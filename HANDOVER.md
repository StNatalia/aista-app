# Передача проекту AISTA — контекст для нового розробника

Цей документ містить весь контекст, прийняті рішення і поточний стан проекту станом на травень 2026.

---

## Продукт одним реченням

CV builder для українок у Бельгії: людина вводить свій досвід українською → AI адаптує під бельгійський ринок → отримує DOCX на email.

Ключовий інсайт: проблема не в мові резюме (люди вже перекладають), а в **точності адаптації рівня посади та стилю опису досвіду**. "Бухгалтер" → не просто "boekhouder", а "Financieel coördinator" або "Administratief medewerker" залежно від рівня і мети.

---

## Аудиторія

**Олена, 34 роки, Гент.** До Бельгії — бухгалтер/педагог/HR. Зараз — cleaning або horeca. Мова A2-B1. Хоче першу нормальну роботу або повернення до професії. Немає часу і грошей на помилки.

Дані: ~47% зареєстрованих у VDAB мають вищу освіту. 99% не мають бельгійського еквіваленту диплому. 50% хто починав працювати — кидали роботу (проблема не в першому найманні, а в утриманні).

---

## Dual-track стратегія (ключове архітектурне рішення)

Кожна профессія має **два маппінги**:
- **Survival track** — куди реально потрапити зараз (cleaning → zorgkundige, бухгалтер → administratief medewerker)
- **Professional track** — куди повернутися з часом (financieel coördinator, verpleegkundige)

Одна анкета → два готових CV → клієнтка обирає яке відправляти.

---

## Стан проекту (травень 2026)

### Готово ✅
- Next.js app з 7-кроковою анкетою
- 4 маппінги Priority 1 (accountant, teacher, office-manager, nurse)
- Claude API інтеграція з детальними промптами
- DOCX генератор (бельгійський формат, синій дизайн)
- Stripe Checkout (тестовий режим)
- Resend email з DOCX + 4 PDF вкладеннями
- GitHub репо: https://github.com/StNatalia/aista-app
- Лендінг: https://stnatalia.github.io/aista-landing/

### НЕ готово ⏳
- Stripe production (чекає реєстрації ЧП — очікується після 9 червня 2026)
- Домен aista.be (не куплений)
- Email відправка від власного домену (зараз @resend.dev)
- Деплой на Vercel (не задеплоєно)
- Stripe webhook secret (потрібен після деплою)
- Маппінги Priority 2 і 3
- Французька версія

---

## Ключові бізнес-рішення

| Рішення | Чому |
|---|---|
| Ціна €9 разово | Низький бар'єр входу. €19/міс і €69/lifetime — наступні тарифи |
| Спочатку заповнити анкету, потім платити | Вища конверсія — клієнт інвестував час |
| DOCX (не PDF) | Стандарт в Бельгії, вимога ATS систем |
| Stripe (не Lemon Squeezy) | Нижча комісія (1.5% vs 5%), після реєстрації ЧП |
| JSON маппінги (не БД) | MVP достатньо, легко редагувати вручну |
| Claude Sonnet (не Haiku) | Якість генерації критична для довіри |

---

## Юридичний контекст власника

- Статус: Tijdelijke Bescherming в Бельгії
- Безробітня з 2 березня 2026 (VDAB / RVA)
- Зустріч Springplank: 9 червня 2026
- Після зустрічі: реєстрація zelfstandige bijberoep
- Ліміт доходу без зменшення пособія: €18.08/день = ~€4,719 за 2026 рік
- Stripe live: активувати тільки після реєстрації ЧП

---

## Структура промптів (lib/claude.ts)

Система промптів побудована на трьох рівнях:
1. **System prompt** — Claude як експерт бельгійського ринку праці
2. **User prompt** — дані анкети + маппінг профессії + приклади трансформацій
3. **Output** — строго JSON: `{cv, motivation_letter, profession_list}`

Критичні правила в промпті:
- Ніколи не вказувати дату народження, фото, сімейний стан (заборонено в Бельгії)
- Bullet points з дієсловами результату: Beheerde, Coördineerde, Realiseerde
- Рівень мови за CEFR
- Відповідь тільки JSON без зайвого тексту

---

## Структура маппінгу (data/mappings/*.json)

```json
{
  "id": "accountant",
  "uk_title": "Бухгалтер / Економіст / Фінансовий аналітик",
  "uk_title_variants": ["бухгалтер", "головний бухгалтер", ...],
  "survival_track": {
    "nl_title": "Administratief medewerker boekhouding",
    "isco_code": "4311",
    "ats_keywords_nl": [...],
    "vdab_categories": [...]
  },
  "professional_track": {
    "nl_title": "Financieel coördinator",
    "isco_code": "2411",
    ...
  },
  "experience_transforms": [
    {
      "uk_pattern": "Відповідала за ведення бухгалтерського обліку",
      "nl_output": "Beheerde de volledige financiële administratie...",
      "fr_output": "Géré la comptabilité complète..."
    }
  ],
  "recognition_info": { "required": false, "body_nl": "IAB", ... }
}
```

---

## Як додати нову профессію

1. Створити `data/mappings/[id].json` за зразком вище
2. Додати імпорт у `lib/mappings.ts`
3. Додати до масиву `ALL_MAPPINGS`

Пріоритети наступних маппінгів:
- engineer (civil/mechanical/electrical)
- doctor-pharmacist
- it-developer
- lawyer

---

## Відомі проблеми / технічний борг

1. **NFT warning** в `email.ts` — використовує `fs.readFileSync` і `path.join(process.cwd(), ...)`. Це warning при білді, не помилка. В Vercel PDF файли потрібно класти в `public/` (вже так є).

2. **Невикористані імпорти** в `docx-generator.ts` — `Table`, `TableRow`, `TableCell`, `WidthType`, `ShadingType` імпортовані але не використовуються. Можна прибрати.

3. **Stripe metadata ліміт** — форма кодується в 5 chunks по 499 символів. Якщо форма стане значно довшою, потрібно переробити на зберігання в БД.

4. **Anthropic API key** в `.env.local` — новий розробник повинен отримати власний ключ у власника або створити новий на console.anthropic.com.

---

## Корисні посилання

- [RVA — bijberoep werkloosheid](https://www.rva.be/burgers/volledige-werkloosheid/mag-u-werken-tijdens-uw-werkloosheid/mag-u-een-bijberoep-uitoefenen-tijdens-uw-volledige-werkloosheid)
- [VDAB vacatures](https://www.vdab.be/vindeenjob)
- [NARIC Vlaanderen](https://www.naricvlaanderen.be)
- [RIZIV verpleegkundigen](https://www.riziv.fgov.be)
- [Stripe test cards](https://stripe.com/docs/testing)
- [Resend docs](https://resend.com/docs)
- [Claude API docs](https://docs.anthropic.com)
