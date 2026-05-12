import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getAllProjectSlugs, getProjectBySlug, getNextProject } from '@/lib/mdx'

// MDX module map — statically known at build time
const mdxModules: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'ctf-mn': () => import('@/content/work/ctf-mn.mdx'),
  'uudam-network': () => import('@/content/work/uudam-network.mdx'),
  'apple-flow': () => import('@/content/work/apple-flow.mdx'),
  'mesa-visual': () => import('@/content/work/mesa-visual.mdx'),
}

// Hero image paths — .png where available, null = no hero yet
const heroImages: Record<string, string | null> = {
  'ctf-mn': '/hero-images/ctf-mn.png',
  'uudam-network': null,
  'apple-flow': '/hero-images/apple-flow.png',
  'mesa-visual': '/hero-images/mesa-visual.png',
}

// Gallery images per project
const galleries: Record<string, { src: string; caption: string }[]> = {
  'ctf-mn': [
    { src: '/work/ctf-mn/landing.png', caption: 'CTF.mn landing page — final design' },
  ],
  'uudam-network': [],
  'apple-flow': [
    { src: '/work/apple-flow/landing.png', caption: 'Apple Flow — marketing landing page' },
    { src: '/work/apple-flow/dashboard.png', caption: 'Apple Flow — product dashboard view' },
  ],
  'mesa-visual': [
    { src: '/work/mesa-visual/landing.png', caption: 'Nomadic Masters Spring 2025 — landing page concept' },
    { src: '/work/mesa-visual/sticker-default.png', caption: 'NM MESA 2025 — default sticker variant' },
    { src: '/work/mesa-visual/sticker-holo.png', caption: 'NM MESA 2025 — holographic sticker variant' },
    { src: '/work/mesa-visual/sticker-golden.png', caption: 'NM MESA 2025 — golden sticker variant' },
    { src: '/work/mesa-visual/sticker-silver.png', caption: 'NM MESA 2025 — silver sticker variant' },
    { src: '/work/mesa-visual/sticker-bronze.png', caption: 'NM MESA 2025 — bronze sticker variant' },
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

  const metaItems = [
    { label: 'ROLE', value: project.roles.join(' · ') },
    {
      label: 'TIMELINE',
      value: project.duration
        ? `${project.year} · ${project.duration}`
        : String(project.year),
    },
    {
      label: 'PLATFORM',
      value: slug === 'mesa-visual' ? 'Print + Digital' : 'Web',
    },
    { label: 'OUTCOME', value: getOutcome(slug), accent: true },
  ]

  return (
    <div style={{ background: '#050505', minHeight: '100svh', color: '#C8C8C8' }}>
      {/* Back nav */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 0' }}>
        <Link
          href="/#work"
          style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontSize: '14px',
            color: '#9A9A9A',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Work
        </Link>
      </div>

      {/* Header */}
      <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 0' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display, sans-serif)',
            fontWeight: 300,
            fontSize: 'clamp(36px, 4vw, 52px)',
            letterSpacing: '-0.04em',
            color: '#F0F0F0',
            lineHeight: 1.05,
            marginBottom: '16px',
          }}
        >
          {project.title}
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            color: '#9A9A9A',
            letterSpacing: '0.08em',
            marginBottom: '24px',
          }}
        >
          {project.roles.join(' · ')} · {project.year} · 4 min read
        </p>

        <p
          style={{
            fontFamily: 'var(--font-inter, sans-serif)',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: 1.6,
            color: '#C8C8C8',
            maxWidth: '640px',
            marginBottom: '32px',
          }}
        >
          {project.description}
        </p>

        {/* External links */}
        {project.links.live && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              style={ghostBtnStyle}
            >
              Live site →
            </a>
          </div>
        )}
      </header>

      {/* Hero image */}
      {heroSrc && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#141414',
            }}
          >
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

      {/* Meta strip */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          marginBottom: '64px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
          className="meta-strip"
        >
          {metaItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: '20px 24px',
                borderRight:
                  i < metaItems.length - 1 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '10px',
                  color: '#9A9A9A',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-inter, sans-serif)',
                  fontSize: '13px',
                  color: item.accent ? '#A3FF47' : '#C8C8C8',
                  lineHeight: 1.4,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MDX content */}
      <article
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 40px',
          marginBottom: '80px',
        }}
      >
        <div className="mdx-content">
          <Content />
        </div>
      </article>

      {/* Image gallery */}
      {gallery.length > 0 && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
            marginBottom: '80px',
          }}
        >
          <p
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: 'rgba(163,255,71,0.45)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            VISUALS // SELECTED ASSETS
          </p>

          {/* First image — full width */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#141414',
              marginBottom: '8px',
            }}
          >
            <Image
              src={gallery[0].src}
              alt={gallery[0].caption}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              color: '#9A9A9A',
              letterSpacing: '0.06em',
              marginBottom: '24px',
            }}
          >
            {gallery[0].caption}
          </p>

          {/* Remaining images — grid */}
          {gallery.length > 1 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              {gallery.slice(1).map((img) => (
                <div key={img.src}>
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#141414',
                      marginBottom: '8px',
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.caption}
                      fill
                      style={{ objectFit: 'contain', padding: '16px' }}
                    />
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-syne-mono, monospace)',
                      fontSize: '10px',
                      color: '#9A9A9A',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Next project */}
      {nextProject && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px 80px',
          }}
        >
          <div
            style={{
              height: '0.5px',
              background: 'rgba(255,255,255,0.08)',
              marginBottom: '32px',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '11px',
                color: '#9A9A9A',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Next project →
            </span>
            <Link
              href={nextProject.links.case_study}
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: 300,
                fontSize: '22px',
                color: '#F0F0F0',
                textDecoration: 'none',
                letterSpacing: '-0.02em',
              }}
            >
              {nextProject.title}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .mdx-content h2 {
          font-family: var(--font-display, sans-serif);
          font-weight: 300;
          font-size: 22px;
          letter-spacing: -0.02em;
          color: #F0F0F0;
          margin: 40px 0 16px;
        }
        .mdx-content h3 {
          font-family: var(--font-syne-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9A9A9A;
          margin: 32px 0 12px;
        }
        .mdx-content p {
          font-family: var(--font-inter, sans-serif);
          font-size: 16px;
          line-height: 1.7;
          color: #C8C8C8;
          margin-bottom: 20px;
        }
        .mdx-content strong {
          color: #F0F0F0;
          font-weight: 400;
        }
        @media (max-width: 640px) {
          .meta-strip {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .meta-strip {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

const ghostBtnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter, sans-serif)',
  fontSize: '13px',
  color: '#C8C8C8',
  border: '0.5px solid rgba(200,200,200,0.25)',
  borderRadius: '8px',
  padding: '8px 16px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
}

function getOutcome(slug: string): string {
  const outcomes: Record<string, string> = {
    'ctf-mn': 'Live at ctf.mn',
    'uudam-network': 'Concept — not yet launched',
    'apple-flow': 'Personal concept — design exploration',
    'mesa-visual': 'Mongolian Valorant Tournament 2025',
  }
  return outcomes[slug] ?? '—'
}
