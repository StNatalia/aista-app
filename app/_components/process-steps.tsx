"use client";

import { useRef, type ComponentType } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Animated preview widgets ──────────────── */

function FormPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const lines = [
    { label: "Ім'я", value: "Оксана І.", delay: 0.3 },
    { label: "Посада в Україні", value: "Бухгалтер", delay: 0.45 },
    { label: "Роки досвіду", value: "8 років", delay: 0.6 },
  ];

  return (
    <div ref={ref} className="mt-5 space-y-2.5">
      {lines.map((l) => (
        <motion.div
          key={l.label}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: l.delay, ease }}
          className="flex items-center gap-2"
        >
          <span className="text-[10px] text-sage-light/45 font-sans shrink-0 w-28 truncate">
            {l.label}
          </span>
          <div className="flex-1 h-px bg-cream/10 relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-sage-light/25"
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 0.5, delay: l.delay + 0.15, ease }}
            />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: l.delay + 0.45 }}
            className="text-cream/55 text-[11px] font-mono shrink-0"
          >
            {l.value}
          </motion.span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-1.5 mt-1"
      >
        <span className="text-[10px] text-sage-light/35 font-sans">Мова CV</span>
        <motion.span
          className="inline-block w-0.5 h-3.5 bg-sage-light/50 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.85, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

function AIPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const tasks = [
    { label: "Аналіз досвіду", delay: 0.3 },
    { label: "Маппінг посади", delay: 0.65 },
    { label: "ATS-ключі (NL)", delay: 1.0 },
  ];

  return (
    <div ref={ref} className="mt-5 space-y-2.5">
      {tasks.map((t) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: t.delay, ease }}
          className="flex items-center gap-2.5"
        >
          <motion.div
            className="size-1.5 rounded-full bg-sage-light shrink-0"
            animate={inView ? { opacity: [0.3, 1, 0.3] } : {}}
            transition={{ duration: 1.1, repeat: Infinity, delay: t.delay }}
          />
          <div className="flex-1 h-0.5 bg-cream/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage-light/45 rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1.1, delay: t.delay + 0.15, ease }}
            />
          </div>
          <span className="text-[10px] text-sage-light/40 font-sans shrink-0">
            {t.label}
          </span>
        </motion.div>
      ))}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.7 }}
        className="text-[10px] text-sage-light/30 font-mono pt-1"
      >
        claude-sonnet · ~35s
      </motion.p>
    </div>
  );
}

function DocsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const docs = [
    { name: "CV.docx", delay: 0.3 },
    { name: "Motivatiebrief.docx", delay: 0.5 },
    { name: "Vacatures_NL.pdf", delay: 0.7 },
    { name: "Cursus_NL.pdf", delay: 0.9 },
  ];

  return (
    <div ref={ref} className="mt-5">
      <div className="flex flex-wrap gap-1.5">
        {docs.map((d) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: d.delay, ease }}
            className="flex items-center gap-1.5 bg-cream/8 border border-cream/10 rounded-lg px-2 py-1"
          >
            <div className="size-1.5 rounded-sm bg-sage-light/55" />
            <span className="text-[10px] text-cream/45 font-mono">{d.name}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
        className="text-[10px] text-sage-light/30 font-sans mt-2"
      >
        → на email за 15 хвилин
      </motion.p>
    </div>
  );
}

/* ── Step data (no JSX in data) ──────────────── */

type PreviewKey = "form" | "ai" | "docs";

const PREVIEW_MAP: Record<PreviewKey, ComponentType> = {
  form: FormPreview,
  ai: AIPreview,
  docs: DocsPreview,
};

interface StepData {
  num: string;
  title: string;
  body: string;
  previewKey: PreviewKey;
}

const STEPS: StepData[] = [
  {
    num: "01",
    title: "Розкажи про себе",
    body: "Заповнюєш анкету рідною мовою. Пиши як писала б подрузі — без офіційщини. Це безкоштовно.",
    previewKey: "form",
  },
  {
    num: "02",
    title: "AI адаптує під ринок",
    body: "Claude Sonnet читає твій досвід і перекладає на мову бельгійського ринку: рівень посади, стиль і ATS-ключі.",
    previewKey: "ai",
  },
  {
    num: "03",
    title: "Документи на пошту",
    body: "CV у DOCX, мотиваційний лист, список посад і уроки нідерландської — усе одним листом.",
    previewKey: "docs",
  },
];

/* ── Step component ──────────────────────────── */

function Step({ data, delay }: { data: StepData; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Preview = PREVIEW_MAP[data.previewKey];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className="relative"
    >
      <motion.span
        className="font-display text-7xl leading-none select-none"
        initial={{ color: "rgba(197,214,203,0.12)" }}
        animate={inView ? { color: "rgba(197,214,203,0.28)" } : {}}
        transition={{ duration: 1, delay: delay + 0.1 }}
      >
        {data.num}
      </motion.span>

      <h3 className="mt-3 font-display text-2xl text-cream">{data.title}</h3>
      <p className="mt-2 text-cream/70 leading-relaxed text-[15px]">{data.body}</p>

      <Preview />
    </motion.div>
  );
}

/* ── ProcessSteps ────────────────────────────── */

export function ProcessSteps() {
  return (
    <div className="mt-14 grid md:grid-cols-3 gap-10 sm:gap-14 relative">
      {/* Subtle connecting line on desktop */}
      <div
        className="hidden md:block absolute top-9 left-[33%] right-[33%] h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(197,214,203,0.12), transparent)" }}
      />

      {STEPS.map((s, i) => (
        <Step key={s.num} data={s} delay={i * 0.1} />
      ))}
    </div>
  );
}
