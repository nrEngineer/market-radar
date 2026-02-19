import { z } from 'zod'

export const hnItemSchema = z.object({
  id: z.number(),
  type: z.enum(['story', 'comment', 'job', 'poll', 'pollopt']).optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  score: z.number().optional(),
  by: z.string().optional(),
  time: z.number().optional(),
  descendants: z.number().optional(),
  kids: z.array(z.number()).optional(),
})

export const hnTopStoriesSchema = z.array(z.number())

export type HNItem = z.infer<typeof hnItemSchema>
