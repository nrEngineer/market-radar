import type { CollectionResult } from './types'
import { hnTopStoriesSchema, hnItemSchema } from '../schemas/hackernews'

// Hacker News データ収集
export async function collectHackerNews(): Promise<CollectionResult> {
  try {
    // Top stories APIから上位ストーリーを取得
    const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const rawIds = await topStoriesResponse.json()
    const parsedIds = hnTopStoriesSchema.safeParse(rawIds)
    const topStoryIds = parsedIds.success ? parsedIds.data : (rawIds as number[])

    // 上位20件の詳細を取得
    const stories = await Promise.all(
      topStoryIds.slice(0, 20).map(async (id: number) => {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        const raw = await storyResponse.json()
        const parsed = hnItemSchema.safeParse(raw)
        return parsed.success ? parsed.data : raw
      })
    )

    const filteredStories = stories
      .filter(story => story && story.title && story.url)
      .map(story => ({
        id: `hn_${story.id}`,
        title: story.title,
        url: story.url,
        score: story.score || 0,
        author: story.by,
        timestamp: story.time ? new Date(story.time * 1000).toISOString() : new Date().toISOString(),
        commentCount: story.descendants || 0,
        text: story.text || ''
      }))

    return {
      source: 'hackernews',
      status: 'success',
      dataCount: filteredStories.length,
      timestamp: new Date().toISOString(),
      data: filteredStories
    }
  } catch (error) {
    return {
      source: 'hackernews',
      status: 'error',
      dataCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
