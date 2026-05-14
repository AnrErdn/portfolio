'use client'

import dynamic from 'next/dynamic'
import FadeUp from '@/components/fade-up'
import ScrambleText from '@/components/scramble-text'

const AboutTV = dynamic(() => import('@/components/about-tv'), {
  ssr: false,
  loading: () => null,
})

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export default function About() {
  return (
    <section
      id="about"
      className="about-section"
      style={{
        background: '#0D0D0D',
        padding: '120px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
        }}
      >
        {/* Section label */}
        <FadeUp>
          <p
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: 'rgba(163,255,71,0.45)',
              textTransform: 'uppercase',
              marginBottom: '56px',
            }}
          >
            OPERATOR.PROFILE // 001
          </p>
        </FadeUp>

        {/* Two-column grid */}
        <div className="about-grid" style={{ display: 'grid', gap: '0' }}>

          {/* ── LEFT — retro TV scene ── */}
          <FadeUp delay={40}>
            <div
              className="tv-wrapper"
              style={{
                position: 'relative',
                height: '580px',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <AboutTV />

              {/* Grain overlay on the TV scene */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-10%',
                  backgroundImage: GRAIN_SVG,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '200px 200px',
                  opacity: 0.045,
                  pointerEvents: 'none',
                  animation: 'grain-shift 0.4s steps(1) infinite',
                  zIndex: 10,
                }}
              />

              {/* Subtle vignette on edges of the TV scene */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at center, transparent 45%, rgba(13,13,13,0.75) 100%)',
                  pointerEvents: 'none',
                  zIndex: 9,
                }}
              />
            </div>
          </FadeUp>

          {/* ── RIGHT — dossier profile ── */}
          <FadeUp delay={120}>
            <div
              className="dossier"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '580px',
                paddingLeft: '64px',
              }}
            >
              {/* Dossier header */}
              <div style={{ marginBottom: '32px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display, sans-serif)',
                    fontWeight: 300,
                    fontSize: '38px',
                    letterSpacing: '-0.04em',
                    color: '#F0F0F0',
                    lineHeight: 1.1,
                    marginBottom: '6px',
                  }}
                >
                  <ScrambleText text="About me" duration={700} />
                </h2>
                <div
                  style={{
                    height: '0.5px',
                    background: 'rgba(163,255,71,0.25)',
                    marginTop: '20px',
                  }}
                />
              </div>

              {/* Labeled fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {[
                  { label: 'NAME',   value: 'Anar-Erdene Gantulga' },
                  { label: 'ROLE',   value: 'Product Designer & Developer' },
                  { label: 'BASE',   value: 'Ulaanbaatar, Mongolia' },
                  { label: 'STATUS', value: '● Available' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-syne-mono, monospace)',
                        fontSize: '9px',
                        letterSpacing: '0.14em',
                        color: 'rgba(163,255,71,0.5)',
                        textTransform: 'uppercase',
                        minWidth: '56px',
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: label === 'STATUS'
                          ? 'var(--font-syne-mono, monospace)'
                          : 'var(--font-inter, sans-serif)',
                        fontSize: label === 'STATUS' ? '11px' : '14px',
                        color: label === 'STATUS' ? '#A3FF47' : '#C8C8C8',
                        letterSpacing: label === 'STATUS' ? '0.06em' : 'normal',
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '0.5px',
                  background: 'rgba(255,255,255,0.06)',
                  marginBottom: '28px',
                }}
              />

              {/* Bio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    color: '#9A9A9A',
                  }}
                >
                  I design and build digital products where clarity matters more than
                  decoration. Focused on turning ideas into interfaces that feel right —
                  not just look right.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '15px',
                    lineHeight: 1.75,
                    color: '#9A9A9A',
                  }}
                >
                  I care about how things feel, not just how they look.
                </p>
              </div>

              {/* CV link */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#C8C8C8',
                  border: '0.5px solid rgba(200,200,200,0.2)',
                  borderRadius: '4px',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  transition: 'border-color 200ms, color 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(163,255,71,0.5)'
                  e.currentTarget.style.color = '#A3FF47'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200,200,200,0.2)'
                  e.currentTarget.style.color = '#C8C8C8'
                }}
              >
                Download CV ↓
              </a>
            </div>
          </FadeUp>
        </div>
      </div>

      <style>{`
        .about-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
          .tv-wrapper {
            height: 420px !important;
          }
          .dossier {
            height: auto !important;
            padding-left: 0 !important;
            padding-top: 48px;
          }
        }
      `}</style>
    </section>
  )
}
