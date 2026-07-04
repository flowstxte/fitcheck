'use client'

export type ProgressStage = 'compressing' | 'uploading' | 'analyzing' | 'done'

interface UploadProgressProps {
  stage: ProgressStage
  percent: number // 0–100
}

const STAGE_LABELS: Record<ProgressStage, string> = {
  compressing: 'Compressing image…',
  uploading:   'Uploading to cloud…',
  analyzing:   'Analyzing your fit…',
  done:        'Analysis complete ✓',
}

const STAGE_ICONS: Record<ProgressStage, string> = {
  compressing: '🗜',
  uploading:   '☁',
  analyzing:   '✦',
  done:        '✓',
}

export default function UploadProgress({ stage, percent }: UploadProgressProps) {
  const isDone = stage === 'done'

  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: isDone ? 'var(--bg-elevated)' : 'var(--bg-card)',
        border: `1px solid ${isDone ? 'var(--border-mid)' : 'var(--border-subtle)'}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: isDone ? 'var(--text-primary)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            transition: 'color 0.3s',
          }}
        >
          <span style={{ fontSize: '0.85em' }}>{STAGE_ICONS[stage]}</span>
          {STAGE_LABELS[stage]}
        </span>
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: isDone ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          {percent}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: 3,
          borderRadius: 2,
          background: 'var(--bg-elevated)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: '#ffffff',
            borderRadius: 2,
            transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  )
}