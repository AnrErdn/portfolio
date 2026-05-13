'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { projects } from '@/lib/projects'
import FadeUp from '@/components/fade-up'
import { GooeyText } from '@/components/ui/gooey-text-morphing'

export default function WorkGrid() {
  return (
    <section
      id="work"
      style={{ background: '#050505', padding: '100px 0 120px' }}
    >
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 56px' }} className="work-outer">
        {/* Section header */}
        <FadeUp>
          <div style={{ marginBottom: '64px' }}>
            <p
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                color: 'rgba(163,255,71,0.5)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              CASE.FILES // {String(projects.length).padStart(3, '0')} PROJECTS
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: 300,
                fontSize: 'clamp(36px, 5vw, 80px)',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                color: '#F0F0F0',
              }}
            >
              Selected
              <br />
              <span style={{ color: 'rgba(240,240,240,0.25)' }}>work.</span>
            </h2>
          </div>
        </FadeUp>

        {/* Full-width divider */}
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.1)', marginBottom: '0' }} />

        {/* Project list */}
        {projects.map((project, i) => (
          <FadeUp key={project.slug} delay={i * 60}>
            <WorkRow project={project} index={i + 1} />
          </FadeUp>
        ))}

        {/* Bottom divider */}
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.1)' }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .work-outer { padding: 0 24px !important; }
        }
      `}</style>
    </section>
  )
}

interface WorkRowProps {
  project: (typeof projects)[number]
  index: number
}

function WorkRow({ project, index }: WorkRowProps) {
  const [hovered, setHovered] = useState(false)
  const indexStr = String(index).padStart(2, '0')

  return (
    <Link
      href={project.links.case_study}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '80px 1fr auto',
          gap: '0 32px',
          alignItems: 'center',
          padding: '44px 0',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          transition: 'background 200ms ease',
          background: hovered ? 'rgba(255,255,255,0.015)' : 'transparent',
          cursor: 'pointer',
        }}
        className="work-row"
      >
        {/* Background thumbnail on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: hovered ? 0.07 : 0,
            transition: 'opacity 400ms ease',
            pointerEvents: 'none',
          }}
        >
          <Image
            src={project.thumbnail}
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            sizes="100vw"
          />
        </div>

        {/* Index number */}
        <div
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: 'clamp(28px, 4vw, 56px)',
            letterSpacing: '-0.02em',
            color: hovered ? 'rgba(163,255,71,0.6)' : 'rgba(255,255,255,0.12)',
            lineHeight: 1,
            transition: 'color 250ms ease',
            userSelect: 'none',
            alignSelf: 'center',
          }}
        >
          {indexStr}
        </div>

        {/* Project info */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* GooeyText cycles: title → role1 → role2 → … */}
            <div
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontWeight: 300,
                fontSize: 'clamp(26px, 3.8vw, 60px)',
                letterSpacing: '-0.035em',
                lineHeight: 1.0,
                color: hovered ? '#FFFFFF' : '#E8E8E8',
                transition: 'color 200ms ease',
              }}
            >
              <GooeyText
                texts={[project.title, ...project.roles]}
                morphTime={1}
                cooldownTime={3}
              />
            </div>
            {project.status === 'concept' && (
              <span
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.3)',
                  border: '0.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '3px',
                  padding: '2px 7px',
                  textTransform: 'uppercase',
                  flexShrink: 0,
                }}
              >
                CONCEPT
              </span>
            )}
          </div>
        </div>

        {/* Right: year + arrow */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}
          className="work-row-right"
        >
          <span
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.22)',
            }}
          >
            {project.year}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '10px',
              color: hovered ? '#A3FF47' : 'transparent',
              letterSpacing: '0.06em',
              transition: 'color 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            VIEW →
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .work-row { grid-template-columns: 48px 1fr !important; gap: 0 16px !important; padding: 32px 0 !important; }
          .work-row-right { display: none !important; }
        }
      `}</style>
    </Link>
  )
}
