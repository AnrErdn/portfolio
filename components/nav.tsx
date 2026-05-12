'use client'

import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY > 80) {
        setHidden(currentY > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleLinkClick = (href: string) => {
    setMenuOpen(false)
    document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── SVG filter definition for liquid glass distortion ── */}
      <svg
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', zIndex: -1 }}
      >
        <defs>
          <filter id="liquid-glass-filter" x="-10%" y="-50%" width="120%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.022"
              numOctaves="3"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: '22px',
          left: '50%',
          transform: `translateX(-50%) translateY(${hidden ? '-160%' : '0'})`,
          transition: 'transform 320ms cubic-bezier(0.0,0.0,0.2,1.0)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 14px',
          /* ── Liquid glass material ── */
          background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.055) 50%, rgba(255,255,255,0.085) 100%)',
          backdropFilter: 'blur(52px) saturate(200%) brightness(1.08)',
          WebkitBackdropFilter: 'blur(52px) saturate(200%) brightness(1.08)',
          border: '0.5px solid rgba(255,255,255,0.28)',
          borderRadius: '9999px',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.22)',
            'inset 0 -0.5px 0 rgba(0,0,0,0.12)',
            '0 20px 60px rgba(0,0,0,0.55)',
            '0 4px 16px rgba(0,0,0,0.35)',
            '0 1px 4px rgba(0,0,0,0.2)',
          ].join(', '),
          width: 'max-content',
          maxWidth: 'calc(100vw - 48px)',
        }}
      >
        {/* Liquid highlight shimmer strip */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            width: '70%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            borderRadius: '9999px',
            pointerEvents: 'none',
            animation: 'liquid-shimmer 6s ease-in-out infinite',
          }}
        />

        {/* Desktop links */}
        <ul
          className="nav-links"
          style={{ display: 'flex', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace('#', '')
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? '#FFFFFF' : 'rgba(220,220,220,0.72)',
                    textDecoration: 'none',
                    padding: '5px 13px',
                    borderRadius: '9999px',
                    transition: 'color 120ms ease, background 120ms ease',
                    background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(220,220,220,0.72)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        background: '#A3FF47',
                        flexShrink: 0,
                        boxShadow: '0 0 6px rgba(163,255,71,0.8)',
                      }}
                    />
                  )}
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Divider */}
        <span
          className="nav-divider"
          style={{ width: '0.5px', height: '14px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }}
        />

        {/* Resume CTA */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-resume"
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: '#A3FF47',
            border: '0.5px solid rgba(163,255,71,0.35)',
            background: 'rgba(163,255,71,0.07)',
            borderRadius: '8px',
            padding: '5px 12px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            transition: 'background 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(163,255,71,0.14)'
            e.currentTarget.style.borderColor = 'rgba(163,255,71,0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(163,255,71,0.07)'
            e.currentTarget.style.borderColor = 'rgba(163,255,71,0.35)'
          }}
        >
          RÉSUMÉ
        </a>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#C8C8C8' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" />
                <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,5,5,0.97)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
              style={{
                fontFamily: 'var(--font-display, sans-serif)',
                fontSize: '36px',
                fontWeight: 300,
                color: '#F0F0F0',
                textDecoration: 'none',
                letterSpacing: '-0.03em',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-syne-mono, monospace)',
              fontSize: '11px',
              color: '#A3FF47',
              border: '0.5px solid rgba(163,255,71,0.4)',
              borderRadius: '8px',
              padding: '10px 24px',
              textDecoration: 'none',
              marginTop: '8px',
            }}
          >
            RÉSUMÉ
          </a>
        </div>
      )}

      <style>{`
        @keyframes liquid-shimmer {
          0%, 100% { opacity: 0.6; transform: translateX(-10%); }
          50%       { opacity: 1;   transform: translateX(10%); }
        }
        @media (max-width: 768px) {
          .nav-links    { display: none !important; }
          .nav-divider  { display: none !important; }
          .nav-resume   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
