export function isTrustedCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'res.cloudinary.com' &&
      parsed.pathname.startsWith(`/${process.env.CLOUDINARY_CLOUD_NAME ?? ''}/`)
    )
  } catch {
    return false
  }
}