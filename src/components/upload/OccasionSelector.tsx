'use client'

export const OCCASIONS = [
  { id: 'casual',     label: 'Casual' },
  { id: 'streetwear', label: 'Streetwear' },
  { id: 'formal',     label: 'Formal' },
  { id: 'gym',        label: 'Gym / Sport' },
  { id: 'date',       label: 'Date Night' },
  { id: 'business',   label: 'Business' },
  { id: 'work',       label: 'Work' },
  { id: 'university', label: 'University' },
  { id: 'school',     label: 'School' },
  { id: 'beach',      label: 'Beach' },
  { id: 'party',      label: 'Party' },
  { id: 'travel',     label: 'Travel' },
  { id: 'wedding',    label: 'Wedding' },
] as const

export type OccasionId = (typeof OCCASIONS)[number]['id']

interface OccasionSelectorProps {
  value: OccasionId | null
  onChange: (id: OccasionId | null) => void
}

export default function OccasionSelector({ value, onChange }: OccasionSelectorProps) {
  return (
    <div>
      <p
        style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}
      >
        Occasion — optional
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {OCCASIONS.map(occ => {
          const active = value === occ.id
          return (
            <button
              key={occ.id}
              id={`occasion-${occ.id}`}
              type="button"
              onClick={() => onChange(active ? null : occ.id)}
              style={{
                padding: '0.4375rem 0.9375rem',
                borderRadius: 100,
                fontSize: '0.8125rem',
                fontWeight: active ? 600 : 400,
                fontFamily: 'var(--font-archivo)',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                border: active ? '1px solid #ffffff' : '1px solid var(--border-mid)',
                background: active ? '#ffffff' : 'rgba(255,255,255,0.03)',
                color: active ? '#000000' : 'var(--text-secondary)',
              }}
            >
              {occ.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
