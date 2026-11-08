import type { WeeklyDay } from '@/types';

interface WeeklyPlanProps {
  days: WeeklyDay[];
}

export default function WeeklyPlan({ days }: WeeklyPlanProps) {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-semibold text-lime-300">Регулярність — твій суперпроєкт</p>
        <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">План тренувань на тиждень</h1>
      </header>

      <ol className="grid gap-3">
        {days.map((item, index) => (
          <li
            key={item.day}
            style={{ animationDelay: `${index * 60}ms` }}
            className="animate-fade-in flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-300 hover:border-lime-500/40 sm:flex-row sm:items-center sm:gap-5"
          >
            <span className="w-28 shrink-0 text-sm font-extrabold uppercase tracking-wide text-lime-300">{item.day}</span>
            <div className="min-w-0 space-y-1">
              <p className="text-base font-bold text-white">{item.title}</p>
              {item.exercises.length > 0 && (
                <p className="text-sm leading-relaxed text-slate-400">{item.exercises.join(' · ')}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
