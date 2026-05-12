'use client'

import Image from 'next/image'
import SectionLabel from '@/components/hud/section-label'
import FadeUp from '@/components/fade-up'
import ScrambleText from '@/components/scramble-text'

export default function About() {
  return (
    <section
      id="about"
      style={{
        background: '#0D0D0D',
        padding: '120px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section header */}
        <FadeUp>
          <SectionLabel label="OPERATOR.PROFILE" description="" />
          <h2
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 300,
              fontSize: '36px',
              letterSpacing: '-0.03em',
              color: '#F0F0F0',
              marginBottom: '48px',
            }}
          >
            <ScrambleText text="About me" duration={700} />
          </h2>
        </FadeUp>

        {/* 2-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40% 60%',
            gap: '64px',
            alignItems: 'start',
          }}
          className="about-grid"
        >
          {/* Photo */}
          <FadeUp delay={80}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                borderRadius: '20px',
                overflow: 'hidden',
                background: '#141414',
                border: '0.5px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Image
                src="/photo.jpg"
                alt="Anar-Erdene Gantulga"
                fill
                style={{
                  objectFit: 'cover',
                  filter: 'grayscale(20%) brightness(0.85) contrast(1.05)',
                }}
              />
            </div>
          </FadeUp>

          {/* Text content */}
          <FadeUp delay={160}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Bio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#C8C8C8',
                  }}
                >
                  I design and build digital products where clarity matters more than decoration.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#C8C8C8',
                  }}
                >
                  I focus on turning ideas into simple, usable interfaces that actually solve real problems.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: 1.7,
                    color: '#C8C8C8',
                  }}
                >
                  I care about how things feel, not just how they look.
                </p>
              </div>

              {/* Stats row */}
              <div
                style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display, sans-serif)',
                    fontWeight: 300,
                    fontSize: '32px',
                    color: '#F0F0F0',
                    letterSpacing: '-0.03em',
                  }}
                >
                  4+
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-syne-mono, monospace)',
                    fontSize: '11px',
                    color: '#9A9A9A',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginTop: '4px',
                  }}
                >
                  Projects from idea to deployment
                </div>
              </div>

              {/* Download CV */}
              <div>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '14px',
                    color: '#C8C8C8',
                    border: '0.5px solid rgba(200,200,200,0.25)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    transition: 'border-color 200ms ease, color 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200,200,200,0.5)'
                    e.currentTarget.style.color = '#F0F0F0'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200,200,200,0.25)'
                    e.currentTarget.style.color = '#C8C8C8'
                  }}
                >
                  Download CV ↓
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}
