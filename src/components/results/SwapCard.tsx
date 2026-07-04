'use client'

interface SwapCardProps {
  index: number
  issue: string
  fix: string
  isLast: boolean
}

export default function SwapCard({ index, issue, fix, isLast }: SwapCardProps) {
  return (
    <div
      data-index={index}
      style={{
        padding: '1rem 1.125rem',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
      }}
    >
      {/* Issue row */}
      <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            marginTop: 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(248,113,113,0.12)',
            border: '1px solid rgba(248,113,113,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.55rem',
            color: '#f87171',
            fontWeight: 800,
          }}
        >
          ✕
        </span>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#fca5a5',
            lineHeight: 1.55,
            fontWeight: 500,
          }}
        >
          {issue}
        </p>
      </div>

      {/* Fix row */}
      <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            marginTop: 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: '#4ade80',
            fontWeight: 700,
          }}
        >
          →
        </span>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
          }}
        >
          {fix}
        </p>
      </div>
    </div>
  )
}