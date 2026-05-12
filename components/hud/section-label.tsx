import ScrambleText from '@/components/scramble-text'

interface SectionLabelProps {
  label: string
  description: string
}

export default function SectionLabel({ label, description }: SectionLabelProps) {
  const text = description ? `${label} // ${description}` : label
  return (
    <p
      aria-hidden="true"
      style={{
        fontFamily: 'var(--font-syne-mono, monospace)',
        fontSize: '10px',
        letterSpacing: '0.12em',
        lineHeight: 1.4,
        color: 'rgba(163, 255, 71, 0.45)',
        textTransform: 'uppercase',
        marginBottom: '12px',
      }}
    >
      <ScrambleText text={text} />
    </p>
  )
}
