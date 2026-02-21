import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/server/stripe-client'
import { stripeCheckoutSchema } from '@/server/validation/schemas'
import { notifyError } from '@/server/discord-notify'

// Pricing plans configuration
const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    limits: { analyses: 5, reports: 0, api_calls: 0 },
    features: ['基本市場分析', '月5回まで', 'コミュニティサポート']
  },
  premium: {
    name: 'Premium',
    price: 5000,
    stripe_price_id: 'price_premium_monthly', // TODO: Create in Stripe dashboard
    limits: { analyses: 100, reports: 10, api_calls: 1000 },
    features: ['AIレポート生成', '月100回分析', '詳細トレンド分析', 'メールサポート']
  },
  professional: {
    name: 'Professional', 
    price: 15000,
    stripe_price_id: 'price_professional_monthly',
    limits: { analyses: -1, reports: -1, api_calls: 10000 },
    features: ['無制限分析', 'API アクセス', 'カスタムダッシュボード', '優先サポート']
  },
  enterprise: {
    name: 'Enterprise',
    price: 50000,
    stripe_price_id: 'price_enterprise_monthly', 
    limits: { analyses: -1, reports: -1, api_calls: 100000 },
    features: ['全機能アクセス', 'ホワイトラベル', '専用サポート', 'SLA保証']
  }
}

// Create checkout session
export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 })
    }

    const body = await request.json()
    const parsed = stripeCheckoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { plan, success_url, cancel_url, customer_email } = parsed.data

    // Validate redirect URLs to prevent open redirect attacks
    const allowedHosts = [
      'market-radar-rho.vercel.app',
      'localhost',
      '127.0.0.1',
    ]

    function isAllowedUrl(url: string | undefined): boolean {
      if (!url) return true // Will use defaults
      try {
        const parsed = new URL(url)
        return allowedHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))
      } catch {
        return false
      }
    }

    if (!isAllowedUrl(success_url) || !isAllowedUrl(cancel_url)) {
      return NextResponse.json({ error: 'Invalid redirect URL' }, { status: 400 })
    }

    // Plan is already validated by Zod schema (premium | professional | enterprise)
    const planConfig = PRICING_PLANS[plan]

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: success_url || `${process.env.NEXTAUTH_URL || 'https://market-radar-rho.vercel.app'}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXTAUTH_URL || 'https://market-radar-rho.vercel.app'}/pricing`,
      customer_email: customer_email,
      metadata: {
        plan: plan,
        features: JSON.stringify(planConfig.features),
        limits: JSON.stringify(planConfig.limits)
      },
      subscription_data: {
        metadata: {
          plan: plan,
        },
      },
    })

    return NextResponse.json({ 
      checkout_url: session.url,
      session_id: session.id 
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    notifyError('payment/stripe', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Get pricing plans
export async function GET() {
  return NextResponse.json({
    plans: PRICING_PLANS,
    currency: 'JPY',
    billing_cycle: 'monthly'
  })
}