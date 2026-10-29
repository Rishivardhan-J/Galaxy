// One shared WebGL context renders every planet; results are blitted into each planet's 2D canvas.
// Monochrome fbm surface, rim light, optional ring, ordered dithering.
const VERT = `attribute vec2 p; varying vec2 uv; void main(){ uv=p; gl_Position=vec4(p,0.,1.); }`
const FRAG = `precision mediump float;
varying vec2 uv;
uniform float t, seed, bands, ring, tilt, R;
float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))+seed)*43758.5453); }
float n(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm(vec3 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*n(p); p*=2.03; a*=.5; } return s; }
float bayer(vec2 c){ vec2 m=mod(c,4.); float x=m.x, y=m.y;
  float v = mod(x,2.)<1. ? (mod(y,2.)<1.?0.:12.) : (mod(y,2.)<1.?8.:4.);
  v += (x>=2. ? 2. : 0.) + (y>=2. ? 3. : 0.); return v/16.; }
void main(){
  vec2 q = uv / ((ring>.5)?1.0:1.0);
  float cr = cos(tilt), sr = sin(tilt);
  vec2 rq = vec2(q.x*cr - q.y*sr, q.x*sr + q.y*cr);
  float col = 0., alpha = 0.;
  float r = length(q) / R;
  bool sphere = r < 1.;
  if (sphere) {
    float z = sqrt(1. - r*r);
    vec3 nrm = vec3(q/R, z);
    float a = t*.12; float ca=cos(a), sa=sin(a);
    vec3 sp = vec3(nrm.x*ca + nrm.z*sa, nrm.y, -nrm.x*sa + nrm.z*ca);
    float surf = fbm(sp*2.2 + seed) ;
    float band = .5 + .5*sin(sp.y*bands*3. + surf*4.);
    float tex = mix(surf, band, .55);
    vec3 L = normalize(vec3(-.55,.5,.7));
    float d = clamp(dot(nrm, L), 0., 1.);
    float rim = pow(1. - z, 3.);
    col = clamp(pow(d, .8) * (.35 + .75*tex) + rim*.25, 0., 1.);
    alpha = 1.;
  }
  if (ring > .5) {
    vec2 e = vec2(rq.x, rq.y / .28);
    float d = length(e) / R;
    if (d > 1.28 && d < 1.95) {
      float s = .5 + .5*sin(d*38. + seed);
      float rc = .25 + .55*s;
      bool front = rq.y < 0.;
      if (front || !sphere) { col = rc * (d < 1.4 ? .5 : 1.); alpha = .9 - .35*smoothstep(1.7,1.95,d); }
    }
  }
  float dth = (bayer(gl_FragCoord.xy) - .5) / 14.;
  col = clamp(col + dth*step(.001, alpha), 0., 1.);
  gl_FragColor = vec4(vec3(col)*alpha, alpha);
}`

export interface PlanetParams { seed: number; bands: number; ring: boolean; tilt: number }
interface Slot { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; params: PlanetParams; size: number }

let gl: WebGLRenderingContext | null = null
let glCanvas: HTMLCanvasElement | null = null
let prog: WebGLProgram | null = null
let U: Record<string, WebGLUniformLocation | null> = {}
const slots = new Set<Slot>()
let raf = 0
let animate = true
let supported: boolean | null = null

export function glSupported() {
  if (supported !== null) return supported
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(location.search).get('gl') === '0') return (supported = false)
  try {
    glCanvas = document.createElement('canvas')
    gl = glCanvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: true })
    if (!gl) return (supported = false)
    const mk = (type: number, src: string) => { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(s) ?? 'shader'); return s }
    prog = gl.createProgram()!
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog); gl.useProgram(prog)
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    U = Object.fromEntries(['t', 'seed', 'bands', 'ring', 'tilt', 'R'].map((n) => [n, gl!.getUniformLocation(prog!, n)]))
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    return (supported = true)
  } catch { return (supported = false) }
}

function renderSlot(s: Slot, time: number) {
  if (!gl || !glCanvas) return
  const px = s.canvas.width
  if (glCanvas.width !== px || glCanvas.height !== px) { glCanvas.width = px; glCanvas.height = px }
  gl.viewport(0, 0, px, px)
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
  gl.uniform1f(U.t, time); gl.uniform1f(U.seed, s.params.seed); gl.uniform1f(U.bands, s.params.bands)
  gl.uniform1f(U.ring, s.params.ring ? 1 : 0); gl.uniform1f(U.tilt, s.params.tilt); gl.uniform1f(U.R, s.params.ring ? 0.5 : 0.96)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  s.ctx.clearRect(0, 0, px, px)
  s.ctx.drawImage(glCanvas, 0, 0)
}

let lastDraw = 0
function tick(ts: number) {
  if (ts - lastDraw > 33) { lastDraw = ts; slots.forEach((s) => renderSlot(s, ts / 1000)) }
  raf = requestAnimationFrame(tick)
}
const sync = () => {
  cancelAnimationFrame(raf); raf = 0
  if (animate && slots.size && !document.hidden) raf = requestAnimationFrame(tick)
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', sync)

export function setPlanetAnimation(on: boolean) { animate = on; sync(); if (!on) slots.forEach((s) => renderSlot(s, 4)) }

export function registerPlanet(canvas: HTMLCanvasElement, params: PlanetParams, size: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = canvas.height = Math.round(size * dpr)
  const slot: Slot = { canvas, ctx: canvas.getContext('2d')!, params, size }
  slots.add(slot)
  renderSlot(slot, 4)
  sync()
  return () => { slots.delete(slot); sync() }
}
