/**
 * Shared WebGL plumbing for the product viewers: one matcap shader, buffer
 * upload, matcap texture. Keeps TriClampScene and ProductScene in step.
 */
import { Geometry } from './geometry';
import { makeMatcap } from './matcap';

export const VERT = `
attribute vec3 aPos; attribute vec3 aNor;
uniform mat4 uProj; uniform mat4 uMV;
varying vec3 vN;
void main(){ vN = mat3(uMV) * aNor; gl_Position = uProj * uMV * vec4(aPos, 1.0); }`;

export const FRAG = `
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

export const UNIFORMS = ['uProj', 'uMV', 'uMatcap', 'uTint', 'uContrast', 'uBg', 'uFade'] as const;
export type UniformName = (typeof UNIFORMS)[number];
export type UniformMap = Record<UniformName, WebGLUniformLocation | null>;

export interface Vao {
  pos: WebGLBuffer;
  nor: WebGLBuffer;
  idx: WebGLBuffer;
  count: number;
}

export interface Program {
  prog: WebGLProgram;
  loc: UniformMap;
  attr: { pos: number; nor: number };
}

export function createContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) throw new Error('WebGL unavailable');
  return gl;
}

export function compileProgram(gl: WebGLRenderingContext): Program {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) throw new Error('shader alloc');
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
    return s;
  };
  const prog = gl.createProgram();
  if (!prog) throw new Error('program alloc');
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
  const loc = Object.fromEntries(UNIFORMS.map((n) => [n, gl.getUniformLocation(prog, n)])) as UniformMap;
  return {
    prog,
    loc,
    attr: { pos: gl.getAttribLocation(prog, 'aPos'), nor: gl.getAttribLocation(prog, 'aNor') },
  };
}

export function uploadGeometry(gl: WebGLRenderingContext, g: Geometry): Vao {
  const buf = (target: number, data: BufferSource) => {
    const b = gl.createBuffer();
    if (!b) throw new Error('buffer alloc');
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

export function deleteVao(gl: WebGLRenderingContext, v: Vao) {
  gl.deleteBuffer(v.pos);
  gl.deleteBuffer(v.nor);
  gl.deleteBuffer(v.idx);
}

export function uploadMatcap(gl: WebGLRenderingContext): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error('texture alloc');
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, makeMatcap());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

/** Bind a VAO's buffers and draw it. Program must already be in use. */
export function drawVao(gl: WebGLRenderingContext, p: Program, v: Vao) {
  gl.bindBuffer(gl.ARRAY_BUFFER, v.pos);
  gl.enableVertexAttribArray(p.attr.pos);
  gl.vertexAttribPointer(p.attr.pos, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, v.nor);
  gl.enableVertexAttribArray(p.attr.nor);
  gl.vertexAttribPointer(p.attr.nor, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, v.idx);
  gl.drawElements(gl.TRIANGLES, v.count, gl.UNSIGNED_SHORT, 0);
}
