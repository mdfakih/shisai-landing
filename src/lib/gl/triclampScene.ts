import { compileProgram, createContext, deleteVao, drawVao, Program, uploadGeometry, uploadMatcap, Vao } from './glCore';
import { CutPlane, Exhibit, Fit, jointExhibit, Vec3 } from './exhibit';
import { clamp01, compose, lerp, Mat4, multiply, perspective, rotationX, rotationY, scaling, smoothstep, translation } from './math';
import { GroupId, LIFT_MM, PartId, PartSpec, SPREAD_MM } from './parts';

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
  /** 0 = solid, 1 = section cut through the axis. */
  section: number;
  /** 0 = mirror polish, 1 = matt. */
  matt: number;
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
  /** 0..1 while a part swap fades the model out and back in. */
  reveal: number;
  /** Project a point given in a group's local space to CSS pixels. */
  project: (p: readonly [number, number, number], group: GroupId) => ProjectedPoint;
}

export interface SceneOptions extends Partial<SceneState> {
  /** Starting exhibit; the tri-clamp joint when omitted. */
  exhibit?: Exhibit;
  /** Runs after every drawn frame; use it to place HTML/SVG annotations. */
  onFrame?: (ctx: FrameContext) => void;
  /** Half extents (mm) that must stay inside the frame. Overrides the exhibit's framing. */
  fit?: Fit;
  /** Base orientation in radians. Overrides the starting exhibit's. */
  yaw?: number;
  pitch?: number;
  /** Called on the first user drag. */
  onInteract?: () => void;
  /** Called when a requested exhibit replaces the old one, mid-transition. */
  onSwap?: (exhibit: Exhibit) => void;
  onDoubleTap?: () => void;
}

interface Mesh {
  spec: PartSpec;
  vao: Vao;
  fade: number;
}

const DPR_CAP = 1.75;
const FOV = (26 * Math.PI) / 180;
const SWAP_OUT_MS = 200;
const SWAP_IN_MS = 560;
const SECTION_MS = 900;
const MATT_MS = 450;
const HATCH_PX = 6;
const TAP_MS = 260;
const DOUBLE_TAP_MS = 340;

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Linear approach of v toward target by at most step. */
const approach = (v: number, target: number, step: number) =>
  v < target ? Math.min(target, v + step) : Math.max(target, v - step);

/** Self-contained WebGL viewer for the tri-clamp joint and its fittings. No deps. */
export class TriClampScene {
  private gl: WebGLRenderingContext;
  private program: Program;
  private meshes: Mesh[] = [];
  private matcap: WebGLTexture;
  private state: SceneState;
  private exhibit: Exhibit;
  private pending: Exhibit | null = null;
  /** Swap progress: 1 = fully shown, 0 = gone. */
  private show = 1;
  private manualFit: Fit | null;
  private fit: Fit;
  private aim: Vec3;
  private aspect = 1;
  private baseYaw: number;
  private basePitch: number;
  private userYaw = 0;
  private userPitch = 0;
  private velYaw = 0;
  private velPitch = 0;
  private resetting = false;
  private current = { spread: 0, lift: 0 };
  private cutT = 0;
  private mattT = 0;
  private bg: [number, number, number] = [1, 1, 1];
  private ink: [number, number, number] = [0.14, 0.17, 0.46];
  private hatch = HATCH_PX;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private lastT = 0;
  private downX = 0;
  private downY = 0;
  private downT = 0;
  private tapT = 0;
  private tapX = 0;
  private tapY = 0;
  private idleSince = 0;
  private lastNow = 0;
  private frame = 0;
  private visible = true;
  private disposed = false;
  private proj: Mat4 = perspective(FOV, 1, 1, 2000);
  private dist = 500;
  private onInteract?: () => void;
  private onFrame?: (ctx: FrameContext) => void;
  private onSwap?: (exhibit: Exhibit) => void;
  private onDoubleTap?: () => void;
  private interacted = false;
  private ro: ResizeObserver | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    opts: SceneOptions = {},
  ) {
    const gl = createContext(canvas);
    this.gl = gl;
    this.state = {
      spread: opts.spread ?? 0,
      lift: opts.lift ?? 0,
      highlight: opts.highlight ?? null,
      autoRotate: opts.autoRotate ?? false,
      interactive: opts.interactive ?? true,
      section: opts.section ?? 0,
      matt: opts.matt ?? 0,
    };
    this.current = { spread: this.state.spread, lift: this.state.lift };
    this.cutT = this.state.section;
    this.mattT = this.state.matt;
    this.exhibit = opts.exhibit ?? jointExhibit();
    this.manualFit = opts.fit ?? null;
    const framing = this.framing();
    this.fit = framing.fit;
    this.aim = framing.aim;
    this.baseYaw = opts.yaw ?? this.exhibit.yaw;
    this.basePitch = opts.pitch ?? this.exhibit.pitch;
    this.onInteract = opts.onInteract;
    this.onFrame = opts.onFrame;
    this.onSwap = opts.onSwap;
    this.onDoubleTap = opts.onDoubleTap;

    this.program = compileProgram(gl);
    this.upload(this.exhibit);
    this.matcap = uploadMatcap(gl);

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

  /** Draw one frame now, e.g. after the annotation layer changed. */
  redraw() {
    this.wake();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
  }

  /** Pin the framed extents; the camera eases to the new distance. */
  setFit(fit: Fit) {
    if (this.manualFit && fit.halfW === this.manualFit.halfW && fit.halfH === this.manualFit.halfH) return;
    this.manualFit = { ...fit };
    this.wake();
  }

  /** Swap to another part: the current one shrinks away, the new one spins in. */
  setExhibit(exhibit: Exhibit) {
    if (exhibit === this.exhibit && !this.pending) return;
    this.pending = exhibit === this.exhibit ? null : exhibit;
    this.wake();
  }

  setBackground(rgb: [number, number, number]) {
    this.bg = rgb;
    this.wake();
  }

  /** Colour for section hatching and cut lines. */
  setInk(rgb: [number, number, number]) {
    this.ink = rgb;
    this.wake();
  }

  /** Ease back to the exhibit's resting orientation. */
  resetView() {
    const turn = Math.PI * 2;
    this.userYaw = ((((this.userYaw + Math.PI) % turn) + turn) % turn) - Math.PI;
    this.velYaw = 0;
    this.velPitch = 0;
    this.resetting = true;
    this.idleSince = performance.now();
    this.wake();
  }

  /** Spin by keyboard: a small impulse that coasts out like a flick. */
  nudge(dYaw: number, dPitch: number) {
    this.resetting = false;
    this.velYaw += dYaw * 0.0013;
    this.velPitch += dPitch * 0.0011;
    this.idleSince = performance.now();
    this.markInteracted();
    this.wake();
  }

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.ro?.disconnect();
    const gl = this.gl;
    this.meshes.forEach((m) => deleteVao(gl, m.vao));
    gl.deleteTexture(this.matcap);
    gl.deleteProgram(this.program.prog);
  }

  /* ---------- setup ---------- */

  private upload(exhibit: Exhibit) {
    const gl = this.gl;
    this.meshes.forEach((m) => deleteVao(gl, m.vao));
    this.meshes = exhibit.parts.map((spec) => ({ spec, vao: uploadGeometry(gl, spec.geometry), fade: 0 }));
  }

  private applyPending(now: number) {
    const next = this.pending;
    if (!next) return;
    this.pending = null;
    this.exhibit = next;
    this.upload(next);
    this.baseYaw = next.yaw;
    this.basePitch = next.pitch;
    this.userYaw = 0;
    this.userPitch = 0;
    this.velYaw = 0;
    this.velPitch = 0;
    this.resetting = false;
    this.idleSince = now;
    // Jump the framing while nothing is on screen.
    const framing = this.framing();
    this.fit = framing.fit;
    this.aim = framing.aim;
    this.updateProjection();
    this.onSwap?.(next);
  }

  /** Where the camera should frame, from the requested (not eased) state. */
  private framing(): { fit: Fit; aim: Vec3 } {
    const ex = this.exhibit;
    if (this.manualFit) return { fit: this.manualFit, aim: ex.centre };
    const k = ex.exploded ? Math.max(this.state.spread, this.state.lift) : 0;
    const to = ex.exploded ?? { fit: ex.fit, centre: ex.centre };
    return {
      fit: { halfW: lerp(ex.fit.halfW, to.fit.halfW, k), halfH: lerp(ex.fit.halfH, to.fit.halfH, k) },
      aim: lerp3(ex.centre, to.centre, k),
    };
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
    this.aspect = w / h;
    this.hatch = HATCH_PX * dpr;
    this.updateProjection();
    this.wake();
  }

  private updateProjection() {
    const t = Math.tan(FOV / 2);
    this.dist = Math.max(this.fit.halfW / (t * this.aspect), this.fit.halfH / t) * 1.08;
    this.proj = perspective(FOV, this.aspect, 10, this.dist + 600);
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

  private markInteracted() {
    if (this.interacted) return;
    this.interacted = true;
    this.onInteract?.();
  }

  private onDown = (e: PointerEvent) => {
    if (!this.state.interactive) return;
    this.dragging = true;
    this.resetting = false;
    this.lastX = this.downX = e.clientX;
    this.lastY = this.downY = e.clientY;
    this.lastT = this.downT = performance.now();
    this.velYaw = 0;
    this.velPitch = 0;
    this.canvas.setPointerCapture(e.pointerId);
    this.canvas.style.cursor = 'grabbing';
    this.markInteracted();
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

  private onUp = (e: Event) => {
    if (!this.dragging) return;
    this.dragging = false;
    const now = performance.now();
    this.idleSince = now;
    this.canvas.style.cursor = this.state.interactive ? 'grab' : '';
    if (e.type === 'pointerup') this.detectTap(e as PointerEvent, now);
  };

  /** Two quick taps in the same spot. Drags never count. */
  private detectTap(e: PointerEvent, now: number) {
    if (!this.onDoubleTap) return;
    const still = Math.hypot(e.clientX - this.downX, e.clientY - this.downY) < 8;
    if (!still || now - this.downT > TAP_MS) {
      this.tapT = 0;
      return;
    }
    const near = Math.hypot(e.clientX - this.tapX, e.clientY - this.tapY) < 28;
    if (this.tapT && now - this.tapT < DOUBLE_TAP_MS && near) {
      this.tapT = 0;
      this.velYaw = 0;
      this.velPitch = 0;
      this.onDoubleTap();
      return;
    }
    this.tapT = now;
    this.tapX = e.clientX;
    this.tapY = e.clientY;
  }

  /* ---------- render loop ---------- */

  private wake() {
    if (!this.frame && !this.disposed) this.frame = requestAnimationFrame(this.loop);
  }

  private loop = (now: number) => {
    this.frame = 0;
    if (this.disposed) return;
    const s = this.state;
    const dt = Math.min(64, Math.max(0, now - (this.lastNow || now)));
    this.lastNow = now;
    let busy = this.dragging;

    // Part swap: shrink out, replace geometry while invisible, spin back in.
    if (this.pending) {
      this.show = Math.max(0, this.show - dt / SWAP_OUT_MS);
      if (this.show === 0) this.applyPending(now);
      busy = true;
    } else if (this.show < 1) {
      this.show = Math.min(1, this.show + dt / SWAP_IN_MS);
      busy = true;
    }

    // Inertia after release (and after keyboard nudges).
    if (!this.dragging && (Math.abs(this.velYaw) > 1e-5 || Math.abs(this.velPitch) > 1e-5)) {
      this.userYaw += this.velYaw * 16;
      this.userPitch = Math.max(-1.1, Math.min(1.1, this.userPitch + this.velPitch * 16));
      this.velYaw *= 0.93;
      this.velPitch *= 0.93;
      busy = true;
    }

    if (this.resetting && !this.dragging) {
      this.userYaw = lerp(this.userYaw, 0, 0.12);
      this.userPitch = lerp(this.userPitch, 0, 0.12);
      if (Math.abs(this.userYaw) < 0.002 && Math.abs(this.userPitch) < 0.002) {
        this.userYaw = 0;
        this.userPitch = 0;
        this.resetting = false;
      }
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

    // Section sweep and finish change run on a clock so they read the same at any frame rate.
    const cutTo = clamp01(s.section);
    const mattTo = clamp01(s.matt);
    if (this.cutT !== cutTo || this.mattT !== mattTo) busy = true;
    this.cutT = approach(this.cutT, cutTo, dt / SECTION_MS);
    this.mattT = approach(this.mattT, mattTo, dt / MATT_MS);

    busy = this.easeFraming() || busy;

    // Highlight fades.
    for (const m of this.meshes) {
      const target = s.highlight && s.highlight !== m.spec.part ? 0.62 : 0;
      if (Math.abs(m.fade - target) > 0.004) {
        m.fade = lerp(m.fade, target, 0.12);
        busy = true;
      } else m.fade = target;
    }

    const reveal = smoothstep(this.show);
    // The part turns a little as it arrives or leaves.
    const spin = (1 - reveal) * 0.8;
    this.draw(this.baseYaw + this.userYaw + sway + spin, this.basePitch + this.userPitch + swayPitch, reveal);
    // A swap always runs to the end, so the tab and the model never disagree.
    const swapping = this.pending !== null || this.show < 1;
    if (busy && (this.visible || swapping)) this.frame = requestAnimationFrame(this.loop);
  };

  /** Camera distance and aim ease toward the requested framing. Returns true while moving. */
  private easeFraming(): boolean {
    const want = this.framing();
    const near = (a: number, b: number) => Math.abs(a - b) <= 0.2;
    const settled =
      near(this.fit.halfW, want.fit.halfW) &&
      near(this.fit.halfH, want.fit.halfH) &&
      want.aim.every((v, i) => near(this.aim[i], v));
    if (settled) {
      if (this.fit.halfW !== want.fit.halfW || this.fit.halfH !== want.fit.halfH) {
        this.fit = want.fit;
        this.updateProjection();
      }
      this.aim = want.aim;
      return false;
    }
    this.fit = { halfW: lerp(this.fit.halfW, want.fit.halfW, 0.1), halfH: lerp(this.fit.halfH, want.fit.halfH, 0.1) };
    this.aim = lerp3(this.aim, want.aim, 0.1);
    this.updateProjection();
    return true;
  }

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

  /** Section planes for this frame: each sweeps in from beyond the part to its resting offset. */
  private cutPlanes(): [CutPlane, CutPlane] {
    const t = smoothstep(this.cutT);
    const { centre, size } = this.exhibit.bounds;
    const lifted = this.exhibit.exploded ? LIFT_MM : 0;
    const reach = Math.hypot(size[0], size[1], size[2]) / 2 + lifted + 4;
    const sweep = ([x, y, z, w]: CutPlane): CutPlane => {
      if (x === 0 && y === 0 && z === 0) return [x, y, z, w];
      const start = x * centre[0] + y * centre[1] + z * centre[2] + reach;
      return [x, y, z, lerp(start, w, t)];
    };
    const [a, b] = this.exhibit.cut;
    return [sweep(a), sweep(b)];
  }

  private draw(yaw: number, pitch: number, reveal: number) {
    const gl = this.gl;
    const p = this.program;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(p.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.matcap);
    gl.uniform1i(p.loc.uMatcap, 0);
    gl.uniformMatrix4fv(p.loc.uProj, false, this.proj);
    gl.uniform3fv(p.loc.uBg, this.bg);
    gl.uniform3fv(p.loc.uInk, this.ink);
    gl.uniform1f(p.loc.uHatch, this.hatch);
    gl.uniform1f(p.loc.uMatt, smoothstep(this.mattT));
    const [cutA, cutB] = this.cutPlanes();
    gl.uniform1f(p.loc.uCut, this.cutT > 0.001 ? 1 : 0);
    gl.uniform4f(p.loc.uCutA, ...cutA);
    gl.uniform4f(p.loc.uCutB, ...cutB);

    const [ax, ay, az] = this.aim;
    const view = compose(
      translation(0, 0, -this.dist),
      rotationX(pitch),
      rotationY(yaw),
      scaling(0.84 + 0.16 * reveal),
      translation(-ax, -ay, -az),
    );
    const models: Partial<Record<GroupId, Mat4>> = {};
    const views: Partial<Record<GroupId, Mat4>> = {};
    const modelOf = (g: GroupId) => (models[g] ??= this.groupMatrix(g));
    const groupOf = (g: GroupId) => (views[g] ??= multiply(view, modelOf(g)));

    for (const m of this.meshes) {
      gl.uniformMatrix4fv(p.loc.uMV, false, multiply(groupOf(m.spec.group), m.spec.local));
      gl.uniformMatrix4fv(p.loc.uModel, false, multiply(modelOf(m.spec.group), m.spec.local));
      gl.uniform3fv(p.loc.uTint, m.spec.tint);
      gl.uniform1f(p.loc.uContrast, m.spec.contrast);
      gl.uniform1f(p.loc.uCapKind, m.spec.contrast < 0.5 ? 1 : 0);
      gl.uniform1f(p.loc.uFade, 1 - (1 - m.fade) * reveal);
      drawVao(gl, p, m.vao);
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
      this.onFrame({ width, height, reveal, project });
    }
  }
}
