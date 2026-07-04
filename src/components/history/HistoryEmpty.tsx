import Link from 'next/link'

export default function HistoryEmpty() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        gap: '1.5rem',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-mid)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
        }}
        aria-hidden
      >
        ✦
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2
          className="font-serif"
          style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          No checks yet
        </h2>
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: 340,
          }}
        >
          Upload your first outfit and get an instant AI rating — your history will appear here.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/check"
        id="btn-history-empty-cta"
        className="btn-primary"
        style={{
          padding: '0.8125rem 1.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '1rem',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span>✦</span> Check my fit
      </Link>
    </div>
  )
}
