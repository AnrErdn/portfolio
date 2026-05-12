'use client'

import { useEffect, useState } from 'react'
import BracketCorners from '@/components/hud/bracket-corners'

interface HeroProps {
  ready?: boolean
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

// Returns transition styles for phase-gated reveal
function phaseIn(
  phase: number,
  minPhase: number,
  extra: React.CSSProperties = {}
): React.CSSProperties {
  return {
    opacity: phase >= minPhase ? 1 : 0,
    transform: phase >= minPhase ? 'translateY(0px)' : 'translateY(30px)',
    transition:
      'opacity 750ms cubic-bezier(0.16,1,0.3,1), transform 750ms cubic-bezier(0.16,1,0.3,1)',
    ...extra,
  }
}

export default function Hero({ ready = false }: HeroProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!ready) return
    // Staggered cinematic entrance — each element enters at a deliberate interval
    const timers = [
      setTimeout(() => setPhase(1), 0),     // atmospheric overlays
      setTimeout(() => setPhase(2), 180),   // eyebrow mono label
      setTimeout(() => setPhase(3), 450),   // name line 1
      setTimeout(() => setPhase(4), 650),   // name line 2
      setTimeout(() => setPhase(5), 900),   // horizontal rule grows
      setTimeout(() => setPhase(6), 1100),  // h1 headline
      setTimeout(() => setPhase(7), 1350),  // body copy
      setTimeout(() => setPhase(8), 1600),  // CTAs
      setTimeout(() => setPhase(9), 1900),  // scroll hint
      setTimeout(() => setPhase(10), 2100), // HUD metadata overlays
    ]
    return () => timers.forEach(clearTimeout)
  }, [ready])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: '#050505',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* ── Atmospheric fog layers ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 90% 70% at 15% 55%, rgba(163,255,71,0.022) 0%, transparent 65%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1400ms ease',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 45% at 85% 15%, rgba(20,20,20,0.9) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 40% 30% at 90% 90%, rgba(163,255,71,0.012) 0%, transparent 55%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 2000ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* ── Film grain ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.038,
          pointerEvents: 'none',
          animation: 'grain-shift 0.35s steps(1) infinite',
        }}
      />

      {/* ── HUD bracket corners ── */}
      <BracketCorners size={18} color="rgba(163,255,71,0.2)" />

      {/* ── Main content ── */}
      <div
        className="hero-content"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: '160px 48px 100px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Eyebrow — mono HUD identifier */}
        <p
          aria-label="Anar-Erdene — Designer and Developer"
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '11px',
            letterSpacing: '0.16em',
            color: 'rgba(163,255,71,0.48)',
            textTransform: 'uppercase',
            marginBottom: '28px',
            ...phaseIn(phase, 2),
          }}
        >
          ANAR-ERDENE // DESIGNER + DEVELOPER
        </p>

        {/* ── Display name — the primary hero element ── */}
        <div style={{ marginBottom: '36px' }}>
          <div
            className="hero-name"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: 'clamp(48px, 8.5vw, 108px)',
              letterSpacing: '-0.04em',
              lineHeight: 0.94,
              color: '#F0F0F0',
              ...phaseIn(phase, 3),
            }}
          >
            ANAR-ERDENE
          </div>
          <div
            className="hero-name"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: 'clamp(48px, 8.5vw, 108px)',
              letterSpacing: '-0.04em',
              lineHeight: 0.94,
              color: '#F0F0F0',
              marginTop: '6px',
              ...phaseIn(phase, 4),
            }}
          >
            GANTULGA
          </div>
        </div>

        {/* Divider — draws from left */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            marginBottom: '36px',
            maxWidth: '560px',
            transformOrigin: 'left center',
            transform: phase >= 5 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 900ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />

        {/* H1 — the semantic headline, visually secondary */}
        <h1
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 300,
            fontSize: 'clamp(20px, 2.8vw, 34px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.22,
            color: 'rgba(240,240,240,0.72)',
            marginBottom: '22px',
            maxWidth: '500px',
            ...phaseIn(phase, 6),
          }}
        >
          Where design thinking
          <br />
          meets production code.
        </h1>

        {/* Body copy */}
        <p
          style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: 1.72,
            color: 'rgba(200,200,200,0.52)',
            marginBottom: '52px',
            maxWidth: '420px',
            ...phaseIn(phase, 7),
          }}
        >
          UX/UI designer and frontend developer — building products that are
          beautiful to use and solid to ship.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            ...phaseIn(phase, 8),
          }}
        >
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="cta-primary"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '13px 28px',
              background: '#A3FF47',
              color: '#050505',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid #A3FF47',
              transition: 'filter 180ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            VIEW WORK ↓
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '13px 28px',
              background: 'transparent',
              color: 'rgba(200,200,200,0.65)',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: '0.5px solid rgba(200,200,200,0.18)',
              transition: 'border-color 180ms ease, color 180ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200,200,200,0.45)'
              e.currentTarget.style.color = 'rgba(200,200,200,0.95)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200,200,200,0.18)'
              e.currentTarget.style.color = 'rgba(200,200,200,0.65)'
            }}
          >
            ABOUT ME
          </a>
        </div>

        {/* Scroll hint */}
        <p
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.16em',
            color: 'rgba(255,255,255,0.16)',
            textTransform: 'uppercase',
            marginTop: '88px',
            ...phaseIn(phase, 9),
          }}
        >
          SCROLL TO EXPLORE ↓
        </p>
      </div>

      {/* ── HUD metadata — top right ── */}
      <div
        aria-hidden="true"
        className="hero-hud-meta"
        style={{
          position: 'absolute',
          top: '80px',
          right: '48px',
          textAlign: 'right',
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.16)',
          lineHeight: 1.9,
          ...phaseIn(phase, 10),
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
          .hero-content { padding: 120px 24px 80px !important; }
          .hero-hud-meta { display: none !important; }
          .hero-name { font-size: clamp(40px, 12vw, 72px) !important; }
        }
      `}</style>
    </section>
  )
}
