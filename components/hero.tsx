'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import BracketCorners from '@/components/hud/bracket-corners'
import HeroBrush from '@/components/hero-brush'

const ShaderGradientCanvas = dynamic(
  async () => {
    const { ShaderGradientCanvas } = await import('shadergradient')
    return ShaderGradientCanvas
  },
  { ssr: false, loading: () => null }
)
const ShaderGradient = dynamic(
  async () => {
    const { ShaderGradient } = await import('shadergradient')
    return ShaderGradient
  },
  { ssr: false }
)

interface HeroProps {
  ready?: boolean
}

function HudDate() {
  const [dateStr, setDateStr] = useState('')
  useEffect(() => {
    const d = new Date()
    setDateStr(
      `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    )
  }, [])
  return <>{dateStr}</>
}

function phaseIn(phase: number, minPhase: number, extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    opacity: phase >= minPhase ? 1 : 0,
    transform: phase >= minPhase ? 'translateY(0px)' : 'translateY(24px)',
    transition: 'opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)',
    ...extra,
  }
}

export default function Hero({ ready = false }: HeroProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!ready) return
    const timers = [
      setTimeout(() => setPhase(1), 0),
      setTimeout(() => setPhase(2), 200),
      setTimeout(() => setPhase(3), 500),
      setTimeout(() => setPhase(4), 750),
      setTimeout(() => setPhase(5), 1000),
      setTimeout(() => setPhase(6), 1250),
      setTimeout(() => setPhase(7), 1550),
      setTimeout(() => setPhase(8), 1900),
      setTimeout(() => setPhase(9), 2200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [ready])

  return (
    <section
      id="hero"
      style={{ position: 'relative', minHeight: '100svh', background: '#050505', overflow: 'hidden' }}
    >
      {/* ── ShaderGradient background ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-20px',          /* bleed past edges so blur doesn't show white fringe */
          zIndex: 0,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 2000ms ease',
          filter: 'blur(10px)',    /* slight softening */
        }}
      >
        <ShaderGradientCanvas style={{ width: '100%', height: '100%' }} fov={45}>
          <ShaderGradient
            type="waterPlane"
            animate="on"
            uSpeed={0.2}
            uStrength={3.5}
            uDensity={1.3}
            uFrequency={5.5}
            color1="#050505"
            color2="#1C4400"
            color3="#0A0A0A"
            brightness={1.6}
            grain="on"
            lightType="3d"
            envPreset="city"
            cameraZoom={1.5}
            positionX={0}
            positionY={-1}
            positionZ={0}
          />
        </ShaderGradientCanvas>
      </div>

      {/* ── Cinematic grain overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          width: '120%',
          height: '120%',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.055,
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'grain-shift 0.4s steps(1) infinite',
        }}
      />

      {/* ── Cinematic haze — soft light bloom from upper-left ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: [
            'radial-gradient(ellipse 70% 50% at 10% 20%, rgba(163,255,71,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 60% at 90% 80%, rgba(30,80,0,0.06) 0%, transparent 65%)',
          ].join(', '),
          pointerEvents: 'none',
        }}
      />

      {/* ── Vignette overlay to darken edges ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background:
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(5,5,5,0.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── HUD bracket corners ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <BracketCorners size={20} color="rgba(163,255,71,0.18)" />
      </div>

      {/* ── Wet brush trail canvas ── */}
      <HeroBrush />

      {/* ── Main content ── */}
      <div
        className="hero-content"
        style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100svh',
          padding: '160px 56px 80px',
          maxWidth: '100%',
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'rgba(163,255,71,0.5)',
            textTransform: 'uppercase',
            marginBottom: '32px',
            ...phaseIn(phase, 2),
          }}
        >
          PORTFOLIO // ANAR-ERDENE GANTULGA
        </p>

        {/* ── The name — fills the viewport ── */}
        <div style={{ flex: 1 }}>
          <div
            className="hero-name-1"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: 'clamp(56px, 13.5vw, 230px)',
              letterSpacing: '-0.045em',
              lineHeight: 0.92,
              color: '#EFEFEF',
              ...phaseIn(phase, 3),
            }}
          >
            ANAR-ERDENE
          </div>
          <div
            className="hero-name-2"
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: 'clamp(80px, 20vw, 340px)',
              letterSpacing: '-0.045em',
              lineHeight: 0.9,
              color: '#FFFFFF',
              marginTop: '4px',
              ...phaseIn(phase, 4),
            }}
          >
            GANTULGA
          </div>
        </div>

        {/* ── Below-name section ── */}
        <div style={{ marginTop: '48px' }}>
          {/* Horizontal rule — draws from left */}
          <div
            aria-hidden="true"
            style={{
              height: '1px',
              background: 'rgba(255,255,255,0.12)',
              marginBottom: '32px',
              maxWidth: '640px',
              transformOrigin: 'left center',
              transform: phase >= 5 ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 1000ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />

          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <h1
                className="hero-headline"
                style={{
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontWeight: 300,
                  fontSize: 'clamp(18px, 2.2vw, 30px)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.25,
                  color: 'rgba(240,240,240,0.65)',
                  marginBottom: '14px',
                  ...phaseIn(phase, 6),
                }}
              >
                Where design thinking
                <br />
                meets production code.
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(200,200,200,0.45)',
                  maxWidth: '380px',
                  marginBottom: '36px',
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
                  gap: '12px',
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
                  style={{
                    fontFamily: 'var(--font-syne-mono, monospace)',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '12px 26px',
                    background: '#A3FF47',
                    color: '#050505',
                    borderRadius: '3px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #A3FF47',
                    transition: 'filter 180ms ease',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = '')}
                >
                  VIEW WORK ↓
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-syne-mono, monospace)',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '12px 26px',
                    background: 'transparent',
                    color: 'rgba(200,200,200,0.55)',
                    borderRadius: '3px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '0.5px solid rgba(200,200,200,0.18)',
                    transition: 'border-color 180ms ease, color 180ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200,200,200,0.4)'
                    e.currentTarget.style.color = 'rgba(200,200,200,0.9)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200,200,200,0.18)'
                    e.currentTarget.style.color = 'rgba(200,200,200,0.55)'
                  }}
                >
                  RÉSUMÉ ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint — bottom */}
        <p
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.18)',
            textTransform: 'uppercase',
            marginTop: '64px',
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
          top: '32px',
          right: '56px',
          textAlign: 'right',
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '9px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.14)',
          lineHeight: 2,
          zIndex: 4,
          ...phaseIn(phase, 9),
        }}
      >
        <div>LAT 47.9077° N · LON 106.8832° E</div>
        <div><HudDate /></div>
        <div>RENDER — ACTIVE</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-content { padding: 100px 24px 60px !important; }
          .hero-hud-meta { display: none !important; }
          .hero-name-1 { font-size: clamp(44px, 14vw, 100px) !important; }
          .hero-name-2 { font-size: clamp(64px, 20vw, 140px) !important; }
          .hero-headline { font-size: clamp(16px, 4vw, 24px) !important; }
        }
      `}</style>
    </section>
  )
}
