'use client'

import { useEffect, useRef, useState } from 'react'

interface ScanLineProps {
  onComplete?: () => void
}

export default function ScanLine({ onComplete }: ScanLineProps) {
  const [phase, setPhase] = useState<'sweeping' | 'done'>('sweeping')
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const timer = setTimeout(() => {
      setPhase('done')
      onComplete?.()
    }, 600)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (phase === 'done') return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(163,255,71,0.3)',
          animation: 'scan-sweep 600ms cubic-bezier(0.0,0.0,0.2,1.0) forwards',
        }}
      />
      <style>{`
        @keyframes scan-sweep {
          from { top: 0; }
          to   { top: 100%; }
        }
      `}</style>
    </div>
  )
}
