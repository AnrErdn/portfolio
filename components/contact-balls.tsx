'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

type BallDef = {
  r: number
  color: string
  roughness: number
  metalness: number
  emissive?: string
  emissiveIntensity?: number
}

// 17 balls — slightly larger, mix of lime / gray / black
const BALL_DEFS: BallDef[] = [
  { r: 0.82, color: '#A3FF47', roughness: 0.05, metalness: 0.0,  emissive: '#A3FF47', emissiveIntensity: 0.08 },
  { r: 0.60, color: '#C8C8C8', roughness: 0.07, metalness: 0.45 },
  { r: 0.48, color: '#111111', roughness: 0.04, metalness: 0.55 },
  { r: 0.92, color: '#A3FF47', roughness: 0.05, metalness: 0.0,  emissive: '#A3FF47', emissiveIntensity: 0.07 },
  { r: 0.56, color: '#9A9A9A', roughness: 0.09, metalness: 0.32 },
  { r: 0.70, color: '#0A0A0A', roughness: 0.03, metalness: 0.62 },
  { r: 0.75, color: '#BBFF60', roughness: 0.06, metalness: 0.0,  emissive: '#BBFF60', emissiveIntensity: 0.05 },
  { r: 0.46, color: '#D4D4D4', roughness: 0.07, metalness: 0.42 },
  { r: 0.86, color: '#A3FF47', roughness: 0.05, metalness: 0.0,  emissive: '#A3FF47', emissiveIntensity: 0.06 },
  { r: 0.53, color: '#808080', roughness: 0.11, metalness: 0.28 },
  { r: 0.66, color: '#141414', roughness: 0.04, metalness: 0.50 },
  { r: 0.51, color: '#C8FF80', roughness: 0.06, metalness: 0.0,  emissive: '#C8FF80', emissiveIntensity: 0.04 },
  // Extra balls
  { r: 0.70, color: '#A3FF47', roughness: 0.05, metalness: 0.0,  emissive: '#A3FF47', emissiveIntensity: 0.06 },
  { r: 0.44, color: '#BEBEBE', roughness: 0.08, metalness: 0.38 },
  { r: 0.60, color: '#0D0D0D', roughness: 0.04, metalness: 0.58 },
  { r: 0.53, color: '#9AE840', roughness: 0.06, metalness: 0.0,  emissive: '#9AE840', emissiveIntensity: 0.04 },
  { r: 0.47, color: '#707070', roughness: 0.10, metalness: 0.30 },
]

type BallState = {
  x: number; y: number; z: number
  vx: number; vy: number
  r: number
  floatFreq: number; floatPhase: number
  driftFreq: number; driftPhase: number
}

// Place a ball with guaranteed distance from the section centre
function spawnAway(): [number, number] {
  const minR = 2.8
  for (let attempt = 0; attempt < 40; attempt++) {
    const x = (Math.random() - 0.5) * 12
    const y = (Math.random() - 0.5) * 7
    if (x * x + y * y >= minR * minR) return [x, y]
  }
  // Fallback: place on a random edge cluster
  const side = Math.random() < 0.5 ? -1 : 1
  return [side * (3 + Math.random() * 4), (Math.random() - 0.5) * 5]
}

function PhysicsBalls() {
  const { gl, viewport } = useThree()

  // R3F's ResizeObserver may fire before CSS applies — force a resize after mount
  useEffect(() => {
    const canvas = gl.domElement
    const raf = requestAnimationFrame(() => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        gl.setSize(w, h, false)
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [gl])

  const mouseRef = useRef({ x: 0, y: 0, active: false })

  // Lazy init — only runs once on mount
  const ballStateRef = useRef<BallState[]>([])
  if (ballStateRef.current.length === 0) {
    ballStateRef.current = BALL_DEFS.map((def) => {
      const [x, y] = spawnAway()
      return {
        x, y,
        z: (Math.random() - 0.5) * 0.8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: def.r,
        floatFreq:  0.22 + Math.random() * 0.48,
        floatPhase: Math.random() * Math.PI * 2,
        driftFreq:  0.14 + Math.random() * 0.28,
        driftPhase: Math.random() * Math.PI * 2,
      }
    })
  }

  const meshRefs = useRef<(THREE.Mesh | null)[]>(BALL_DEFS.map(() => null))

  // Track mouse over the whole section via window (works even when content sits on top)
  useEffect(() => {
    const canvas = gl.domElement
    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const inSection =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        y: -((e.clientY - rect.top)  / rect.height) * 2 + 1,
        active: inSection,
      }
    }
    const handleLeave = () => { mouseRef.current.active = false }
    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
    }
  }, [gl.domElement])

  useFrame((state, delta) => {
    const dt    = Math.min(delta, 0.033)
    const t     = state.clock.elapsedTime
    const hw    = viewport.width  / 2
    const hh    = viewport.height / 2
    const mx    = mouseRef.current.x * hw
    const my    = mouseRef.current.y * hh
    const repel = mouseRef.current.active

    const balls = ballStateRef.current
    const damp  = Math.pow(0.982, dt * 60)

    // ── 1. Forces + integrate ──────────────────────────────────────────────
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i]

      // Weak gravity (baloony float feel)
      b.vy -= 0.28 * dt

      // Sinusoidal float / drift per ball
      b.vy += Math.sin(t * b.floatFreq + b.floatPhase) * 0.22 * dt
      b.vx += Math.cos(t * b.driftFreq + b.driftPhase) * 0.06 * dt

      // Velocity damping
      b.vx *= damp
      b.vy *= damp

      // ── Centre-avoidance — keep balls off the text column ────────────────
      // Soft repulsion from (0, 0): natural resting zone is the edges.
      // Cursor repulsion can still push balls inward temporarily.
      const cx2 = b.x * b.x + b.y * b.y
      const CAR  = 3.0 // world-unit radius of the avoidance zone
      if (cx2 < CAR * CAR && cx2 > 0.001) {
        const cd    = Math.sqrt(cx2)
        const force = (1 - cd / CAR) * 0.6
        b.vx += (b.x / cd) * force * dt
        b.vy += (b.y / cd) * force * dt
      }

      // Mouse repulsion
      if (repel) {
        const dx    = b.x - mx
        const dy    = b.y - my
        const dist2 = dx * dx + dy * dy
        const R     = 1.9 + b.r
        if (dist2 < R * R && dist2 > 0.001) {
          const dist  = Math.sqrt(dist2)
          const force = (1 - dist / R) * 4.5
          b.vx += (dx / dist) * force * dt
          b.vy += (dy / dist) * force * dt
        }
      }

      b.x += b.vx * dt
      b.y += b.vy * dt
    }

    // ── 2. Ball-ball collision (elastic impulse) ───────────────────────────
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const a  = balls[i]
        const b  = balls[j]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d2 = dx * dx + dy * dy
        const md = a.r + b.r
        if (d2 < md * md && d2 > 0.0001) {
          const dist    = Math.sqrt(d2)
          const nx      = dx / dist
          const ny      = dy / dist
          const overlap = (md - dist) * 0.5
          a.x -= nx * overlap;  a.y -= ny * overlap
          b.x += nx * overlap;  b.y += ny * overlap
          const dvn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny
          if (dvn > 0) {
            const imp = dvn * 0.82
            a.vx -= imp * nx;  a.vy -= imp * ny
            b.vx += imp * nx;  b.vy += imp * ny
          }
        }
      }
    }

    // ── 3. Wall bounce ─────────────────────────────────────────────────────
    const bounce = 0.52
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i]
      if (b.x - b.r < -hw) { b.x = -hw + b.r; b.vx =  Math.abs(b.vx) * bounce }
      if (b.x + b.r >  hw) { b.x =  hw - b.r; b.vx = -Math.abs(b.vx) * bounce }
      if (b.y - b.r < -hh) { b.y = -hh + b.r; b.vy =  Math.abs(b.vy) * bounce }
      if (b.y + b.r >  hh) { b.y =  hh - b.r; b.vy = -Math.abs(b.vy) * bounce }
    }

    // ── 4. Write positions to meshes ───────────────────────────────────────
    for (let i = 0; i < balls.length; i++) {
      const mesh = meshRefs.current[i]
      if (mesh) mesh.position.set(balls[i].x, balls[i].y, balls[i].z)
    }
  })

  return (
    <>
      {BALL_DEFS.map((def, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          position={[
            ballStateRef.current[i].x,
            ballStateRef.current[i].y,
            ballStateRef.current[i].z,
          ]}
        >
          <sphereGeometry args={[def.r, 48, 32]} />
          <meshPhysicalMaterial
            color={def.color}
            roughness={def.roughness}
            metalness={def.metalness}
            clearcoat={1.0}
            clearcoatRoughness={0.04}
            emissive={def.emissive ?? '#000000'}
            emissiveIntensity={def.emissiveIntensity ?? 0}
          />
        </mesh>
      ))}
    </>
  )
}

export default function ContactBalls() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        const el = gl.domElement
        el.style.display = 'block'
        el.style.width = '100%'
        el.style.height = '100%'
      }}
    >
      {/* Atmospheric fog — gives depth/haze between balls */}
      <fog attach="fog" args={['#050505', 11, 22]} />

      {/* Environment for material reflections (clearcoat / metalness) */}
      <Environment preset="city" background={false} />

      {/* Lighting */}
      <ambientLight intensity={0.20} />
      <pointLight position={[5, 6, 6]}  intensity={4.0} color="#A3FF47" />
      <pointLight position={[-6, 1, 5]} intensity={2.0} color="#ffffff" />
      <pointLight position={[1, -6, 4]} intensity={1.4} color="#7799ff" />

      <PhysicsBalls />
    </Canvas>
  )
}
