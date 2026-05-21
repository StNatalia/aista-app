# Supabase — налаштування для AISTA

> Час на все: **~10 хвилин.** Безкоштовно.

Supabase зберігає **усі заявки** (форму, статус оплати, дату генерації CV) і дозволяє переглядати їх через `/admin`. Замість хака з нарізкою форми на 5 шматків у Stripe metadata, в Stripe тепер летить тільки UUID замовлення — все інше живе у БД.

---

## 1. Створи проект Supabase

1. Зайди на **https://supabase.com** → `Start your project` → увійди через GitHub
2. `New project`:
   - **Name:** `aista`
   - **Database Password:** натисни `Generate` → **збережи в 1Password або будь-який менеджер паролів**
   - **Region:** `West EU (Ireland)` — найближче до Бельгії
   - **Plan:** Free
3. Зачекай ~2 хв поки проект створиться.

---

## 2. Запусти SQL-міграцію

1. У боковому меню → **SQL Editor** → `New query`
2. Відкрий файл `supabase/migrations/0001_orders.sql` у репозиторії, скопіюй увесь вміст
3. Встав у SQL Editor → `Run` (правий-нижній кут)
4. Має з&apos;явитися `Success. No rows returned`

Перевір що таблиці створились:
```sql
select * from orders limit 5;
select * from leads limit 5;
```

---

## 3. Візьми ключі

У боковому меню → **Settings** (шестерня внизу) → **API**:

| Що скопіювати | Куди вставити в `.env.local` |
|---|---|
| `Project URL` (зверху) | `NEXT_PUBLIC_SUPABASE_URL` |
| `service_role` ключ (під `Project API keys`, треба натиснути око 👁️) | `SUPABASE_SERVICE_ROLE_KEY` |

⚠️ **`service_role` ключ — секретний.** Він обходить усі RLS-політики. Ніколи не клади його у клієнтський код, у git, у Telegram. Тільки `.env.local` (вже у `.gitignore`).

---

## 4. Налаштуй `.env.local`

Скопіюй `.env.example` → `.env.local` і заповни:

```env
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

ADMIN_PASSWORD=якийсь-довгий-пароль-сюди
```

---

## 5. Перевір локально

```bash
npm run dev
```

Перейди на `http://localhost:3000/admin?key=твій-ADMIN_PASSWORD` — побачиш порожню табличку зі статусами.

Заповни форму на `/form`, доклацай до кроку 7, натисни «Оплатити €9». Перевір:
- У Supabase **Table Editor → orders** з&apos;явиться рядок зі статусом `pending`
- Після успішної оплати (Stripe test card `4242 4242 4242 4242`) — статус піде через `paid → generating → completed`
- На `/admin` все це видно

---

## 6. Деплой на Vercel

Скопіюй ті самі змінні у **Vercel → Project → Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- (+ усі попередні Stripe / Resend / Anthropic)

Не забудь оновити `NEXT_PUBLIC_BASE_URL` на реальний домен.

---

## Що ти отримав

- **Усі замовлення в БД** — навіть якщо людина не доплатила, лід у тебе
- **`/admin?key=...`** — KPI-плитки + таблиця останніх 100 замовлень з фільтром по статусу
- **`order_funnel` view** — аналітика по днях (`select * from order_funnel`)
- **Готовий фундамент** для:
  - auth клієнтів («мої CV»)
  - storage для DOCX-файлів
  - email-нагадування про незавершені форми

---

## Питання-відповіді

**А якщо в безкоштовному тарифі закінчиться місце?**
500 MB вистачить на ~1 млн рядків `orders`. До цього часу ти вже на платному.

**Куди ходити дивитись заявки кожен день?**
`https://aista.be/admin?key=...` — додай у закладки.

**Як експортувати в Excel?**
Supabase → Table Editor → orders → правий-верхній → `Export to CSV`.

**Як «відправити CV ще раз» якщо клієнт втратив лист?**
Поки що — вручну: знайди order в admin, скопіюй `email` і `form_data` → виконай POST на `/api/generate`. У наступну ітерацію додамо кнопку.
