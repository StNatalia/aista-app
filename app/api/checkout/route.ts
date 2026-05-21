import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FormData } from '@/types'
import { supabaseAdmin } from '@/lib/supabase'

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

    console.log('STEP1: starting supabase insert')
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    console.log('STEP1a: sbUrl len', sbUrl.length, 'codes', sbUrl.split('').map((c: string) => c.charCodeAt(0)).join(','))
    // ── 1. Create order row in Supabase ───────────────────────
    const supabase = supabaseAdmin()
    let order: { id: string } | null = null
    try {
      const result = await supabase
        .from('orders')
        .insert({
          email: formData.email.toLowerCase().trim(),
          full_name: formData.full_name,
          form_data: formData,
          profession_id: formData.profession_id,
          track: formData.track,
          region: formData.region,
          output_language: formData.output_language,
          status: 'pending',
          amount_eur: 9.0,
          user_agent: req.headers.get('user-agent'),
          ip_country: req.headers.get('x-vercel-ip-country') ?? null,
        })
        .select('id')
        .single()
      if (result.error || !result.data) {
        console.error('Supabase insert failed:', result.error)
        return NextResponse.json(
          { error: 'Could not save order', details: String(result.error?.message) },
          { status: 500 },
        )
      }
      order = result.data
    } catch (supaErr) {
      console.error('Supabase threw exception:', supaErr)
      return NextResponse.json({ error: 'Supabase exception', details: String(supaErr) }, { status: 500 })
    }

    console.log('STEP2: supabase done, order id:', order.id, 'starting stripe')
    // ── 2. Stripe Checkout session ─────────────────────────────
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'bancontact', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'AISTA - CV Package for Belgium',
              description:
                'CV in Dutch/French + motivation letter + job list + 4 Dutch lessons',
              images: ['https://aista-app.vercel.app/images/og-image.png'],
            },
            unit_amount: 900, // €9.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/form?cancelled=true`,
      customer_email: formData.email,
      metadata: {
        // Single source of truth — webhook fetches the rest from Supabase
        order_id: order.id,
      },
    })

    console.log('STEP3: stripe session created:', session.id)
    // ── 3. Link the Stripe session id back to the order ───────
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url, order_id: order.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Could not create checkout session', details: String(error) },
      { status: 500 },
    )
  }
}
