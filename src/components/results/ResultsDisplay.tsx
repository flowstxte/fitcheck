'use client'

import ScoreRing from './ScoreRing'
import RatingCard from './RatingCard'
import SwapCard from './SwapCard'
import ShareModal from './ShareModal'
import type { AnalyzeResponse } from '@/lib/types'
import { useState } from 'react'

interface ResultsDisplayProps {
  result: AnalyzeResponse
  previewUrl: string | null
  onReset: () => void
}

const LABEL_GRADE: Record<string, string> = {
  Excellent: 'Excellent',
  Good: 'Good',
  Fair: 'Fair',
  Poor: 'Poor',
}

export default function ResultsDisplay({ result, previewUrl, onReset }: ResultsDisplayProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const { aiResult, occasionTag } = result
  const score = aiResult.overall_score

  const scoreLabel =
    score >= 9 ? 'Fit Perfection'
    : score >= 7.5 ? 'Strong Fit'
    : score >= 6 ? 'Solid Look'
    : score >= 4 ? 'Needs Work'
    : 'Major Rework'

  return (
    <div
      className="animate-fade-up"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
    >
      {/* ── Hero card ──────────────────────────────────────────────────────── */}
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        {/* Outfit photo */}
        {previewUrl && (
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Your outfit"
              style={{
                width: '100%',
                aspectRatio: '3 / 4',
                height: 'auto',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Gradient fade at bottom of image */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background:
                  'linear-gradient(to bottom, transparent, var(--bg-card))',
                pointerEvents: 'none',
              }}
            />

            {/* Score ring — floating over image bottom-right */}
            <div
              style={{
                position: 'absolute',
                bottom: -12,
                right: 16,
                background: '#000000',
                borderRadius: '50%',
                padding: 6,
                border: '1px solid var(--border-mid)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <ScoreRing score={score} size={112} />
            </div>
          </div>
        )}

        {/* Text section */}
        <div
          style={{
            padding: previewUrl ? '1.25rem 1.25rem 1.25rem' : '1.5rem',
            paddingRight: previewUrl ? 148 : undefined, // make room for the score ring
          }}
        >
          {/* Score label + occasion badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '0.5rem',
            }}
          >
            <span
              className="font-serif"
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {scoreLabel}
            </span>
            {occasionTag && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.2rem 0.625rem',
                  borderRadius: 100,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-mid)',
                  fontSize: '0.75rem',
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                {occasionTag}
              </span>
            )}
          </div>

          {/* Summary */}
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.65,
            }}
          >
            {aiResult.summary}
          </p>
        </div>
      </div>

      {/* ── Rating cards ───────────────────────────────────────────────────── */}
      <div className="rating-grid">
        <RatingCard
          label="Color Harmony"
          rating={aiResult.color_harmony.rating as 'Excellent' | 'Good' | 'Fair' | 'Poor'}
          notes={aiResult.color_harmony.notes}
        />
        <RatingCard
          label="Occasion Match"
          rating={aiResult.occasion_match.rating as 'Excellent' | 'Good' | 'Fair' | 'Poor'}
          notes={aiResult.occasion_match.notes}
        />
      </div>

      {/* ── Swap recommendations ────────────────────────────────────────────── */}
      {aiResult.swap_recommendations.length > 0 ? (
        <div
          style={{
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.75rem 1.125rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '0.875rem' }}>💡</span>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.09em',
              }}
            >
              Swap Recommendations ({aiResult.swap_recommendations.length})
            </span>
          </div>

          {/* Cards */}
          {aiResult.swap_recommendations.map((rec, i) => (
            <SwapCard
              key={i}
              index={i}
              issue={rec.issue}
              fix={rec.suggested_fix}
              isLast={i === aiResult.swap_recommendations.length - 1}
            />
          ))}
        </div>
      ) : (
        /* Perfect outfit — no swaps needed */
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.18)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <span style={{ fontSize: '1.125rem' }}>✓</span>
          <p style={{ fontSize: '0.9rem', color: '#86efac', fontWeight: 500 }}>
            No swaps needed — this outfit is on point!
          </p>
        </div>
      )}

      {/* ── Action buttons ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
        <button
          id="btn-share"
          type="button"
          className="btn-primary"
          onClick={() => setIsShareModalOpen(true)}
          style={{
            width: '100%',
            padding: '0.8125rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9375rem',
          }}
        >
          Share Result
        </button>
        <button
          id="btn-new-check"
          type="button"
          className="btn-secondary"
          onClick={onReset}
          style={{
            width: '100%',
            padding: '0.8125rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9375rem',
            fontFamily: 'inherit',
          }}
        >
          Check another fit →
        </button>
      </div>

      {isShareModalOpen && (
      <ShareModal
        score={result.aiResult.overall_score}
        occasionTag={result.occasionTag}
        colorRating={result.aiResult.color_harmony.rating}
        occasionRating={result.aiResult.occasion_match.rating}
        cloudinaryUrl={result.cloudinaryUrl}
        onClose={() => setIsShareModalOpen(false)}
      />
    )}
    </div>
  )
}