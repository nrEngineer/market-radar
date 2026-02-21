import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/server/stripe-client'
import { stripeCheckoutSchema } from '@/server/validation/schemas'
import { notifyError } from '@/server/discord-notify'
import { PRICING_PLANS } from '@/server/config/pricing'

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
        { error: 'Invalid request parameters' },
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

    const planConfig = PRICING_PLANS[plan]

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
        limits: JSON.stringify(planConfig.limits),
      },
      subscription_data: {
        metadata: { plan },
      },
    })

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
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
    billing_cycle: 'monthly',
  })
}
