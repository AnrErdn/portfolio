import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllProjectSlugs, getProjectBySlug, getNextProject } from '@/lib/mdx'

const mdxModules: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'ctf-mn':        () => import('@/content/work/ctf-mn.mdx'),
  'uudam-network': () => import('@/content/work/uudam-network.mdx'),
  'apple-flow':    () => import('@/content/work/apple-flow.mdx'),
  'mesa-visual':   () => import('@/content/work/mesa-visual.mdx'),
}

const heroImages: Record<string, string | null> = {
  'ctf-mn':        '/hero-images/ctf-mn.png',
  'uudam-network': null,
  'apple-flow':    '/hero-images/apple-flow.png',
  'mesa-visual':   '/hero-images/mesa-visual.png',
}

const galleries: Record<string, { src: string; caption: string }[]> = {
  'ctf-mn': [
    { src: '/work/ctf-mn/landing.png', caption: 'CTF.mn landing page — final design' },
  ],
  'uudam-network': [],
  'apple-flow': [
    { src: '/work/apple-flow/landing.png',   caption: 'Apple Flow — marketing landing page' },
    { src: '/work/apple-flow/dashboard.png', caption: 'Apple Flow — product dashboard view' },
  ],
  'mesa-visual': [
    { src: '/work/mesa-visual/landing.png',        caption: 'Nomadic Masters Spring 2025 — landing page concept' },
    { src: '/work/mesa-visual/sticker-default.png', caption: 'NM MESA 2025 — default sticker' },
    { src: '/work/mesa-visual/sticker-holo.png',    caption: 'NM MESA 2025 — holographic' },
    { src: '/work/mesa-visual/sticker-golden.png',  caption: 'NM MESA 2025 — golden' },
    { src: '/work/mesa-visual/sticker-silver.png',  caption: 'NM MESA 2025 — silver' },
    { src: '/work/mesa-visual/sticker-bronze.png',  caption: 'NM MESA 2025 — bronze' },
  ],
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Anar-Erdene Gantulga`,
    description: project.description,
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const mdxLoader = mdxModules[slug]
  if (!mdxLoader) notFound()

  const { default: Content } = await mdxLoader()
  const nextProject = getNextProject(slug)
  const heroSrc = heroImages[slug]
  const gallery = galleries[slug] ?? []

  const projectIndex = getAllProjectSlugs().indexOf(slug) + 1

  return (
    <div style={{ background: '#050505', minHeight: '100svh', color: '#C8C8C8' }}>

      {/* ── Top nav row ── */}
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '36px 56px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        className="cs-nav"
      >
        <Link
          href="/#work"
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.12em',
            color: 'rgba(200,200,200,0.4)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'color 150ms ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={undefined}
        >
          ← WORK
        </Link>
        <span
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '9px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.14)',
            textTransform: 'uppercase',
          }}
        >
          CASE STUDY {String(projectIndex).padStart(3, '0')}
        </span>
      </div>

      {/* ── Hero title — brutalist, fills viewport ── */}
      <header
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '56px 56px 0',
        }}
        className="cs-header"
      >
        <h1
          className="cs-title"
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 300,
            fontSize: 'clamp(56px, 10vw, 160px)',
            letterSpacing: '-0.045em',
            lineHeight: 0.9,
            color: '#F0F0F0',
            marginBottom: '40px',
          }}
        >
          {project.title}
        </h1>

        {/* Meta row */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
            alignItems: 'center',
            paddingBottom: '32px',
            borderBottom: '0.5px solid rgba(255,255,255,0.08)',
            marginBottom: '48px',
          }}
          className="cs-meta-row"
        >
          {project.roles.map((role) => (
            <span
              key={role}
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: 'rgba(163,255,71,0.6)',
                textTransform: 'uppercase',
              }}
            >
              {role}
            </span>
          ))}
          <span
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              marginLeft: 'auto',
            }}
          >
            {project.year}{project.duration ? ` · ${project.duration}` : ''}
          </span>
        </div>

        {/* Description + live link */}
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px', flexWrap: 'wrap', marginBottom: '72px' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: 'clamp(16px, 1.4vw, 22px)',
              lineHeight: 1.55,
              color: 'rgba(200,200,200,0.65)',
              maxWidth: '600px',
            }}
          >
            {project.description}
          </p>
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                color: '#A3FF47',
                border: '0.5px solid rgba(163,255,71,0.35)',
                padding: '10px 20px',
                textDecoration: 'none',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(163,255,71,0.07)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              LIVE SITE ↗
            </a>
          )}
        </div>
      </header>

      {/* ── Hero image — full bleed, no radius ── */}
      {heroSrc && (
        <div
          style={{
            maxWidth: '1320px',
            margin: '0 auto',
            padding: '0 56px',
            marginBottom: '80px',
          }}
          className="cs-hero-img"
        >
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#0D0D0D' }}>
            <Image
              src={heroSrc}
              alt={`${project.title} — final product`}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>
      )}

      {/* ── Meta strip — stark horizontal ── */}
      <div
        style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 56px', marginBottom: '96px' }}
        className="cs-meta-strip"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: '0.5px solid rgba(255,255,255,0.1)',
          }}
          className="cs-meta-grid"
        >
          {[
            { label: 'ROLE',     value: project.roles.join(' · ') },
            { label: 'TIMELINE', value: project.duration ? `${project.year} · ${project.duration}` : String(project.year) },
            { label: 'PLATFORM', value: slug === 'mesa-visual' ? 'Print + Digital' : 'Web' },
            { label: 'OUTCOME',  value: getOutcome(slug), accent: true },
          ].map((item) => (
            <div
              key={item.label}
              style={{ padding: '28px 0', paddingRight: '24px' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '9px',
                  letterSpacing: '0.14em',
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  color: item.accent ? '#A3FF47' : 'rgba(200,200,200,0.8)',
                  lineHeight: 1.4,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MDX content ── */}
      <article
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 56px',
          marginBottom: '96px',
        }}
        className="cs-article"
      >
        <div className="mdx-content">
          <Content />
        </div>
      </article>

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <div
          style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 56px', marginBottom: '96px' }}
          className="cs-gallery"
        >
          <p
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.16em',
              color: 'rgba(163,255,71,0.4)',
              textTransform: 'uppercase',
              marginBottom: '32px',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
              paddingTop: '32px',
            }}
          >
            VISUALS // SELECTED ASSETS
          </p>

          {/* First image — full width */}
          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#0D0D0D', marginBottom: '10px' }}>
            <Image src={gallery[0].src} alt={gallery[0].caption} fill style={{ objectFit: 'cover' }} />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '9px',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.08em',
              marginBottom: gallery.length > 1 ? '24px' : '0',
            }}
          >
            {gallery[0].caption}
          </p>

          {/* Rest — 3-col grid */}
          {gallery.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }} className="cs-gallery-grid">
              {gallery.slice(1).map((img) => (
                <div key={img.src}>
                  <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#0D0D0D', marginBottom: '6px' }}>
                    <Image src={img.src} alt={img.caption} fill style={{ objectFit: 'contain', padding: '12px' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-syne-mono, monospace)', fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Next project ── */}
      {nextProject && (
        <div
          style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 56px 120px' }}
          className="cs-next"
        >
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', marginBottom: '56px' }} />
          <Link href={nextProject.links.case_study} style={{ textDecoration: 'none', display: 'block', group: 'next' }}>
            <p
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              NEXT PROJECT →
            </p>
            <div
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: 300,
                fontSize: 'clamp(36px, 6vw, 96px)',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: '#F0F0F0',
                transition: 'color 200ms ease',
              }}
              className="cs-next-title"
              onMouseEnter={(e) => (e.currentTarget.style.color = '#A3FF47')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#F0F0F0')}
            >
              {nextProject.title}
            </div>
          </Link>
        </div>
      )}

      <style>{`
        .mdx-content h2 {
          font-family: var(--font-display, sans-serif);
          font-weight: 300;
          font-size: clamp(22px, 2.5vw, 36px);
          letter-spacing: -0.03em;
          color: #F0F0F0;
          margin: 56px 0 18px;
          padding-top: 56px;
          border-top: 0.5px solid rgba(255,255,255,0.07);
        }
        .mdx-content h3 {
          font-family: var(--font-syne-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(163,255,71,0.55);
          margin: 36px 0 10px;
        }
        .mdx-content p {
          font-family: var(--font-inter, sans-serif);
          font-size: 16px;
          line-height: 1.75;
          color: rgba(200,200,200,0.7);
          margin-bottom: 22px;
        }
        .mdx-content strong { color: #F0F0F0; font-weight: 500; }
        .mdx-content ul, .mdx-content ol {
          margin: 0 0 20px 24px;
          color: rgba(200,200,200,0.65);
          font-family: var(--font-inter, sans-serif);
          font-size: 15px;
          line-height: 1.7;
        }
        @media (max-width: 768px) {
          .cs-nav         { padding: 24px 24px 0 !important; }
          .cs-header      { padding: 32px 24px 0 !important; }
          .cs-hero-img    { padding: 0 24px !important; }
          .cs-meta-strip  { padding: 0 24px !important; }
          .cs-article     { padding: 0 24px !important; }
          .cs-gallery     { padding: 0 24px !important; }
          .cs-next        { padding: 0 24px 80px !important; }
          .cs-meta-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .cs-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cs-title       { font-size: clamp(40px, 12vw, 80px) !important; }
        }
        @media (max-width: 480px) {
          .cs-meta-grid   { grid-template-columns: 1fr !important; }
          .cs-gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function getOutcome(slug: string): string {
  const outcomes: Record<string, string> = {
    'ctf-mn':        'Live at ctf.mn',
    'uudam-network': 'Concept — not yet launched',
    'apple-flow':    'Personal design exploration',
    'mesa-visual':   'Mongolian Valorant Tournament 2025',
  }
  return outcomes[slug] ?? '—'
}
