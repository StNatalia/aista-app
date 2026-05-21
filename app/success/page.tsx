export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Ваш CV вже в дорозі! 🎉
        </h1>

        <p className="text-slate-600 mb-6">
          Ми надішлемо вам лист з усіма документами протягом кількох хвилин.
          Перевірте папку <strong>«Вхідні»</strong> та <strong>«Спам»</strong>.
        </p>

        {/* What's in the package */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 text-left mb-6">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Що у листі
          </p>
          <ul className="space-y-2">
            {[
              '📄 CV у форматі DOCX (готове до відправки)',
              '✉️ Мотиваційний лист (шаблон всередині CV)',
              '💼 Список посад для пошуку',
              '📚 4 уроки нідерландської для співбесіди',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="shrink-0">{item.slice(0, 2)}</span>
                <span>{item.slice(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next step tip */}
        <div className="bg-blue-50 rounded-xl p-4 text-left text-sm text-blue-800">
          <strong>💡 Що робити далі:</strong> Відкрийте DOCX, перегляньте — і адаптуйте
          мотиваційний лист під конкретну вакансію. Відправляйте файл як є, не конвертуйте
          в PDF — у Бельгії стандарт DOCX.
        </div>

        <p className="mt-6 text-xs text-slate-400">
          Питання? hello@aista.be
        </p>
      </div>
    </main>
  )
}
