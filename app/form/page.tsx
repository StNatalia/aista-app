'use client'

import { useState } from 'react'
import { FormData, Track, Region, Language, LanguageLevel } from '@/types'
import { PROFESSION_OPTIONS } from '@/lib/mappings'

// ============================================================
// Initial empty form state
// ============================================================
const EMPTY_FORM: FormData = {
  track: 'professional',
  region: 'flanders',
  output_language: 'nl',
  profession_id: '',
  uk_job_title: '',
  current_be_job: '',
  experience_years: 0,
  experience_description: '',
  key_achievements: '',
  education_level: '',
  education_field: '',
  institution: '',
  graduation_year: '',
  diploma_recognized: false,
  dutch_level: '',
  french_level: '',
  english_level: '',
  other_languages: '',
  target_job_title: '',
  target_vacancy_text: '',
  full_name: '',
  email: '',
}

const TOTAL_STEPS = 7

// ============================================================
// MAIN FORM PAGE
// ============================================================
export default function FormPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(field: keyof FormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    window.scrollTo(0, 0)
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo(0, 0)
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: form }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url // Redirect to Stripe Checkout
      } else {
        setError('Помилка при створенні оплати. Спробуйте ще раз.')
      }
    } catch {
      setError('Помилка з\'єднання. Перевірте інтернет і спробуйте ще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">AISTA</h1>
          <p className="text-slate-500 text-sm mt-1">Ваш досвід — мовою бельгійського роботодавця</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Крок {step} з {TOTAL_STEPS}</span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {step === 1 && <Step1 form={form} update={update} />}
          {step === 2 && <Step2 form={form} update={update} />}
          {step === 3 && <Step3 form={form} update={update} />}
          {step === 4 && <Step4 form={form} update={update} />}
          {step === 5 && <Step5 form={form} update={update} />}
          {step === 6 && <Step6 form={form} update={update} />}
          {step === 7 && <Step7 form={form} update={update} />}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={back}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                ← Назад
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                onClick={next}
                disabled={!isStepValid(step, form)}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Далі →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isStepValid(step, form)}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Обробка...' : 'Оплатити €9 та отримати CV →'}
              </button>
            )}
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        {/* Trust indicators */}
        <p className="text-center text-xs text-slate-400 mt-4">
          🔒 Оплата через Stripe · Ваші дані захищені · Повернення коштів протягом 24 годин
        </p>
      </div>
    </main>
  )
}

// ============================================================
// STEP VALIDATION
// ============================================================
function isStepValid(step: number, form: FormData): boolean {
  switch (step) {
    case 1: return !!form.track && !!form.region && !!form.output_language
    case 2: return !!form.profession_id && !!form.uk_job_title
    case 3: return !!form.experience_description && form.experience_years > 0
    case 4: return !!form.education_level && !!form.education_field
    case 5: return true // Languages are optional
    case 6: return true // Target and vacancy text are optional
    case 7: return !!form.full_name && !!form.email && form.email.includes('@')
    default: return true
  }
}

// ============================================================
// STEP COMPONENTS
// ============================================================

type StepProps = { form: FormData; update: (field: keyof FormData, value: unknown) => void }

function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1">{children}</label>
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </select>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  )
}

// --- Step 1: Track + Region + Language ---
function Step1({ form, update }: StepProps) {
  return (
    <>
      <StepTitle title="З чого почнемо?" subtitle="Це допоможе нам підібрати правильний формат CV" />

      <div className="mb-4">
        <Label>Ваша мета прямо зараз</Label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'survival' as Track, label: 'Знайти будь-яку роботу зараз', desc: 'Cleaning, догляд, склад, адмін — будь-що стабільне' },
            { value: 'professional' as Track, label: 'Повернутися до своєї професії', desc: 'Хочу працювати за фахом як в Україні' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('track', opt.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.track === opt.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <p className="font-semibold text-sm text-slate-800">{opt.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Label>Ваш регіон у Бельгії</Label>
        <Select value={form.region} onChange={(v) => update('region', v as Region)}>
          <option value="flanders">Фландрія (Gent, Antwerpen, Brugge...)</option>
          <option value="brussels">Брюссель / Brussels</option>
          <option value="wallonia">Валлонія (Liège, Namur, Charleroi...)</option>
        </Select>
      </div>

      <div>
        <Label>Мова CV</Label>
        <Select value={form.output_language} onChange={(v) => update('output_language', v as Language)}>
          <option value="nl">Нідерландська (Nederlands) — Фландрія</option>
          <option value="fr">Французька (Français) — Валлонія / Брюссель</option>
          <option value="en">Англійська (English) — міжнародні компанії</option>
        </Select>
      </div>
    </>
  )
}

// --- Step 2: Profession ---
function Step2({ form, update }: StepProps) {
  return (
    <>
      <StepTitle
        title="Ваша професія"
        subtitle="Оберіть найближчу до вашої спеціальності"
      />

      <div className="mb-4">
        <Label>Ваша спеціальність</Label>
        <Select value={form.profession_id} onChange={(v) => update('profession_id', v)}>
          <option value="">— оберіть —</option>
          {PROFESSION_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Ваша точна посада в Україні (українською)</Label>
        <Input
          value={form.uk_job_title}
          onChange={(v) => update('uk_job_title', v)}
          placeholder="напр. Головний бухгалтер / Старший методист"
        />
        <p className="text-xs text-slate-400 mt-1">
          Пишіть так, як написано у трудовій книжці або дипломі
        </p>
      </div>

      {form.current_be_job !== undefined && (
        <div className="mt-4">
          <Label>Де зараз працюєте в Бельгії? (необов&apos;язково)</Label>
          <Input
            value={form.current_be_job}
            onChange={(v) => update('current_be_job', v)}
            placeholder="напр. Schoonmaakster bij Sodexo / не працюю"
          />
        </div>
      )}
    </>
  )
}

// --- Step 3: Experience ---
function Step3({ form, update }: StepProps) {
  return (
    <>
      <StepTitle
        title="Ваш досвід"
        subtitle="Розкажіть своїми словами — українською, як вам зручно"
      />

      <div className="mb-4">
        <Label>Скільки років досвіду у вашій професії?</Label>
        <Input
          type="number"
          value={form.experience_years}
          onChange={(v) => update('experience_years', parseInt(v) || 0)}
          placeholder="напр. 8"
        />
      </div>

      <div className="mb-4">
        <Label>Опишіть ваш досвід</Label>
        <Textarea
          value={form.experience_description}
          onChange={(v) => update('experience_description', v)}
          placeholder="Де працювали, що робили, які обов'язки мали. Можна декількома реченнями або списком. Пишіть вільно — ми адаптуємо під бельгійський формат."
          rows={5}
        />
      </div>

      <div>
        <Label>Чим пишаєтесь у своїй роботі? (необов&apos;язково)</Label>
        <Textarea
          value={form.key_achievements}
          onChange={(v) => update('key_achievements', v)}
          placeholder="напр. Скоротила витрати на 15%, провела 200+ уроків, впровадила нову систему обліку..."
          rows={3}
        />
        <p className="text-xs text-slate-400 mt-1">
          Якщо є цифри — чудово. Але можна й без них.
        </p>
      </div>
    </>
  )
}

// --- Step 4: Education ---
function Step4({ form, update }: StepProps) {
  return (
    <>
      <StepTitle title="Освіта" />

      <div className="mb-4">
        <Label>Рівень освіти</Label>
        <Select value={form.education_level} onChange={(v) => update('education_level', v)}>
          <option value="">— оберіть —</option>
          <option value="bachelor">Бакалавр</option>
          <option value="specialist">Спеціаліст (5 років)</option>
          <option value="master">Магістр</option>
          <option value="phd">Кандидат / Доктор наук</option>
          <option value="college">Молодший спеціаліст / технікум</option>
        </Select>
      </div>

      <div className="mb-4">
        <Label>Спеціальність / напрям</Label>
        <Input
          value={form.education_field}
          onChange={(v) => update('education_field', v)}
          placeholder="напр. Бухгалтерський облік та аудит"
        />
      </div>

      <div className="mb-4">
        <Label>Навчальний заклад</Label>
        <Input
          value={form.institution}
          onChange={(v) => update('institution', v)}
          placeholder="напр. Київський національний університет ім. Шевченка"
        />
      </div>

      <div className="mb-4">
        <Label>Рік закінчення</Label>
        <Input
          value={form.graduation_year}
          onChange={(v) => update('graduation_year', v)}
          placeholder="напр. 2012"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.diploma_recognized}
            onChange={(e) => update('diploma_recognized', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600"
          />
          <span className="text-sm text-slate-700">
            Мій диплом вже визнано в Бельгії (NARIC)
          </span>
        </label>
      </div>
    </>
  )
}

// --- Step 5: Languages ---
function Step5({ form, update }: StepProps) {
  const [showGuide, setShowGuide] = useState(false)

  const levels: { value: LanguageLevel | ''; label: string }[] = [
    { value: '', label: '— не говорю' },
    { value: 'A1', label: 'A1 — розумію кілька слів' },
    { value: 'A2', label: 'A2 — базовий рівень' },
    { value: 'B1', label: 'B1 — можу спілкуватися' },
    { value: 'B2', label: 'B2 — впевнено спілкуюся' },
    { value: 'C1', label: 'C1 — майже як носій' },
    { value: 'C2', label: 'C2 — рідна мова або рівень носія' },
  ]

  return (
    <>
      <StepTitle
        title="Мови"
        subtitle="Чесно — роботодавці все одно перевірять на співбесіді"
      />

      {/* CEFR guide toggle */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="text-xs text-blue-600 underline underline-offset-2"
        >
          {showGuide ? '▲ Сховати' : '▼ Як визначити свій рівень?'}
        </button>
        {showGuide && (
          <div className="mt-2 bg-blue-50 rounded-xl p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-600 mb-2">Шкала CEFR (міжнародний стандарт):</p>
            <p><span className="font-medium">A1</span> — розумію окремі слова, можу представитися</p>
            <p><span className="font-medium">A2</span> — розумію прості речення, базове спілкування</p>
            <p><span className="font-medium">B1</span> — можу спілкуватися на знайомі теми, розумію повільну мову</p>
            <p><span className="font-medium">B2</span> — впевнено спілкуюся, розумію більшість текстів</p>
            <p><span className="font-medium">C1</span> — вільно висловлююся, майже як носій</p>
            <p><span className="font-medium text-blue-700">C2</span> — <span className="text-blue-700">рідна мова або повне володіння (наприклад: українська, російська)</span></p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label>Нідерландська (Nederlands)</Label>
          <Select value={form.dutch_level} onChange={(v) => update('dutch_level', v as LanguageLevel | '')}>
            {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Французька (Français)</Label>
          <Select value={form.french_level} onChange={(v) => update('french_level', v as LanguageLevel | '')}>
            {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Англійська (English)</Label>
          <Select value={form.english_level} onChange={(v) => update('english_level', v as LanguageLevel | '')}>
            {levels.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </Select>
        </div>

        <div>
          <Label>Інші мови (необов&apos;язково)</Label>
          <Input
            value={form.other_languages}
            onChange={(v) => update('other_languages', v)}
            placeholder="напр. Українська C2, Російська C2, Польська B1"
          />
          <p className="text-xs text-slate-400 mt-1">
            Рідна мова = C2. Вкажіть українську та інші мови, якими володієте
          </p>
        </div>
      </div>
    </>
  )
}

// --- Step 6: Target ---
function Step6({ form, update }: StepProps) {
  return (
    <>
      <StepTitle
        title="Ваша ціль"
        subtitle="Допоможе зробити CV ще точнішим"
      />

      <div className="mb-4">
        <Label>На яку посаду хочете потрапити? (необов&apos;язково)</Label>
        <Input
          value={form.target_job_title}
          onChange={(v) => update('target_job_title', v)}
          placeholder="напр. Boekhouder, HR-medewerker, Verpleegkundige"
        />
        <p className="text-xs text-slate-400 mt-1">
          Якщо не знаєте — ми підберемо самі на основі вашого досвіду
        </p>
      </div>

      <div>
        <Label>Текст вакансії (необов&apos;язково, але дуже корисно)</Label>
        <Textarea
          value={form.target_vacancy_text}
          onChange={(v) => update('target_vacancy_text', v)}
          placeholder="Вставте текст конкретної вакансії з VDAB або іншого сайту — і ми адаптуємо CV саме під неї"
          rows={6}
        />
        <p className="text-xs text-slate-400 mt-1">
          Якщо є конкретна вакансія — ATS-ключові слова з неї будуть вбудовані у ваш CV
        </p>
      </div>
    </>
  )
}

// --- Step 7: Contact + Payment ---
function Step7({ form, update }: StepProps) {
  return (
    <>
      <StepTitle
        title="Останній крок"
        subtitle="Куди надіслати готові документи"
      />

      <div className="mb-4">
        <Label>Ваше ім&apos;я та прізвище</Label>
        <Input
          value={form.full_name}
          onChange={(v) => update('full_name', v)}
          placeholder="напр. Olena Kovalenko"
        />
        <p className="text-xs text-slate-400 mt-1">
          Латинськими літерами, як у посвідці на проживання або закордонному паспорті — саме так ваше ім&apos;я буде у CV
        </p>
      </div>

      <div className="mb-6">
        <Label>Email адреса</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
          placeholder="ваш@email.com"
        />
        <p className="text-xs text-slate-400 mt-1">
          На цю адресу прийде лист з CV та матеріалами
        </p>
      </div>

      {/* Price summary */}
      <div className="bg-slate-50 rounded-xl p-4 mb-2">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-slate-700">Ваш пакет</span>
          <span className="text-2xl font-bold text-blue-600">€9</span>
        </div>
        <ul className="space-y-1.5 text-sm text-slate-600">
          {[
            '✓ CV на нідерландській / французькій',
            '✓ Мотиваційний лист',
            '✓ Список посад для пошуку',
            '✓ 4 уроки нідерландської для співбесіди',
          ].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Оплата через Stripe · Bancontact, Visa, Mastercard · Повернення коштів протягом 24 годин з моменту звернення
      </p>
    </>
  )
}
