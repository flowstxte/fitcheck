/**
 * Shared TypeScript types used across client and server.
 */

export interface ColorHarmony {
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  notes: string
}

export interface OccasionMatch {
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  notes: string
}

export interface SwapRecommendation {
  issue: string
  suggested_fix: string
}

export interface AiResult {
  overall_score: number            // 0.0 – 10.0
  color_harmony: ColorHarmony
  occasion_match: OccasionMatch
  swap_recommendations: SwapRecommendation[]
  summary: string
}

export interface AnalyzeResponse {
  aiResult: AiResult
  cloudinaryUrl: string
  occasionTag: string | null
}

/** Shape of a row in the `checks` table (subset used client-side) */
export interface CheckRow {
  id: string
  cloudinary_url: string
  ai_result: AiResult
  occasion_tag: string | null
  created_at: string
}
