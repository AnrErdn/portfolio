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
    borderRadius: '4px',
    overflow: 'hidden',
    background: isFeatured ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)',
    border: isSide
      ? '0.5px dashed rgba(255,255,255,0.09)'
      : hovered
      ? '0.5px solid rgba(255,255,255,0.14)'
      : '0.5px solid rgba(255,255,255,0.07)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
    transition:
      'transform 280ms cubic-bezier(0.16,1,0.3,1), border-color 200ms ease, background 200ms ease',
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
        {/* Bracket corners on featured — dimmer, no glow */}
        {isFeatured && <BracketCorners size={18} color="rgba(163,255,71,0.35)" />}

        {/* Thumbnail */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            overflow: 'hidden',
            background: '#0D0D0D',
            flexShrink: 0,
          }}
        >
          <Image
            src={project.thumbnail}
            alt={`${project.title} thumbnail`}
            fill
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 500ms cubic-bezier(0.16,1,0.3,1)',
              filter: hovered ? 'brightness(0.88)' : 'brightness(0.82)',
            }}
            sizes={
              isFeatured
                ? '(max-width: 768px) 100vw, 63vw'
                : '(max-width: 768px) 100vw, 35vw'
            }
            onError={() => {}}
          />

          {/* Hover overlay — restrained, no glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(5,5,5,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 250ms ease',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-syne-mono, monospace)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: '#A3FF47',
                border: '0.5px solid rgba(163,255,71,0.35)',
                borderRadius: '4px',
                padding: '8px 18px',
                textTransform: 'uppercase',
              }}
            >
              {isSide ? 'View project →' : 'View case study →'}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div
          style={{
            padding: '22px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {/* Badge row */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {isFeatured && (
              <span
                style={{
                  fontFamily: 'var(--font-syne-mono, monospace)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  color: 'rgba(163,255,71,0.75)',
                  background: 'rgba(163,255,71,0.06)',
                  border: '0.5px solid rgba(163,255,71,0.2)',
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
                  background: 'rgba(255,255,255,0.05)',
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
              fontSize: isFeatured ? '21px' : '17px',
              letterSpacing: '-0.02em',
              color: hovered ? '#F0F0F0' : 'rgba(240,240,240,0.88)',
              lineHeight: 1.2,
              transition: 'color 200ms ease',
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-inter, sans-serif)',
              fontSize: '13px',
              lineHeight: 1.62,
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
                color: 'rgba(255,255,255,0.18)',
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
