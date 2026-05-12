'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function FadeUp({ children, delay = 0, className = '' }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setVisible(true), delay)
          observer.unobserve(el)
          return () => clearTimeout(t)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 500ms cubic-bezier(0.0,0.0,0.2,1.0) ${delay}ms, transform 500ms cubic-bezier(0.0,0.0,0.2,1.0) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
