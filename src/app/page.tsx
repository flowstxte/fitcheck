import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
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
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs (Removed for strict b&w) */}

      <div
        className="animate-fade-up"
        style={{ position: 'relative', maxWidth: 640 }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 1rem',
            borderRadius: 100,
            border: '1px solid var(--border-mid)',
            background: 'var(--bg-elevated)',
            marginBottom: '2rem',
            fontSize: '0.8125rem',
            color: 'var(--text-primary)',
            fontWeight: 500,
          }}
        >
          <span>✦</span>
          AI-powered fashion intelligence
        </div>

        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
          }}
        >
          Rate your fit. <br />
          <span style={{ fontStyle: 'italic', color: '#aaaaaa' }}>Elevate your style.</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: 520,
            margin: '0 auto 2.5rem',
          }}
        >
          Upload a photo of your outfit and get an instant AI analysis — color
          harmony scores, occasion matching, and specific swap recommendations
          to level up your look.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.875rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {user ? (
            <Link
              href="/check"
              id="hero-cta-check"
              className="btn-primary"
              style={{
                padding: '0.875rem 2rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              Check your fit →
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                id="hero-cta-signup"
                className="btn-primary"
                style={{
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Get started free →
              </Link>
              <Link
                href="/check"
                id="hero-cta-guest"
                className="btn-secondary"
                style={{
                  padding: '0.875rem 2rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Try as guest
              </Link>
            </>
          )}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginTop: '3.5rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '0–10', label: 'Style score' },
            { value: 'Color', label: 'Harmony check' },
            { value: 'Swap', label: 'Recommendations' },
          ].map(stat => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}