'use client'

import { useState } from 'react'
import ShareModal from '@/components/results/ShareModal'
import SwapCard from '@/components/results/SwapCard'
import type { CheckRow } from '@/lib/types'

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const RATING_PIPS = { Excellent: 4, Good: 3, Fair: 2, Poor: 1 } as const
const RATING_COLORS: Record<string, string> = {
  Excellent: '#ffffff',
  Good:      '#cccccc',
  Fair:      '#999999',
  Poor:      '#666666',
}

function MiniPips({ rating }: { rating: string }) {
  const pips = RATING_PIPS[rating as keyof typeof RATING_PIPS] ?? 2
  const color = RATING_COLORS[rating] ?? 'var(--text-muted)'
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 3,
            borderRadius: 2,
            background: i <= pips ? color : 'rgba(255,255,255,0.08)',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */
interface HistoryCardProps {
  check: CheckRow
  formattedDate: string
}

export default function HistoryCard({ check, formattedDate }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const { ai_result: ai, cloudinary_url, occasion_tag } = check
  const score = ai.overall_score
  const hasSwaps = ai.swap_recommendations.length > 0

  return (
    <article
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-mid)'
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-subtle)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* ── Image + score badge ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cloudinary_url}
          alt={`Outfit from ${formattedDate}`}
          loading="lazy"
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            height: 'auto',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Gradient fade */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to bottom, transparent, var(--bg-card))',
            pointerEvents: 'none',
          }}
        />

        {/* Score badge */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(8,8,16,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.3rem 0.625rem',
            border: '1px solid var(--border-mid)',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.2rem',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            {score.toFixed(1)}
          </span>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            /10
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          aria-label="Share this fit"
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(8,8,16,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid var(--border-mid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 15V3" />
            <path d="M7 8l5-5 5 5" />
            <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
          </svg>
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '0.875rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flex: 1,
        }}
      >
        {/* Date + occasion */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <span
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}
          >
            {formattedDate}
          </span>
          {occasion_tag && (
            <span
              style={{
                fontSize: '0.6875rem',
                padding: '0.175rem 0.5rem',
                borderRadius: 100,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-mid)',
                color: 'var(--text-primary)',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              {occasion_tag}
            </span>
          )}
        </div>

        {/* Summary */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {ai.summary}
        </p>

        {/* Mini rating row */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '0.125rem',
          }}
        >
          {[
            { key: 'color', label: 'Color', rating: ai.color_harmony.rating },
            { key: 'occasion', label: 'Occasion', rating: ai.occasion_match.rating },
          ].map(({ key, label, rating }) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {label}
              </span>
              <MiniPips rating={rating} />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: RATING_COLORS[rating] ?? 'var(--text-muted)',
                }}
              >
                {rating}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Expand toggle ───────────────────────────────────────────────── */}
      {hasSwaps && (
        <>
          <button
            type="button"
            id={`btn-expand-${check.id}`}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget
              b.style.background = 'var(--bg-elevated)'
              b.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget
              b.style.background = 'transparent'
              b.style.color = 'var(--text-muted)'
            }}
          >
            {expanded ? '▲' : '▼'}{' '}
            {expanded ? 'Hide' : `Show`} {ai.swap_recommendations.length} swap
            {ai.swap_recommendations.length !== 1 ? 's' : ''}
          </button>

          {/* Expanded swap recommendations */}
          {expanded && (
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                background: 'rgba(0,0,0,0.15)',
              }}
            >
              {ai.swap_recommendations.map((rec, i) => (
                <SwapCard
                  key={i}
                  index={i}
                  issue={rec.issue}
                  fix={rec.suggested_fix}
                  isLast={i === ai.swap_recommendations.length - 1}
                />
              ))}
            </div>
          )}
        </>
      )}

      {isShareOpen && (
        <ShareModal
          score={score}
          occasionTag={occasion_tag}
          colorRating={ai.color_harmony.rating}
          occasionRating={ai.occasion_match.rating}
          cloudinaryUrl={cloudinary_url}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </article>
  )
}
