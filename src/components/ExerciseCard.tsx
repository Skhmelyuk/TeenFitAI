import { Lightbulb } from 'lucide-react';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  index: number;
  exercise: Exercise;
}

export default function ExerciseCard({ index, exercise }: ExerciseCardProps) {
  return (
    <article className="animate-fade-in group rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-lime-500/50 hover:shadow-lime-500/10 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-500/15 text-base font-extrabold text-lime-400">
          {index}
        </span>
        <div className="min-w-0 space-y-1">
          <h3 className="text-lg font-bold leading-snug text-white">{exercise.name}</h3>
          <p className="text-sm font-semibold text-lime-300">{exercise.reps}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3 rounded-2xl bg-slate-950/70 p-4">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-200">Лайфхак техніки</p>
          <p className="text-sm leading-relaxed text-slate-300">{exercise.tip}</p>
        </div>
      </div>
    </article>
  );
}
