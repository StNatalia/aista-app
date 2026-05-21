import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) return NextResponse.json({ error: 'no key' }, { status: 500 })
    
    const stripe = new Stripe(key, { httpClient: Stripe.createNodeHttpClient() })
    const balance = await stripe.balance.retrieve()
    return NextResponse.json({ ok: true, currency: balance.available[0]?.currency })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e), stack: e?.stack?.split('\n').slice(0,6).join('|') }, { status: 500 })
  }
}
