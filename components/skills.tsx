import SectionLabel from '@/components/hud/section-label'
import FadeUp from '@/components/fade-up'
import ScrambleText from '@/components/scramble-text'

const SKILLS = {
  Design: {
    accent: ['Figma', 'FigJam'],
    standard: ['Framer', 'Adobe XD'],
  },
  Development: {
    accent: ['HTML', 'CSS', 'JavaScript'],
    standard: ['React', 'Next.js'],
  },
}

const LEARNING = ['TypeScript →', 'Framer Motion →', 'System Design →', 'Backend basics →']

function Chip({
  label,
  variant,
}: {
  label: string
  variant: 'accent' | 'standard' | 'learning'
}) {
  const styles: React.CSSProperties = {
    fontFamily: 'var(--font-syne-mono, monospace)',
    fontSize: '11px',
    borderRadius: '4px',
    padding: '4px 10px',
    display: 'inline-block',
    letterSpacing: '0.04em',
  }

  if (variant === 'accent') {
    return (
      <span
        style={{
          ...styles,
          background: 'rgba(163,255,71,0.07)',
          border: '0.5px solid rgba(163,255,71,0.2)',
          color: 'rgba(163,255,71,0.85)',
        }}
      >
        {label}
      </span>
    )
  }

  if (variant === 'learning') {
    return (
      <span
        style={{
          ...styles,
          border: '0.5px dashed rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.28)',
          background: 'transparent',
        }}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      style={{
        ...styles,
        background: 'rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        color: '#C8C8C8',
      }}
    >
      {label}
    </span>
  )
}

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        background: '#050505',
        padding: '120px 40px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <FadeUp>
          <SectionLabel label="TECH.STACK" description="CAPABILITY MATRIX" />
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
            <ScrambleText text="Skills & tools" duration={700} />
          </h2>
        </FadeUp>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Design */}
          <FadeUp delay={80}>
            <SkillRow
              category="Design"
              chips={[
                ...SKILLS.Design.accent.map((l) => ({ label: l, variant: 'accent' as const })),
                ...SKILLS.Design.standard.map((l) => ({ label: l, variant: 'standard' as const })),
              ]}
            />
          </FadeUp>

          {/* Divider */}
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '0' }} />

          {/* Development */}
          <FadeUp delay={160}>
            <SkillRow
              category="Development"
              chips={[
                ...SKILLS.Development.accent.map((l) => ({ label: l, variant: 'accent' as const })),
                ...SKILLS.Development.standard.map((l) => ({ label: l, variant: 'standard' as const })),
              ]}
            />
          </FadeUp>

          {/* Divider */}
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '0' }} />

          {/* Currently learning */}
          <FadeUp delay={240}>
            <SkillRow
              category="Currently learning"
              chips={LEARNING.map((l) => ({ label: l, variant: 'learning' as const }))}
            />
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

function SkillRow({
  category,
  chips,
}: {
  category: string
  chips: { label: string; variant: 'accent' | 'standard' | 'learning' }[]
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '40px',
        padding: '32px 0',
      }}
      className="skill-row"
    >
      <div
        style={{
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '11px',
          color: '#9A9A9A',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          minWidth: '160px',
          flexShrink: 0,
          paddingTop: '2px',
        }}
      >
        {category}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
        {chips.map((chip) => (
          <Chip key={chip.label} label={chip.label} variant={chip.variant} />
        ))}
      </div>
    </div>
  )
}
