import { Geometry } from './geometry';
import { makeMatcap } from './matcap';
import { clamp01, compose, lerp, Mat4, multiply, perspective, rotationX, rotationY, translation } from './math';
import { buildParts, GroupId, LIFT_MM, PartId, PartSpec, SPREAD_MM } from './parts';

export interface SceneState {
  /** 0 = ferrules seated against the gasket, 1 = pulled apart. */
  spread: number;
  /** 0 = clamp closed over the flanges, 1 = lifted clear. */
  lift: number;
  /** Dim every part except this one. */
  highlight: PartId | null;
  /** Slow idle sway when nobody is dragging. */
  autoRotate: boolean;
  /** Accept pointer drags. */
  interactive: boolean;
}

export interface ProjectedPoint {
  x: number;
  y: number;
  /** False when behind the camera. */
  visible: boolean;
}

export interface FrameContext {
  width: number;
  height: number;
  /** Project a point given in a group's local space to CSS pixels. */
  project: (p: readonly [number, number, number], group: GroupId) => ProjectedPoint;
}

export interface SceneOptions extends Partial<SceneState> {
  /** Runs after every drawn frame; use it to place HTML/SVG annotations. */
  onFrame?: (ctx: FrameContext) => void;
  /** Half extents (mm) that must stay inside the frame. */
  fit?: { halfW: number; halfH: number };
  /** Base orientation in radians. */
  yaw?: number;
  pitch?: number;
  /** Called on the first user drag. */
  onInteract?: () => void;
}

const VERT = `
attribute vec3 aPos; attribute vec3 aNor;
uniform mat4 uProj; uniform mat4 uMV;
varying vec3 vN;
void main(){ vN = mat3(uMV) * aNor; gl_Position = uProj * uMV * vec4(aPos, 1.0); }`;

const FRAG = `
precision mediump float;
uniform sampler2D uMatcap; uniform vec3 uTint; uniform float uContrast; uniform vec3 uBg; uniform float uFade;
varying vec3 vN;
void main(){
  vec3 n = normalize(vN);
  vec2 uv = n.xy * 0.5 + 0.5;
  vec3 m = texture2D(uMatcap, uv).rgb;
  vec3 c = mix(vec3(0.92), m, uContrast) * uTint;
  c = mix(c, uBg, uFade);
  gl_FragColor = vec4(c, 1.0);
}`;

interface Mesh {
  spec: PartSpec;
  vao: { pos: WebGLBuffer; nor: WebGLBuffer; idx: WebGLBuffer; count: number };
  fade: number;
}

const DPR_CAP = 1.75;
const FOV = (26 * Math.PI) / 180;

/** Self-contained WebGL viewer for the tri-clamp joint. ~8 KB, no deps. */
export class TriClampScene {
  private gl: WebGLRenderingContext;
  private prog: WebGLProgram;
  private loc: Record<string, WebGLUniformLocation | null>;
  private attr: { pos: number; nor: number };
  private meshes: Mesh[];
  private matcap: WebGLTexture;
  private state: SceneState;
  private fit: { halfW: number; halfH: number };
  private baseYaw: number;
  private basePitch: number;
  private userYaw = 0;
  private userPitch = 0;
  private velYaw = 0;
  private velPitch = 0;
  private current = { spread: 0, lift: 0 };
  private bg: [number, number, number] = [1, 1, 1];
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private lastT = 0;
  private idleSince = 0;
  private frame = 0;
  private visible = true;
  private disposed = false;
  private proj: Mat4 = perspective(FOV, 1, 1, 2000);
  private dist = 500;
  private onInteract?: () => void;
  private onFrame?: (ctx: FrameContext) => void;
  private interacted = false;
  private ro: ResizeObserver | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    opts: SceneOptions = {},
  ) {
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl;
    this.state = {
      spread: opts.spread ?? 0,
      lift: opts.lift ?? 0,
      highlight: opts.highlight ?? null,
      autoRotate: opts.autoRotate ?? false,
      interactive: opts.interactive ?? true,
    };
    this.current = { spread: this.state.spread, lift: this.state.lift };
    this.fit = opts.fit ?? { halfW: 170, halfH: 95 };
    this.baseYaw = opts.yaw ?? 1.0;
    this.basePitch = opts.pitch ?? 0.28;
    this.onInteract = opts.onInteract;
    this.onFrame = opts.onFrame;

    this.prog = this.compile();
    this.attr = { pos: gl.getAttribLocation(this.prog, 'aPos'), nor: gl.getAttribLocation(this.prog, 'aNor') };
    this.loc = Object.fromEntries(
      ['uProj', 'uMV', 'uMatcap', 'uTint', 'uContrast', 'uBg', 'uFade'].map((n) => [n, gl.getUniformLocation(this.prog, n)]),
    );
    this.meshes = buildParts().map((spec) => ({ spec, vao: this.upload(spec.geometry), fade: 0 }));
    this.matcap = this.uploadMatcap();

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    this.bindPointer();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.idleSince = performance.now();
    this.loop(performance.now());
  }

  /* ---------- public API ---------- */

  setState(partial: Partial<SceneState>) {
    this.state = { ...this.state, ...partial };
    this.wake();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
  }

  setBackground(rgb: [number, number, number]) {
    this.bg = rgb;
    this.wake();
  }

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.ro?.disconnect();
    const gl = this.gl;
    this.meshes.forEach((m) => {
      gl.deleteBuffer(m.vao.pos);
      gl.deleteBuffer(m.vao.nor);
      gl.deleteBuffer(m.vao.idx);
    });
    gl.deleteTexture(this.matcap);
    gl.deleteProgram(this.prog);
  }

  /* ---------- setup ---------- */

  private compile(): WebGLProgram {
    const gl = this.gl;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    return p;
  }

  private upload(g: Geometry) {
    const gl = this.gl;
    const buf = (target: number, data: BufferSource) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(target, b);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      return b;
    };
    return {
      pos: buf(gl.ARRAY_BUFFER, g.positions),
      nor: buf(gl.ARRAY_BUFFER, g.normals),
      idx: buf(gl.ELEMENT_ARRAY_BUFFER, g.indices),
      count: g.indices.length,
    };
  }

  private uploadMatcap(): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, makeMatcap());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl.viewport(0, 0, w, h);
    const aspect = w / h;
    const t = Math.tan(FOV / 2);
    this.dist = Math.max(this.fit.halfW / (t * aspect), this.fit.halfH / t) * 1.08;
    this.proj = perspective(FOV, aspect, 10, this.dist + 600);
    this.wake();
  }

  /* ---------- interaction ---------- */

  private bindPointer() {
    const c = this.canvas;
    c.addEventListener('pointerdown', this.onDown);
    c.addEventListener('pointermove', this.onMove);
    c.addEventListener('pointerup', this.onUp);
    c.addEventListener('pointercancel', this.onUp);
    c.addEventListener('lostpointercapture', this.onUp);
  }

  private onDown = (e: PointerEvent) => {
    if (!this.state.interactive) return;
    this.dragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastT = performance.now();
    this.velYaw = 0;
    this.velPitch = 0;
    this.canvas.setPointerCapture(e.pointerId);
    this.canvas.style.cursor = 'grabbing';
    if (!this.interacted) {
      this.interacted = true;
      this.onInteract?.();
    }
    this.wake();
  };

  private onMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const now = performance.now();
    const dt = Math.max(8, now - this.lastT);
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const k = 0.0075;
    this.userYaw += dx * k;
    this.userPitch = Math.max(-1.1, Math.min(1.1, this.userPitch + dy * k * 0.8));
    this.velYaw = (dx * k) / dt;
    this.velPitch = (dy * k * 0.8) / dt;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastT = now;
    this.wake();
  };

  private onUp = () => {
    if (!this.dragging) return;
    this.dragging = false;
    this.idleSince = performance.now();
    this.canvas.style.cursor = this.state.interactive ? 'grab' : '';
  };

  /* ---------- render loop ---------- */

  private wake() {
    if (!this.frame && !this.disposed) this.frame = requestAnimationFrame(this.loop);
  }

  private loop = (now: number) => {
    this.frame = 0;
    if (this.disposed) return;
    const s = this.state;
    let busy = this.dragging;

    // Inertia after release.
    if (!this.dragging && (Math.abs(this.velYaw) > 1e-5 || Math.abs(this.velPitch) > 1e-5)) {
      this.userYaw += this.velYaw * 16;
      this.userPitch = Math.max(-1.1, Math.min(1.1, this.userPitch + this.velPitch * 16));
      this.velYaw *= 0.93;
      this.velPitch *= 0.93;
      busy = true;
    }

    // Ease pitch back toward level while idle, so the model never gets stuck upside down.
    if (!this.dragging && Math.abs(this.userPitch) > 0.001) {
      this.userPitch = lerp(this.userPitch, 0, 0.012);
      busy = busy || Math.abs(this.userPitch) > 0.01;
    }

    // Idle sway.
    let sway = 0;
    let swayPitch = 0;
    if (s.autoRotate && !this.dragging && this.visible) {
      const idle = (now - this.idleSince) / 1000;
      const ramp = clamp01((idle - 1.2) / 2.5);
      sway = Math.sin(now / 3400) * 0.42 * ramp;
      swayPitch = Math.sin(now / 5200 + 1) * 0.06 * ramp;
      busy = true;
    }

    // Explode easing.
    const ease = 0.14;
    this.current.spread = lerp(this.current.spread, s.spread, ease);
    this.current.lift = lerp(this.current.lift, s.lift, ease);
    if (Math.abs(this.current.spread - s.spread) > 0.002 || Math.abs(this.current.lift - s.lift) > 0.002) busy = true;
    else this.current = { spread: s.spread, lift: s.lift };

    // Highlight fades.
    for (const m of this.meshes) {
      const target = s.highlight && s.highlight !== m.spec.part ? 0.62 : 0;
      if (Math.abs(m.fade - target) > 0.004) {
        m.fade = lerp(m.fade, target, 0.12);
        busy = true;
      } else m.fade = target;
    }

    this.draw(this.baseYaw + this.userYaw + sway, this.basePitch + this.userPitch + swayPitch);
    if (busy && this.visible) this.frame = requestAnimationFrame(this.loop);
  };

  private groupMatrix(group: GroupId): Mat4 {
    const { spread, lift } = this.current;
    switch (group) {
      case 'left':
        return translation(0, 0, -SPREAD_MM * spread);
      case 'right':
        return translation(0, 0, SPREAD_MM * spread);
      case 'clamp':
        return translation(0, LIFT_MM * lift, 0);
      default:
        return translation(0, 0, 0);
    }
  }

  private draw(yaw: number, pitch: number) {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.matcap);
    gl.uniform1i(this.loc.uMatcap, 0);
    gl.uniformMatrix4fv(this.loc.uProj, false, this.proj);
    gl.uniform3fv(this.loc.uBg, this.bg);

    const view = compose(translation(0, 0, -this.dist), rotationX(pitch), rotationY(yaw));
    const groups: Partial<Record<GroupId, Mat4>> = {};
    const groupOf = (g: GroupId) => (groups[g] ??= multiply(view, this.groupMatrix(g)));

    for (const m of this.meshes) {
      const mv = multiply(groupOf(m.spec.group), m.spec.local);
      gl.uniformMatrix4fv(this.loc.uMV, false, mv);
      gl.uniform3fv(this.loc.uTint, m.spec.tint);
      gl.uniform1f(this.loc.uContrast, m.spec.contrast);
      gl.uniform1f(this.loc.uFade, m.fade);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.vao.pos);
      gl.enableVertexAttribArray(this.attr.pos);
      gl.vertexAttribPointer(this.attr.pos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, m.vao.nor);
      gl.enableVertexAttribArray(this.attr.nor);
      gl.vertexAttribPointer(this.attr.nor, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.vao.idx);
      gl.drawElements(gl.TRIANGLES, m.vao.count, gl.UNSIGNED_SHORT, 0);
    }

    if (this.onFrame) {
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      const proj = this.proj;
      const project = (p: readonly [number, number, number], group: GroupId): ProjectedPoint => {
        const mv = groupOf(group);
        const [x, y, z] = p;
        // clip = proj * mv * [x y z 1]
        const vx = mv[0] * x + mv[4] * y + mv[8] * z + mv[12];
        const vy = mv[1] * x + mv[5] * y + mv[9] * z + mv[13];
        const vz = mv[2] * x + mv[6] * y + mv[10] * z + mv[14];
        const cx = proj[0] * vx;
        const cy = proj[5] * vy;
        const cw = -vz;
        if (cw <= 0.0001) return { x: 0, y: 0, visible: false };
        return { x: (cx / cw * 0.5 + 0.5) * width, y: (1 - (cy / cw * 0.5 + 0.5)) * height, visible: true };
      };
      this.onFrame({ width, height, project });
    }
  }
}
