'use client'

import { useEffect, useRef } from 'react'
import SectionLabel from '@/components/hud/section-label'
import FadeUp from '@/components/fade-up'

// ── Vertex shader — fullscreen quad ──────────────────────────────────────────
const VERT_SRC = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`

// ── Fragment shader — domain-warped FBM, mouse influence, click ripple ───────
const FRAG_SRC = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2  u_mouse;
  uniform float u_click;
  uniform float u_aspect;

  // Value noise hash
  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  // Smooth value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),           hash(i + vec2(1,0)), f.x),
      mix(hash(i+vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }

  // Fractal Brownian Motion
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8660, 0.5, -0.5, 0.8660); // 30-degree rotation each octave
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p  = rot * p * 2.1 + vec2(100.0);
      a *= 0.48;
    }
    return v;
  }

  void main() {
    vec2 uv = v_uv;
    // Correct aspect so the field isn't stretched
    vec2 field = vec2(uv.x * u_aspect, uv.y);
    float t = u_time * 0.07;

    // Domain warping — two-pass
    vec2 q = vec2(
      fbm(field + t * 0.5),
      fbm(field + vec2(5.2, 1.3))
    );
    vec2 r = vec2(
      fbm(field + 1.4 * q + vec2(1.7, 9.2) + 0.12 * t),
      fbm(field + 1.4 * q + vec2(8.3, 2.8) + 0.126 * t)
    );
    float f = fbm(field + 2.2 * r);

    // Mouse warp — pulls the field toward cursor
    vec2 mouseField = vec2(u_mouse.x * u_aspect, u_mouse.y);
    float mouseDist = length(field - mouseField);
    float mouseInfluence = smoothstep(0.55, 0.0, mouseDist) * 0.28;
    f += mouseInfluence;

    // Click ripple — expanding ring that decays
    if (u_click > 0.0) {
      float dist  = length(uv - u_mouse);
      float ring  = sin(dist * 28.0 - u_click * 9.0);
      float decay = exp(-dist * 7.0) * exp(-u_click * 1.6);
      f += ring * decay * 0.18;
    }

    f = clamp(f, 0.0, 1.0);

    // Color palette — near-black to lime highlight
    vec3 c0 = vec3(0.020, 0.020, 0.020); // void
    vec3 c1 = vec3(0.038, 0.062, 0.012); // dark terrain
    vec3 c2 = vec3(0.55,  0.88,  0.20);  // lime peak

    vec3 col = c0;
    col = mix(col, c1, smoothstep(0.0,  0.62, f));
    col = mix(col, c2, smoothstep(0.52, 1.0,  f * f * 2.6));

    // Vignette
    float vig = length((uv - 0.5) * vec2(1.5, 1.3));
    col *= 1.0 - smoothstep(0.28, 1.0, vig) * 0.72;

    gl_FragColor = vec4(col, 1.0);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

export default function ShaderSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const clickRef = useRef(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl') as WebGLRenderingContext
    if (!gl) return

    // Compile + link
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vert)
    gl.attachShader(prog, frag)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Fullscreen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime   = gl.getUniformLocation(prog, 'u_time')
    const uMouse  = gl.getUniformLocation(prog, 'u_mouse')
    const uClick  = gl.getUniformLocation(prog, 'u_click')
    const uAspect = gl.getUniformLocation(prog, 'u_aspect')

    function resize() {
      if (!canvas) return
      const dpr = window.devicePixelRatio || 1
      // Use parent clientWidth — more reliable than getBoundingClientRect before paint
      const w = canvas.parentElement?.clientWidth ?? canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w === 0 || h === 0) return
      canvas.width  = w * dpr
      canvas.height = h * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    // rAF catches the case where offsetWidth is 0 on first synchronous call
    requestAnimationFrame(resize)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const t0 = performance.now()
    let visible = false

    function render() {
      if (!canvas || !visible) return
      const elapsed = (performance.now() - t0) / 1000

      // Decay click over time
      if (clickRef.current > 0) clickRef.current = Math.max(0, clickRef.current - 0.018)

      const aspect = canvas.width / canvas.height || 1

      gl.uniform1f(uTime,   elapsed)
      gl.uniform2f(uMouse,  mouseRef.current.x, mouseRef.current.y)
      gl.uniform1f(uClick,  clickRef.current)
      gl.uniform1f(uAspect, aspect)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      frameRef.current = requestAnimationFrame(render)
    }

    // Only run the render loop when canvas is in view — saves CPU + unblocks screenshots
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = requestAnimationFrame(render)
        } else {
          cancelAnimationFrame(frameRef.current)
          frameRef.current = 0
        }
      },
      { threshold: 0.05 }
    )
    io.observe(canvas)

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      }
    }

    function onClick() {
      clickRef.current = 3.5
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClick)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <section
      id="interface"
      style={{ background: '#050505', padding: '120px 48px' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeUp>
          <SectionLabel label="INTERFACE" description="INTERACTIVE ENV" />
          <h2
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: '36px',
              letterSpacing: '-0.03em',
              color: '#F0F0F0',
              marginBottom: '8px',
            }}
          >
            System wallpaper
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.22)',
              marginBottom: '40px',
              textTransform: 'uppercase',
            }}
          >
            Move cursor to explore · Click to disturb
          </p>
        </FadeUp>

        {/* Shader canvas */}
        <FadeUp delay={80}>
          <div
            style={{
              position: 'relative',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '0.5px solid rgba(255,255,255,0.07)',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: '560px',
                cursor: 'crosshair',
              }}
            />

            {/* HUD overlays on canvas corners */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(163,255,71,0.28)',
                pointerEvents: 'none',
                textTransform: 'uppercase',
              }}
            >
              SHADER // LIVE
            </div>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '18px',
                right: '18px',
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.14)',
                pointerEvents: 'none',
              }}
            >
              WebGL · Domain Warp · FBM
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
