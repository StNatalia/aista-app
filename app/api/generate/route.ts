import { NextRequest, NextResponse } from 'next/server'
import { generateCVPackage } from '@/lib/claude'
import { generateCVDocx } from '@/lib/docx-generator'
import { sendCVPackage } from '@/lib/email'
import { getMappingById } from '@/lib/mappings'
import { FormData } from '@/types'

// This endpoint is called by the Stripe webhook after successful payment.
// It generates the full CV package and sends it to the user via email.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const formData: FormData = body.formData

    // 1. Load the profession mapping
    const mapping = getMappingById(formData.profession_id)
    if (!mapping) {
      return NextResponse.json(
        { error: `Profession mapping not found: ${formData.profession_id}` },
        { status: 400 }
      )
    }

    // 2. Generate CV content via Claude API
    const { cv, motivationLetter, professionList } = await generateCVPackage(formData, mapping)

    // 3. Generate DOCX file
    const cvDocxBuffer = await generateCVDocx(cv)

    // 4. Send email with DOCX + PDF lessons
    await sendCVPackage({ formData, cvDocxBuffer, professionList })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    )
  }
}
