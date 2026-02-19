import { timingSafeEqual as nodeTimingSafeEqual } from 'crypto'
import { createHash } from 'crypto'

export function timingSafeCompare(a: string, b: string): boolean {
  // Hash both values to fixed-length before comparing to avoid length leak
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return nodeTimingSafeEqual(hashA, hashB)
}

export function validateCronToken(authHeader: string | null): boolean {
  const cronSecret = process.env.CRON_SECRET_TOKEN
  if (!cronSecret) return false
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  return timingSafeCompare(token, cronSecret)
}
