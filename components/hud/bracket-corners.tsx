interface BracketCornersProps {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}

export default function BracketCorners({
  size = 20,
  color = 'rgba(163,255,71,0.55)',
  strokeWidth = 1.5,
  className = '',
}: BracketCornersProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {/* Top-left */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 left-0"
        fill="none"
      >
        <path
          d={`M0 ${size} L0 0 L${size} 0`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>

      {/* Top-right */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 right-0"
        fill="none"
      >
        <path
          d={`M0 0 L${size} 0 L${size} ${size}`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>

      {/* Bottom-left */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute bottom-0 left-0"
        fill="none"
      >
        <path
          d={`M0 0 L0 ${size} L${size} ${size}`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>

      {/* Bottom-right */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute bottom-0 right-0"
        fill="none"
      >
        <path
          d={`M${size} 0 L${size} ${size} L0 ${size}`}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
        />
      </svg>
    </div>
  )
}
