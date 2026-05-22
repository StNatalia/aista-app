"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Animated preview widgets ──────────────── */

/** Step 1: form lines appearing */
function FormPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const lines = [
    { label: "Ім'я", value: "Оксана І.", w: "w-24" },
    { label: "Посада в Україні", value: "Бухгалтер", w: "w-20" },
    { label: "Роки досвіду", value: "8 років", w: "w-16" },
  ];

  return (
    <div ref={ref} className="mt-4 space-y-2">
      {lines.map((l, i) => (
        <motion.div
          key={l.label}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease }}
          className="flex items-center gap-2"
        >
          <span className="text-sage-light/50 text-[10px] font-sans shrink-0 w-28 truncate">
            {l.label}
          </span>
          <div className="flex-1 h-px bg-cream/10 relative overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-sage-light/30"
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease }}
            />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.9 + i * 0.15 }}
            className="text-cream/60 text-[11px] font-mono shrink-0"
          >
            {l.value}
          </motion.span>
        </motion.div>
      ))}

      {/* Blinking cursor */}
      <motion.div
        className="flex items-center gap-1.5 mt-1"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[10px] text-sage-light/40 font-sans">Мова CV</span>
        <motion.span
          className="inline-block w-0.5 h-3.5 bg-sage-light/60 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}

/** Step 2: AI processing with progress */
function AIPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const tasks = [
    { label: "Аналіз досвіду", delay: 0.3 },
    { label: "Маппінг посади", delay: 0.7 },
    { label: "ATS-ключі (NL)", delay: 1.1 },
  ];

  return (
    <div ref={ref} className="mt-4 space-y-2">
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
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: t.delay,
            }}
          />
          <div className="flex-1 h-0.5 bg-cream/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage-light/50 rounded-full"
              initial={{ width: 0 }}
              animate={inView ? { width: "100%" } : { width: 0 }}
              transition={{ duration: 1.2, delay: t.delay + 0.2, ease }}
            />
          </div>
          <span className="text-[10px] text-sage-light/40 font-sans shrink-0">
            {t.label}
          </span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.8 }}
        className="flex items-center gap-1.5 pt-1"
      >
        <span className="text-[10px] text-sage-light/35 font-mono">
          claude-sonnet · ~35s
        </span>
      </motion.div>
    </div>
  );
}

/** Step 3: document badges arriving */
function DocsPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const docs = [
    { name: "CV.docx", delay: 0.3 },
    { name: "Motivatiebrief.docx", delay: 0.55 },
    { name: "Vacatures_NL.pdf", delay: 0.8 },
    { name: "Cursus_NL.pdf", delay: 1.05 },
  ];

  return (
    <div ref={ref} className="mt-4 flex flex-wrap gap-1.5">
      {docs.map((d) => (
        <motion.div
          key={d.name}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: d.delay, ease }}
          className="flex items-center gap-1.5 bg-cream/10 border border-cream/10 rounded-lg px-2 py-1"
        >
          <div className="size-1.5 rounded-sm bg-sage-light/60" />
          <span className="text-[10px] text-cream/50 font-mono">{d.name}</span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        className="w-full mt-1"
      >
        <span className="text-[10px] text-sage-light/35 font-sans">
          → на email за 15 хвилин
        </span>
      </motion.div>
    </div>
  );
}

/* ── ProcessSteps ────────────────────────────── */
const STEPS = [
  {
    num: "01",
    title: "Розкажи про себе",
    body: "Заповнюєш анкету рідною мовою. Пиши як писала б подрузі — без офіційщини. Це безкоштовно.",
    preview: <FormPreview />,
  },
  {
    num: "02",
    title: "AI адаптує під ринок",
    body: "Claude Sonnet читає твій досвід і перекладає на мову бельгійського ринку: рівень посади, стиль і ATS-ключі.",
    preview: <AIPreview />,
  },
  {
    num: "03",
    title: "Документи на пошту",
    body: "CV у DOCX, мотиваційний лист, список посад і уроки нідерландської — усе одним листом.",
    preview: <DocsPreview />,
  },
];

function Step({
  num,
  title,
  body,
  preview,
  delay,
}: {
  num: string;
  title: string;
  body: string;
  preview: React.ReactNode;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease }}
      className="relative"
    >
      {/* Step number */}
      <div className="relative inline-block">
        <motion.span
          className="font-display text-7xl leading-none text-sage-light/15 select-none"
          initial={{ opacity: 0.1 }}
          animate={inView ? { opacity: 1 } : { opacity: 0.1 }}
          transition={{ duration: 1, delay: delay + 0.1, ease }}
        >
          {num}
        </motion.span>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          <span className="font-display text-7xl leading-none text-sage-light/30 select-none">
            {num}
          </span>
        </motion.div>
      </div>

      <h3 className="mt-3 font-display text-2xl text-cream">{title}</h3>
      <p className="mt-2 text-cream/70 leading-relaxed text-[15px]">{body}</p>
      {preview}
    </motion.div>
  );
}

export function ProcessSteps() {
  return (
    <div className="mt-14 grid md:grid-cols-3 gap-10 sm:gap-14 relative">
      {/* Connecting line on desktop */}
      <div className="hidden md:block absolute top-9 left-[33%] right-[33%] h-px bg-sage-light/10" />

      {STEPS.map((s, i) => (
        <Step
          key={s.num}
          num={s.num}
          title={s.title}
          body={s.body}
          preview={s.preview}
          delay={i * 0.12}
        />
      ))}
    </div>
  );
}
