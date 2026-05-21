import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { FormData } from '@/types'

// Lazy init — avoids build-time crash when env var not yet set
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

// Create a Stripe Checkout session.
// Called when user submits the form and clicks "Pay €9".
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.json()
    const formData: FormData = body.formData

    // Encode form data to pass through Stripe metadata
    // Stripe metadata values have a 500 char limit per field,
    // so we split into chunks if needed.
    const formDataJson = JSON.stringify(formData)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'bancontact', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'AISTA — CV пакет для Бельгії',
              description:
                'CV на нідерландській/французькій + мотиваційний лист + список вакансій + 4 уроки нідерландської',
              images: ['https://aista.be/og-image.png'],
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
        // Store form data to retrieve in webhook
        // Max 500 chars per value in Stripe — we store in chunks
        form_chunk_1: formDataJson.slice(0, 499),
        form_chunk_2: formDataJson.slice(499, 998),
        form_chunk_3: formDataJson.slice(998, 1497),
        form_chunk_4: formDataJson.slice(1497, 1996),
        form_chunk_5: formDataJson.slice(1996, 2495),
        // Track total length to reassemble
        form_total_length: String(formDataJson.length),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Could not create checkout session', details: String(error) },
      { status: 500 }
    )
  }
}
