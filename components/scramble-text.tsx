'use client'

import { useEffect, useRef, useState } from 'react'

// Shuffled pool so adjacent chars look visually different from each other
const POOL = ']{$~|@012!3-_\\/[}^>=+*?#%<6789&'

const FLICKER_MS = 85 // how often unrevealed chars change — slower = more readable scramble

interface Props {
  text: string
  trigger?: boolean
  delay?: number
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export default function ScrambleText({
  text,
  trigger,
  delay = 0,
  duration = 3000,
  className,
  style,
}: Props) {
  const [output, setOutput]   = useState(text)
  const elRef                  = useRef<HTMLSpanElement>(null)
  const rafRef                 = useRef<number>(0)
  const timerRef               = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastFlickerRef         = useRef<number>(0)
  const hasRun                 = useRef(false)

  const rndChar = (ch: string) =>
    ch === ' ' || ch === '\n'
      ? ch
      : POOL[Math.floor(Math.random() * POOL.length)]

  const run = () => {
    if (hasRun.current) return
    hasRun.current = true

    // Start fully scrambled
    setOutput(text.split('').map(rndChar).join(''))
    lastFlickerRef.current = performance.now()

    const start = performance.now()

    const tick = (now: number) => {
      const progress   = Math.min((now - start) / duration, 1)
      const revealUpTo = Math.floor(progress * text.length)

      // Only re-randomise unrevealed chars every FLICKER_MS — makes it legible
      if (now - lastFlickerRef.current >= FLICKER_MS) {
        lastFlickerRef.current = now
        setOutput(
          text.split('').map((ch, i) =>
            i < revealUpTo ? ch : rndChar(ch)
          ).join('')
        )
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setOutput(text)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  // Controlled trigger
  useEffect(() => {
    if (trigger === undefined) return
    if (trigger) timerRef.current = setTimeout(run, delay)
    return () => { clearTimeout(timerRef.current); cancelAnimationFrame(rafRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  // IntersectionObserver trigger
  useEffect(() => {
    if (trigger !== undefined) return
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect()
          timerRef.current = setTimeout(run, delay)
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => { obs.disconnect(); clearTimeout(timerRef.current); cancelAnimationFrame(rafRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span
      ref={elRef}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', ...style }}
    >
      {output}
    </span>
  )
}
