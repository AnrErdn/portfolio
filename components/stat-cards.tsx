'use client'

import { useState } from 'react'

const CARDS = [
  { value: '4+',     label: 'Projects Shipped',  sub: 'Idea → Production',   delay: '0s'   },
  { value: 'UX×DEV', label: 'Full-Stack Design',  sub: 'Design to code',      delay: '0.9s' },
  { value: '2024',   label: 'Active Since',       sub: 'Building since day 1', delay: '1.8s' },
  { value: 'UB',     label: 'Ulaanbaatar',        sub: 'Remote-friendly',     delay: '2.7s' },
]

interface Tilt { rx: number; ry: number; gx: number; gy: number }

function StatCard({
  index, value, label, sub, floatDelay,
}: {
  index: number; value: string; label: string; sub: string; floatDelay: string
}) {
  const [tilt, setTilt]       = useState<Tilt>({ rx: 0, ry: 0, gx: 50, gy: 50 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top)  / r.height
    setTilt({ rx: (y - 0.5) * -18, ry: (x - 0.5) * 18, gx: x * 100, gy: y * 100 })
  }

  const onLeave = () => {
    setHovered(false)
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })
  }

  return (
    /* Float wrapper — translateY only, never conflicts with tilt */
    <div
      className={`sc-float sc-float-${index}`}
      style={{ animationDelay: floatDelay, flex: '1 1 200px', minWidth: 0 }}
    >
      {/* Tilt + interactive card */}
      <div
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{
          position: 'relative',
          padding: '28px 22px 22px',
          background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.025)',
          border: hovered
            ? '0.5px solid rgba(163,255,71,0.32)'
            : '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          overflow: 'hidden',
          cursor: 'none',
          transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.025 : 1})`,
          transition: hovered
            ? 'transform 80ms ease, background 200ms ease, border-color 200ms ease'
            : 'transform 500ms cubic-bezier(0.22,1,0.36,1), background 200ms ease, border-color 200ms ease',
          willChange: 'transform',
        }}
      >
        {/* Mouse-tracked inner glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(163,255,71,${hovered ? 0.10 : 0.03}) 0%, transparent 65%)`,
          transition: 'background 150ms ease',
        }} />

        {/* Scan line — sweeps top → bottom on repeat */}
        <div
          className="sc-scan"
          style={{ animationDuration: `${3.2 + index * 0.5}s`, animationDelay: floatDelay }}
        />

        {/* Top-right bracket */}
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 8, height: 8,
          borderTop:   '1px solid rgba(163,255,71,0.4)',
          borderRight: '1px solid rgba(163,255,71,0.4)',
          opacity: hovered ? 1 : 0.3,
          transition: 'opacity 200ms ease',
        }} />

        {/* Index */}
        <div style={{
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '8px',
          color: 'rgba(255,255,255,0.14)',
          letterSpacing: '0.12em',
          marginBottom: '20px',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Value */}
        <div style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontWeight: 300,
          fontSize: 'clamp(24px, 2.6vw, 40px)',
          letterSpacing: '-0.04em',
          color: hovered ? '#FFFFFF' : '#EFEFEF',
          lineHeight: 1,
          marginBottom: '8px',
          transition: 'color 200ms ease',
        }}>
          {value}
        </div>

        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          color: hovered ? 'rgba(163,255,71,0.8)' : 'rgba(255,255,255,0.38)',
          textTransform: 'uppercase',
          transition: 'color 200ms ease',
          marginBottom: '3px',
        }}>
          {label}
        </div>

        {/* Sub */}
        <div style={{
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '9px',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase',
        }}>
          {sub}
        </div>
      </div>
    </div>
  )
}

export default function StatCards() {
  return (
    <section style={{ background: '#070707', padding: '56px 56px' }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
      }}>
        {CARDS.map((c, i) => (
          <StatCard
            key={c.value}
            index={i}
            value={c.value}
            label={c.label}
            sub={c.sub}
            floatDelay={c.delay}
          />
        ))}
      </div>

      <style>{`
        @keyframes sc-float-0 { 0%,100%{transform:translateY(0)}    55%{transform:translateY(-7px)}  }
        @keyframes sc-float-1 { 0%,100%{transform:translateY(0)}    45%{transform:translateY(-10px)} }
        @keyframes sc-float-2 { 0%,100%{transform:translateY(0)}    60%{transform:translateY(-6px)}  }
        @keyframes sc-float-3 { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-9px)}  }
        .sc-float-0 { animation: sc-float-0 3.8s ease-in-out infinite; }
        .sc-float-1 { animation: sc-float-1 4.4s ease-in-out infinite; }
        .sc-float-2 { animation: sc-float-2 3.6s ease-in-out infinite; }
        .sc-float-3 { animation: sc-float-3 4.8s ease-in-out infinite; }

        @keyframes sc-scan {
          0%   { top: -1px; opacity: 0;   }
          6%   { opacity: 0.9; }
          94%  { opacity: 0.9; }
          100% { top: 100%;   opacity: 0; }
        }
        .sc-scan {
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(163,255,71,0.5), transparent);
          animation: sc-scan linear infinite;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .sc-float { flex: 1 1 calc(50% - 7px) !important; }
        }
      `}</style>
    </section>
  )
}
