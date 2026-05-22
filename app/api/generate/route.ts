import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
import { generateCVAndProfessions, generateMotivationLetter } from '@/lib/claude'
import { generateCVDocx, generateMotivationLetterDocx } from '@/lib/docx-generator'
import { sendCVPackage } from '@/lib/email'
import { getMappingById } from '@/lib/mappings'
import { FormData } from '@/types'

// Called by the Stripe webhook after successful payment.
export async function POST(req: NextRequest) {
  const t0 = Date.now()
  const elapsed = () => `+${Date.now() - t0}ms`

  try {
    const body = await req.json()
    const formData: FormData = body.formData
    console.log(`[generate] START — profession: ${formData.profession_id}, email: ${formData.email}`)

    // 1. Mapping lookup
    const mapping = getMappingById(formData.profession_id)
    if (!mapping) {
      console.error(`[generate] ${elapsed()} — mapping not found: ${formData.profession_id}`)
      return NextResponse.json(
        { error: `Profession mapping not found: ${formData.profession_id}` },
        { status: 400 }
      )
    }
    console.log(`[generate] ${elapsed()} — mapping OK`)

    // 2. Two parallel Claude calls:
    //    - Sonnet: full CV + profession list (quality matters, ~3000 tokens)
    //    - Haiku:  motivation letter (fast, simple, ~400 tokens)
    console.log(`[generate] ${elapsed()} — calling Claude (Sonnet+Haiku parallel)...`)
    let cvResult, motivationLetter
    try {
      ;[cvResult, motivationLetter] = await Promise.all([
        generateCVAndProfessions(formData, mapping),
        generateMotivationLetter(formData, mapping),
      ])
    } catch (err) {
      console.error(`[generate] ${elapsed()} — Claude FAILED:`, err)
      throw err
    }
    const { cv, professionList } = cvResult
    console.log(`[generate] ${elapsed()} — Claude OK (both)`)

    // 3. Both DOCX in parallel — they're independent
    console.log(`[generate] ${elapsed()} — generating DOCX files (parallel)...`)
    let cvDocxBuffer: Buffer
    let motivationDocxBuffer: Buffer
    try {
      ;[cvDocxBuffer, motivationDocxBuffer] = await Promise.all([
        generateCVDocx(cv),
        generateMotivationLetterDocx(motivationLetter, formData.full_name),
      ])
    } catch (err) {
      console.error(`[generate] ${elapsed()} — DOCX FAILED:`, err)
      throw err
    }
    console.log(
      `[generate] ${elapsed()} — DOCX OK — CV: ${cvDocxBuffer.length}b, letter: ${motivationDocxBuffer.length}b`
    )

    // 4. Send email
    console.log(`[generate] ${elapsed()} — sending email...`)
    try {
      await sendCVPackage({ formData, cvDocxBuffer, motivationDocxBuffer, professionList })
    } catch (err) {
      console.error(`[generate] ${elapsed()} — Email FAILED:`, err)
      throw err
    }
    console.log(`[generate] ${elapsed()} — DONE`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[generate] +${Date.now() - t0}ms — UNHANDLED ERROR:`, error)
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    )
  }
}
