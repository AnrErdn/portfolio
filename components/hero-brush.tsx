'use client'

import { useEffect, useRef } from 'react'

interface BrushPoint {
  x: number
  y: number
  vx: number
  vy: number
  age: number   // 0 → 1
  size: number
}

export default function HeroBrush() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const points = useRef<BrushPoint[]>([])
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      // Preserve existing drawing as best as possible — just resize
      canvas.width  = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const vx = lastPos.current ? x - lastPos.current.x : 0
      const vy = lastPos.current ? y - lastPos.current.y : 0
      const speed = Math.sqrt(vx * vx + vy * vy)

      if (speed > 1) {
        points.current.push({
          x, y, vx, vy,
          age: 0,
          size: Math.min(90, 18 + speed * 2.2),
        })
        // Interpolate extra points for fast swipes so trail is continuous
        if (speed > 20 && lastPos.current) {
          const steps = Math.floor(speed / 12)
          for (let i = 1; i < steps; i++) {
            const t = i / steps
            points.current.push({
              x: lastPos.current.x + vx * t,
              y: lastPos.current.y + vy * t,
              vx, vy,
              age: 0,
              size: Math.min(90, 18 + speed * 2.2),
            })
          }
        }
      }
      lastPos.current = { x, y }
    }

    // Attach to hero section, not canvas (canvas has pointer-events: none)
    const hero = document.getElementById('hero')
    if (hero) hero.addEventListener('mousemove', onMove)

    const FADE_RATE = 0.012 // opacity lost per frame

    const draw = () => {
      const { width: w, height: h } = canvas

      // Fade existing pixels by erasing at low alpha
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,0.025)'
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'

      for (const p of points.current) {
        const alpha  = 1 - p.age
        const speed  = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const angle  = Math.atan2(p.vy, p.vx)
        // Stretch along velocity: faster = more elongated
        const stretchX = 1 + Math.min(speed * 0.08, 3.5)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(angle)

        // 3 layered radial gradients — outer haze, mid glow, bright core
        const layers = [
          { r: p.size * 1.6, a: alpha * 0.055 },
          { r: p.size * 0.9, a: alpha * 0.12  },
          { r: p.size * 0.4, a: alpha * 0.22  },
        ]
        for (const l of layers) {
          const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, l.r)
          grd.addColorStop(0,   `rgba(163,255,71,${l.a})`)
          grd.addColorStop(0.5, `rgba(163,255,71,${l.a * 0.4})`)
          grd.addColorStop(1,   'rgba(163,255,71,0)')
          ctx.fillStyle = grd
          ctx.scale(stretchX, 1)
          ctx.beginPath()
          ctx.arc(0, 0, l.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.scale(1 / stretchX, 1)
        }

        ctx.restore()
        p.age += FADE_RATE
      }

      points.current = points.current.filter((p) => p.age < 1)
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      hero?.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        mixBlendMode: 'screen',
      }}
    />
  )
}
