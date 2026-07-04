'use client'

function Bone({
  w = '100%',
  h = 14,
  r = 'var(--radius-sm)',
  style = {},
}: {
  w?: string | number
  h?: number
  r?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className="skeleton-shimmer"
      style={{ width: w, height: h, borderRadius: r, ...style }}
    />
  )
}

/**
 * Skeleton shown during the "analyzing" stage.
 * Mirrors the ResultsDisplay layout so the transition feels seamless.
 */
export default function ResultsSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Analyzing your outfit…"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
    >
      {/* Hero card skeleton */}
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Image placeholder */}
        <Bone h={220} r="0" />

        {/* Score ring placeholder — positioned to mirror the actual overlay */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.125rem 1.25rem 1.25rem',
          }}
        >
          <Bone w={80} h={80} r="50%" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Bone w={64} h={20} r="100px" />
            <Bone h={13} />
            <Bone w="75%" h={13} />
          </div>
        </div>
      </div>

      {/* Rating cards skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <Bone w={90} h={9} />
            <Bone h={4} r="2px" />
            <Bone w={70} h={18} />
            <Bone h={11} />
            <Bone w="85%" h={11} />
          </div>
        ))}
      </div>

      {/* Swap card skeleton */}
      <div
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '0.75rem 1.125rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Bone w={150} h={11} />
        </div>
        <div
          style={{
            padding: '1rem 1.125rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <Bone h={13} />
          <Bone w="88%" h={13} />
          <div style={{ height: '0.375rem' }} />
          <Bone h={13} />
          <Bone w="70%" h={13} />
        </div>
      </div>
    </div>
  )
}