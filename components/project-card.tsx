'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BracketCorners from '@/components/hud/bracket-corners'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  variant?: 'featured' | 'standard' | 'side'
}

export default function ProjectCard({ project, variant = 'standard' }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const isFeatured = variant === 'featured'
  const isSide = variant === 'side'

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    background: isFeatured
      ? 'rgba(163,255,71,0.04)'
      : 'rgba(255,255,255,0.05)',
    border: isSide
      ? '0.5px dashed rgba(255,255,255,0.12)'
      : isFeatured
      ? '0.5px solid rgba(163,255,71,0.20)'
      : '0.5px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: hovered
      ? isFeatured
        ? '0 0 24px rgba(163,255,71,0.35)'
        : '0 0 12px rgba(163,255,71,0.12)'
      : isFeatured
      ? '0 0 20px rgba(163,255,71,0.12)'
      : 'none',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'transform 200ms cubic-bezier(0.0,0.0,0.2,1.0), box-shadow 200ms cubic-bezier(0.0,0.0,0.2,1.0)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }

  return (
    <Link
      href={project.links.case_study}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article style={cardStyle}>
        {/* Featured bracket corners */}
        {isFeatured && <BracketCorners size={20} color="rgba(163,255,71,0.55)" />}

        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            overflow: 'hidden',
            background: '#141414',
            flexShrink: 0,
          }}
        >
          <Image
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            fill
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 200ms cubic-bezier(0.0,0.0,0.2,1.0)',
            }}
            sizes={isFeatured ? '(max-width: 768px) 100vw, 63vw' : '(max-width: 768px) 100vw, 35vw'}
            onError={() => {}} // thumbnails missing before launch — silent fail
          />

          {/* Hover CTA overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5,5,5,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 200ms ease',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '12px',
                color: '#A3FF47',
                border: '0.5px solid rgba(163,255,71,0.4)',
                borderRadius: '8px',
                padding: '8px 16px',
                letterSpacing: '0.08em',
              }}
            >
              {isSide ? 'View project →' : 'View case study →'}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Status badge + FEATURED tag row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {isFeatured && (
              <span
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: '#A3FF47',
                  background: 'rgba(163,255,71,0.08)',
                  border: '0.5px solid rgba(163,255,71,0.3)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                }}
              >
                FEATURED
              </span>
            )}
            {project.status === 'concept' && (
              <span
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: '#9A9A9A',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  textTransform: 'uppercase',
                }}
              >
                CONCEPT
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: isFeatured ? 400 : 300,
              fontSize: isFeatured ? '22px' : '18px',
              letterSpacing: '-0.02em',
              color: '#F0F0F0',
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#9A9A9A',
              flex: 1,
            }}
          >
            {project.description}
          </p>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginTop: '4px',
              paddingTop: '12px',
              borderTop: '0.5px solid rgba(255,255,255,0.06)',
            }}
          >
            {project.roles.map((role) => (
              <span
                key={role}
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '10px',
                  color: '#9A9A9A',
                  letterSpacing: '0.06em',
                }}
              >
                {role}
              </span>
            ))}
            <span
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                marginLeft: 'auto',
              }}
            >
              {project.year}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
