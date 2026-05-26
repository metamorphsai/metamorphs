import { useEffect, useRef } from 'react'

const DEFAULT_TINT = [1.0, 0.353, 0.235] // #FF5A3C
const DEFAULT_DOT_SIZE = 20

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;

uniform vec2  u_resolution;
uniform float u_time;
uniform vec3  u_tint;
uniform float u_dotSize;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 6; i++) {
    v += amp * noise(p);
    p *= 2.0;
    amp *= 0.5;
  }
  return v;
}

float liquid(vec2 p, float t) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, t)),
    fbm(p + vec2(5.2, 1.3 - t * 0.5))
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2 + t * 0.7)),
    fbm(p + 4.0 * q + vec2(8.3, 2.8 - t * 0.4))
  );
  return fbm(p + 3.0 * r);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_resolution.xy;
  float minDim = min(u_resolution.x, u_resolution.y);
  float t = u_time * 0.18;

  vec2 cellPx     = vec2(u_dotSize);
  vec2 cellId     = floor(frag / cellPx);
  vec2 cellCenter = (cellId + 0.5) * cellPx;
  vec2 sampleP    = (cellCenter - 0.5 * u_resolution.xy) / minDim;

  float b = liquid(sampleP * 2.0, t);
  b = smoothstep(0.05, 0.70, b);

  vec2 inCell   = (frag - cellCenter) / cellPx;
  float distC   = length(inCell);
  // Minimum dot radius so cells are always visible, max grows with brightness
  float radius  = mix(0.12, 0.50, b);
  float edge    = 1.6 / u_dotSize;
  float dotMask = 1.0 - smoothstep(radius - edge, radius + edge, distC);

  vec3 bg        = vec3(0.941, 0.937, 0.902);
  vec3 peach     = vec3(1.0, 0.66, 0.50);
  vec3 coralDark = u_tint * 0.62;
  vec3 dotColor  = mix(peach, mix(u_tint, coralDark, smoothstep(0.55, 1.0, b)), b);

  vec3 color = mix(bg, dotColor, dotMask);

  float glint = pow(b, 4.0) * 0.22;
  color += vec3(glint, glint * 0.85, glint * 0.65);

  vec2 vUv = uv - 0.5;
  float vig = 1.0 - smoothstep(0.42, 0.95, length(vUv) * 1.35);
  color = mix(bg * 0.93, color, vig);

  gl_FragColor = vec4(color, 1.0);
}
`

export default function LiquidHalftoneCanvas({
  tint = DEFAULT_TINT,
  dotSize = DEFAULT_DOT_SIZE,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.warn('[LiquidHalftone] canvas ref is null')
      return
    }

    const parentRect = canvas.parentElement?.getBoundingClientRect()
    console.log('[LiquidHalftone] mount — parent size:', {
      width: parentRect?.width,
      height: parentRect?.height,
      canvasClientW: canvas.clientWidth,
      canvasClientH: canvas.clientHeight,
    })

    const gl =
      canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { antialias: true, premultipliedAlpha: false })

    if (!gl) {
      console.error('[LiquidHalftone] WebGL not available, using fallback')
      canvas.classList.add('liquid-canvas--fallback')
      return
    }
    console.log('[LiquidHalftone] WebGL context OK')

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('[LiquidHalftone] shader compile failed:', gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      canvas.classList.add('liquid-canvas--fallback')
      return
    }

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[LiquidHalftone] program link failed:', gl.getProgramInfoLog(program))
      canvas.classList.add('liquid-canvas--fallback')
      return
    }
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1,
      ]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'u_time')
    const uRes  = gl.getUniformLocation(program, 'u_resolution')
    const uTint = gl.getUniformLocation(program, 'u_tint')
    const uDot  = gl.getUniformLocation(program, 'u_dotSize')

    gl.uniform3f(uTint, tint[0], tint[1], tint[2])

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let logged = false
    const resize = () => {
      const parent = canvas.parentElement
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'
        gl.viewport(0, 0, w, h)
        gl.uniform2f(uRes, w, h)
        gl.uniform1f(uDot, dotSize * dpr)
        if (!logged) {
          console.log('[LiquidHalftone] resize →', { w, h, rectW: rect.width, rectH: rect.height })
          logged = true
        }
      }
    }

    let raf = 0
    let running = true
    const start = performance.now()

    const loop = () => {
      if (!running) return
      resize()
      gl.clearColor(0.941, 0.937, 0.902, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform1f(uTime, (performance.now() - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      gl.deleteBuffer(buf)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [tint, dotSize])

  return (
    <canvas
      ref={canvasRef}
      className="liquid-canvas"
      width={600}
      height={400}
      aria-hidden="true"
    />
  )
}
