'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })
  const rafRef  = useRef<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const show = (v: number) => {
      if (dotRef.current)  dotRef.current.style.opacity  = String(v)
      if (ringRef.current) ringRef.current.style.opacity = String(v)
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      show(1)
    }
    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', () => show(0))
    document.documentElement.addEventListener('mouseenter', () => show(1))

    const DOT  = 6
    const RING = 38

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.10
      ring.current.y += (pos.current.y - ring.current.y) * 0.10

      if (dotRef.current)
        dotRef.current.style.transform =
          `translate(${pos.current.x - DOT / 2}px, ${pos.current.y - DOT / 2}px)`

      if (ringRef.current)
        ringRef.current.style.transform =
          `translate(${ring.current.x - RING / 2}px, ${ring.current.y - RING / 2}px)`

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const bracket = (pos: { top?: number | string; bottom?: number | string; left?: number | string; right?: number | string }) => ({
    position: 'absolute' as const,
    width: '8px',
    height: '8px',
    ...pos,
    borderTop:    pos.top    !== undefined ? '1.5px solid #A3FF47' : undefined,
    borderBottom: pos.bottom !== undefined ? '1.5px solid #A3FF47' : undefined,
    borderLeft:   pos.left   !== undefined ? '1.5px solid #A3FF47' : undefined,
    borderRight:  pos.right  !== undefined ? '1.5px solid #A3FF47' : undefined,
  })

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#A3FF47',
          boxShadow: '0 0 10px rgba(163,255,71,0.9), 0 0 4px rgba(163,255,71,1)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: 0,
          willChange: 'transform',
        }}
      />

      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '38px', height: '38px',
          pointerEvents: 'none',
          zIndex: 99998,
          opacity: 0,
          willChange: 'transform',
        }}
      >
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          inset: '4px',
          borderRadius: '50%',
          border: '1px solid rgba(163,255,71,0.5)',
          boxShadow: '0 0 8px rgba(163,255,71,0.12)',
        }} />
        {/* Tick marks at N/E/S/W */}
        <div style={{ position: 'absolute', width: '1px', height: '4px', background: 'rgba(163,255,71,0.7)', top: '1px', left: '50%' }} />
        <div style={{ position: 'absolute', width: '1px', height: '4px', background: 'rgba(163,255,71,0.7)', bottom: '1px', left: '50%' }} />
        <div style={{ position: 'absolute', height: '1px', width: '4px', background: 'rgba(163,255,71,0.7)', left: '1px', top: '50%' }} />
        <div style={{ position: 'absolute', height: '1px', width: '4px', background: 'rgba(163,255,71,0.7)', right: '1px', top: '50%' }} />
        {/* Corner brackets */}
        <div style={{ ...bracket({ top: 0, left: 0 }) }} />
        <div style={{ ...bracket({ top: 0, right: 0 }) }} />
        <div style={{ ...bracket({ bottom: 0, left: 0 }) }} />
        <div style={{ ...bracket({ bottom: 0, right: 0 }) }} />
      </div>
    </>
  )
}
