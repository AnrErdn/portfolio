'use client'

import { useEffect, useRef, useState } from 'react'

// Uniform distribution over sphere surface via Fibonacci lattice
function fibonacciSphere(n: number, radius: number) {
  const phi = Math.PI * (3 - Math.sqrt(5))
  const pts: { x: number; y: number; z: number }[] = []
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i
    pts.push({ x: Math.cos(theta) * r * radius, y: y * radius, z: Math.sin(theta) * r * radius })
  }
  return pts
}

// Ring in XZ plane, tilted around X axis by `tilt` radians
function makeOrbitRing(n: number, radius: number, tilt: number) {
  const pts: { x: number; y: number; z: number }[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push({
      x: Math.cos(a) * radius,
      y: -Math.sin(tilt) * Math.sin(a) * radius,
      z: Math.cos(tilt) * Math.sin(a) * radius,
    })
  }
  return pts
}

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const doneRef = useRef(false)
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const cx = w / 2
    const cy = h / 2
    const globeR = Math.min(w, h) * 0.165
    const fov = globeR * 4

    const particles = fibonacciSphere(720, globeR)
    const ring1 = makeOrbitRing(80, globeR * 1.42, 0.32)
    const ring2 = makeOrbitRing(52, globeR * 1.82, -0.62)

    let rotY = 0
    const startTime = performance.now()
    const DURATION = 3600

    function project(px: number, py: number, pz: number) {
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const rx = px * cosY - pz * sinY
      const rz = px * sinY + pz * cosY
      const scale = fov / (fov + rz + globeR * 0.5)
      return { sx: cx + rx * scale, sy: cy - py * scale, depth: rz }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, w, h)

      // Soft atmospheric bloom behind globe
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, globeR * 2.8)
      bloom.addColorStop(0, 'rgba(163,255,71,0.055)')
      bloom.addColorStop(0.45, 'rgba(163,255,71,0.018)')
      bloom.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bloom
      ctx.fillRect(0, 0, w, h)

      // Project + depth-sort particles
      const proj = particles.map((p) => ({ ...project(p.x, p.y, p.z) }))
      proj.sort((a, b) => a.depth - b.depth)

      for (const { sx, sy, depth } of proj) {
        const t = Math.max(0, Math.min(1, (depth + globeR) / (globeR * 2)))
        const opacity = 0.1 + t * 0.78
        const size = 0.35 + t * 0.95
        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(163,255,71,${opacity * 0.88})`
        ctx.fill()
      }

      // Orbit ring renderer
      function drawRing(ring: ReturnType<typeof makeOrbitRing>, alpha: number, dotR: number) {
        const pts = ring.map((p) => project(p.x, p.y, p.z))

        ctx.beginPath()
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy)))
        ctx.closePath()
        ctx.strokeStyle = `rgba(163,255,71,${alpha * 0.11})`
        ctx.lineWidth = 0.5
        ctx.stroke()

        for (const p of pts) {
          const t = Math.max(0, Math.min(1, (p.depth + globeR * 2) / (globeR * 4)))
          ctx.beginPath()
          ctx.arc(p.sx, p.sy, dotR, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(163,255,71,${alpha * (0.18 + t * 0.55)})`
          ctx.fill()
        }
      }

      drawRing(ring1, 0.9, 1.6)
      drawRing(ring2, 0.52, 1.0)

      // Center core — small radial glow + hard dot
      const c = project(0, 0, 0)
      const core = ctx.createRadialGradient(c.sx, c.sy, 0, c.sx, c.sy, 14)
      core.addColorStop(0, 'rgba(163,255,71,0.85)')
      core.addColorStop(0.35, 'rgba(163,255,71,0.25)')
      core.addColorStop(1, 'rgba(163,255,71,0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(c.sx, c.sy, 14, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(c.sx, c.sy, 2.2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(163,255,71,1)'
      ctx.fill()
    }

    function tick() {
      const elapsed = performance.now() - startTime
      rotY += 0.0042

      drawFrame()

      const p = Math.min(Math.floor((elapsed / DURATION) * 100), 99)
      setProgress(p)

      if (elapsed < DURATION && !doneRef.current) {
        frameRef.current = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        setProgress(100)
        setFading(true)
        setTimeout(onComplete, 680)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#050505',
        zIndex: 9999,
        opacity: fading ? 0 : 1,
        transition: fading ? 'opacity 680ms cubic-bezier(0.4,0,0.6,1)' : 'none',
        overflow: 'hidden',
        pointerEvents: fading ? 'none' : 'auto',
      }}
      aria-hidden="true"
    >
      {/* Film grain */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.05,
          pointerEvents: 'none',
          animation: 'grain-shift 0.4s steps(1) infinite',
        }}
      />

      {/* Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Radial vignette to push focus inward */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(5,5,5,0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* HUD top-left */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '0.14em',
          color: 'rgba(163,255,71,0.38)',
          textTransform: 'uppercase',
          opacity: visible ? 1 : 0,
          transition: 'opacity 500ms ease',
        }}
      >
        AG // PORTFOLIO
      </div>

      {/* Bottom — progress counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 600ms ease',
          whiteSpace: 'nowrap',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(163,255,71,0.52)',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          INITIALIZING
        </p>
        <p
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.18)',
          }}
        >
          {String(progress).padStart(3, '0')} / 100
        </p>
      </div>
    </div>
  )
}
