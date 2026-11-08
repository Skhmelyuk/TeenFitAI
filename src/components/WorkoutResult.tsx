import { CheckCircle2, Heart } from 'lucide-react';
import ExerciseCard from '@/components/ExerciseCard';
import FocusTimer from '@/components/FocusTimer';
import type { WorkoutPlan } from '@/types';

interface WorkoutResultProps {
  plan: WorkoutPlan;
  completedToday: boolean;
  onComplete: () => void;
}

export default function WorkoutResult({ plan, completedToday, onComplete }: WorkoutResultProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-lime-300">Твій план на сьогодні</p>
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">{plan.title}</h1>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
          {plan.source === 'ai' ? 'AI-ментор' : 'Офлайн-план'}
        </span>
      </header>

      <FocusTimer minutes={plan.minutes} />

      <div className="grid gap-4">
        {plan.exercises.map((exercise, index) => (
          <ExerciseCard key={exercise.name} index={index + 1} exercise={exercise} />
        ))}
      </div>

      <section className="animate-fade-in relative overflow-hidden rounded-3xl border border-lime-500/30 bg-gradient-to-br from-lime-500/15 to-slate-900 p-6 sm:p-7">
        <div className="flex items-center gap-2 text-lime-300">
          <Heart className="h-5 w-5 fill-lime-300/20" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Мотивація від твого AI-ментора</h2>
        </div>
        <p className="mt-3 text-base leading-relaxed text-white sm:text-lg">{plan.motivation}</p>
      </section>

      <button
        type="button"
        onClick={onComplete}
        disabled={completedToday}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-lime-500 px-6 py-4 text-base font-extrabold text-slate-900 shadow-xl shadow-lime-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-lime-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300 disabled:shadow-none"
      >
        <CheckCircle2 className="h-5 w-5" />
        {completedToday ? 'Сьогодні вже зараховано' : 'Я виконав тренування!'}
      </button>
    </div>
  );
}
