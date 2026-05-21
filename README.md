# AISTA — CV Builder для українок у Бельгії

> "Твій досвід — мовою бельгійського роботодавця"

Онлайн-сервіс, який допомагає українкам у Бельгії перетворити свій досвід в бельгійське CV, зрозуміле роботодавцям.

**Лендінг:** https://stnatalia.github.io/aista-landing/
**App (цей репо):** https://github.com/StNatalia/aista-app

---

## Що це за продукт

Клієнтка заповнює 7-крокову анкету → оплачує €9 → отримує на email:
- CV на нідерландській (або французькій/англійській) у форматі DOCX
- Мотиваційний лист
- Список посад для пошуку
- 4 PDF-уроки нідерландської для співбесіди

Ключова фіча: **переклад українських посад у бельгійський еквівалент** — не просто мовний переклад, а точна адаптація рівня посади і стилю опису досвіду.

---

## Стек

| Компонент | Технологія |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Стилі | Tailwind CSS |
| AI генерація | Claude API (claude-sonnet-4-5) |
| DOCX | `docx` npm package |
| Оплата | Stripe Checkout |
| Email | Resend |
| Хостинг | Vercel |
| База маппінгів | JSON файли (data/mappings/) |

---

## Структура проекту

```
aista-app/
├── app/
│   ├── form/page.tsx          # 7-крокова анкета (головна сторінка продукту)
│   ├── success/page.tsx       # Сторінка після оплати
│   └── api/
│       ├── checkout/route.ts  # Створення Stripe Checkout сесії
│       ├── generate/route.ts  # Генерація CV через Claude API
│       └── webhook/route.ts   # Stripe webhook → тригер генерації
├── lib/
│   ├── claude.ts              # Промпти та виклик Claude API
│   ├── docx-generator.ts      # Генерація DOCX документу
│   ├── email.ts               # Відправка email через Resend
│   └── mappings.ts            # Завантаження даних маппінгів
├── data/mappings/             # JSON файли з маппінгами професій
│   ├── accountant.json        # Бухгалтер / економіст / фінаналітик
│   ├── teacher.json           # Вчитель / педагог / методист
│   ├── office-manager.json    # Офіс-менеджер / HR / адміністратор
│   └── nurse.json             # Медсестра / лікар
├── types/index.ts             # TypeScript типи
└── public/lessons/            # 4 PDF уроки нідерландської
```

---

## Швидкий старт

### 1. Клонувати та встановити

```bash
git clone https://github.com/StNatalia/aista-app.git
cd aista-app
npm install
```

### 2. Змінні середовища

Створи `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. PDF уроки

Поклади 4 файли в `public/lessons/`:
```
les-01-vacatures-lezen.pdf
les-02-cv-schrijven.pdf
les-03-sollicitatiebrief.pdf
les-04-woordenlijst.pdf
```

### 4. Запуск

```bash
npm run dev
# http://localhost:3000/form
```

---

## API ключі

| Сервіс | Де взяти | Вартість |
|---|---|---|
| Anthropic | console.anthropic.com | ~€0.025 за 1 CV |
| Stripe | stripe.com → Developers → API keys | 1.5% + €0.25 / транзакція |
| Resend | resend.com | Безкоштовно до 3000 листів/міс |

---

## Stripe webhook (локально)

```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Скопіюй `whsec_...` з консолі в `.env.local`.

---

## Дані маппінгів

Кожен JSON у `data/mappings/` містить:
- `uk_title_variants` — варіанти назви посади українською
- `survival_track` — бельгійський еквівалент для швидкого пошуку роботи
- `professional_track` — бельгійський еквівалент для повернення до професії
- `experience_transforms` — приклади трансформації опису досвіду
- `ats_keywords_nl/fr` — ключові слова для ATS
- `recognition_info` — NARIC, RIZIV та інші процедури визнання

**Готово (Priority 1):** accountant, teacher, office-manager, nurse

**TODO (Priority 2):** engineer, doctor-pharmacist, it-developer

**TODO (Priority 3):** lawyer, psychologist, architect, logistics

---

## Деплой на Vercel

```bash
npm i -g vercel
vercel
```

Після деплою:
1. Оновити `NEXT_PUBLIC_BASE_URL` на реальний URL
2. Налаштувати Stripe webhook на production endpoint
3. Верифікувати домен у Resend

---

## TODO

- [ ] Додати маппінги Priority 2 (engineer, doctor, IT)
- [ ] Підключити Stripe production (після реєстрації ЧП)
- [ ] Купити домен aista.be і верифікувати в Resend
- [ ] Французька версія CV
- [ ] Сторінка /admin для перегляду замовлень
- [ ] Мотиваційний лист як окремий DOCX файл

---

## Контакти

Власник: Nataliia Stasiuk · nataliia.stasiuk.be@gmail.com · @StNatalia
