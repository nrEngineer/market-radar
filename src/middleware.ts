import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { checkRateLimitAsync, RATE_LIMITS, type RateLimitConfig } from '@/server/rate-limit'
import { notifyRateLimit } from '@/server/discord-notify'

interface RouteConfig {
  requireAuth: boolean
  rateLimit: RateLimitConfig
  allowedMethods?: string[]
}

const ROUTE_CONFIGS: Record<string, RouteConfig> = {
  '/api/custom-research': {
    requireAuth: true,
    rateLimit: RATE_LIMITS.computation,
  },
  '/api/free-analysis': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.public,
  },
  '/api/data': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.public,
  },
  '/api/product-hunt-data': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.public,
  },
  '/api/health': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.health,
  },
  '/api/collect': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.authenticated,
  },
  '/api/payment/stripe': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.payment,
  },
  '/api/payment/stripe/webhook': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.authenticated,
  },
  '/api/seed-real-data': {
    requireAuth: false,
    rateLimit: RATE_LIMITS.authenticated,
  },
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const aHash = await crypto.subtle.digest('SHA-256', encoder.encode(a))
  const bHash = await crypto.subtle.digest('SHA-256', encoder.encode(b))
  const aArr = new Uint8Array(aHash)
  const bArr = new Uint8Array(bHash)
  if (aArr.length !== bArr.length) return false
  let result = 0
  for (let i = 0; i < aArr.length; i++) {
    result |= aArr[i] ^ bArr[i]
  }
  return result === 0
}

async function validateApiKey(request: NextRequest): Promise<boolean> {
  const apiKey = request.headers.get('x-api-key')
  const expectedKey = process.env.API_SECRET_KEY
  if (!expectedKey || !apiKey) return false
  return timingSafeEqual(apiKey, expectedKey)
}

async function validateSupabaseAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return false
  const token = authHeader.slice(7)
  const jwtSecret = process.env.SUPABASE_JWT_SECRET
  if (!jwtSecret) return false
  try {
    const secret = new TextEncoder().encode(jwtSecret)
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 30, // 30s clock skew tolerance
    })
    // Require both sub (user ID) and exp (expiration) claims
    return !!payload.sub && !!payload.exp
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  let config: RouteConfig | undefined
  let matchedPath = ''
  for (const [path, cfg] of Object.entries(ROUTE_CONFIGS)) {
    if (pathname.startsWith(path) && path.length > matchedPath.length) {
      config = cfg
      matchedPath = path
    }
  }

  if (!config) {
    config = {
      requireAuth: true,
      rateLimit: RATE_LIMITS.authenticated,
    }
  }

  const clientIP = getClientIP(request)
  const rateLimitKey = `${clientIP}:${matchedPath || pathname}`
  const rateLimitResult = await checkRateLimitAsync(rateLimitKey, config.rateLimit)

  if (!rateLimitResult.allowed) {
    notifyRateLimit(clientIP, matchedPath || pathname).catch(() => {})

    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.retryAfter),
          'X-RateLimit-Limit': String(config.rateLimit.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        },
      }
    )
  }

  if (config.requireAuth) {
    const hasApiKey = await validateApiKey(request)
    const hasSupabaseAuth = await validateSupabaseAuth(request)

    if (!hasApiKey && !hasSupabaseAuth) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(config.rateLimit.maxRequests))
  response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))
  response.headers.set('X-RateLimit-Reset', String(rateLimitResult.resetAt))

  return response
}

export const config = {
  matcher: '/api/:path*',
}
