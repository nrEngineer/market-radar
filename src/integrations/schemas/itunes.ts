import { z } from 'zod'

export const iTunesAppSchema = z.object({
  trackId: z.number(),
  trackName: z.string(),
  bundleId: z.string().optional(),
  primaryGenreName: z.string(),
  price: z.number(),
  averageUserRating: z.number().optional(),
  userRatingCount: z.number().optional(),
  releaseDate: z.string(),
  currentVersionReleaseDate: z.string().optional(),
  description: z.string().optional(),
  artworkUrl100: z.string().optional(),
})

export const iTunesSearchResponseSchema = z.object({
  resultCount: z.number(),
  results: z.array(iTunesAppSchema),
})

export type ITunesApp = z.infer<typeof iTunesAppSchema>
export type ITunesSearchResponse = z.infer<typeof iTunesSearchResponseSchema>
