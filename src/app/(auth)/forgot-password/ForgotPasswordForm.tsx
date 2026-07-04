'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      setError(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>
        Reset your password
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
        Enter the email on your account and we will send you a reset link.
      </p>

      {status === 'sent' ? (
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          Check your inbox — a password reset link is on its way. It may take a minute to arrive.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-mid)',
              background: 'var(--bg-void)',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
          {error && <p style={{ color: '#ff6b6b', fontSize: '0.8125rem' }}>{error}</p>}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary"
            style={{ padding: '0.8125rem', borderRadius: 'var(--radius-sm)' }}
          >
            {status === 'loading' ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}

      <Link
        href="/login"
        style={{ display: 'block', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}
      >
        ← Back to sign in
      </Link>
    </div>
  )
}