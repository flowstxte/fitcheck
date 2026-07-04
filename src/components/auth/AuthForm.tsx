'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { login, signup } from '@/app/actions/auth'

type Mode = 'login' | 'signup'

interface AuthFormProps {
  mode: Mode
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isLogin = mode === 'login'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const action = isLogin ? login : signup
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div
      className="animate-fade-up"
      style={{
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      {/* Logo mark */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <img
            src="/logo.png"
            alt="FitCheck"
            style={{
              width: 36,
              height: 36,
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <span
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            FitCheck
          </span>
        </div>

        <h1
          style={{
            fontSize: '1.625rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          {isLogin
            ? 'Sign in to view your outfit history.'
            : 'Get 5 AI outfit ratings per day, free forever.'}
        </p>
      </div>

      {/* Card */}
      <div
        className="card"
        style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
      >
        {/* Subtle glow top-left (removed for b&w) */}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor="auth-email"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Email address
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label
              htmlFor="auth-password"
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
              }}
            >
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              required
              minLength={8}
              placeholder={isLogin ? '••••••••' : 'Min 8 characters'}
              className="input-field"
            />
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                color: '#fca5a5',
                fontSize: '0.875rem',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary"
            style={{
              marginTop: '0.5rem',
              padding: '0.875rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {isPending ? (
              <>
                <SpinnerIcon />
                {isLogin ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </button>

          {isLogin && (
            <Link
              href="/forgot-password"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                marginTop: '0.5rem',
              }}
            >
              Forgot password?
            </Link>
          )}
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.5rem 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        <Link
          href={isLogin ? '/signup' : '/login'}
          id={isLogin ? 'link-to-signup' : 'link-to-login'}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-mid)',
            color: 'var(--text-primary)',
            fontWeight: 500,
            fontSize: '0.9375rem',
            textDecoration: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = '#ffffff'
            ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-mid)'
            ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
          }}
        >
          {isLogin ? 'Create a free account' : 'Sign in instead'}
        </Link>
      </div>

      {/* Footer note */}
      <p
        style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8125rem',
          marginTop: '1.5rem',
          lineHeight: 1.6,
        }}
      >
        By continuing, you agree to FitCheck&apos;s{' '}
        <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
          Privacy Policy
        </Link>.
      </p>
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}