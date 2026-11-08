import { Bot, Flame } from 'lucide-react';
import type { Goal } from '@/types';

interface EmptyStateProps {
  onQuickStart: (goal: Goal) => void;
  disabled: boolean;
}

export default function EmptyState({ onQuickStart, disabled }: EmptyStateProps) {
  return (
    <section className="animate-fade-in relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-xl sm:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime-500/10 blur-3xl" />
      <div className="relative">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500/15 text-lime-400">
          <Bot className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">Привіт!</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Я твій безкоштовний спортивний асистент. Допоможу підібрати тренування відповідно до твого рівня та цілей.
          Разом зробимо спорт простим, цікавим і регулярним!
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onQuickStart('energy')}
            disabled={disabled}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Flame className="h-4 w-4 transition group-hover:scale-110" />
            Швидкий заряд енергії
          </button>
          <button
            type="button"
            onClick={() => onQuickStart('back')}
            disabled={disabled}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-500/40 bg-sky-500/10 px-5 py-3 text-sm font-bold text-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Зняти напругу в спині
          </button>
        </div>
      </div>
    </section>
  );
}
