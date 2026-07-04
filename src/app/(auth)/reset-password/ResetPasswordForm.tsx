'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [sessionReady, setSessionReady] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setSessionReady(!!data.user)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setStatus('error')
    } else {
      setStatus('done')
      setTimeout(() => router.push('/login'), 1800)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '0 1.5rem' }}>
      <h1 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>
        Set a new password
      </h1>

      {status === 'done' ? (
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
          Password updated — redirecting you to sign in…
        </p>
      ) : sessionReady === false ? (
        <p style={{ color: '#ff6b6b', fontSize: '0.875rem' }}>
          This reset link is invalid or expired. Please request a new one.
        </p>
      ) : sessionReady === true ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
          <input
            type="password"
            required
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-mid)',
              background: 'var(--bg-void)',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
            {status === 'loading' ? 'Updating…' : 'Update password'}
          </button>
        </form>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Verifying link…
        </p>
      )}
    </div>
  )
}
