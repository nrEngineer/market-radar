import type { CollectionResult } from './types'
import { COLLECTION_SOURCES } from './types'
import { iTunesSearchResponseSchema } from '../schemas/itunes'

export type { CollectionResult }
export { COLLECTION_SOURCES }

// App Store データ収集
export async function collectAppStore(): Promise<CollectionResult> {
  try {
    // iTunes Search API を使った実際のデータ取得
    const categories = ['productivity', 'business', 'health-fitness', 'finance']
    const allApps: Record<string, unknown>[] = []

    for (const category of categories) {
      const response = await fetch(
        `${COLLECTION_SOURCES.appStore.url}?term=${category}&country=JP&media=software&limit=10`,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'MarketRadar/1.0'
          }
        }
      )

      if (response.ok) {
        const raw = await response.json()
        const parsed = iTunesSearchResponseSchema.safeParse(raw)
        const results = parsed.success ? parsed.data.results : raw.results || []
        const apps = results.map((app: Record<string, unknown>) => ({
          id: `app_${app.trackId}`,
          name: app.trackName,
          developer: (app as Record<string, unknown>).artistName,
          category: app.primaryGenreName,
          price: app.price || 0,
          rating: app.averageUserRating || 0,
          ratingCount: app.userRatingCount || 0,
          description: app.description,
          releaseDate: app.releaseDate,
          url: (app as Record<string, unknown>).trackViewUrl,
          iconUrl: app.artworkUrl100
        }))
        allApps.push(...apps)
      }
    }

    return {
      source: 'appstore',
      status: 'success',
      dataCount: allApps.length,
      timestamp: new Date().toISOString(),
      data: allApps
    }
  } catch (error) {
    return {
      source: 'appstore',
      status: 'error',
      dataCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
