import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with secret key (conditional for build)
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
    })
  : null

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

    const { plan, success_url, cancel_url, customer_email } = await request.json()

    // Validate plan
    if (!PRICING_PLANS[plan as keyof typeof PRICING_PLANS] || plan === 'free') {
      return NextResponse.json({ error: 'Invalid plan specified' }, { status: 400 })
    }

    const planConfig = PRICING_PLANS[plan as keyof typeof PRICING_PLANS]

    // Ensure plan has stripe_price_id
    if (!('stripe_price_id' in planConfig)) {
      return NextResponse.json({ error: 'Plan not available for purchase' }, { status: 400 })
    }

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
      success_url: success_url || `${process.env.NEXTAUTH_URL || 'https://market-radar-rho.vercel.app'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
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
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Handle webhook events
export async function PUT(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 })
    }

    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const body = await request.text()

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        // TODO: Update user subscription in database
        console.log('Subscription created:', session.id)
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        // TODO: Update user limits and features
        console.log('Subscription updated:', subscription.id)
        break

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object as Stripe.Subscription
        // TODO: Downgrade user to free plan
        console.log('Subscription cancelled:', deletedSub.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
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