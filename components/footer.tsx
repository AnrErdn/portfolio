export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        padding: '24px 40px',
        background: '#050505',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'center',
          fontFamily: 'var(--font-syne-mono, monospace)',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
        className="footer-grid"
      >
        <span>Anar-Erdene © 2026</span>
        <span style={{ textAlign: 'center' }}>SYSTEM // OFFLINE</span>
        <span style={{ textAlign: 'right' }}>Built with Next.js</span>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            text-align: center !important;
          }
          .footer-grid span { text-align: center !important; }
        }
      `}</style>
    </footer>
  )
}
