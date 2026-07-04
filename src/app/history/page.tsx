import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import HistoryCard from '@/components/history/HistoryCard'
import HistoryEmpty from '@/components/history/HistoryEmpty'
import type { CheckRow } from '@/lib/types'

export const metadata = {
  title: 'History',
  description: 'All your past outfit ratings in one place.',
}

/* ─── Date formatter ─────────────────────────────────────────────────────── */
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHrs = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHrs / 24)

  if (diffMin < 2)  return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function HistoryPage() {
  // Auth guard
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch history (most recent first, capped at 50) using adminClient to bypass missing table grants
  const adminClient = createAdminClient()
  const { data: rawChecks, error } = await adminClient
    .from('checks')
    .select('id, cloudinary_url, ai_result, occasion_tag, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[history] Supabase fetch error:', error)
  }

  const checks = (rawChecks ?? []) as CheckRow[]

  /* ── Stat counters ────────────────────────────────────────────────────── */
  const avgScore =
    checks.length > 0
      ? checks.reduce((acc, c) => acc + c.ai_result.overall_score, 0) / checks.length
      : null

  const bestScore =
    checks.length > 0
      ? Math.max(...checks.map((c) => c.ai_result.overall_score))
      : null

  // Today's checks (for "X left today" counter)
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayCount = checks.filter(
    (c) => new Date(c.created_at) >= todayStart
  ).length
  const remaining = Math.max(0, 5 - todayCount)

  return (
    <main
      style={{
        flex: 1,
        maxWidth: 900,
        width: '100%',
        margin: '0 auto',
        padding: '2.5rem 1.25rem 4rem',
      }}
    >
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div
        className="animate-fade-up"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.375rem',
            }}
          >
            Your fit history
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            {checks.length === 0
              ? 'No checks yet'
              : `${checks.length} outfit${checks.length !== 1 ? 's' : ''} rated · ${remaining} check${remaining !== 1 ? 's' : ''} left today`}
          </p>
        </div>

        <Link
          href="/check"
          id="btn-history-new-check"
          className="btn-primary"
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9375rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            flexShrink: 0,
          }}
        >
          <span>✦</span> New check
        </Link>
      </div>

      {/* ── Stat pills (shown only when user has checks) ──────────────────── */}
      {checks.length > 0 && avgScore !== null && bestScore !== null && (
        <div
          className="animate-fade-up"
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1.75rem',
          }}
        >
          {[
            { label: 'Total checks', value: String(checks.length) },
            { label: 'Avg score', value: avgScore.toFixed(1) },
            { label: 'Best score', value: bestScore.toFixed(1) },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.125rem',
                minWidth: 100,
              }}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {checks.length === 0 ? (
        <HistoryEmpty />
      ) : (
        <div
          className="animate-fade-up"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {checks.map((check) => (
            <HistoryCard
              key={check.id}
              check={check}
              formattedDate={formatDate(check.created_at)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
