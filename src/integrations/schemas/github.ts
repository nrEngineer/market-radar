import { z } from 'zod'

export const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  stargazers_count: z.number(),
  language: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  topics: z.array(z.string()).optional(),
  homepage: z.string().nullable().optional(),
})

export const githubSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(githubRepoSchema),
})

export type GitHubRepoSchema = z.infer<typeof githubRepoSchema>
export type GitHubSearchResponse = z.infer<typeof githubSearchResponseSchema>
