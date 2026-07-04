'use client'

import { useTransition } from 'react'
import { logout } from '@/app/actions/auth'

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      id="btn-logout"
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-mid)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-secondary)',
        fontSize: '0.8125rem',
        fontWeight: 500,
        padding: '0.4375rem 0.875rem',
        cursor: 'pointer',
        transition: 'border-color 0.2s, color 0.2s, background 0.2s',
        fontFamily: 'inherit',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.borderColor = 'rgba(239,68,68,0.4)'
        btn.style.color = '#fca5a5'
        btn.style.background = 'rgba(239,68,68,0.06)'
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.borderColor = 'var(--border-mid)'
        btn.style.color = 'var(--text-secondary)'
        btn.style.background = 'transparent'
      }}
    >
      {isPending ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
