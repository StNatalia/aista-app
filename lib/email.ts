import { Resend } from 'resend'
import { FormData, GeneratedProfessionList } from '@/types'
import path from 'path'
import fs from 'fs'

const resend = new Resend(process.env.RESEND_API_KEY)

// ============================================================
// Send the CV package to the client
// ============================================================
export async function sendCVPackage({
  formData,
  cvDocxBuffer,
  professionList,
}: {
  formData: FormData
  cvDocxBuffer: Buffer
  professionList: GeneratedProfessionList
}): Promise<void> {
  // Load the 4 Dutch lesson PDFs from public folder
  const lessonPaths = [
    path.join(process.cwd(), 'public', 'lessons', 'les-01-vacatures-lezen.pdf'),
    path.join(process.cwd(), 'public', 'lessons', 'les-02-cv-schrijven.pdf'),
    path.join(process.cwd(), 'public', 'lessons', 'les-03-sollicitatiebrief.pdf'),
    path.join(process.cwd(), 'public', 'lessons', 'les-04-woordenlijst.pdf'),
  ]

  // Build profession list HTML for the email body
  const professionListHtml = professionList.items
    .map(
      (p) =>
        `<li>
          <strong>${p.nl_title}</strong>${p.fr_title !== p.nl_title ? ` / ${p.fr_title}` : ''}<br/>
          ${p.match_reason}<br/>
          <a href="${p.vdab_url}">Пошук на VDAB →</a>
        </li>`
    )
    .join('')

  // Build attachments: CV DOCX + lesson PDFs (if they exist)
  const attachments: { filename: string; content: Buffer }[] = [
    {
      filename: `CV_${formData.full_name.replace(/\s+/g, '_')}_AISTA.docx`,
      content: cvDocxBuffer,
    },
  ]

  lessonPaths.forEach((lessonPath, idx) => {
    if (fs.existsSync(lessonPath)) {
      attachments.push({
        filename: path.basename(lessonPath),
        content: fs.readFileSync(lessonPath),
      })
    }
  })

  await resend.emails.send({
    from: 'AISTA CV Builder <cv@aista.be>',
    to: formData.email,
    subject: `Ваш CV готовий, ${formData.full_name.split(' ')[0]}! 🎉`,
    html: buildEmailHtml(formData, professionListHtml),
    attachments,
  })
}

// ============================================================
// Email HTML template
// ============================================================
function buildEmailHtml(formData: FormData, professionListHtml: string): string {
  const firstName = formData.full_name.split(' ')[0]
  const regionLabel =
    formData.region === 'flanders'
      ? 'Фландрії'
      : formData.region === 'brussels'
      ? 'Брюсселі'
      : 'Валлонії'

  return `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Calibri', Arial, sans-serif; color: #2D2D2D; max-width: 600px; margin: 0 auto; padding: 24px; }
    .header { background: #1B4F8A; color: white; padding: 24px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p { margin: 4px 0 0; opacity: 0.8; font-size: 14px; }
    .body { background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; }
    .section { background: white; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .section h2 { color: #2E86AB; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 8px; font-size: 14px; line-height: 1.5; }
    a { color: #2E86AB; }
    .tip { background: #EBF8FF; border-left: 3px solid #2E86AB; padding: 12px; border-radius: 0 6px 6px 0; font-size: 13px; }
    .footer { text-align: center; font-size: 11px; color: #9CA3AF; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Ваш CV готовий! 🎉</h1>
    <p>AISTA · Ваш досвід — мовою бельгійського роботодавця</p>
  </div>
  <div class="body">
    <p>Привіт, <strong>${firstName}</strong>!</p>
    <p>Ваш пакет для пошуку роботи в ${regionLabel} готовий. Всі файли — у вкладеннях цього листа.</p>

    <div class="section">
      <h2>📎 Що у вкладеннях</h2>
      <ul>
        <li><strong>CV_${formData.full_name.replace(/\s+/g, '_')}_AISTA.docx</strong> — ваше CV, готове до відправки</li>
        <li><strong>4 уроки нідерландської</strong> — PDF-файли для підготовки до співбесіди</li>
      </ul>
    </div>

    <div class="section">
      <h2>💼 Посади, на які можна подаватися</h2>
      <ul>${professionListHtml}</ul>
    </div>

    <div class="tip">
      <strong>💡 Порада:</strong> Перед відправкою CV перевірте:<br/>
      ✓ Ім'я файлу: "Prізвище_Ім'я_CV.docx"<br/>
      ✓ Відправляйте DOCX (не PDF) — це стандарт у Бельгії<br/>
      ✓ Напишіть короткий мотиваційний лист — шаблон ви знайдете всередині документа
    </div>
  </div>
  <div class="footer">
    AISTA · допомагаємо українкам знайти роботу в Бельгії<br/>
    Питання? Напишіть нам: hello@aista.be
  </div>
</body>
</html>`
}
