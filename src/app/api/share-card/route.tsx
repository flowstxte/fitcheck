import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { isTrustedCloudinaryUrl } from '@/lib/validate-url'

export const runtime = 'edge'

const RATING_DOT: Record<string, string> = {
  Excellent: '#ffffff',
  Good: '#cfcfcf',
  Fair: '#8a8a8a',
  Poor: '#555555',
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') ?? 'story'
    const imageUrl = searchParams.get('url')
    const score = searchParams.get('score') ?? '?'
    const occasion = searchParams.get('occasion') || 'Outfit'
    const colorRating = searchParams.get('color') ?? ''
    const occasionRating = searchParams.get('occasionRating') ?? ''

    if (!imageUrl) {
      return new Response('Missing image url', { status: 400 })
    }

    if (!isTrustedCloudinaryUrl(imageUrl)) {
      return new Response('Invalid image source', { status: 400 })
    }

    const site =
      (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/^https?:\/\//, '')

    const width = 1080
    const height = format === 'story' ? 1920 : 1350
    const panelHeight = format === 'story' ? 460 : 400

    const [playfairData, archivoData, archivoBoldData] = await Promise.all([
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf').then((r) => r.arrayBuffer()),
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/archivo@latest/latin-400-normal.ttf').then((r) => r.arrayBuffer()),
      fetch('https://cdn.jsdelivr.net/fontsource/fonts/archivo@latest/latin-700-normal.ttf').then((r) => r.arrayBuffer()),
    ])

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            position: 'relative',
          }}
        >
          {/* Photo area (fills everything above the bottom panel) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              width: '100%',
              height: height - panelHeight,
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                inset: -2,
                objectPosition: 'center',
              }}
            />

            {/* Top vignette just for wordmark legibility */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 220,
                display: 'flex',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
              }}
            />

            {/* Wordmark, text-only */}
            <span
              style={{
                position: 'absolute',
                top: 52,
                left: 60,
                display: 'flex',
                fontFamily: '"Archivo"',
                fontWeight: 700,
                fontSize: 30,
                color: '#ffffff',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              FitCheck
            </span>
          </div>

          {/* Solid black bottom panel — always legible regardless of photo brightness */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 26,
              width: '100%',
              height: panelHeight,
              backgroundColor: '#000000',
              borderTop: '1px solid rgba(255,255,255,0.14)',
              padding: '0 60px',
            }}
          >
            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: '"Playfair Display"' }}>
              <span style={{ fontSize: 236, color: '#fff', lineHeight: 1, display: 'flex', letterSpacing: '-0.02em' }}>
                {score}
              </span>
              <span style={{ fontSize: 50, color: 'rgba(255,255,255,0.5)', marginLeft: 14, display: 'flex' }}>
                /10
              </span>
            </div>

            {/* Hairline rule */}
            <div style={{ display: 'flex', height: 1, background: 'rgba(255,255,255,0.2)', width: '100%' }} />

            {/* Occasion + ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: '"Archivo"',
                  fontWeight: 700,
                  fontSize: 34,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {occasion}
              </span>

              {colorRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 99,
                      background: RATING_DOT[colorRating] ?? '#888',
                      display: 'flex',
                    }}
                  />
                  <span style={{ fontFamily: '"Archivo"', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>
                    Color: {colorRating}
                  </span>
                </div>
              )}

              {occasionRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: 99,
                      background: RATING_DOT[occasionRating] ?? '#888',
                      display: 'flex',
                    }}
                  />
                  <span style={{ fontFamily: '"Archivo"', fontSize: 28, color: 'rgba(255,255,255,0.7)' }}>
                    Fit: {occasionRating}
                  </span>
                </div>
              )}
            </div>

            {/* Watermark URL */}
            <span
              style={{
                fontFamily: '"Archivo"',
                fontSize: 26,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.02em',
                display: 'flex',
              }}
            >
              {site}
            </span>
          </div>

          {/* Outer black border frame */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: '14px solid #000000',
              display: 'flex',
              pointerEvents: 'none',
            }}
          />
        </div>
      ),
      {
        width,
        height,
        fonts: [
          { name: 'Playfair Display', data: playfairData, style: 'normal', weight: 700 },
          { name: 'Archivo', data: archivoData, style: 'normal', weight: 400 },
          { name: 'Archivo', data: archivoBoldData, style: 'normal', weight: 700 },
        ],
      }
    )
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 })
  }
}