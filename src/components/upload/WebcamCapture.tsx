'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface WebcamCaptureProps {
  onCapture: (file: File) => void
  onClose: () => void
}

export default function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => {
        setError('Could not access your webcam. Check your browser permissions and try again.')
      })

    return () => {
      document.body.style.overflow = ''
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function handleCapture() {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' })
          onCapture(file)
        }
      },
      'image/jpeg',
      0.92
    )
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        height: '100dvh',
        zIndex: 200,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          aspectRatio: '3 / 4',
          background: '#000',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border-mid)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {error ? (
          <p style={{ color: '#f87171', textAlign: 'center', padding: '2rem', fontSize: '0.875rem' }}>
            {error}
          </p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.625rem' }}>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-sm)' }}>
          Cancel
        </button>
        {!error && (
          <button onClick={handleCapture} className="btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-sm)' }}>
            Capture
          </button>
        )}
      </div>
    </div>,
    document.body
  )
}
