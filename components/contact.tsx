'use client'

import FadeUp from '@/components/fade-up'
import { Typewriter } from '@/components/ui/typewriter'

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: '#050505',
        padding: '120px 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
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
