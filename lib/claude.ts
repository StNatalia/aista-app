import Anthropic from '@anthropic-ai/sdk'
import { FormData, ProfessionMapping, GeneratedCV, GeneratedMotivationLetter, GeneratedProfessionList } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ============================================================
// SYSTEM PROMPT — sets up Claude as a Belgian CV expert
// ============================================================
const SYSTEM_PROMPT = `Ти — експерт із бельгійського ринку праці та написання CV для Фламандського, Брюссельського та Валлонського ринків. Ти спеціалізуєшся на допомозі українським біженцям у Бельгії адаптувати свій досвід під місцеві стандарти.

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

Ти пишеш CV та мотиваційний лист на мові, яку вказує користувач (nl/fr/en).`

// ============================================================
// MAIN GENERATION FUNCTION
// ============================================================
export async function generateCVPackage(
  formData: FormData,
  mapping: ProfessionMapping
): Promise<{
  cv: GeneratedCV
  motivationLetter: GeneratedMotivationLetter
  professionList: GeneratedProfessionList
}> {
  const track = formData.track === 'survival' ? mapping.survival_track : mapping.professional_track
  const lang = formData.output_language

  const userPrompt = buildUserPrompt(formData, mapping, lang)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  // Parse the JSON response
  const parsed = JSON.parse(responseText)

  return {
    cv: parsed.cv,
    motivationLetter: parsed.motivation_letter,
    professionList: parsed.profession_list,
  }
}

// ============================================================
// BUILD THE USER PROMPT
// ============================================================
function buildUserPrompt(
  form: FormData,
  mapping: ProfessionMapping,
  lang: string
): string {
  const track = form.track === 'survival' ? mapping.survival_track : mapping.professional_track

  // Prepare experience transform examples for this profession
  const exampleTransforms = mapping.experience_transforms
    .slice(0, 3)
    .map(
      (t) =>
        `  - Українська: "${t.uk_pattern}"\n    ${lang === 'nl' ? 'NL' : lang === 'fr' ? 'FR' : 'EN'}: "${lang === 'nl' ? t.nl_output : t.fr_output}"`
    )
    .join('\n')

  return `Створи повний пакет документів для пошуку роботи в Бельгії.

## ДАНІ КОРИСТУВАЧА

**Ім'я:** ${form.full_name}
**Email:** ${form.email}
**Регіон Бельгії:** ${form.region}
**Мова виводу:** ${lang === 'nl' ? 'нідерландська' : lang === 'fr' ? 'французька' : 'англійська'}
**Трек:** ${form.track === 'survival' ? 'Пошук роботи зараз (survival)' : 'Повернення до професії (professional)'}

**Посада в Україні:** ${form.uk_job_title}
**Поточна робота в Бельгії:** ${form.current_be_job || 'не працює / не вказано'}
**Бажана посада в Бельгії:** ${form.target_job_title || track.nl_title}
**Досвід роботи:** ${form.experience_years} років

**Опис досвіду (власними словами):**
${form.experience_description}

**Досягнення, якими пишається:**
${form.key_achievements || 'не вказано'}

**Освіта:** ${form.education_level}, ${form.education_field}, ${form.institution} (${form.graduation_year})
**Диплом визнано:** ${form.diploma_recognized ? 'так' : 'ні / в процесі'}

**Мови:**
- Нідерландська: ${form.dutch_level || 'не вказано'}
- Французька: ${form.french_level || 'не вказано'}
- Англійська: ${form.english_level || 'не вказано'}
${form.other_languages ? `- Інші: ${form.other_languages}` : ''}

${form.target_vacancy_text ? `**Текст вакансії (адаптуй CV під неї):**\n${form.target_vacancy_text}` : ''}

## МАППІНГ ПОСАДИ

**Бельгійська назва посади (${form.track} track):** ${track.nl_title}
**ISCO код:** ${track.isco_code}
**ATS-ключові слова:** ${lang === 'nl' ? track.ats_keywords_nl.join(', ') : track.ats_keywords_fr.join(', ')}

**Приклади трансформації досвіду для цієї професії:**
${exampleTransforms}

## ЗАВДАННЯ

Поверни JSON з трьома розділами:

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
      {"language": "...", "level": "...", "cefr": "B1"},
      ...
    ],
    "ats_keywords_used": ["ключові слова що використані в тексті"]
  },
  "motivation_letter": {
    "opening": "Перший абзац: звернення + чому ця компанія/посада",
    "why_this_role": "Другий абзац: що приваблює в посаді, зв'язок з досвідом",
    "what_i_bring": "Третій абзац: 2-3 конкретних цінності що принесе",
    "closing": "Заключний абзац: заклик до дії"
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
- Мінімум 3 записи в experience (якщо досвіду мало — розшир опис наявного)
- Мінімум 5 посад у profession_list (2 survival, 2 professional, 1 stretch)
- Всі тексти CV та листа — мовою ${lang}, КРІМ назв посад в Україні (їх залишай як є або дай переклад у дужках)
- Profile summary — конкретний, без кліше типу "hard-working professional"`
}
