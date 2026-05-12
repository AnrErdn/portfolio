import { projects } from '@/lib/projects'
import ProjectCard from '@/components/project-card'
import SectionLabel from '@/components/hud/section-label'
import FadeUp from '@/components/fade-up'

export default function WorkGrid() {
  const featured = projects.find((p) => p.featured)!
  const supporting = projects.filter((p) => !p.featured && p.type === 'full')
  const side = projects.filter((p) => p.type === 'side')

  return (
    <section
      id="work"
      style={{
        background: '#050505',
        padding: '120px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Section header */}
      <FadeUp>
        <SectionLabel label="CASE.FILES" description="004 PROJECTS" />
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
          Selected work
        </h2>
      </FadeUp>

      {/* Main grid — featured (63%) + supporting stack (35%) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '63fr 35fr',
          gap: '24px',
          marginBottom: '24px',
        }}
        className="work-main-grid"
      >
        {/* Featured card */}
        <FadeUp delay={0}>
          <div style={{ height: '100%' }}>
            <ProjectCard project={featured} variant="featured" />
          </div>
        </FadeUp>

        {/* Supporting stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {supporting.map((project, i) => (
            <FadeUp key={project.slug} delay={80 * (i + 1)}>
              <div style={{ flex: 1 }}>
                <ProjectCard project={project} variant="standard" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Side project — full width, dashed */}
      {side.map((project, i) => (
        <FadeUp key={project.slug} delay={80 * (i + 3)}>
          <ProjectCard project={project} variant="side" />
        </FadeUp>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .work-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
