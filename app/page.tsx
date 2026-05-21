import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  Mail,
  CheckCircle2,
  Star,
  Lock,
  Clock,
  Globe2,
} from "lucide-react";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  Float,
  HoverLift,
} from "./_components/motion";

const CTA_HREF = "/form";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProofBar />
        <Problem />
        <HowItWorks />
        <Bundle />
        <Testimonials />
        <Why />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}

/* ──────────────────────────────────────────────── HEADER */
function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-ink/5">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-5 sm:px-8 h-16">
        <Link href="/" className="flex items-center gap-2">
          <LogoMark />
          <span className="font-display text-xl tracking-tight">AISTA</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-soft">
          <a href="#how" className="hover:text-ink transition">Як працює</a>
          <a href="#bundle" className="hover:text-ink transition">Що отримаєш</a>
          <a href="#stories" className="hover:text-ink transition">Історії</a>
          <a href="#faq" className="hover:text-ink transition">FAQ</a>
        </nav>
        <Link
          href={CTA_HREF}
          className="btn-press hidden sm:inline-flex items-center gap-2 rounded-full bg-forest text-cream px-4 py-2 text-sm font-medium hover:bg-sage-dark"
        >
          Створити CV
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span className="grid place-items-center size-8 rounded-full bg-forest text-cream font-display text-base">
      A
    </span>
  );
}

/* ──────────────────────────────────────────────── HERO */
function Hero() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-light/60 text-sage-dark px-3 py-1.5 text-xs font-medium mb-6 ring-1 ring-sage/20">
            <Sparkles className="size-3.5" /> Для українок у Бельгії
          </div>

          <h1 className="font-display text-[2.4rem] sm:text-5xl lg:text-[3.6rem] leading-[1.05] tracking-tight text-ink">
            Твоє резюме —{" "}
            <span className="text-sage-dark italic">мовою бельгійського</span>{" "}
            роботодавця
          </h1>

          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            AI адаптує твій український досвід під ATS-фільтри Бельгії. CV
            нідерландською або французькою, мотиваційний лист і список
            вакансій — на email за 15 хвилин.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={CTA_HREF}
              className="btn-press group inline-flex items-center justify-center gap-2 rounded-full bg-forest text-cream px-6 py-4 text-base font-semibold hover:bg-sage-dark shadow-lg shadow-forest/15"
            >
              Створити моє CV за €9
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="inline-flex items-center gap-2 text-sm text-muted">
              <ShieldCheck className="size-4 text-sage" />
              Повернення коштів протягом 24 годин
            </span>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Stat n="15хв" l="готове CV" />
            <Stat n="ATS" l="ключові слова" />
            <Stat n="€9" l="без підписки" />
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="relative">
            <Float>
              <div className="relative rounded-3xl overflow-hidden ring-1 ring-ink/10 card-shadow bg-white">
                <Image
                  src="/images/hero.jpg"
                  alt="Українка з готовим CV нідерландською у Генті"
                  width={1800}
                  height={1005}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>
            </Float>

            <FloatingCard
              className="-left-3 sm:-left-6 top-6"
              icon={<CheckCircle2 className="size-4 text-sage-dark" />}
              text="Erkenning aangevraagd"
            />
            <FloatingCard
              className="-right-3 sm:-right-6 bottom-8"
              icon={<Star className="size-4 fill-clay text-clay" />}
              text="4.9 · 312 відгуків"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-ink">{n}</div>
      <div className="text-xs text-muted mt-0.5">{l}</div>
    </div>
  );
}

function FloatingCard({
  className = "",
  icon,
  text,
}: {
  className?: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div
      className={`absolute hidden sm:flex items-center gap-2 bg-white card-shadow rounded-2xl py-2.5 px-3.5 ring-1 ring-ink/5 ${className}`}
    >
      {icon}
      <span className="text-sm font-medium text-ink-soft">{text}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────── SOCIAL PROOF BAR */
function SocialProofBar() {
  return (
    <section className="border-y border-ink/5 bg-cream-2/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 text-center sm:text-left">
        <ProofItem big="47%" small="українок у VDAB з вищою освітою" />
        <ProofItem big="99%" small="не проходять ATS-фільтри без адаптації" />
        <ProofItem big="DOCX" small="стандарт бельгійського ринку" />
        <ProofItem big="NL / FR / EN" small="три мови на вибір" />
      </div>
    </section>
  );
}

function ProofItem({ big, small }: { big: string; small: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <div className="font-display text-2xl text-forest">{big}</div>
      <div className="text-xs text-muted mt-0.5 leading-snug">{small}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────── PROBLEM */
function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <FadeIn>
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Чому твоє CV ігнорують
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            Це не про твій досвід.{" "}
            <span className="text-clay italic">Це про переклад.</span>
          </h2>
          <p className="mt-5 text-ink-soft text-lg leading-relaxed">
            «Бухгалтер» у словнику — «boekhouder». Але це — посада для
            випускника без досвіду. Твої 8 років насправді — Financieel
            coördinator. Різниця між мовним перекладом і ринковою адаптацією —
            це різниця між тишею і запрошенням на співбесіду.
          </p>
        </div>
      </FadeIn>

      <StaggerChildren className="mt-12 grid sm:grid-cols-3 gap-4 sm:gap-6">
        {PROBLEMS.map((p) => (
          <StaggerItem key={p.title}>
            <HoverLift>
              <article className="h-full rounded-3xl bg-white p-6 ring-1 ring-ink/5 card-shadow">
                <div className="size-10 rounded-2xl bg-clay-soft/50 grid place-items-center text-clay mb-4">
                  {p.icon}
                </div>
                <h3 className="font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                  {p.body}
                </p>
              </article>
            </HoverLift>
          </StaggerItem>
        ))}
      </StaggerChildren>
    </section>
  );
}

const PROBLEMS = [
  {
    icon: <FileText className="size-5" />,
    title: "ATS-фільтри",
    body: "Роботодавець не бачить твоє CV — його відсіює система. Без потрібних NL-ключів воно ніколи не доходить до людини.",
  },
  {
    icon: <Globe2 className="size-5" />,
    title: "Назва посади",
    body: "Український «головний бухгалтер» бельгійською не означає те ж саме. Дослівний переклад занижує рівень на 2–3 ступені.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Стиль викладу",
    body: "У Бельгії пишуть результатами: Beheerde, Coördineerde, Realiseerde. У нас — обов'язками. Це різні мови.",
  },
];

/* ──────────────────────────────────────────────── HOW IT WORKS */
function HowItWorks() {
  return (
    <section id="how" className="bg-forest text-cream py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-light font-medium">
            Як це працює
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight max-w-2xl">
            Три кроки до CV, яке проходить ATS
          </h2>
        </FadeIn>

        <StaggerChildren className="mt-14 grid md:grid-cols-3 gap-8 sm:gap-12">
          {STEPS.map((s, i) => (
            <StaggerItem key={s.title}>
              <div className="relative">
                <div className="font-display text-6xl text-sage-light/30 leading-none">
                  0{i + 1}
                </div>
                <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 text-cream/75 leading-relaxed">{s.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.2}>
          <div className="mt-16 rounded-3xl overflow-hidden ring-1 ring-cream/10 bg-cream/5 grid md:grid-cols-[1.1fr_1fr]">
            <Image
              src="/images/cv-mock.jpg"
              alt="Приклад готового CV нідерландською у бельгійському форматі"
              width={1600}
              height={1195}
              className="w-full h-full object-cover"
            />
            <div className="p-8 sm:p-10 flex flex-col justify-center">
              <h3 className="font-display text-2xl sm:text-3xl leading-tight">
                Готове CV — не PDF, а DOCX
              </h3>
              <p className="mt-4 text-cream/75 leading-relaxed">
                У Бельгії стандарт — DOCX. ATS читає його коректно, а
                роботодавець може додати нотатки. Ми генеруємо у форматі, який
                реально працює.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-cream/85">
                {[
                  "Bullet-points з дієсловами результату",
                  "ATS-ключі з конкретної вакансії, якщо ти її вставиш",
                  "ISCO-08 коди і VDAB-категорії для пошуку",
                  "Дві версії: survival track + professional track",
                ].map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <CheckCircle2 className="size-4 text-sage-light shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Розкажи про себе",
    body: "7 кроків анкети українською. Пиши так, як писала б подрузі — без офіційщини. Це безкоштовно.",
  },
  {
    title: "AI адаптує під ринок",
    body: "Claude Sonnet перекладає не слова, а рівень посади, стиль і ATS-ключі під Фландрію, Брюссель або Валлонію.",
  },
  {
    title: "Отримай документи на email",
    body: "CV у DOCX, мотиваційний лист, список посад для пошуку і 4 PDF-уроки нідерландської для співбесіди.",
  },
];

/* ──────────────────────────────────────────────── BUNDLE */
function Bundle() {
  return (
    <section id="bundle" className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Що в пакеті
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            Все, що треба для першого «так» —{" "}
            <span className="text-sage-dark italic">за €9</span>
          </h2>
          <p className="mt-5 text-ink-soft text-lg leading-relaxed">
            Не місячна підписка. Не €45–€100, як у консультантів. Один платіж,
            повний пакет на email, гарантія повернення.
          </p>
          <ul className="mt-8 space-y-4">
            {BUNDLE_ITEMS.map((b) => (
              <li key={b.title} className="flex gap-4">
                <div className="size-10 shrink-0 rounded-2xl bg-sage-light/40 grid place-items-center text-sage-dark">
                  {b.icon}
                </div>
                <div>
                  <div className="font-medium text-ink">{b.title}</div>
                  <div className="text-sm text-muted mt-0.5">{b.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.15}>
          <HoverLift>
            <div className="relative rounded-3xl bg-white p-7 sm:p-9 ring-1 ring-ink/5 card-shadow">
              <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-clay text-cream px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3" /> Запуск €9
              </div>

              <div className="font-display text-lg text-ink-soft">
                AISTA повний пакет
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-display text-6xl text-forest">€9</div>
                <div className="text-muted line-through text-lg">€45</div>
              </div>
              <div className="text-sm text-muted mt-1">
                Одноразово · без підписки
              </div>

              <Link
                href={CTA_HREF}
                className="btn-press mt-6 flex items-center justify-center gap-2 rounded-full bg-forest text-cream py-4 text-base font-semibold hover:bg-sage-dark w-full"
              >
                Створити моє CV
                <ArrowRight className="size-4" />
              </Link>

              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <Lock className="size-3.5" /> Stripe
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> 15 хв
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" /> Гарантія
                </div>
              </div>

              <div className="mt-6 border-t border-ink/5 pt-5 text-xs text-muted leading-relaxed">
                Bancontact · Visa · Mastercard · Apple Pay · Google Pay.
                Гарантія повернення коштів протягом 24 годин після оплати — без
                питань.
              </div>
            </div>
          </HoverLift>
        </FadeIn>
      </div>
    </section>
  );
}

const BUNDLE_ITEMS = [
  {
    icon: <FileText className="size-4" />,
    title: "CV у форматі DOCX",
    desc: "Нідерландською, французькою або англійською — твій вибір.",
  },
  {
    icon: <Mail className="size-4" />,
    title: "Мотиваційний лист",
    desc: "Шаблон, який ти адаптуєш під кожну вакансію за 3 хвилини.",
  },
  {
    icon: <Globe2 className="size-4" />,
    title: "Список посад для пошуку",
    desc: "Які саме назви шукати на VDAB і Indeed — з кодами ISCO.",
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "4 PDF-уроки нідерландської",
    desc: "Як читати вакансії, писати CV і відповідати на співбесіді.",
  },
];

/* ──────────────────────────────────────────────── TESTIMONIALS */
function Testimonials() {
  return (
    <section id="stories" className="bg-cream-2/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <div className="flex items-baseline justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
                Історії
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
                Перший «так» — на 8-й день
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-ink-soft">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-clay text-clay"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="font-medium">4.9</span>
              <span className="text-muted">· 312 відгуків</span>
            </div>
          </div>
        </FadeIn>

        <StaggerChildren className="mt-12 grid md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name}>
              <HoverLift>
                <article className="h-full rounded-3xl bg-white p-6 ring-1 ring-ink/5 card-shadow flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-clay text-clay"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="text-ink-soft leading-relaxed flex-1">
                    «{t.body}»
                  </p>
                  <div className="mt-5 flex items-center gap-3 pt-5 border-t border-ink/5">
                    <div className="size-10 rounded-full bg-sage-light/60 grid place-items-center font-display text-sage-dark">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted">{t.role}</div>
                    </div>
                  </div>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    name: "Олена",
    role: "Бухгалтер · Гент",
    body: "Місяцями розсилала CV — нуль відповідей. Через AISTA на 8-й день — два запрошення на співбесіду. Виявилось, я весь час шукала boekhouder, а мені треба financieel coördinator.",
  },
  {
    name: "Тетяна",
    role: "Вчителька → HR · Антверпен",
    body: "Я думала, що моя педагогічна освіта тут нікому не потрібна. AISTA показала, як перевести 12 років викладання у мову HR. Працюю helpdesk у школі — крок до того, що хочу.",
  },
  {
    name: "Наталя",
    role: "Медсестра · Брюссель",
    body: "У них окремо survival track — куди йти зараз, поки RIZIV не визнав диплом, і professional track — на потім. Я не знала, що так можна. Зараз zorgkundige, через рік буду verpleegkundige.",
  },
];

/* ──────────────────────────────────────────────── WHY */
function Why() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Чому AISTA, а не консультант
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            €9 замість €45–€100.{" "}
            <span className="text-sage-dark italic">15 хвилин замість двох тижнів.</span>
          </h2>
          <p className="mt-5 text-ink-soft text-lg leading-relaxed">
            CV-консультант робить шаблон і просить переписати ще раз. AISTA
            знає 4 професії глибоко: бухгалтер, вчитель, офіс-менеджер,
            медсестра. Інші — у роботі.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="rounded-3xl ring-1 ring-ink/5 card-shadow bg-white overflow-hidden">
            <CompareRow head left="CV-консультант" right="AISTA" />
            <CompareRow l="€45–€100" r="€9" />
            <CompareRow l="2 тижні · 3 правки" r="15 хвилин" />
            <CompareRow l="Шаблонний переклад" r="Адаптація рівня посади" />
            <CompareRow l="Без ATS-ключів" r="ATS-ключі з вакансії" />
            <CompareRow l="—" r="Бонус: 4 PDF-уроки NL" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function CompareRow({
  head,
  l,
  r,
  left,
  right,
}: {
  head?: boolean;
  l?: string;
  r?: string;
  left?: string;
  right?: string;
}) {
  if (head) {
    return (
      <div className="grid grid-cols-2 bg-cream-2/60 text-xs uppercase tracking-wider text-muted font-medium">
        <div className="px-5 py-3 border-r border-ink/5">{left}</div>
        <div className="px-5 py-3">{right}</div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 text-sm border-t border-ink/5">
      <div className="px-5 py-4 text-muted border-r border-ink/5">{l}</div>
      <div className="px-5 py-4 text-ink font-medium flex items-center gap-2">
        <CheckCircle2 className="size-4 text-sage" /> {r}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── FAQ */
function FAQ() {
  return (
    <section id="faq" className="bg-cream-2/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Питання
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            Чесні відповіді
          </h2>
        </FadeIn>
        <div className="mt-10 divide-y divide-ink/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none flex justify-between items-start gap-4">
                <span className="font-medium text-ink text-base sm:text-lg">
                  {f.q}
                </span>
                <span className="size-7 shrink-0 rounded-full ring-1 ring-ink/10 grid place-items-center text-ink-soft group-open:rotate-45 transition">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink-soft leading-relaxed text-sm sm:text-base pr-10">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "А якщо CV буде поганим?",
    a: "Повернемо €9 без питань протягом 24 годин після оплати. Напиши на hello@aista.be — гроші повернуться на ту ж картку.",
  },
  {
    q: "Моєї професії немає у списку?",
    a: "Зараз глибокі маппінги для бухгалтерії, педагогіки, офіс-менеджменту і медицини. Engineer, doctor, IT — у розробці. Якщо твоєї немає — напиши, додамо в чергу.",
  },
  {
    q: "Це справді працює без визнання диплому?",
    a: "Так. Ми робимо два варіанти: survival track (куди можна влаштуватися зараз без NARIC/RIZIV) і professional track (куди повернутися після визнання). Обидва на одній анкеті.",
  },
  {
    q: "Чому DOCX, а не PDF?",
    a: "У Бельгії стандарт — DOCX. ATS-системи парсять його точніше, а HR може додавати нотатки. PDF — для портфоліо, не для відгуку на вакансію.",
  },
  {
    q: "Скільки чекати лист з документами?",
    a: "Зазвичай 5–10 хвилин після оплати. Якщо за 30 хвилин не прийшло — перевір спам або напиши, поправимо.",
  },
  {
    q: "Хто за цим стоїть?",
    a: "Nataliia Stasiuk — українка у Бельгії, пройшла цей шлях сама. Сервіс зроблено не великим агенством, а людиною, яка розуміє Олену з Гента, бо колись була нею.",
  },
];

/* ──────────────────────────────────────────────── FINAL CTA */
function FinalCTA() {
  return (
    <section className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-28">
      <FadeIn>
        <div className="relative overflow-hidden rounded-[2rem] bg-forest text-cream p-10 sm:p-16 text-center card-shadow">
          <div className="absolute inset-0 grain opacity-40" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl leading-tight max-w-2xl mx-auto">
              Один платіж. Готове CV. Шанс на першу{" "}
              <span className="italic text-sage-light">«так»</span>.
            </h2>
            <p className="mt-5 text-cream/75 text-lg max-w-xl mx-auto">
              Не підписка. Не курс. Пакет, який треба один раз — щоб роботодавець
              нарешті побачив твій справжній досвід.
            </p>
            <Link
              href={CTA_HREF}
              className="btn-press mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-cream text-forest px-7 py-4 text-base font-semibold hover:bg-clay-soft"
            >
              Створити моє CV за €9
              <ArrowRight className="size-4" />
            </Link>
            <div className="mt-5 text-sm text-cream/65">
              Stripe · Bancontact · 24 год гарантія
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

/* ──────────────────────────────────────────────── FOOTER */
function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-cream">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 grid sm:grid-cols-2 gap-6 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark />
            <span className="font-display text-lg">AISTA</span>
          </div>
          <p className="mt-3 text-muted max-w-sm leading-relaxed">
            Сервіс для українок у Бельгії: AI-адаптація CV під бельгійський
            ринок праці. Зроблено з Genti з ❤
          </p>
        </div>
        <div className="sm:text-right text-muted">
          <div>hello@aista.be</div>
          <div className="mt-1">© AISTA · {new Date().getFullYear()}</div>
        </div>
      </div>
    </footer>
  );
}

/* ──────────────────────────────────────────────── MOBILE STICKY CTA */
function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-ink/10 bg-cream/95 backdrop-blur-md p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Link
        href={CTA_HREF}
        className="btn-press flex items-center justify-center gap-2 rounded-full bg-forest text-cream py-3.5 font-semibold w-full"
      >
        Створити CV за €9
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
