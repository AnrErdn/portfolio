'use client'

import dynamic from 'next/dynamic'
import FadeUp from '@/components/fade-up'
import { Typewriter } from '@/components/ui/typewriter'

const ContactBalls = dynamic(() => import('@/components/contact-balls'), {
  ssr: false,
  loading: () => null,
})

// SVG fractal-noise grain encoded as data URL
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        background: '#050505',
        padding: '120px 40px',
        minHeight: '480px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── 3D physics balls — absolute background ── */}
      <ContactBalls />

      {/* ── Radial vignette — darkens edges, centres focus on content ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, transparent 10%, rgba(5,5,5,0.55) 60%, rgba(5,5,5,0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* ── Film grain overlay ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-10%',
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.055,
          pointerEvents: 'none',
          animation: 'grain-shift 0.35s steps(1) infinite',
          zIndex: 3,
        }}
      />

      {/* ── Content — sits above all overlays ── */}
      <div style={{ position: 'relative', zIndex: 4, maxWidth: '640px', margin: '0 auto' }}>
        <FadeUp>
          {/* Pulse availability dot */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <span
              className="animate-pulse-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#A3FF47',
                display: 'inline-block',
              }}
              aria-hidden="true"
            />
          </div>

          {/* HUD label */}
          <p
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(163,255,71,0.4)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            SIGNAL.OPEN // AVAILABLE FOR WORK
          </p>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: '36px',
              letterSpacing: '-0.03em',
              color: '#F0F0F0',
              marginBottom: '16px',
            }}
          >
            <Typewriter
              text={["Let's build something.", "Let's ship great products.", "Let's create together."]}
              speed={65}
              deleteSpeed={35}
              waitTime={2200}
              initialDelay={400}
              loop={true}
              cursorChar="_"
              cursorClassName=""
              cursorAnimationVariants={{
                initial: { opacity: 0 },
                animate: {
                  opacity: 1,
                  transition: { duration: 0.01, repeat: Infinity, repeatDelay: 0.45, repeatType: 'reverse' },
                },
              }}
              className="text-inherit"
            />
          </h2>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: 1.7,
              color: '#9A9A9A',
              marginBottom: '40px',
            }}
          >
            Open to full-time roles and select freelance projects.
          </p>

          {/* Email CTA */}
          <a
            href="mailto:g.anarerdenegantulga34@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '14px',
              color: '#A3FF47',
              border: '0.5px solid rgba(163,255,71,0.4)',
              background: 'rgba(163,255,71,0.06)',
              borderRadius: '8px',
              padding: '12px 24px',
              textDecoration: 'none',
              transition: 'background 200ms ease, box-shadow 200ms ease',
              marginBottom: '48px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(163,255,71,0.12)'
              e.currentTarget.style.boxShadow = '0 0 12px rgba(163,255,71,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(163,255,71,0.06)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            g.anarerdenegantulga34@gmail.com →
          </a>
        </FadeUp>

        {/* Divider */}
        <div
          style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.05)',
            margin: '0 0 32px',
          }}
        />

        {/* GitHub link */}
        <FadeUp delay={80}>
          <a
            href="https://github.com/AnrErdn"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '12px',
              color: '#9A9A9A',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              transition: 'color 100ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#C8C8C8' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#9A9A9A' }}
          >
            GitHub
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
