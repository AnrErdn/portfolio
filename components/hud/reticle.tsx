export default function Reticle() {
  return (
    <div
      aria-hidden="true"
      className="relative flex items-center justify-center w-full h-full"
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="100"
          cy="100"
          r="60"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* Mid circle */}
        <circle
          cx="100"
          cy="100"
          r="38"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />

        {/* Crosshair — horizontal */}
        <line
          x1="24"
          y1="100"
          x2="76"
          y2="100"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
        <line
          x1="124"
          y1="100"
          x2="176"
          y2="100"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />

        {/* Crosshair — vertical */}
        <line
          x1="100"
          y1="24"
          x2="100"
          y2="76"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
        <line
          x1="100"
          y1="124"
          x2="100"
          y2="176"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />

        {/* Inner tick marks on outer circle */}
        <line x1="100" y1="38" x2="100" y2="46" stroke="rgba(163,255,71,0.2)" strokeWidth="0.5" />
        <line x1="100" y1="154" x2="100" y2="162" stroke="rgba(163,255,71,0.2)" strokeWidth="0.5" />
        <line x1="38" y1="100" x2="46" y2="100" stroke="rgba(163,255,71,0.2)" strokeWidth="0.5" />
        <line x1="154" y1="100" x2="162" y2="100" stroke="rgba(163,255,71,0.2)" strokeWidth="0.5" />

        {/* Center dot */}
        <circle
          cx="100"
          cy="100"
          r="3"
          fill="rgba(163,255,71,0.5)"
        />

        {/* H-LOCK label */}
        <text
          x="112"
          y="96"
          fontFamily="var(--font-syne-mono, monospace)"
          fontSize="8"
          fill="rgba(255,255,255,0.2)"
          letterSpacing="0.08em"
        >
          H-LOCK
        </text>
      </svg>
    </div>
  )
}
