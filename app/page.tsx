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
  CursorSpotlight,
  FadeIn,
  StaggerChildren,
  StaggerItem,
  Float,
  HoverLift,
  CountUp,
  FAQItem,
} from "./_components/motion";
import { TestimonialsCarousel } from "./_components/carousel";

const CTA_HREF = "/form";

export default function Home() {
  return (
    <>
      <CursorSpotlight />
      <AnnounceBanner />
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProofBar />
        <Problem />
        <Situations />
        <HowItWorks />
        <Bundle />
        <Testimonials />
        <Transformation />
        <Guarantee />
        <Author />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}

/* ──────────────────────────────────────────────── ANNOUNCE BANNER */
function AnnounceBanner() {
  return (
    <div className="bg-forest text-cream text-xs sm:text-sm text-center py-2.5 px-4 font-medium">
      🇺🇦 Онлайн-сервіс для українців у Бельгії —{" "}
      <span className="text-clay-soft font-semibold">
        Акційна ціна: 9 € замість 45 €
      </span>
    </div>
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
          <a href="#stories" className="hover:text-ink transition">Відгуки</a>
          <a href="#faq" className="hover:text-ink transition">FAQ</a>
        </nav>
        <Link
          href={CTA_HREF}
          className="btn-press btn-shimmer hidden sm:inline-flex items-center gap-2 rounded-full bg-forest text-cream px-4 py-2 text-sm font-medium hover:bg-sage-dark"
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
            Відправляєш десятки заявок на роботу у Бельгії —{" "}
            <span className="text-clay italic">і отримуєш тишу?</span>
          </h1>

          <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
            За <strong className="text-ink">15 хвилин</strong> отримаєш резюме
            нідерландською потрібного формату, де твій досвід нарешті звучить
            зрозуміло і доходить до рук живого рекрутера.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={CTA_HREF}
              className="btn-press btn-shimmer group inline-flex items-center justify-center gap-2 rounded-full bg-forest text-cream px-6 py-4 text-base font-semibold hover:bg-sage-dark shadow-lg shadow-forest/15"
            >
              Нарешті бути побаченою як спеціаліст — €9
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <span className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
            <ShieldCheck className="size-4 text-sage" />
            Гарантія 7 днів — одне повідомлення і гроші повертаються
          </span>

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
              text="Перша відповідь на 8-й день"
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
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 text-center sm:text-left">
        <ProofItem
          big={<><CountUp to={78} />→0</>}
          small="заявок — і жодної відповіді. Типова ситуація."
        />
        <ProofItem
          big="6–7 сек"
          small="рекрутер витрачає на перегляд CV"
        />
        <ProofItem
          big={<>+<CountUp to={53} suffix="%" /></>}
          small="більше відгуків після адаптації формату"
        />
        <ProofItem
          big="€9 vs €90"
          small="середня ціна консультанта у Бельгії"
        />
      </div>
    </section>
  );
}

function ProofItem({ big, small }: { big: React.ReactNode; small: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start">
      <div className="font-display text-2xl text-forest">{big}</div>
      <div className="text-xs text-muted mt-0.5 leading-snug">{small}</div>
    </div>
  );
}

/* ──────────────────────────────────────────────── PROBLEM — три причини */
function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <FadeIn>
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Чому твоє CV ігнорують
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            Три реальні причини —{" "}
            <span className="text-clay italic">і жодна не про твій досвід.</span>
          </h2>
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
    title: "Автоматичні фільтри — реальність",
    body: "Система опрацьовує заявки за певними правилами. Без потрібних NL-ключів CV автоматично відхиляється — до людини не доходить.",
  },
  {
    icon: <Clock className="size-5" />,
    title: "Місцева специфіка і час",
    body: "Рекрутер витрачає 6–7 секунд на перегляд заявки. Якщо в ці секунди він не бачить потрібної назви посади — далі не читає.",
  },
  {
    icon: <Globe2 className="size-5" />,
    title: "Персоналізація під вакансію",
    body: "Одне резюме на всі посади не працює. Кожна вакансія має свої ключові слова і очікування — без адаптації немає результату.",
  },
];

/* ──────────────────────────────────────────────── SITUATIONS — впізнаєш себе */
function Situations() {
  return (
    <section className="bg-cream-2/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
              Впізнаєш себе?
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
              Якщо хоч одна ситуація —{" "}
              <span className="text-clay italic">твоя,</span> ти на правильному місці.
            </h2>
          </div>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SITUATIONS.map((s) => (
            <StaggerItem key={s.title}>
              <HoverLift>
                <article className="h-full rounded-3xl bg-white p-6 ring-1 ring-ink/5 card-shadow">
                  <div className="font-display text-3xl text-clay leading-none mb-3">✕</div>
                  <h3 className="font-semibold text-ink text-base leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{s.body}</p>
                </article>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

const SITUATIONS = [
  {
    title: "Надіслала 78 заявок. Отримала 0 відповідей.",
    body: "Витрачаєш понад 3 години на одну заявку. Надсилаєш. Чекаєш. Знову тиша.",
  },
  {
    title: "Замість достойної роботи — знову cleaning.",
    body: "Твою кваліфікацію ніби не помічають. Хоча в Україні ти була менеджеркою, бухгалтером, викладачкою.",
  },
  {
    title: "VDAB та OCMW вимагають звітів.",
    body: "Твої консультанти тиснуть на тебе щодня — а результатів немає, бо проблема не в кількості заявок.",
  },
  {
    title: "Не знаєш, на що взагалі подаватися.",
    body: "Як подати те, що вміла в Україні? «Бухгалтер» і «boekhouder» — це різні рівні. Ніхто про це не попереджає.",
  },
  {
    title: "Пошук роботи забирає весь час.",
    body: "До 20 годин на тиждень — на вакансії без результату. Сил на роботу, дітей і себе вже не залишається.",
  },
  {
    title: "Не знаєш, як пояснити це дитині.",
    body: "В Україні ти була керівником. А тут — знову починаєш з нуля. Це боляче. І це несправедливо.",
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
            Три кроки — і резюме у тебе на пошті
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
                Готове резюме — у форматі DOCX
              </h3>
              <p className="mt-4 text-cream/75 leading-relaxed">
                У Бельгії стандарт — DOCX. ATS читає його коректно, а
                роботодавець може додати нотатки. Ми генеруємо у форматі, який
                реально відкривають і читають.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-cream/85">
                {[
                  "Опис досвіду через результати з цифрами (Beheerde, Coördineerde...)",
                  "Назва посади адаптована під рівень бельгійського ринку",
                  "ATS-ключі під конкретну вакансію, якщо ти її вставиш",
                  "Два треки: survival (зараз) і professional (після визнання диплому)",
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
    body: "Завантажуєш резюме або заповнюєш коротку форму рідною мовою. Вставляєш посилання на вакансію — AI врахує ключові слова.",
  },
  {
    title: "AI адаптує під ринок Бельгії",
    body: "Claude Sonnet знаходить твій справжній рівень і перекладає не слова, а кар'єру. Твій «Бухгалтер» стає «Financieel coördinator».",
  },
  {
    title: "Отримуєш документи і підбірку вакансій",
    body: "CV у DOCX, мотиваційний лист, актуальні вакансії і 3 уроки нідерландської для співбесіди — усе одним листом за 15 хвилин.",
  },
];

/* ──────────────────────────────────────────────── BUNDLE */
function Bundle() {
  return (
    <section id="bundle" className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Що в пакеті
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            €103 у подарунок —{" "}
            <span className="text-sage-dark italic">за €9</span>
          </h2>
          <p className="mt-5 text-ink-soft text-lg leading-relaxed">
            Не місячна підписка. Не €90+, як у консультанта. Один платіж —
            повний пакет на email.
          </p>

          {/* Static timer */}
          <div className="mt-8 mb-8 p-4 rounded-2xl bg-clay-soft/30 ring-1 ring-clay/20">
            <div className="text-xs uppercase tracking-widest text-clay font-semibold mb-3 text-center">
              До кінця акції залишилось
            </div>
            <div className="flex justify-center gap-3">
              {[{ n: "02", l: "Дні" }, { n: "14", l: "Год" }, { n: "37", l: "Хв" }, { n: "22", l: "Сек" }].map(
                ({ n, l }) => (
                  <div key={l} className="text-center">
                    <div className="size-14 rounded-xl bg-forest text-cream grid place-items-center font-display text-2xl">
                      {n}
                    </div>
                    <div className="text-xs text-muted mt-1">{l}</div>
                  </div>
                )
              )}
            </div>
          </div>

          <ul className="space-y-4">
            {BUNDLE_ITEMS.map((b) => (
              <li key={b.title} className="flex gap-4">
                <div className="size-10 shrink-0 rounded-2xl bg-sage-light/40 grid place-items-center text-sage-dark">
                  {b.icon}
                </div>
                <div>
                  <div className="font-medium text-ink flex flex-wrap items-center gap-2">
                    {b.title}
                    {b.oldPrice && (
                      <span className="text-xs text-muted line-through">{b.oldPrice}</span>
                    )}
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                        b.special
                          ? "bg-clay text-cream"
                          : "bg-sage-light/60 text-sage-dark"
                      }`}
                    >
                      {b.badge}
                    </span>
                  </div>
                  <div className="text-sm text-muted mt-0.5">{b.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 p-4 rounded-2xl bg-forest/5 ring-1 ring-forest/10 text-sm text-sage-dark font-medium text-center">
            Загальна цінність бонусів: <span className="font-display text-lg text-forest">€103</span> у подарунок
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <HoverLift>
            <div className="relative rounded-3xl bg-white p-7 sm:p-9 ring-1 ring-ink/5 card-shadow sticky top-24">
              <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-clay text-cream px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3" /> Акційна ціна
              </div>

              <div className="font-display text-lg text-ink-soft">
                AISTA повний пакет
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-display text-6xl text-forest">€9</div>
                <div className="text-muted line-through text-lg">€45</div>
              </div>
              <div className="text-sm text-muted mt-1">Одноразово · без підписки</div>

              <Link
                href={CTA_HREF}
                className="btn-press btn-shimmer mt-6 flex items-center justify-center gap-2 rounded-full bg-forest text-cream py-4 text-base font-semibold hover:bg-sage-dark w-full"
              >
                Нарешті бути побаченою як спеціаліст
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
                  <ShieldCheck className="size-3.5" /> 7 днів
                </div>
              </div>

              <div className="mt-6 border-t border-ink/5 pt-5 text-xs text-muted leading-relaxed">
                Bancontact · Visa · Mastercard · Apple Pay · Google Pay.
                Гарантія 7 днів — одне повідомлення і гроші повертаються.
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
    oldPrice: undefined,
    badge: "основний продукт",
    special: false,
    desc: "Нідерландською, французькою або англійською — адаптоване під бельгійський ринок.",
  },
  {
    icon: <Mail className="size-4" />,
    title: "Мотиваційний лист під одну вакансію",
    oldPrice: "€20",
    badge: "безкоштовно",
    special: false,
    desc: "Адаптований під конкретну посаду — не шаблон.",
  },
  {
    icon: <Globe2 className="size-4" />,
    title: "Підбірка актуальних вакансій",
    oldPrice: "€15",
    badge: "безкоштовно",
    special: false,
    desc: "Які назви шукати на VDAB та Indeed — з кодами ISCO і категоріями.",
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "Три уроки нідерландської",
    oldPrice: "€45",
    badge: "безкоштовно",
    special: false,
    desc: "«Пошук роботи у Фландрії» — читати вакансії, писати CV, відповідати на співбесіді.",
  },
  {
    icon: <Star className="size-4" />,
    title: "Пакет 5 резюме + 5 листів",
    oldPrice: "€45",
    badge: "€22 ТІЛЬКИ СЬОГОДНІ",
    special: true,
    desc: "Якщо шукаєш кілька позицій — повний пакет за €4.40 за заявку.",
  },
];

/* ──────────────────────────────────────────────── TESTIMONIALS */
function Testimonials() {
  return (
    <section id="stories" className="bg-cream-2/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
              Історії
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
              Перша відповідь — на 8-й день
            </h2>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-soft">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-clay text-clay" strokeWidth={0} />
                ))}
              </div>
              <span className="font-medium">4.9</span>
              <span className="text-muted">· 100+ резюме створено</span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TestimonialsCarousel />
        </FadeIn>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────── TRANSFORMATION */
function Transformation() {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Що змінюється
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            15 хвилин замість{" "}
            <span className="text-sage-dark italic">20 годин на тиждень.</span>
          </h2>
          <p className="mt-5 text-ink-soft text-lg leading-relaxed">
            Замість хаотичного пошуку — системний підхід. Замість тиші — запрошення.
            Одна анкета, два треки: survival і professional.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="rounded-3xl ring-1 ring-ink/5 card-shadow bg-white overflow-hidden">
            <CompareRow head left="Без AISTA" right="З AISTA" />
            <CompareRow l="3+ години на одну заявку" r="15 хвилин" />
            <CompareRow l="Десятки відмов — нуль відповідей" r="CV доходить до живого рекрутера" />
            <CompareRow l="Сумніви у власній кваліфікації" r="Впевненість у своїй фаховості" />
            <CompareRow l="Хаотичний пошук без системи" r="Список посад + ATS-ключі" />
            <CompareRow l="€90+ за одну консультацію" r="€9 одноразово" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function CompareRow({
  head, l, r, left, right,
}: {
  head?: boolean; l?: string; r?: string; left?: string; right?: string;
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
        <CheckCircle2 className="size-4 text-sage shrink-0" /> {r}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── GUARANTEE */
function Guarantee() {
  return (
    <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-20 sm:pb-28">
      <FadeIn>
        <div className="rounded-3xl bg-sage-light/30 ring-1 ring-sage/20 p-8 sm:p-12 text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink">
            Гарантія 7 днів
          </h2>
          <p className="mt-4 text-ink-soft text-lg max-w-xl mx-auto leading-relaxed">
            Якщо сервіс тобі не підійшов, просто напиши{" "}
            <span className="font-medium text-ink">«не задоволена»</span> —
            і гроші повертаються. Без зайвих питань.
          </p>
          <Link
            href={CTA_HREF}
            className="btn-press btn-shimmer mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-forest text-cream px-7 py-4 text-base font-semibold hover:bg-sage-dark"
          >
            Спробувати без ризику — €9
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}

/* ──────────────────────────────────────────────── AUTHOR */
function Author() {
  return (
    <section className="bg-cream-2/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <FadeIn>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="size-20 rounded-full bg-forest grid place-items-center text-cream font-display text-3xl shrink-0 mx-auto sm:mx-0">
              N
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
                Хто за цим стоїть
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl">
                Наталія Стасюк
              </h2>
              <p className="text-sm text-muted mt-1">
                Сертифікована AI-фахівець · 4 роки у Бельгії
              </p>
              <p className="mt-5 text-ink-soft leading-relaxed">
                Переїхавши з України до Бельгії в 2022 році з двома синами,
                дипломом економіста, багаторічним досвідом та 5-ма мовами, я не
                змогла одразу знайти роботу. Я пройшла цей шлях сама — і
                зробила сервіс, якого мені не вистачало.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 max-w-sm">
                <Stat n="4 роки" l="у Бельгії" />
                <Stat n="100+" l="резюме створено" />
                <Stat n="+53%" l="більше відгуків" />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────── FAQ */
function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <FadeIn>
          <span className="text-xs uppercase tracking-[0.18em] text-sage-dark font-medium">
            Питання
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-tight">
            Чесні відповіді
          </h2>
        </FadeIn>
        <div className="mt-10">
          {FAQS.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Моя нідерландська на рівні А2. Це проблема?",
    a: "Ні. Вводиш дані рідною мовою — сервіс перекладає нідерландською. Нідерландська потрібна тобі для співбесіди, не для анкети.",
  },
  {
    q: "Мій диплом ще не визнаний у Бельгії.",
    a: "Не страшно. Визнання обов'язкове лише для певних регульованих професій (медицина, педагогіка). Для більшості — CV достатньо. Ми також робимо survival track — куди можна влаштуватися прямо зараз.",
  },
  {
    q: "Чим це відрізняється від Europass?",
    a: "Europass — загальноєвропейський шаблон. Роботодавці Фландрії його не люблять: він надто формальний і не адаптований під бельгійські ATS. AISTA генерує CV у бельгійському форматі з правильними ключовими словами.",
  },
  {
    q: "Скільки часу займе створення резюме?",
    a: "15 хвилин від першого кроку до готового CV на email. Анкета — 7 кроків, оплата — 1 хвилина, генерація — 5–10 хвилин.",
  },
  {
    q: "Що таке програма-фільтр (ATS)?",
    a: "Більшість компаній у Бельгії використовують програму, яка автоматично перевіряє резюме до того, як його побачить людина. Якщо немає потрібних ключових слів нідерландською — заявка закривається автоматично.",
  },
  {
    q: "Я вже надсилала багато резюме — нічого. Чому зараз буде інакше?",
    a: "Якщо рекрутер не бачить ключових слів або резюме не пройшло автофільтр — результат нульовий незалежно від досвіду. AISTA вирішує саме цю проблему: формат, ключові слова, рівень посади.",
  },
  {
    q: "З мене потім будуть списуватися якісь гроші?",
    a: "Ні — одноразова оплата. Ніяких підписок, ніяких автоматичних списань. Ти платиш €9 один раз і отримуєш повний пакет.",
  },
  {
    q: "Я ледве зводжу кінці з кінцями. Навіщо €9?",
    a: "Консультант з CV у Бельгії бере від €90 за одну сесію — і не гарантує результат. AISTA — €9 одноразово з гарантією повернення протягом 7 днів. Це інвестиція у першу відповідь від роботодавця.",
  },
  {
    q: "Якщо мені потрібне буде інше резюме для іншої вакансії?",
    a: "Ти отримаєш можливість купити пакет 5 резюме + 5 мотиваційних листів за €22. Це €4.40 за одну якісну заявку замість 3 годин ручної роботи.",
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
              Зроби резюме, яке{" "}
              <span className="italic text-sage-light">нарешті прочитають</span>.
            </h2>
            <p className="mt-5 text-cream/75 text-lg max-w-xl mx-auto">
              Одноразова оплата. Без підписок. Без сюрпризів.
            </p>
            <Link
              href={CTA_HREF}
              className="btn-press btn-shimmer mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-cream text-forest px-7 py-4 text-base font-semibold hover:bg-clay-soft"
            >
              Нарешті бути побаченою як спеціаліст — €9
              <ArrowRight className="size-4" />
            </Link>
            <div className="mt-5 text-sm text-cream/65">
              Stripe · Bancontact · Гарантія 7 днів
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
            ринок праці. Зроблено з Гента з ❤
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
        className="btn-press btn-shimmer flex items-center justify-center gap-2 rounded-full bg-forest text-cream py-3.5 font-semibold w-full"
      >
        Нарешті бути побаченою як спеціаліст — €9
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
