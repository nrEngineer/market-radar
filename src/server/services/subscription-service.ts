import Stripe from 'stripe'
import { supabaseAdmin } from '@/server/db/client'

function maskEmail(email: string | null | undefined): string {
  if (!email) return '(none)'
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  return `${local[0]}***@${domain}`
}

export async function activateSubscription(session: Stripe.Checkout.Session): Promise<void> {
  const plan = session.metadata?.plan
  const customerEmail = session.customer_email
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

  console.log(`[Subscription] Activated plan=${plan} for email=${maskEmail(customerEmail)} session=${session.id}`)

  if (!customerEmail || !plan) return

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      email: customerEmail,
      plan,
      stripe_session_id: session.id,
      stripe_subscription_id: subscriptionId ?? null,
      status: 'active',
      activated_at: new Date().toISOString(),
    }, { onConflict: 'email' })

  if (error) {
    console.error('[Subscription] Failed to activate:', error.message)
  }
}

export async function updateSubscription(subscription: Stripe.Subscription): Promise<void> {
  const plan = subscription.metadata?.plan
  console.log(`[Subscription] Updated subscription=${subscription.id} plan=${plan} status=${subscription.status}`)

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      plan: plan ?? undefined,
      status: subscription.status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('[Subscription] Failed to update:', error.message)
  }
}

export async function cancelSubscription(subscription: Stripe.Subscription): Promise<void> {
  console.log(`[Subscription] Cancelled subscription=${subscription.id}`)

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('[Subscription] Failed to cancel:', error.message)
  }
}
