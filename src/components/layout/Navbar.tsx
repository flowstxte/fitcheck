import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          id="nav-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/logo.png"
            alt="FitCheck"
            style={{
              height: 28,
              width: 'auto',
              display: 'block',
            }}
          />
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {/* History link */}
              <Link
                href="/history"
                id="nav-history"
                className="nav-link"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.2s, background 0.2s',
                }}
              >
                History
              </Link>

              {/* User avatar */}
              <span
                title={user.email}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#333333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {user.email?.[0]?.toUpperCase() ?? '?'}
              </span>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login"
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color 0.2s',
                }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                id="nav-signup"
                className="btn-primary"
                style={{
                  fontSize: '0.875rem',
                  padding: '0.5rem 1.125rem',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
