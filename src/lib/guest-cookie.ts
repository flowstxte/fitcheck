/**
 * Server-only — cookie signing for guest rate limiting.
 * Uses HMAC-SHA256 so the count can't be tampered with client-side.
 * Cookie format: "<count>.<hex_sig>"
 */
import { createHmac } from 'crypto'

export const GUEST_COOKIE_NAME = 'fc_guest'
export const GUEST_LIMIT = 2

function getSecret(): string {
  const secret = process.env.COOKIE_SECRET
  if (!secret) {
    // Warn in dev — fail loudly in prod
    if (process.env.NODE_ENV === 'production') {
      throw new Error('COOKIE_SECRET env var is required in production')
    }
    return 'dev-only-insecure-fallback-secret-change-me'
  }
  return secret
}

function sign(count: number): string {
  return createHmac('sha256', getSecret())
    .update(String(count))
    .digest('hex')
    .slice(0, 24)
}

/**
 * Reads + verifies a guest cookie value.
 * Returns the verified count, or 0 if missing/tampered.
 */
export function verifyGuestCookie(cookieValue: string | undefined): number {
  if (!cookieValue) return 0
  const dotIndex = cookieValue.lastIndexOf('.')
  if (dotIndex === -1) return 0

  const countStr = cookieValue.slice(0, dotIndex)
  const sig = cookieValue.slice(dotIndex + 1)
  const count = parseInt(countStr, 10)

  if (isNaN(count) || count < 0) return 0
  if (sign(count) !== sig) return 0 // tampered → treat as 0

  return count
}

/**
 * Returns a new signed cookie value with count + 1.
 */
export function incrementGuestCookie(cookieValue: string | undefined): string {
  const current = verifyGuestCookie(cookieValue)
  const next = current + 1
  return `${next}.${sign(next)}`
}