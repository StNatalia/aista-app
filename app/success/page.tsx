export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-sage-light/50 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-sage/20">
          <svg className="w-10 h-10 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-3 leading-tight">
          Ваш CV вже в дорозі
        </h1>

        <p className="text-ink-soft mb-8 leading-relaxed">
          Лист з документами прийде на пошту протягом 5–10 хвилин.
          Перевірте папку <strong>«Вхідні»</strong> та <strong>«Спам»</strong>.
        </p>

        {/* What's in the package */}
        <div className="bg-white rounded-3xl border border-ink/5 card-shadow p-6 text-left mb-5">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
            Що у листі
          </p>
          <ul className="space-y-3">
            {[
              '📄 CV у форматі DOCX (готове до відправки)',
              '✉️ Мотиваційний лист (шаблон всередині CV)',
              '💼 Список посад для пошуку',
              '📚 4 уроки нідерландської для співбесіди',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink-soft leading-relaxed">
                <span className="shrink-0 text-base">{item.slice(0, 2)}</span>
                <span>{item.slice(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next step tip */}
        <div className="bg-sage-light/30 rounded-3xl p-5 text-left text-sm text-ink-soft leading-relaxed">
          <strong className="text-forest">💡 Що робити далі:</strong> Відкрий DOCX, перегляньте — і адаптуй
          мотиваційний лист під конкретну вакансію. Відправляй файл як є, не конвертуй
          у PDF — у Бельгії стандарт DOCX.
        </div>

        <p className="mt-8 text-xs text-muted">
          Питання? <a className="underline underline-offset-2" href="mailto:hello@aista.be">hello@aista.be</a>
        </p>
      </div>
    </main>
  )
}
