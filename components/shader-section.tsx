'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

/* ── GLSL ────────────────────────────────────────────────────────────────── */

const vert = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const frag = /* glsl */`
uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uRipple;
uniform float uRippleAge;
uniform vec2  uResolution;
varying vec2  vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float smoothNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),             hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.55;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * smoothNoise(p);
    p  = rot * p * 2.1 + vec2(9.3, 4.1);
    a *= 0.48;
  }
  return v;
}

void main() {
  float aspect = uResolution.x / uResolution.y;

  /* Aspect-corrected UV so noise is not stretched */
  vec2 uvN = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);

  /* Mouse warp in same space */
  vec2 mouseN = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);
  float mouseDist = length(uvN - mouseN);
  uvN += (mouseN) * 0.18 * (1.0 - smoothstep(0.0, 0.8, mouseDist));

  /* Click ripple */
  vec2 rippleN = vec2((uRipple.x - 0.5) * aspect, uRipple.y - 0.5);
  float rDist  = length(uvN - rippleN);
  float ripple = sin(rDist * 28.0 - uRippleAge * 5.5)
               * exp(-rDist * 3.0)
               * exp(-uRippleAge * 1.2) * 0.04;
  uvN += normalize(uvN - rippleN + 0.001) * ripple;

  /* Domain-warped FBM */
  float q1 = fbm(uvN * 2.2 + uTime * 0.06);
  float q2 = fbm(uvN * 2.2 + vec2(q1) + 1.7 - uTime * 0.04);
  float f  = fbm(uvN * 2.0 + vec2(q1, q2) - uTime * 0.03);

  /* Palette */
  vec3 col = mix(vec3(0.01, 0.01, 0.01), vec3(0.05, 0.10, 0.02), clamp(f * 2.4, 0.0, 1.0));
  col = mix(col, vec3(0.64, 1.0, 0.28) * 0.55, clamp((f - 0.38) * 3.5, 0.0, 1.0));
  col = mix(col, vec3(0.12, 0.72, 0.62) * 0.40, clamp((f - 0.55) * 5.0, 0.0, 1.0));

  /* Vignette using original vUv */
  float vig = 1.0 - dot(vUv - 0.5, vUv - 0.5) * 2.2;
  col *= max(0.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── R3F mesh ─────────────────────────────────────────────────────────────── */

interface PlaneProps {
  ripple:    THREE.Vector2
  rippleAge: number
}

function WarpPlane({ ripple, rippleAge }: PlaneProps) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null)
  const { size } = useThree()

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
    uRipple:     { value: new THREE.Vector2(0.5, 0.5) },
    uRippleAge:  { value: 0 },
    uResolution: { value: new THREE.Vector2(800, 600) },
  }), [])

  useEffect(() => {
    if (matRef.current)
      matRef.current.uniforms.uResolution.value.set(size.width, size.height)
  }, [size])

  useFrame(({ clock, pointer }) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms
    u.uTime.value      = clock.getElapsedTime()
    u.uMouse.value.set((pointer.x + 1) * 0.5, (pointer.y + 1) * 0.5)
    u.uRipple.value.copy(ripple)
    u.uRippleAge.value = rippleAge
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

/* ── Canvas wrapper ──────────────────────────────────────────────────────── */

interface CanvasWrapperProps {
  ripple:    THREE.Vector2
  rippleAge: number
}

function CanvasWrapper({ ripple, rippleAge }: CanvasWrapperProps) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
    >
      <WarpPlane ripple={ripple} rippleAge={rippleAge} />
    </Canvas>
  )
}

const DynamicCanvas = dynamic(() => Promise.resolve(CanvasWrapper), { ssr: false })

/* ── HUD elements ────────────────────────────────────────────────────────── */

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-syne-mono, monospace)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  pointerEvents: 'none',
}

function HudCorner({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 14
  const c = 1.5
  const color = 'rgba(163,255,71,0.35)'
  const style: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderTop:    (corner === 'tl' || corner === 'tr') ? `${c}px solid ${color}` : undefined,
    borderBottom: (corner === 'bl' || corner === 'br') ? `${c}px solid ${color}` : undefined,
    borderLeft:   (corner === 'tl' || corner === 'bl') ? `${c}px solid ${color}` : undefined,
    borderRight:  (corner === 'tr' || corner === 'br') ? `${c}px solid ${color}` : undefined,
    top:    corner.startsWith('t') ? 20 : undefined,
    bottom: corner.startsWith('b') ? 20 : undefined,
    left:   corner.endsWith('l')   ? 20 : undefined,
    right:  corner.endsWith('r')   ? 20 : undefined,
  }
  return <div aria-hidden="true" style={style} />
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export default function ShaderSection() {
  const [ripple,    setRipple]    = useState(() => new THREE.Vector2(0.5, 0.5))
  const [rippleAge, setRippleAge] = useState(999)
  const [hud, setHud] = useState({ x: 0.5, y: 0.5, px: 0, py: 0, inside: false })
  const sectionRef = useRef<HTMLElement>(null)
  const rafRef     = useRef<number>(0)

  useEffect(() => {
    let prev = performance.now()
    const tick = (now: number) => {
      setRippleAge((a) => a + (now - prev) / 1000)
      prev = now
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple(new THREE.Vector2(
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height
    ))
    setRippleAge(0)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHud({
      x:  (e.clientX - rect.left) / rect.width,
      y:  (e.clientY - rect.top)  / rect.height,
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
      inside: true,
    })
  }

  return (
    <section
      id="interface"
      ref={sectionRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHud((h) => ({ ...h, inside: false }))}
      style={{
        position: 'relative',
        height: '70vh',
        minHeight: '480px',
        background: '#050505',
        overflow: 'hidden',
        cursor: 'none',
      }}
    >
      <DynamicCanvas ripple={ripple} rippleAge={rippleAge} />

      {/* ── HUD corner brackets ── */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <HudCorner key={c} corner={c} />
      ))}

      {/* ── Top-left label ── */}
      <div style={{
        position: 'absolute', top: 28, left: 44,
        zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{ ...MONO, fontSize: '9px', color: 'rgba(163,255,71,0.5)', marginBottom: 4 }}>
          #INTERFACE
        </p>
        <p style={{ ...MONO, fontSize: '8px', color: 'rgba(255,255,255,0.18)' }}>
          DOMAIN-WARP · FBM · 6 OCTAVES
        </p>
      </div>

      {/* ── Top-right status ── */}
      <div style={{
        position: 'absolute', top: 28, right: 44,
        textAlign: 'right', zIndex: 2, pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#A3FF47',
            boxShadow: '0 0 6px rgba(163,255,71,0.9)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} className="animate-pulse-dot" />
          <p style={{ ...MONO, fontSize: '9px', color: 'rgba(163,255,71,0.6)' }}>SIG: ACTIVE</p>
        </div>
        <p style={{ ...MONO, fontSize: '8px', color: 'rgba(255,255,255,0.18)' }}>
          FREQ: 5.5Hz · SPEED: 0.2
        </p>
      </div>

      {/* ── Bottom-left coordinates ── */}
      <div style={{
        position: 'absolute', bottom: 28, left: 44,
        zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{ ...MONO, fontSize: '8px', color: 'rgba(255,255,255,0.18)', marginBottom: 3 }}>
          MOVE CURSOR · CLICK TO RIPPLE
        </p>
        <p style={{ ...MONO, fontSize: '9px', color: 'rgba(163,255,71,0.45)' }}>
          X: {hud.x.toFixed(3)} · Y: {hud.y.toFixed(3)}
        </p>
      </div>

      {/* ── Bottom-right readout ── */}
      <div style={{
        position: 'absolute', bottom: 28, right: 44,
        textAlign: 'right', zIndex: 2, pointerEvents: 'none',
      }}>
        <p style={{ ...MONO, fontSize: '8px', color: 'rgba(255,255,255,0.18)' }}>
          WARP: ON · GRAIN: ON
        </p>
      </div>

      {/* ── Targeting reticle ── */}
      {hud.inside && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: hud.px,
            top:  hud.py,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 3,
            width: 56,
            height: 56,
          }}
        >
          {/* Circle */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(163,255,71,0.45)',
            boxShadow: '0 0 12px rgba(163,255,71,0.08)',
          }} />
          {/* Crosshair lines */}
          <div style={{ position: 'absolute', width: 1, height: 18, background: 'rgba(163,255,71,0.4)', left: '50%', top: -22 }} />
          <div style={{ position: 'absolute', width: 1, height: 18, background: 'rgba(163,255,71,0.4)', left: '50%', bottom: -22 }} />
          <div style={{ position: 'absolute', height: 1, width: 18, background: 'rgba(163,255,71,0.4)', top: '50%', left: -22 }} />
          <div style={{ position: 'absolute', height: 1, width: 18, background: 'rgba(163,255,71,0.4)', top: '50%', right: -22 }} />
          {/* Center dot */}
          <div style={{
            position: 'absolute',
            width: 3, height: 3,
            borderRadius: '50%',
            background: '#A3FF47',
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
          }} />
        </div>
      )}

      {/* Edge fades */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #050505 0%, transparent 12%, transparent 88%, #050505 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </section>
  )
}
