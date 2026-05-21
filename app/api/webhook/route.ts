import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FormData } from '@/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Stripe webhook — fires after successful payment.
// Reconstructs form data and triggers CV generation.
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Only handle successful payment events
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  try {
    // Reconstruct form data from Stripe metadata chunks
    const meta = session.metadata!
    const totalLength = parseInt(meta.form_total_length || '0')

    let formDataJson = ''
    formDataJson += meta.form_chunk_1 || ''
    formDataJson += meta.form_chunk_2 || ''
    formDataJson += meta.form_chunk_3 || ''
    formDataJson += meta.form_chunk_4 || ''
    formDataJson += meta.form_chunk_5 || ''

    formDataJson = formDataJson.slice(0, totalLength)
    const formData: FormData = JSON.parse(formDataJson)

    // Call our generate endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Generation failed: ${JSON.stringify(error)}`)
    }

    console.log(`✅ CV package sent to ${formData.email}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    // Return 200 to Stripe so it doesn't retry (we'll handle errors internally)
    // In production: add error logging / alerting here
    return NextResponse.json({ received: true, error: String(error) })
  }
}
