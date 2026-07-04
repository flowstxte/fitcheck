import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isTrustedCloudinaryUrl } from '@/lib/validate-url'
import {
  verifyGuestCookie,
  incrementGuestCookie,
  GUEST_COOKIE_NAME,
  GUEST_LIMIT,
} from '@/lib/guest-cookie'
import type { AiResult } from '@/lib/types'

export const maxDuration = 60; // Vercel timeout

const DAILY_LIMIT = 5
/* ─── Gemini prompt ──────────────────────────────────────────────────────── */
function buildPrompt(occasionTag: string | null): string {
  const occasionClause = occasionTag
    ? `The user has specified this is for a **${occasionTag}** occasion.`
    : 'Detect the most appropriate occasion for this outfit yourself.'

  return `You are an expert fashion stylist AI. Analyze the outfit shown in this image.
${occasionClause}

Return ONLY a valid JSON object — no markdown, no code fences, no explanation text before or after. Pure JSON only.

The JSON must exactly match this schema:
{
  "overall_score": <number, 0.0 to 10.0, exactly one decimal place e.g. 7.5>,
  "color_harmony": {
    "rating": <one of: "Excellent", "Good", "Fair", "Poor">,
    "notes": "<1-2 sentences about color palette, combinations, and contrast>"
  },
  "occasion_match": {
    "rating": <one of: "Excellent", "Good", "Fair", "Poor">,
    "notes": "<1-2 sentences about how well the outfit suits the occasion>"
  },
  "swap_recommendations": [
    {
      "issue": "<specific item or combination that clashes or undermines the look>",
      "suggested_fix": "<concrete, actionable swap or styling adjustment>"
    }
  ],
  "summary": "<1-2 sentences: an overall verdict on the outfit>"
}

Rules:
- overall_score must be a number (not a string) like 7.5
- swap_recommendations is an array — include 1-3 items, or an empty array [] if the outfit is excellent
- All fields are required
- Do not include any text outside the JSON object`
}

/* ─── JSON parsing (defensive) ───────────────────────────────────────────── */
function parseGeminiJSON(text: string): AiResult {
  // Strip markdown JSON block if present
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()

  // First attempt: direct parse
  try {
    return JSON.parse(cleaned) as AiResult
  } catch {
    // Second attempt: extract first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0]) as AiResult
      } catch (e) {
        // Fall through to throw
      }
    }
    throw new Error('AI returned an invalid response format.')
  }
}

// Timeout helper
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: NodeJS.Timeout
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI analysis timed out. Please try again.')), ms)
  })
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer))
}

/* ─── Route handler ──────────────────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse body ──────────────────────────────────────────────────────
    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    const { cloudinaryUrl, occasionTag } = body as {
      cloudinaryUrl: string
      occasionTag: string | null
    }

    if (!cloudinaryUrl || typeof cloudinaryUrl !== 'string') {
      return NextResponse.json({ error: 'cloudinaryUrl is required' }, { status: 400 })
    }

    if (!isTrustedCloudinaryUrl(cloudinaryUrl)) {
      return NextResponse.json({ error: 'Invalid image source' }, { status: 400 })
    }

    // ── 2. Auth ────────────────────────────────────────────────────────────
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // ── 3. Rate limiting ───────────────────────────────────────────────────
    if (user) {
      // Logged-in: 5 per day, reset at midnight UTC
      const todayStart = new Date()
      todayStart.setUTCHours(0, 0, 0, 0)

      const { count, error: countErr } = await supabase
        .from('checks')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', todayStart.toISOString())

      if (!countErr && (count ?? 0) >= DAILY_LIMIT) {
        return NextResponse.json(
          {
            error:
              'Daily limit reached — you get 5 outfit checks per day. Resets at midnight UTC.',
            code: 'RATE_LIMITED',
          },
          { status: 429 }
        )
      }
    } else {
      // Guest: 2 total, tracked via signed httpOnly cookie
      const cookieVal = request.cookies.get(GUEST_COOKIE_NAME)?.value
      const guestCount = verifyGuestCookie(cookieVal)

      if (guestCount >= GUEST_LIMIT) {
        return NextResponse.json(
          {
            error:
              'Guest limit reached (2 free checks). Create a free account to get 5 checks per day.',
            code: 'GUEST_LIMIT',
          },
          { status: 429 }
        )
      }
    }

    // ── 4. Fetch image server-side → base64 ───────────────────────────────
    const imgRes = await fetch(cloudinaryUrl, {
      headers: { 'User-Agent': 'FitCheck/1.0' },
    })
    if (!imgRes.ok) {
      return NextResponse.json(
        { error: 'Could not fetch image from Cloudinary' },
        { status: 400 }
      )
    }
    const imgBuffer = await imgRes.arrayBuffer()
    const base64Image = Buffer.from(imgBuffer).toString('base64')
    const mimeType = imgRes.headers.get('content-type') ?? 'image/jpeg'

    // ── 5. Call Gemini ─────────────────────────────────────────────────────
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
    const prompt = buildPrompt(occasionTag ?? null)

    const geminiPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: prompt },
          ],
        },
      ],
    })

    const geminiResult = await withTimeout(geminiPromise, 25000)

    const rawText = geminiResult.text ?? ''

    // ── 6. Parse JSON defensively (with one retry) ─────────────────────────
    let aiResult: AiResult
    try {
      aiResult = parseGeminiJSON(rawText)
    } catch (parseErr) {
      console.warn('[analyze] First parse attempt failed, retrying:', parseErr)
      const retryPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { inlineData: { data: base64Image, mimeType } },
              {
                text:
                  prompt +
                  '\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY the JSON object — no other text, no code blocks, nothing else.',
              },
            ],
          },
        ],
      })
      const retryResult = await withTimeout(retryPromise, 25000)
      aiResult = parseGeminiJSON(retryResult.text ?? '')
    }

    // Clamp score to valid range
    aiResult.overall_score = Math.max(
      0,
      Math.min(10, Math.round(aiResult.overall_score * 10) / 10)
    )

    // ── 7. Save to DB if logged in ─────────────────────────────────────────
    if (user) {
      const adminClient = createAdminClient()
      const { error: insertErr } = await adminClient.from('checks').insert({
        user_id: user.id,
        cloudinary_url: cloudinaryUrl,
        ai_result: aiResult,
        occasion_tag: occasionTag ?? null,
      })
      if (insertErr) {
        // Don't block the response — log and continue
        console.error('[analyze] DB insert error:', insertErr)
      }
    }

    // ── 8. Build response + set guest cookie ───────────────────────────────
    const response = NextResponse.json({
      aiResult,
      cloudinaryUrl,
      occasionTag: occasionTag ?? null,
    })

    if (!user) {
      const cookieVal = request.cookies.get(GUEST_COOKIE_NAME)?.value
      const newVal = incrementGuestCookie(cookieVal)
      response.cookies.set(GUEST_COOKIE_NAME, newVal, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      })
    }

    return response
  } catch (err) {
    console.error('[analyze] Unhandled error:', err)
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Analysis failed — please try again.',
      },
      { status: 500 }
    )
  }
}