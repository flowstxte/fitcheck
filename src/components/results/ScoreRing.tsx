'use client'

import { useState, useEffect } from 'react'

interface ScoreRingProps {
  score: number
  size?: number
}

export default function ScoreRing({ score, size = 120 }: ScoreRingProps) {
  const strokeWidth = 9
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - Math.min(10, Math.max(0, score)) / 10)

  // Animate from full (empty) to target on mount
  const [offset, setOffset] = useState(circumference)
  useEffect(() => {
    const t = setTimeout(() => setOffset(targetOffset), 100)
    return () => clearTimeout(t)
  }, [targetOffset])

  const cx = size / 2
  const cy = size / 2

  return (
    <div
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      role="img"
      aria-label={`Style score: ${score.toFixed(1)} out of 10`}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />

        {/* Animated score arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#ffffff"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))',
          }}
        />
      </svg>

      {/* Centre text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          pointerEvents: 'none',
        }}
      >
        <span
          className="font-serif"
          style={{
            fontSize: size * 0.28,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1,
            transition: 'color 0.4s',
          }}
        >
          {score.toFixed(1)}
        </span>
        <span
          style={{
            fontSize: size * 0.105,
            color: 'var(--text-muted)',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          / 10
        </span>
      </div>
    </div>
  )
}
