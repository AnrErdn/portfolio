'use client'

import { useEffect, useRef, useState } from 'react'

const POOL = '!<>-_\\/[]{}=+*^?#%$~|@0123456789'

interface Props {
  text: string
  /** Controlled trigger — pass a boolean; animation fires when it flips to true.
   *  Omit to use IntersectionObserver (fires when element scrolls into view). */
  trigger?: boolean
  delay?: number    // ms delay after trigger/intersection
  duration?: number // total decode time in ms
  className?: string
  style?: React.CSSProperties
}

export default function ScrambleText({
  text,
  trigger,
  delay = 0,
  duration = 1500,
  className,
  style,
}: Props) {
  const [output, setOutput] = useState(text)
  const elRef    = useRef<HTMLSpanElement>(null)
  const rafRef   = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hasRun   = useRef(false)

  const scramble = (ch: string) =>
    ch === ' ' || ch === '\n'
      ? ch
      : POOL[Math.floor(Math.random() * POOL.length)]

  const run = () => {
    if (hasRun.current) return
    hasRun.current = true

    // Immediately show full scramble
    setOutput(text.split('').map(scramble).join(''))

    const start = performance.now()
    const tick = (now: number) => {
      const progress   = Math.min((now - start) / duration, 1)
      const revealUpTo = Math.floor(progress * text.length)

      setOutput(
        text.split('').map((ch, i) =>
          i < revealUpTo ? ch : scramble(ch)
        ).join('')
      )

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setOutput(text)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Controlled trigger (hero phase system)
  useEffect(() => {
    if (trigger === undefined) return
    if (trigger) {
      timerRef.current = setTimeout(run, delay)
    }
    return () => {
      clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  // IntersectionObserver trigger (all other sections)
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
    return () => {
      obs.disconnect()
      clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
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
