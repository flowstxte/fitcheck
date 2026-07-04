'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ShareModalProps {
  score: number
  occasionTag: string | null
  colorRating?: string
  occasionRating?: string
  cloudinaryUrl: string
  onClose: () => void
}

export default function ShareModal({
  score,
  occasionTag,
  colorRating,
  occasionRating,
  cloudinaryUrl,
  onClose,
}: ShareModalProps) {
  const [format, setFormat] = useState<'story' | 'post'>('story')
  const [copied, setCopied] = useState(false)

  // Lock body scroll while the modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const occasionLabel = occasionTag ?? 'Outfit'

  const params = new URLSearchParams({
    format,
    url: cloudinaryUrl,
    score: score.toFixed(1),
    occasion: occasionLabel,
  })
  if (colorRating) params.set('color', colorRating)
  if (occasionRating) params.set('occasionRating', occasionRating)

  const imageUrl = `/api/share-card?${params.toString()}`

  const caption = `My fit scored ${score.toFixed(1)}/10 on FitCheck — rate yours free.\n${siteUrl}`

  async function handleCopyCaption() {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked — no-op, user can still select text manually
    }
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        height: '100dvh',
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade-up card-elevated"
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="font-serif" style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>
            Share Your Fit
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Format Toggle */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--bg-void)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <button
            className={format === 'story' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFormat('story')}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: format === 'story' ? undefined : 'none' }}
          >
            Story (9:16)
          </button>
          <button
            className={format === 'post' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFormat('post')}
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: format === 'post' ? undefined : 'none' }}
          >
            Post (4:5)
          </button>
        </div>

        {/* Preview */}
        <div
          style={{
            width: '100%',
            aspectRatio: format === 'story' ? '9/16' : '4/5',
            background: 'var(--bg-void)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid var(--border-mid)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Share preview"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>

        {/* Caption */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Caption
          </span>
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-mid)',
              background: 'var(--bg-void)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
            }}
          >
            {caption}
          </div>
          <button
            onClick={handleCopyCaption}
            className="btn-secondary"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
          >
            {copied ? 'Copied' : 'Copy caption'}
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a
            href={imageUrl}
            download={`fitcheck-${format}.png`}
            className="btn-primary"
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.8125rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Download
          </a>
        </div>
      </div>
    </div>,
    document.body
  )
}