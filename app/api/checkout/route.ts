import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FormData } from '@/types'
// import { supabaseAdmin } from '@/lib/supabase' // TEMP disabled

export const dynamic = 'force-dynamic'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    httpClient: Stripe.createNodeHttpClient(),
  })
}

// Create a Stripe Checkout session.
// Flow:
//   1. Save the order to Supabase (status: pending)
//   2. Create Stripe session, pass only the order_id as metadata
//   3. Return redirect URL to client
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.json()
    const formData: FormData = body.formData

    // Basic validation — email + name are mandatory for the email delivery
    if (!formData?.email || !formData?.full_name) {
      return NextResponse.json(
        { error: 'Missing email or full_name' },
        { status: 400 },
      )
    }

    console.log('STEP1: skipping supabase, testing stripe only')
    // TEMP: bypass Supabase to isolate Stripe connectivity
    const order = { id: 'test-order-' + Date.now() }

    console.log('STEP2: starting stripe minimal')
    // TEMP: absolute minimal Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'eur', product_data: { name: 'AISTA CV' }, unit_amount: 900 }, quantity: 1 }],
      success_url: 'https://aista-app.vercel.app/success',
      cancel_url: 'https://aista-app.vercel.app/form',
    })

    console.log('STEP3: stripe session created:', session.id)
    // TEMP: skip Supabase update
    return NextResponse.json({ url: session.url, order_id: order.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Could not create checkout session', details: String(error) },
      { status: 500 },
    )
  }
}
