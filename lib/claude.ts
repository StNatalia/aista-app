import Anthropic from '@anthropic-ai/sdk'
import { FormData, ProfessionMapping, GeneratedCV, GeneratedMotivationLetter, GeneratedProfessionList } from '@/types'

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')
  return new Anthropic({ apiKey })
}

function stripJson(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?```\s*$/i, '')
    .trim()
}

// ============================================================
// SYSTEM PROMPTS
// ============================================================
const CV_SYSTEM_PROMPT = `Ти — експерт із бельгійського ринку праці та написання CV для Фламандського, Брюссельського та Валлонського ринків. Ти спеціалізуєшся на допомозі українським біженцям у Бельгії адаптувати свій досвід під місцеві стандарти.

Твої ключові знання:
- Бельгійський формат CV: орієнтований на РЕЗУЛЬТАТИ (не обов'язки), лаконічний, 1-2 сторінки
- Відмінність: українці описують "що робили", бельгійці — "чого досягли + в цифрах"
- ATS-системи у Бельгії: Victor (VDAB), Talent.brussels, і приватні
- BAREMA-системи оплати: PC200, PC300, PC330, тощо
- NARIC, RIZIV, IAB — процедури визнання дипломів
- Регіональні відмінності: Фландрія (NL), Брюссель (NL+FR), Валлонія (FR)

ВАЖЛИВО:
- Ніколи не вказуй: дата народження, фото, сімейний стан (заборонено в Бельгії)
- Завжди використовуй bullet points з дієсловами результату: "Beheerde", "Coördineerde", "Realiseerde", "Implementeerde", "Reduceerde"
- Рівень мови вказуй за CEFR (A1-C2)
- Відповідь ЗАВЖДИ у форматі JSON — ніякого іншого тексту навколо JSON

Ти пишеш CV на мові, яку вказує користувач (nl/fr/en).`

const LETTER_SYSTEM_PROMPT = `Ти — експерт із написання мотиваційних листів для бельгійського ринку праці. Пишеш короткі, конкретні, щирі листи для українських кандидатів. Відповідь ЗАВЖДИ у форматі JSON — ніякого іншого тексту навколо JSON.`

// ============================================================
// CALL 1 (Sonnet): CV + profession list
// ============================================================
export async function generateCVAndProfessions(
  formData: FormData,
  mapping: ProfessionMapping
): Promise<{ cv: GeneratedCV; professionList: GeneratedProfessionList }> {
  const track = formData.track === 'survival' ? mapping.survival_track : mapping.professional_track
  const lang = formData.output_language

  const exampleTransforms = mapping.experience_transforms
    .slice(0, 3)
    .map(
      (t) =>
        `  - Українська: "${t.uk_pattern}"\n    ${lang === 'nl' ? 'NL' : lang === 'fr' ? 'FR' : 'EN'}: "${lang === 'nl' ? t.nl_output : t.fr_output}"`
    )
    .join('\n')

  const userPrompt = `Створи CV та список посад для пошуку роботи в Бельгії.

## ДАНІ КОРИСТУВАЧА

**Ім'я:** ${formData.full_name}
**Email:** ${formData.email}
**Регіон Бельгії:** ${formData.region}
**Мова виводу:** ${lang === 'nl' ? 'нідерландська' : lang === 'fr' ? 'французька' : 'англійська'}
**Трек:** ${formData.track === 'survival' ? 'Пошук роботи зараз (survival)' : 'Повернення до професії (professional)'}

**Посада в Україні:** ${formData.uk_job_title}
**Поточна робота в Бельгії:** ${formData.current_be_job || 'не працює / не вказано'}
**Бажана посада в Бельгії:** ${formData.target_job_title || track.nl_title}
**Досвід роботи:** ${formData.experience_years} років

**Опис досвіду (власними словами):**
${formData.experience_description}

**Досягнення, якими пишається:**
${formData.key_achievements || 'не вказано'}

**Освіта:** ${formData.education_level}, ${formData.education_field}, ${formData.institution} (${formData.graduation_year})
**Диплом визнано:** ${formData.diploma_recognized ? 'так' : 'ні / в процесі'}

**Мови:**
- Нідерландська: ${formData.dutch_level || 'не вказано'}
- Французька: ${formData.french_level || 'не вказано'}
- Англійська: ${formData.english_level || 'не вказано'}
${formData.other_languages ? `- Інші: ${formData.other_languages}` : ''}

${formData.target_vacancy_text ? `**Текст вакансії (адаптуй CV під неї):**\n${formData.target_vacancy_text}` : ''}

## МАППІНГ ПОСАДИ

**Бельгійська назва посади (${formData.track} track):** ${track.nl_title}
**ISCO код:** ${track.isco_code}
**ATS-ключові слова:** ${lang === 'nl' ? track.ats_keywords_nl.join(', ') : track.ats_keywords_fr.join(', ')}

**Приклади трансформації досвіду для цієї професії:**
${exampleTransforms}

## ЗАВДАННЯ

Поверни JSON з двома розділами:

\`\`\`json
{
  "cv": {
    "candidate_name": "...",
    "target_title": "...",
    "location": "...",
    "email": "...",
    "profile_summary": "2-3 речення: хто є + ключові компетенції + що пропонує бельгійському роботодавцю. Мова: ${lang}",
    "experience": [
      {
        "job_title_be": "назва посади бельгійською/міжнародною мовою",
        "employer": "назва організації",
        "period": "20XX – 20XX",
        "location": "Місто, Україна",
        "bullets": [
          "Дієслово результату + що зробила + вимірюваний результат (якщо є)",
          "...",
          "..."
        ]
      }
    ],
    "education": [
      {
        "degree_be": "як правильно назвати диплом для бельгійського контексту",
        "institution": "...",
        "field": "...",
        "year": "...",
        "recognition_note": "якщо диплом не визнано: 'Erkenningsprocedure opgestart bij NARIC Vlaanderen' або null"
      }
    ],
    "technical_skills": ["навик 1", "навик 2"],
    "soft_skills": ["навик 1", "навик 2"],
    "languages": [
      {"language": "...", "level": "...", "cefr": "B1"}
    ],
    "ats_keywords_used": ["ключові слова що використані в тексті"]
  },
  "profession_list": {
    "items": [
      {
        "nl_title": "назва посади NL",
        "fr_title": "назва посади FR",
        "vdab_url": "https://www.vdab.be/vindeenjob?q=[назва+посади]",
        "match_reason": "Чому ця посада підходить цій людині (1 речення)",
        "level": "survival | professional | stretch"
      }
    ]
  }
}
\`\`\`

ВАЖЛИВО:
- Лише JSON, без будь-якого тексту до або після
- Мінімум 3 записи в experience
- Мінімум 5 посад у profession_list (2 survival, 2 professional, 1 stretch)
- Всі тексти CV — мовою ${lang}`

  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 3500,
    system: CV_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(stripJson(rawText))

  return {
    cv: parsed.cv,
    professionList: parsed.profession_list,
  }
}

// ============================================================
// CALL 2 (Haiku): motivation letter — fast, independent
// ============================================================
export async function generateMotivationLetter(
  formData: FormData,
  mapping: ProfessionMapping
): Promise<GeneratedMotivationLetter> {
  const track = formData.track === 'survival' ? mapping.survival_track : mapping.professional_track
  const lang = formData.output_language
  const langLabel = lang === 'nl' ? 'нідерландська' : lang === 'fr' ? 'французька' : 'англійська'
  const targetTitle = formData.target_job_title || track.nl_title

  const userPrompt = `Напиши мотиваційний лист для бельгійського роботодавця.

Кандидат: ${formData.full_name}
Посада: ${targetTitle}
Досвід: ${formData.experience_years} років (${formData.uk_job_title})
Ключові досягнення: ${formData.key_achievements || formData.experience_description.slice(0, 200)}
Мова листа: ${langLabel}
Регіон: ${formData.region}

Поверни JSON:
\`\`\`json
{
  "motivation_letter": {
    "opening": "Перший абзац: звернення + чому ця посада/галузь (2-3 речення)",
    "why_this_role": "Другий абзац: що приваблює в бельгійському ринку праці, зв'язок з досвідом (2-3 речення)",
    "what_i_bring": "Третій абзац: 2-3 конкретних цінності що принесе роботодавцю (з прикладами з досвіду)",
    "closing": "Заключний абзац: заклик до дії, подяка (1-2 речення)"
  }
}
\`\`\`

Лист мовою: ${langLabel}. Тон — щирий і конкретний. Без кліше.`

  const message = await getClient().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: LETTER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
  const parsed = JSON.parse(stripJson(rawText))

  return parsed.motivation_letter
}

// ============================================================
// LEGACY: kept for backward compatibility if needed
// ============================================================
export async function generateCVPackage(
  formData: FormData,
  mapping: ProfessionMapping
): Promise<{
  cv: GeneratedCV
  motivationLetter: GeneratedMotivationLetter
  professionList: GeneratedProfessionList
}> {
  const [{ cv, professionList }, motivationLetter] = await Promise.all([
    generateCVAndProfessions(formData, mapping),
    generateMotivationLetter(formData, mapping),
  ])
  return { cv, motivationLetter, professionList }
}
