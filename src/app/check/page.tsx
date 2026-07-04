import { createClient } from '@/lib/supabase/server'
import CheckClient from './CheckClient'

export const metadata = {
  title: 'Check',
  description: 'Upload your outfit photo and get an instant AI fashion rating.',
}

export default async function CheckPage() {
  // Read auth state server-side (for display only — limits enforced in /api/analyze)
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 1.25rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div
        className="animate-fade-up"
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
          position: 'relative',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '0.375rem',
          }}
        >
          Check your fit
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          {user
            ? `5 checks/day · ${user.email}`
            : '2 free checks as guest · no sign-up required'}
        </p>
      </div>

      {/* Upload widget */}
      <div
        className="animate-fade-up"
        style={{ width: '100%', maxWidth: 560, position: 'relative' }}
      >
        <CheckClient />
      </div>

      {/* Guest nudge */}
      {!user && (
        <p
          className="animate-fade-up"
          style={{
            marginTop: '1.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            textAlign: 'center',
          }}
        >
          Want full history & 5 checks/day?{' '}
          <a
            href="/signup"
            style={{ color: 'var(--text-accent)', fontWeight: 500, textDecoration: 'none' }}
          >
            Create a free account →
          </a>
        </p>
      )}
    </main>
  )
}
