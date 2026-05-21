import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FormData } from '@/types'
import { supabaseAdmin } from '@/lib/supabase'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// Stripe webhook — fires after successful payment.
// Flow:
//   1. Verify Stripe signature
//   2. Fetch order from Supabase by order_id (from session metadata)
//   3. Mark as paid → call /api/generate → mark as completed/failed
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.order_id

  if (!orderId) {
    console.error('Webhook: missing order_id in session metadata')
    return NextResponse.json({ received: true, error: 'no order_id' })
  }

  const supabase = supabaseAdmin()

  // ── 1. Mark as paid ─────────────────────────────────────────
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select('id, email, form_data, status')
    .single()

  if (fetchError || !order) {
    console.error('Webhook: order not found', orderId, fetchError)
    return NextResponse.json({ received: true, error: 'order not found' })
  }

  const formData = order.form_data as FormData

  // ── 2. Mark as generating ──────────────────────────────────
  await supabase
    .from('orders')
    .update({ status: 'generating' })
    .eq('id', orderId)

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, orderId }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Generation failed: ${JSON.stringify(error)}`)
    }

    // ── 3. Mark completed ───────────────────────────────────
    await supabase
      .from('orders')
      .update({
        status: 'completed',
        generated_at: new Date().toISOString(),
        emailed_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    console.log(`✅ CV package sent to ${formData.email} (order ${orderId})`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    await supabase
      .from('orders')
      .update({
        status: 'failed',
        error_message: String(error).slice(0, 1000),
      })
      .eq('id', orderId)
    // Return 200 to Stripe — we own the retry logic via /admin
    return NextResponse.json({ received: true, error: String(error) })
  }
}
