"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Тетяна",
    role: "Брюгге · UA: Бухгалтер по зарплаті → BE: Payroll Officer",
    body: "Раніше за місяць розсилок я не отримала жодної відповіді. Але після AISTA — перше запрошення на 8-й день.",
  },
  {
    name: "Оксана",
    role: "Гент · UA: Економіст → BE: Business Controller",
    body: "Економлю від 8 до 15 годин на тиждень, тому що не потрібно підганяти CV вручну під кожну вакансію.",
  },
  {
    name: "Ірина",
    role: "Антверпен · UA: Завідувач господарства → BE: Verantwoordelijke Technische Dienst",
    body: "Проблема виявилась у форматі. За 15 хвилин — нове резюме нідерландською. За тиждень — перше запрошення.",
  },
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 260 : -260,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -260 : 260,
    opacity: 0,
  }),
};

export function TestimonialsCarousel() {
  const [[idx, dir], setSlide] = useState([0, 1]);

  useEffect(() => {
    const t = setInterval(() => {
      setSlide(([i]) => [(i + 1) % TESTIMONIALS.length, 1]);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const go = (next: number) => {
    setSlide(([i]) => [next, next > i ? 1 : -1]);
  };

  const t = TESTIMONIALS[idx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-ink/5 card-shadow px-8 py-10 sm:px-12 sm:py-12 min-h-[220px] flex flex-col justify-between">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={idx}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex gap-0.5 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-clay text-clay"
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="text-ink-soft leading-relaxed text-lg sm:text-xl">
              «{t.body}»
            </p>
            <div className="mt-7 flex items-center gap-3">
              <div className="size-11 rounded-full bg-sage-light/60 grid place-items-center font-display text-sage-dark text-xl shrink-0">
                {t.name[0]}
              </div>
              <div>
                <div className="font-semibold text-ink">{t.name}</div>
                <div className="text-xs text-muted mt-0.5">{t.role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2.5 mt-6">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Відгук ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === idx
                ? "bg-forest w-8"
                : "bg-ink/15 w-2 hover:bg-ink/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
