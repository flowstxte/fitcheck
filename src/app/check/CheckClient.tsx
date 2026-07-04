'use client'

import { useState, useCallback } from 'react'
import imageCompression from 'browser-image-compression'
import UploadZone from '@/components/upload/UploadZone'
import OccasionSelector, { type OccasionId } from '@/components/upload/OccasionSelector'
import UploadProgress, { type ProgressStage } from '@/components/upload/UploadProgress'
import ResultsDisplay from '@/components/results/ResultsDisplay'
import ResultsSkeleton from '@/components/results/ResultsSkeleton'
import type { AnalyzeResponse } from '@/lib/types'

/* ─── State machine ──────────────────────────────────────────────────────── */
type FlowStage =
  | 'idle'         // no file selected
  | 'preview'      // file selected, waiting for user to click analyze
  | 'compressing'  // browser-image-compression running
  | 'uploading'    // uploading compressed image to Cloudinary
  | 'analyzing'    // calling /api/analyze (Gemini)
  | 'done'         // analysis complete, results visible
  | 'error'        // pipeline failed

interface FlowState {
  stage: FlowStage
  percent: number
  result: AnalyzeResponse | null
  error: string | null
  errorCode: string | null
}

const BUSY_STAGES: FlowStage[] = ['compressing', 'uploading', 'analyzing']

/* ─── Cloudinary upload helper ───────────────────────────────────────────── */
async function uploadToCloudinary(
  file: File,
  onProgress: (stage: 'compressing' | 'uploading', pct: number) => void
): Promise<string> {
  // 1 · Compress
  onProgress('compressing', 8)
  const compressed = await imageCompression(file, {
    maxSizeMB: 3,
    maxWidthOrHeight: 2400,
    useWebWorker: true,
    initialQuality: 0.9,
    onProgress: (p) => onProgress('compressing', Math.min(46, Math.round(p * 0.46))),
  })

  // 2 · Get signed upload params (secret stays server-side)
  onProgress('uploading', 50)
  const signRes = await fetch('/api/cloudinary-sign')
  if (!signRes.ok) throw new Error('Failed to get upload signature')
  const sign = await signRes.json()

  // 3 · Upload directly to Cloudinary
  onProgress('uploading', 60)
  const form = new FormData()
  form.append('file', compressed)
  form.append('api_key', sign.apiKey)
  form.append('timestamp', String(sign.timestamp))
  form.append('signature', sign.signature)
  form.append('folder', sign.folder)

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
    { method: 'POST', body: form }
  )
  onProgress('uploading', 80)

  if (!upRes.ok) {
    const err = await upRes.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? 'Cloudinary upload failed')
  }

  const data = await upRes.json()
  onProgress('uploading', 84)
  return data.secure_url as string
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function CheckClient() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [occasion, setOccasion] = useState<OccasionId | null>(null)
  const [flow, setFlow] = useState<FlowState>({
    stage: 'idle',
    percent: 0,
    result: null,
    error: null,
    errorCode: null,
  })

  const isBusy = BUSY_STAGES.includes(flow.stage)

  /* ── File selection ──────────────────────────────────────────────────── */
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setFlow({ stage: 'preview', percent: 0, result: null, error: null, errorCode: null })
  }, [])

  /* ── Full pipeline: compress → upload → analyze ──────────────────────── */
  const handleAnalyze = async () => {
    if (!selectedFile) return
    setFlow({ stage: 'compressing', percent: 5, result: null, error: null, errorCode: null })

    try {
      // Compress + upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(selectedFile, (stage, pct) => {
        setFlow((prev) => ({ ...prev, stage, percent: pct }))
      })

      // Call Gemini via our API route
      setFlow((prev) => ({ ...prev, stage: 'analyzing', percent: 88 }))
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cloudinaryUrl, occasionTag: occasion }),
      })
      setFlow((prev) => ({ ...prev, percent: 99 }))

      const data = await analyzeRes.json()

      if (!analyzeRes.ok) {
        setFlow({
          stage: 'error',
          percent: 0,
          result: null,
          error: data.error ?? 'Analysis failed',
          errorCode: data.code ?? null,
        })
        return
      }

      setFlow({
        stage: 'done',
        percent: 100,
        result: data as AnalyzeResponse,
        error: null,
        errorCode: null,
      })
    } catch (err) {
      setFlow({
        stage: 'error',
        percent: 0,
        result: null,
        error: err instanceof Error ? err.message : 'Something went wrong — please try again.',
        errorCode: null,
      })
    }
  }

  /* ── Reset ───────────────────────────────────────────────────────────── */
  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setOccasion(null)
    setFlow({ stage: 'idle', percent: 0, result: null, error: null, errorCode: null })
  }

  /* ── Progress stage mapping ──────────────────────────────────────────── */
  const progressStage: ProgressStage =
    flow.stage === 'compressing' ? 'compressing'
    : flow.stage === 'uploading' ? 'uploading'
    : flow.stage === 'analyzing' ? 'analyzing'
    : 'done'

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 560,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* ── Done state: show results only ─────────────────────────────────── */}
      {flow.stage === 'done' && flow.result && (
        <ResultsDisplay
          result={flow.result}
          previewUrl={previewUrl}
          onReset={handleReset}
        />
      )}

      {/* ── All other states: upload zone visible ─────────────────────────── */}
      {flow.stage !== 'done' && (
        <>
          <UploadZone
            onFileSelect={handleFileSelect}
            previewUrl={previewUrl}
            disabled={isBusy}
          />

          {/* Preview controls — file picked but not yet submitted */}
          {flow.stage === 'preview' && (
            <div
              className="animate-fade-up"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <OccasionSelector value={occasion} onChange={setOccasion} />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  id="btn-reset"
                  type="button"
                  onClick={handleReset}
                  title="Remove photo"
                  style={{
                    flex: '0 0 auto',
                    padding: '0.8125rem 1.125rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-mid)',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>

                <button
                  id="btn-analyze"
                  type="button"
                  onClick={handleAnalyze}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '0.8125rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>✦</span>
                  Check my fit
                </button>
              </div>
            </div>
          )}

          {/* Progress bar — shown while pipeline runs */}
          {isBusy && (
            <div className="animate-fade-up">
              <UploadProgress stage={progressStage} percent={flow.percent} />
            </div>
          )}

          {/* Skeleton preview — shown while Gemini is thinking */}
          {flow.stage === 'analyzing' && (
            <div className="animate-fade-in">
              <ResultsSkeleton />
            </div>
          )}

          {/* Error state */}
          {flow.stage === 'error' && (
            <div
              className="animate-fade-up"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
            >
              <div
                role="alert"
                style={{
                  background: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.125rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                }}
              >
                <p style={{ color: '#fca5a5', fontWeight: 600, fontSize: '0.9375rem' }}>
                  {flow.errorCode === 'RATE_LIMITED'
                    ? '⏱ Daily limit reached'
                    : flow.errorCode === 'GUEST_LIMIT'
                    ? '🔒 Guest limit reached'
                    : '⚠ Analysis failed'}
                </p>
                <p style={{ color: '#fca5a599', fontSize: '0.875rem', lineHeight: 1.55 }}>
                  {flow.error}
                </p>
                {flow.errorCode === 'GUEST_LIMIT' && (
                  <a
                    href="/signup"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      marginTop: '0.25rem',
                      color: '#a78bfa',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                    }}
                  >
                    Create a free account →
                  </a>
                )}
              </div>

              {flow.errorCode !== 'RATE_LIMITED' && flow.errorCode !== 'GUEST_LIMIT' && (
                <button
                  id="btn-retry"
                  type="button"
                  className="btn-secondary"
                  onClick={handleReset}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Try another photo
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}