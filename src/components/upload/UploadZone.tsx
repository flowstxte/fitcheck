'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  previewUrl: string | null
  disabled?: boolean
}

export default function UploadZone({ onFileSelect, previewUrl, disabled }: UploadZoneProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  // Clear error after shake completes
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 400)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const handleFile = useCallback(
    (file: File) => {
      setErrorMsg(null)

      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload a valid image file.')
        setShake(true)
        return
      }

      if (file.size > 15 * 1024 * 1024) {
        setErrorMsg('File too large. Maximum size is 15MB.')
        setShake(true)
        return
      }

      onFileSelect(file)
    },
    [onFileSelect]
  )

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const onDragLeave = () => setIsDragOver(false)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div
      id="upload-zone"
      className={shake ? 'animate-shake' : ''}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        minHeight: 400,
        borderRadius: 'var(--radius-lg)',
        border: isDragOver
          ? '2px solid rgba(255,255,255,0.8)'
          : previewUrl
          ? '2px solid var(--border-mid)'
          : '2px dashed var(--border-mid)',
        background: isDragOver
          ? 'rgba(255,255,255,0.05)'
          : previewUrl
          ? 'var(--bg-card)'
          : 'rgba(255,255,255,0.02)',
        cursor: 'default',
        overflow: 'hidden',
        transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
        boxShadow: isDragOver
          ? '0 0 0 4px rgba(255,255,255,0.05), inset 0 0 40px rgba(255,255,255,0.02)'
          : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Gallery / file picker — no capture attribute, opens normal photo picker */}
      <input
        ref={galleryInputRef}
        type="file"
        id="gallery-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onInputChange}
        disabled={disabled}
      />

      {/* Camera — capture attribute forces the device camera to open directly */}
      <input
        ref={cameraInputRef}
        type="file"
        id="camera-input"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={onInputChange}
        disabled={disabled}
      />

      {previewUrl ? (
        /* ── Image Preview ── */
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Outfit preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              inset: 0,
              display: 'block',
            }}
          />
          {/* Dark overlay with swap actions */}
          {!disabled && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8,8,16,0.55)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.625rem',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
              className="upload-zone-overlay"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  galleryInputRef.current?.click()
                }}
                className="btn-secondary"
                style={{ padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
              >
                Choose from Library
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  cameraInputRef.current?.click()
                }}
                className="btn-secondary"
                style={{ padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
              >
                Take Photo
              </button>
            </div>
          )}
          <style>{`
            #upload-zone:hover .upload-zone-overlay { opacity: 1 !important; }
            @media (hover: none) {
              #upload-zone .upload-zone-overlay { opacity: 1; background: rgba(8,8,16,0.7); }
            }
          `}</style>
        </>
      ) : (
        /* ── Empty State ── */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            padding: '2rem',
          }}
        >
          {/* Upload icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: isDragOver
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-mid)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.25s, border-color 0.25s',
              borderColor: isDragOver ? 'rgba(255,255,255,0.5)' : undefined,
              pointerEvents: 'none',
            }}
          >
            <UploadIcon isDragOver={isDragOver} />
          </div>

          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <p
              style={{
                fontWeight: 600,
                color: errorMsg
                  ? '#f87171'
                  : isDragOver
                  ? 'var(--text-accent)'
                  : 'var(--text-primary)',
                fontSize: '1rem',
                marginBottom: '0.25rem',
                transition: 'color 0.25s',
              }}
            >
              {errorMsg ? errorMsg : isDragOver ? 'Drop it!' : 'Upload your outfit'}
            </p>
            {!errorMsg && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Drag & drop, or choose an option below
              </p>
            )}
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                marginTop: '0.5rem',
              }}
            >
              JPG, PNG, WEBP · Max 15MB
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                galleryInputRef.current?.click()
              }}
              className="btn-secondary"
              style={{ padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
            >
              Choose from Library
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                cameraInputRef.current?.click()
              }}
              className="btn-secondary"
              style={{ padding: '0.625rem 1.125rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}
            >
              Take Photo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function UploadIcon({ isDragOver }: { isDragOver: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isDragOver ? '#ffffff' : '#666666'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transition: 'stroke 0.25s' }}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}