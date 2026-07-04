import { NextResponse } from 'next/server'
import { generateUploadSignature } from '@/lib/cloudinary'

/**
 * GET /api/cloudinary-sign
 * Returns a short-lived signed upload token.
 * The client uses this to upload directly to Cloudinary — the secret stays server-side.
 */
export async function GET() {
  try {
    const params = generateUploadSignature('fitcheck')
    return NextResponse.json(params)
  } catch (err) {
    console.error('[cloudinary-sign] Failed to generate signature:', err)
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    )
  }
}