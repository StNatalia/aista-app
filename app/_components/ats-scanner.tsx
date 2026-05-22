"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

/* ── types ──────────────────────────────────── */
type Phase =
  | "idle"
  | "scanning"
  | "rejected"
  | "transitioning"
  | "aista"
  | "accepted";

/* ── data ───────────────────────────────────── */
const KW_WITHOUT = [
  "boekhouder",
  "financieel coördinator",
  "salarisadministratie",
  "VDAB-sleutelwoorden",
];

const KW_AISTA = [
  "Financieel coördinator",
  "Loonadministratie",
  "Boekhoudkundige rapportage",
  "VDAB-categorieën",
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ── helpers ────────────────────────────────── */
function animateValue(
  setter: (n: number) => void,
  from: number,
  to: number,
  ms: number,
  rafs: number[]
) {
  const start = performance.now();
  function step(now: number) {
    const t = Math.min((now - start) / ms, 1);
    const eased = 1 - Math.pow(1 - t, 2);
    setter(Math.round(from + eased * (to - from)));
    if (t < 1) rafs.push(requestAnimationFrame(step));
  }
  rafs.push(requestAnimationFrame(step));
}

/* ── component ──────────────────────────────── */
export function ATSScanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [scanY, setScanY] = useState(0);
  const [kwCount, setKwCount] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const rafs: number[] = [];

    function reset() {
      setPhase("idle");
      setScore(0);
      setScanY(0);
      setKwCount(0);
    }

    function add(fn: () => void, ms: number) {
      timers.push(setTimeout(fn, ms));
    }

    if (!isInView) {
      reset();
      return;
    }

    /* ── Scene 1: rejected ─────── */
    add(() => {
      setPhase("scanning");
      setScanY(0);
      setKwCount(0);
      animateValue(setScore, 0, 23, 2200, rafs);
      animateValue(setScanY, 0, 100, 2600, rafs);
    }, 500);

    add(() => setKwCount(1), 1000);
    add(() => setKwCount(2), 1500);
    add(() => setKwCount(3), 2000);
    add(() => setKwCount(4), 2600);
    add(() => setPhase("rejected"), 3200);

    /* ── Scene 2: aista ──────────── */
    add(() => {
      setPhase("transitioning");
      setKwCount(0);
      setScanY(0);
    }, 5600);

    add(() => {
      setPhase("aista");
      animateValue(setScore, 23, 87, 1800, rafs);
      animateValue(setScanY, 0, 100, 2100, rafs);
    }, 6300);

    add(() => setKwCount(1), 6700);
    add(() => setKwCount(2), 7200);
    add(() => setKwCount(3), 7700);
    add(() => setKwCount(4), 8100);
    add(() => setPhase("accepted"), 8900);

    /* ── Reset & loop ─────────── */
    add(() => reset(), 11500);

    return () => {
      timers.forEach(clearTimeout);
      rafs.forEach(cancelAnimationFrame);
    };
  }, [isInView]);

  const isAista = phase === "aista" || phase === "accepted";
  const showBeam = phase === "scanning" || phase === "aista";
  const keywords = isAista ? KW_AISTA : KW_WITHOUT;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease }}
      className="rounded-2xl overflow-hidden ring-1 ring-ink/10 card-shadow"
    >
      {/* ── Browser chrome ── */}
      <div className="bg-[#1c1c1e] px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5 shrink-0">
          <div className="size-3 rounded-full bg-[#ff5f57]" />
          <div className="size-3 rounded-full bg-[#febc2e]" />
          <div className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white/8 text-white/35 text-[11px] px-5 py-1 rounded-md font-mono tracking-tight">
            ats-platform.be / screening / CV_Ivanova
          </div>
        </div>
      </div>

      {/* ── Two panels ── */}
      <div className="grid sm:grid-cols-[1.05fr_1fr] bg-white min-h-[280px]">

        {/* Left: CV document */}
        <div className="relative p-5 sm:p-6 border-r border-ink/6 overflow-hidden">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted font-sans mb-4 font-medium">
            Завантажений файл
          </p>

          <div className="font-mono text-xs leading-relaxed">
            <p className="text-ink font-bold text-[13px] font-sans mb-0.5">
              Іванова Оксана
            </p>
            <p className="text-muted text-[11px] mb-3">
              Посада:{" "}
              <span className="text-ink">Бухгалтер</span>
              {"  "}·{"  "}
              <span className="text-ink">8 років досвіду</span>
            </p>
            <div className="space-y-1 text-ink/55 text-[11px]">
              <p>• Ведення бухгалтерського обліку</p>
              <p>• Нарахування заробітної плати</p>
              <p>• Складання звітності</p>
              <p>• Первинна документація</p>
            </div>
          </div>

          {/* Scan beam */}
          {showBeam && (
            <motion.div
              className="absolute left-0 right-0 pointer-events-none"
              style={{ top: `${10 + scanY * 0.78}%` }}
            >
              <div
                className="h-px w-full"
                style={{
                  background: isAista
                    ? "linear-gradient(to right, transparent, rgba(14,58,47,0.5), transparent)"
                    : "linear-gradient(to right, transparent, rgba(201,123,90,0.6), transparent)",
                  boxShadow: isAista
                    ? "0 0 10px 2px rgba(14,58,47,0.15)"
                    : "0 0 10px 2px rgba(201,123,90,0.2)",
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Right: Results */}
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted font-sans font-medium">
            ATS Аналіз
          </p>

          {/* Score */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-muted font-sans">Score</span>
              <span
                className={`font-bold font-sans text-2xl tabular-nums transition-colors duration-500 ${
                  isAista ? "text-forest" : "text-clay"
                }`}
              >
                {score}
                <span className="text-sm font-normal text-muted">/100</span>
              </span>
            </div>
            <div className="h-1.5 bg-ink/6 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors duration-500 ${
                  isAista ? "bg-forest" : "bg-clay"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2.5">
            {keywords.map((kw, i) => {
              const visible = i < kwCount;
              return (
                <motion.div
                  key={`${isAista ? "a" : "b"}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: visible ? 1 : 0.12, x: visible ? 0 : -8 }}
                  transition={{ duration: 0.28, ease }}
                  className="flex items-center gap-2.5 font-mono text-[11px]"
                >
                  <span
                    className={`w-3.5 text-center font-bold shrink-0 ${
                      isAista ? "text-forest" : "text-clay"
                    }`}
                  >
                    {isAista ? "✓" : "✗"}
                  </span>
                  <span
                    className={
                      isAista
                        ? "text-ink/65"
                        : visible
                        ? "text-ink/40 line-through decoration-clay/40"
                        : "text-ink/15"
                    }
                  >
                    {kw}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Verdict */}
          <div className="mt-auto">
            <AnimatePresence mode="wait">
              {phase === "rejected" && (
                <motion.div
                  key="rejected"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease }}
                  className="rounded-xl bg-clay/8 border border-clay/15 px-4 py-3 text-center"
                >
                  <p className="text-[10px] text-muted font-sans mb-0.5">
                    Рішення системи
                  </p>
                  <p className="text-clay font-bold font-sans tracking-wider text-sm">
                    ВІДХИЛЕНО
                  </p>
                </motion.div>
              )}

              {phase === "transitioning" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl bg-sage-light/25 border border-sage/20 px-4 py-3 text-center"
                >
                  <p className="text-[10px] text-muted font-sans mb-2">
                    Обробка з AISTA
                  </p>
                  <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="size-1.5 rounded-full bg-sage"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                          duration: 0.85,
                          repeat: Infinity,
                          delay: i * 0.22,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "accepted" && (
                <motion.div
                  key="accepted"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="rounded-xl bg-forest/8 border border-forest/15 px-4 py-3 text-center"
                >
                  <p className="text-[10px] text-muted font-sans mb-0.5">
                    Рішення системи
                  </p>
                  <p className="text-forest font-bold font-sans tracking-wider text-sm">
                    ПРИЙНЯТО
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div className="bg-cream-2/60 border-t border-ink/5 px-5 py-2 flex items-center justify-between">
        <span className="text-[10px] text-muted font-sans">
          {isAista
            ? "Резюме адаптовано AISTA — ATS-ключі нідерландською"
            : "Оригінальний файл — ключових слів не знайдено"}
        </span>
        <motion.div
          className={`size-2 rounded-full ${isAista ? "bg-forest" : "bg-clay"}`}
          animate={showBeam ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
