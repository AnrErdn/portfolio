'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import dynamic from 'next/dynamic'

/* ── GLSL source ─────────────────────────────────────────────────────────── */

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
    mix(hash(i),              hash(i + vec2(1,0)), u.x),
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
  vec2 uv = vUv;

  /* Mouse warp */
  vec2 d = uv - uMouse;
  float mouseDist = length(d);
  uv += (uMouse - 0.5) * 0.18 * (1.0 - smoothstep(0.0, 0.8, mouseDist));

  /* Click ripple */
  float rDist  = length(uv - uRipple);
  float ripple = sin(rDist * 28.0 - uRippleAge * 5.5) * exp(-rDist * 3.0) * exp(-uRippleAge * 1.2) * 0.04;
  uv += normalize(uv - uRipple + 0.001) * ripple;

  /* Domain-warped FBM */
  float q1 = fbm(uv * 2.2 + uTime * 0.06);
  float q2 = fbm(uv * 2.2 + vec2(q1) + 1.7 - uTime * 0.04);
  float f  = fbm(uv * 2.0 + vec2(q1, q2) - uTime * 0.03);

  /* Palette: deep void to lime to teal */
  vec3 col = mix(vec3(0.01, 0.01, 0.01), vec3(0.05, 0.10, 0.02), clamp(f * 2.4, 0.0, 1.0));
  col = mix(col, vec3(0.64, 1.0, 0.28) * 0.55, clamp((f - 0.38) * 3.5, 0.0, 1.0));
  col = mix(col, vec3(0.12, 0.72, 0.62) * 0.40, clamp((f - 0.55) * 5.0, 0.0, 1.0));

  /* Vignette */
  float vig = 1.0 - dot(vUv - 0.5, vUv - 0.5) * 2.2;
  col *= max(0.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── R3F mesh ─────────────────────────────────────────────────────────────── */

interface PlaneProps {
  ripple: THREE.Vector2
  rippleAge: number
}

function WarpPlane({ ripple, rippleAge }: PlaneProps) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null)

  const uniforms = useMemo(
    () => ({
      uTime:      { value: 0 },
      uMouse:     { value: new THREE.Vector2(0.5, 0.5) },
      uRipple:    { value: new THREE.Vector2(0.5, 0.5) },
      uRippleAge: { value: 0 },
    }),
    []
  )

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

/* ── Canvas wrapper (extracted so dynamic import works cleanly) ──────────── */

interface CanvasWrapperProps {
  ripple: THREE.Vector2
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

/* ── Section ───────────────────────────────────────────────────────────────── */

export default function ShaderSection() {
  const [ripple, setRipple] = useState(() => new THREE.Vector2(0.5, 0.5))
  const [rippleAge, setRippleAge] = useState(999)
  const sectionRef = useRef<HTMLElement>(null)
  const rafRef = useRef<number>(0)

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
    setRipple(
      new THREE.Vector2(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height
      )
    )
    setRippleAge(0)
  }

  return (
    <section
      id="interface"
      ref={sectionRef}
      onClick={handleClick}
      style={{
        position: 'relative',
        height: '70vh',
        minHeight: '480px',
        background: '#050505',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}
    >
      <DynamicCanvas ripple={ripple} rippleAge={rippleAge} />

      {/* Label overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(163,255,71,0.35)',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          #INTERFACE
        </p>
        <p
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.12)',
            textTransform: 'uppercase',
          }}
        >
          MOVE CURSOR · CLICK TO RIPPLE
        </p>
      </div>

      {/* Edge fades */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, #050505 0%, transparent 12%, transparent 88%, #050505 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </section>
  )
}
