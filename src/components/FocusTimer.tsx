import { Pause, Play, RotateCcw } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';

interface FocusTimerProps {
  minutes: number;
}

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function FocusTimer({ minutes }: FocusTimerProps) {
  const { remaining, running, finished, progress, toggle, reset } = useCountdown(minutes * 60);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const statusText = finished ? 'Чудова робота! Час вийшов' : running ? 'Йдемо далі, ти молодець!' : 'Натисни старт, коли готовий';

  return (
    <section className="flex flex-col items-center gap-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg sm:flex-row sm:gap-8 sm:p-8">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="80" cy="80" r={RADIUS} fill="none" strokeWidth="12" className="stroke-slate-800" />
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="stroke-rose-500 transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-extrabold tabular-nums text-white">{formatTime(remaining)}</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">таймер</span>
        </div>
      </div>

      <div className="w-full space-y-4 text-center sm:text-left">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white">Таймер тренування</h2>
          <p className="text-sm leading-relaxed text-slate-400">{statusText}</p>
        </div>
        <div className="flex items-center justify-center gap-3 sm:justify-start">
          <button
            type="button"
            onClick={toggle}
            disabled={finished}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-rose-500/25 transition hover:-translate-y-0.5 hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? 'Пауза' : 'Старт'}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Скинути таймер"
            className="rounded-2xl border border-slate-700 p-3 text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
