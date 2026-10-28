/**
 * Turntable viewer for a single catalogue part. Drag to orbit, slow spin
 * when idle. Shares shaders and matcap with the hero scene via glCore.
 */
import { compileProgram, createContext, deleteVao, drawVao, Program, uploadGeometry, uploadMatcap, Vao } from './glCore';
import { clamp01, compose, lerp, Mat4, multiply, perspective, rotationX, rotationY, translation } from './math';
import { MeshSpec, ModelSpec } from './models';

export interface ProductSceneOptions {
  model: ModelSpec;
  autoRotate?: boolean;
  onInteract?: () => void;
}

interface Mesh {
  spec: MeshSpec;
  vao: Vao;
}

const DPR_CAP = 1.75;
const FOV = (26 * Math.PI) / 180;
const SPIN = 0.0032; // rad per frame at 60 fps

export class ProductScene {
  private gl: WebGLRenderingContext;
  private program: Program;
  private matcap: WebGLTexture;
  private meshes: Mesh[] = [];
  private fit = { halfW: 100, halfH: 60 };
  private baseYaw = 0.9;
  private basePitch = 0.3;
  private userYaw = 0;
  private userPitch = 0;
  private velYaw = 0;
  private velPitch = 0;
  private bg: [number, number, number] = [1, 1, 1];
  private aspect = 1;
  private dist = 400;
  private proj: Mat4 = perspective(FOV, 1, 1, 2000);
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private lastT = 0;
  private idleSince = 0;
  private frame = 0;
  private visible = true;
  private disposed = false;
  private interacted = false;
  private autoRotate: boolean;
  private onInteract?: () => void;
  private ro: ResizeObserver | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    opts: ProductSceneOptions,
  ) {
    this.gl = createContext(canvas);
    this.program = compileProgram(this.gl);
    this.matcap = uploadMatcap(this.gl);
    this.autoRotate = opts.autoRotate ?? true;
    this.onInteract = opts.onInteract;
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0, 0, 0, 0);
    this.setModel(opts.model);
    this.bindPointer();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.resize();
    this.idleSince = performance.now();
    this.loop(performance.now());
  }

  /* ---------- public API ---------- */

  setModel(model: ModelSpec) {
    this.meshes.forEach((m) => deleteVao(this.gl, m.vao));
    this.meshes = model.meshes.map((spec) => ({ spec, vao: uploadGeometry(this.gl, spec.geometry) }));
    this.fit = { ...model.fit };
    this.baseYaw = model.yaw;
    this.basePitch = model.pitch;
    this.userYaw = 0;
    this.userPitch = 0;
    this.velYaw = 0;
    this.velPitch = 0;
    this.updateProjection();
    this.wake();
  }

  setBackground(rgb: [number, number, number]) {
    this.bg = rgb;
    this.wake();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
  }

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.ro?.disconnect();
    this.meshes.forEach((m) => deleteVao(this.gl, m.vao));
    this.gl.deleteTexture(this.matcap);
    this.gl.deleteProgram(this.program.prog);
  }

  /* ---------- sizing ---------- */

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
    this.updateProjection();
    this.wake();
  }

  private updateProjection() {
    const t = Math.tan(FOV / 2);
    this.dist = Math.max(this.fit.halfW / (t * this.aspect), this.fit.halfH / t) * 1.08;
    this.proj = perspective(FOV, this.aspect, 10, this.dist + 600);
  }

  /* ---------- pointer ---------- */

  private bindPointer() {
    const c = this.canvas;
    c.style.cursor = 'grab';
    c.addEventListener('pointerdown', this.onDown);
    c.addEventListener('pointermove', this.onMove);
    c.addEventListener('pointerup', this.onUp);
    c.addEventListener('pointercancel', this.onUp);
    c.addEventListener('lostpointercapture', this.onUp);
  }

  private onDown = (e: PointerEvent) => {
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
    this.canvas.style.cursor = 'grab';
  };

  /* ---------- loop ---------- */

  private wake() {
    if (!this.frame && !this.disposed) this.frame = requestAnimationFrame(this.loop);
  }

  private loop = (now: number) => {
    this.frame = 0;
    if (this.disposed) return;
    let busy = this.dragging;

    if (!this.dragging && (Math.abs(this.velYaw) > 1e-5 || Math.abs(this.velPitch) > 1e-5)) {
      this.userYaw += this.velYaw * 16;
      this.userPitch = Math.max(-1.1, Math.min(1.1, this.userPitch + this.velPitch * 16));
      this.velYaw *= 0.93;
      this.velPitch *= 0.93;
      busy = true;
    }
    if (!this.dragging && Math.abs(this.userPitch) > 0.001) {
      this.userPitch = lerp(this.userPitch, 0, 0.012);
      busy = busy || Math.abs(this.userPitch) > 0.01;
    }
    if (this.autoRotate && !this.dragging && this.visible) {
      const ramp = clamp01(((now - this.idleSince) / 1000 - 1.2) / 2);
      this.userYaw += SPIN * ramp;
      busy = true;
    }

    this.draw(this.baseYaw + this.userYaw, this.basePitch + this.userPitch);
    if (busy && this.visible) this.frame = requestAnimationFrame(this.loop);
  };

  private draw(yaw: number, pitch: number) {
    const gl = this.gl;
    const p = this.program;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(p.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.matcap);
    gl.uniform1i(p.loc.uMatcap, 0);
    gl.uniformMatrix4fv(p.loc.uProj, false, this.proj);
    gl.uniform3fv(p.loc.uBg, this.bg);
    gl.uniform1f(p.loc.uFade, 0);
    const view = compose(translation(0, 0, -this.dist), rotationX(pitch), rotationY(yaw));
    for (const m of this.meshes) {
      gl.uniformMatrix4fv(p.loc.uMV, false, multiply(view, m.spec.local));
      gl.uniform3fv(p.loc.uTint, m.spec.tint);
      gl.uniform1f(p.loc.uContrast, m.spec.contrast);
      drawVao(gl, p, m.vao);
    }
  }
}
