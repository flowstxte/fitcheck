/**
 * Server-only Cloudinary utility.
 * Never import this from client components — it reads CLOUDINARY_API_SECRET.
 */
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

export { cloudinary }

export interface SignedUploadParams {
  timestamp: number
  signature: string
  folder: string
  cloudName: string
  apiKey: string
}

/**
 * Generates a signed upload param set for a direct client → Cloudinary upload.
 * The API secret never leaves the server.
 */
export function generateUploadSignature(
  folder: string = 'fitcheck'
): SignedUploadParams {
  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign = { folder, timestamp }
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    timestamp,
    signature,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  }
}
