import { CalendarDays, Loader2, Rocket, AlertTriangle } from 'lucide-react';
import { GOAL_OPTIONS, LEVEL_OPTIONS, TIME_OPTIONS } from '@/lib/workoutLibrary';
import type { Goal, Level, Minutes } from '@/types';

interface SelectorPanelProps {
  level: Level | null;
  goal: Goal | null;
  minutes: Minutes;
  isLoading: boolean;
  error: string | null;
  onLevelChange: (level: Level) => void;
  onGoalChange: (goal: Goal) => void;
  onMinutesChange: (minutes: Minutes) => void;
  onGenerateWorkout: () => void;
  onGenerateWeek: () => void;
}

const choiceClass = (selected: boolean) =>
  `rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 ${
    selected
      ? 'border-lime-500 bg-lime-500/15 text-white shadow-md shadow-lime-500/10'
      : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-white'
  }`;

export default function SelectorPanel({
  level,
  goal,
  minutes,
  isLoading,
  error,
  onLevelChange,
  onGoalChange,
  onMinutesChange,
  onGenerateWorkout,
  onGenerateWeek,
}: SelectorPanelProps) {
  return (
    <aside className="space-y-7 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl backdrop-blur sm:p-7 lg:sticky lg:top-6 lg:self-start">
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">1. Твій рівень</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {LEVEL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onLevelChange(option.value)}
              aria-pressed={level === option.value}
              className={choiceClass(level === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">2. Що ти хочеш сьогодні?</h2>
        <div className="grid grid-cols-1 gap-2">
          {GOAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onGoalChange(option.value)}
              aria-pressed={goal === option.value}
              className={choiceClass(goal === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">3. Скільки маєш вільного часу</h2>
        <div className="grid grid-cols-3 gap-2">
          {TIME_OPTIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onMinutesChange(value)}
              aria-pressed={minutes === value}
              className={`${choiceClass(minutes === value)} text-center`}
            >
              {value} хв
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="animate-fade-in flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-200"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          type="button"
          onClick={onGenerateWorkout}
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-lime-500 px-6 py-4 text-base font-extrabold text-slate-900 shadow-xl shadow-lime-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-lime-400 hover:shadow-lime-400/40 active:translate-y-0 disabled:cursor-wait disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5 transition group-hover:-translate-y-0.5" />}
          Підібрати тренування для мене
        </button>
        <button
          type="button"
          onClick={onGenerateWeek}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-slate-600 px-6 py-3.5 text-sm font-bold text-white transition duration-200 hover:border-lime-500 hover:text-lime-300 disabled:cursor-wait disabled:opacity-70"
        >
          <CalendarDays className="h-5 w-5" />
          📅 Скласти план тренувань на тиждень
        </button>
      </div>
    </aside>
  );
}
