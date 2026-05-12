import SectionLabel from '@/components/hud/section-label'
import FadeUp from '@/components/fade-up'

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    subtitle: 'Research · Define',
    description:
      'I start by understanding the problem, user needs, and context behind the product. This helps define what actually matters before any design decisions are made.',
  },
  {
    num: '02',
    title: 'Design',
    subtitle: 'Wireframe · Prototype',
    description:
      'I translate ideas into structured layouts and interfaces, focusing on clarity, hierarchy, and usability. Every decision is made to reduce confusion and guide attention.',
  },
  {
    num: '03',
    title: 'Build',
    subtitle: 'Code · Ship',
    description:
      'I turn designs into real, working interfaces using modern web technologies. I focus on clean structure, performance, and scalability.',
  },
  {
    num: '04',
    title: 'Iterate',
    subtitle: 'Test · Refine',
    description:
      'I test, refine, and improve based on feedback and real usage. Good products are never finished on the first version.',
  },
]

export default function Process() {
  return (
    <section
      id="process"
      style={{
        background: '#0D0D0D',
        padding: '120px 40px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeUp>
          <SectionLabel label="METHODOLOGY" description="DESIGN → BUILD LOOP" />
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
            How I work
          </h2>
        </FadeUp>

        {/* 4 step cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            position: 'relative',
          }}
          className="process-grid"
        >
          {STEPS.map((step, i) => (
            <FadeUp key={step.num} delay={80 * i}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '0.5px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                {/* Arrow connector — right side of each card except last */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      right: '-16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    className="process-arrow"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <line
                        x1="0"
                        y1="8"
                        x2="12"
                        y2="8"
                        stroke="rgba(163,255,71,0.25)"
                        strokeWidth="1"
                      />
                      <path
                        d="M8 4 L12 8 L8 12"
                        stroke="rgba(163,255,71,0.25)"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}

                {/* Step number */}
                <div
                  style={{
                    fontFamily: 'var(--font-syne-mono, monospace)',
                    fontSize: '24px',
                    color: 'rgba(163,255,71,0.3)',
                    fontWeight: 300,
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontFamily: 'var(--font-display, sans-serif)',
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#C8C8C8',
                  }}
                >
                  {step.title}
                </div>

                {/* Subtitle */}
                <div
                  style={{
                    fontFamily: 'var(--font-syne-mono, monospace)',
                    fontSize: '10px',
                    color: '#9A9A9A',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.subtitle}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#9A9A9A',
                    flex: 1,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Loop arc */}
        <FadeUp delay={400}>
          <div
            aria-hidden="true"
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <svg
              width="600"
              height="40"
              viewBox="0 0 600 40"
              fill="none"
              style={{ maxWidth: '100%' }}
            >
              <path
                d="M20 8 Q300 40 580 8"
                stroke="rgba(163,255,71,0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
                fill="none"
              />
              <text
                x="290"
                y="36"
                textAnchor="middle"
                fontFamily="var(--font-syne-mono, monospace)"
                fontSize="8"
                fill="rgba(163,255,71,0.25)"
                letterSpacing="0.1em"
              >
                LOOP
              </text>
            </svg>
          </div>
        </FadeUp>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .process-grid {
            grid-template-columns: 1fr !important;
          }
          .process-arrow { display: none !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .process-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .process-arrow { display: none !important; }
        }
      `}</style>
    </section>
  )
}
