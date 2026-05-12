'use client'

import { useEffect, useRef, useState } from 'react'
import ScanLine from '@/components/hud/scan-line'
import BracketCorners from '@/components/hud/bracket-corners'
import Reticle from '@/components/hud/reticle'

const HUD_TEXT = 'SYSTEM // READY'

function useTypewriter(text: string, delay = 30, startDelay = 700) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const start = setTimeout(() => {
      const tick = () => {
        if (i >= text.length) {
          setDone(true)
          return
        }
        setDisplayed(text.slice(0, i + 1))
        i++
        requestAnimationFrame(() => setTimeout(tick, delay))
      }
      tick()
    }, startDelay)

    return () => clearTimeout(start)
  }, [text, delay, startDelay])

  return { displayed, done }
}

function HudDate() {
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const d = new Date()
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    setDateStr(`${yyyy}.${mm}.${dd}`)
  }, [])

  return <>{dateStr}</>
}

export default function Hero() {
  const [scanDone, setScanDone] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const { displayed: hudText } = useTypewriter(HUD_TEXT, 30, 700)

  useEffect(() => {
    if (scanDone) {
      const t = setTimeout(() => setContentVisible(true), 100)
      return () => clearTimeout(t)
    }
  }, [scanDone])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Scan-line on load */}
      <ScanLine onComplete={() => setScanDone(true)} />

      {/* Viewport bracket corners */}
      <BracketCorners size={20} color="rgba(163,255,71,0.4)" />

      {/* Hero content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: '160px 40px 80px',
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: '40px',
          alignItems: 'center',
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.0,0.0,0.2,1.0)',
        }}
        className="hero-grid"
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* HUD typewriter label */}
          <p
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(163,255,71,0.4)',
              textTransform: 'uppercase',
              marginBottom: '16px',
              minHeight: '14px',
            }}
          >
            {hudText}
            <span
              style={{
                display: 'inline-block',
                width: '1px',
                height: '10px',
                background: 'rgba(163,255,71,0.4)',
                marginLeft: '2px',
                verticalAlign: 'middle',
                animation: 'cursor-blink 1s step-end infinite',
              }}
            />
            <style>{`
              @keyframes cursor-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
            `}</style>
          </p>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: 'rgba(240,240,240,0.3)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            ANAR-ERDENE // DESIGNER + DEVELOPER
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: '#F0F0F0',
              marginBottom: '24px',
            }}
          >
            Where design thinking
            <br />
            meets production code.
          </h1>

          {/* Thin divider */}
          <div
            style={{
              height: '2px',
              background: 'rgba(255,255,255,0.08)',
              marginBottom: '24px',
              width: '100%',
            }}
          />

          {/* Subheadline */}
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: 1.7,
              color: '#C8C8C8',
              marginBottom: '40px',
              maxWidth: '520px',
            }}
          >
            I&apos;m a UX/UI designer and frontend developer — which means I build
            products that are both beautiful to use and solid to ship.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '14px',
                fontWeight: 400,
                padding: '12px 24px',
                background: '#A3FF47',
                color: '#050505',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #A3FF47',
                transition: 'background 200ms ease, box-shadow 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C4FF82'
                e.currentTarget.style.boxShadow = '0 0 24px rgba(163,255,71,0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#A3FF47'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              View Work ↓
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                fontFamily: 'var(--font-inter, sans-serif)',
                fontSize: '14px',
                fontWeight: 400,
                padding: '12px 24px',
                background: 'transparent',
                color: '#C8C8C8',
                borderRadius: '8px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '0.5px solid rgba(200,200,200,0.3)',
                transition: 'border-color 200ms ease, color 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,200,200,0.6)'
                e.currentTarget.style.color = '#F0F0F0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,200,200,0.3)'
                e.currentTarget.style.color = '#C8C8C8'
              }}
            >
              About Me
            </a>
          </div>

          {/* Scroll hint */}
          <p
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              marginTop: '64px',
            }}
          >
            SCROLL TO EXPLORE ↓
          </p>
        </div>

        {/* Right column — reticle, hidden on mobile */}
        <div
          className="hero-reticle"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
          }}
        >
          <Reticle />
        </div>
      </div>

      {/* HUD metadata — top right, hidden on mobile */}
      <div
        className="hero-hud-meta"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '80px',
          right: '40px',
          textAlign: 'right',
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.2)',
          lineHeight: 1.8,
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.0,0.0,0.2,1.0)',
        }}
      >
        <div>LAT 47.9077° N · LON 106.8832° E</div>
        <div>
          <HudDate />
        </div>
        <div>RENDER STATUS — ACTIVE</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            padding: 120px 24px 60px !important;
          }
          .hero-reticle { display: none !important; }
          .hero-hud-meta { display: none !important; }
        }
        @media (min-width: 1200px) {
          .hero-grid h1 {
            font-size: 64px !important;
          }
        }
      `}</style>
    </section>
  )
}
