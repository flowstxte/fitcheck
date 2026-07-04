'use client'

type Rating = 'Excellent' | 'Good' | 'Fair' | 'Poor'

const RATING_PIPS: Record<Rating, number> = {
  Excellent: 4,
  Good: 3,
  Fair: 2,
  Poor: 1,
}

const RATING_COLORS: Record<Rating, string> = {
  Excellent: '#ffffff',
  Good:      '#cccccc',
  Fair:      '#999999',
  Poor:      '#666666',
}

interface RatingCardProps {
  label: string
  rating: Rating
  notes: string
}

export default function RatingCard({ label, rating, notes }: RatingCardProps) {
  const pips = RATING_PIPS[rating] ?? 2
  const color = RATING_COLORS[rating] ?? 'var(--text-muted)'

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.09em',
        }}
      >
        {label}
      </p>

      {/* Pip bar — 4 segments */}
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= pips ? color : 'rgba(255,255,255,0.07)',
              boxShadow: 'none',
              transition: 'background 0.4s, box-shadow 0.4s',
            }}
          />
        ))}
      </div>

      <p
        className="font-serif"
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color,
          lineHeight: 1,
        }}
      >
        {rating}
      </p>

      {/* Notes */}
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {notes}
      </p>
    </div>
  )
}
