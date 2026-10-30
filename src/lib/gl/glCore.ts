/**
 * Shared WebGL plumbing for the product viewers: one matcap shader, buffer
 * upload, matcap texture. Keeps TriClampScene and ProductScene in step.
 */
import { Geometry } from './geometry';
import { makeMatcap } from './matcap';

export const VERT = `
attribute vec3 aPos; attribute vec3 aNor;
uniform mat4 uProj; uniform mat4 uMV; uniform mat4 uModel;
varying vec3 vN; varying vec3 vV; varying vec3 vW;
void main(){
  vec4 v = uMV * vec4(aPos, 1.0);
  vN = mat3(uMV) * aNor;
  vV = v.xyz;
  vW = (uModel * vec4(aPos, 1.0)).xyz;
  gl_Position = uProj * v;
}`;

/*
 * Section view: a fragment beyond both cut planes is discarded. Looking into
 * the cut, the ray meets the inside of the wall, i.e. a back face, so back
 * faces are painted as a hatched section cap like a drawing. The cut line
 * itself is inked where the plane crosses the surface.
 * Matt finish: a 9-tap blur of the matcap, flattened contrast, fine grain.
 */
export const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uMatcap; uniform vec3 uTint; uniform float uContrast; uniform vec3 uBg; uniform float uFade;
uniform vec4 uCutA; uniform vec4 uCutB; uniform float uCut;
uniform float uMatt; uniform vec3 uInk; uniform float uCapKind; uniform float uHatch;
varying vec3 vN; varying vec3 vV; varying vec3 vW;

vec3 tap(vec2 d) {
  float l = length(d);
  return texture2D(uMatcap, d * min(1.0, 0.49 / max(l, 1e-4)) + 0.5).rgb;
}

void main(){
  float a = dot(vW, uCutA.xyz) - uCutA.w;
  float b = dot(vW, uCutB.xyz) - uCutB.w;
  vec3 n = normalize(vN);
  // Derivatives are taken before the discard (uniform flow) and only at highp:
  // at mediump, view positions ~500 mm out are too coarse for a stable face normal.
#if defined(HAS_DERIV) && defined(GL_FRAGMENT_PRECISION_HIGH)
  bool back = dot(n, cross(dFdx(vV), dFdy(vV))) < 0.0;
  vec2 ew = vec2(fwidth(a), fwidth(b)) * 1.4;
#else
  bool back = dot(n, -vV) < 0.0;
  vec2 ew = vec2(0.5);
#endif
  if (uCut > 0.5 && a > 0.0 && b > 0.0) discard;
  vec3 c;
  if (uCut > 0.5 && back) {
    float line = step(fract((gl_FragCoord.x + gl_FragCoord.y) / uHatch), 0.2);
    vec3 fill = mix(uBg, uInk, 0.08);
    c = uCapKind > 0.5 ? mix(uBg, uInk, 0.42) : mix(fill, mix(uBg, uInk, 0.62), line);
  } else {
    vec2 d = n.xy * 0.5;
    vec3 m = texture2D(uMatcap, d + 0.5).rgb;
    if (uMatt > 0.001) {
      float r = 0.15 * uMatt;
      float q = r * 0.7;
      vec3 blur = m
        + tap(d + vec2(r, 0.0)) + tap(d - vec2(r, 0.0)) + tap(d + vec2(0.0, r)) + tap(d - vec2(0.0, r))
        + tap(d + vec2(q, q)) + tap(d - vec2(q, q)) + tap(d + vec2(q, -q)) + tap(d - vec2(q, -q));
      blur /= 9.0;
      float lum = dot(blur, vec3(0.333));
      blur = mix(blur, vec3(lum * 0.8 + 0.1), 0.55);
      float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      m = mix(m, blur + (g - 0.5) * 0.06, uMatt);
    }
    c = mix(vec3(0.92), m, uContrast) * uTint;
    if (uCut > 0.5 && ((abs(a) < ew.x && b > 0.0) || (abs(b) < ew.y && a > 0.0))) c = mix(c, uInk, 0.9);
  }
  gl_FragColor = vec4(mix(c, uBg, uFade), 1.0);
}`;

export const UNIFORMS = [
  'uProj',
  'uMV',
  'uModel',
  'uMatcap',
  'uTint',
  'uContrast',
  'uBg',
  'uFade',
  'uCutA',
  'uCutB',
  'uCut',
  'uMatt',
  'uInk',
  'uCapKind',
  'uHatch',
] as const;
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
  // Screen-space derivatives give a winding-independent back-face test and a
  // one-pixel cut line; without them the fragment shader falls back to the view vector.
  const deriv = gl.getExtension('OES_standard_derivatives')
    ? '#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIV\n'
    : '';
  const prog = gl.createProgram();
  if (!prog) throw new Error('program alloc');
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, deriv + FRAG));
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
