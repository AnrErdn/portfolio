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

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleLinkClick = (href: string) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: `translateX(-50%) translateY(${hidden ? '-150%' : '0'})`,
          transition: 'transform 300ms cubic-bezier(0.0,0.0,0.2,1.0)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '9999px',
          width: 'max-content',
          maxWidth: 'calc(100vw - 48px)',
        }}
      >
        {/* Desktop links */}
        <ul
          className="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
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
                    fontSize: '14px',
                    color: isActive ? '#F0F0F0' : '#9A9A9A',
                    textDecoration: 'none',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    transition: 'color 100ms ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isActive && (
                    <span
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#A3FF47',
                        display: 'inline-block',
                        flexShrink: 0,
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
          style={{
            width: '0.5px',
            height: '16px',
            background: 'rgba(255,255,255,0.1)',
            display: 'inline-block',
          }}
          className="nav-divider"
        />

        {/* Resume CTA */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-resume"
          style={{
            fontFamily: 'var(--font-syne-mono, monospace)',
            fontSize: '11px',
            color: '#A3FF47',
            border: '0.5px solid rgba(163,255,71,0.4)',
            background: 'rgba(163,255,71,0.08)',
            borderRadius: '8px',
            padding: '5px 12px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Resume
        </a>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#C8C8C8',
          }}
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

      {/* Mobile full-screen overlay */}
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
            gap: '32px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                handleLinkClick(link.href)
              }}
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
              fontSize: '12px',
              color: '#A3FF47',
              border: '0.5px solid rgba(163,255,71,0.4)',
              borderRadius: '8px',
              padding: '10px 24px',
              textDecoration: 'none',
              marginTop: '8px',
            }}
          >
            Resume
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-divider { display: none !important; }
          .nav-resume { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
