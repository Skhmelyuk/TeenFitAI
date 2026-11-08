import { Lock, Medal } from 'lucide-react';
import { BADGE_CATALOG } from '@/lib/achievements';
import type { BadgeId } from '@/types';

interface BadgeShelfProps {
  earned: BadgeId[];
}

export default function BadgeShelf({ earned }: BadgeShelfProps) {
  const ids = Object.keys(BADGE_CATALOG) as BadgeId[];
  return (
    <section className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <Medal className="h-5 w-5 text-lime-300" />
        <h2 className="text-lg font-extrabold text-white">Твої досягнення</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {ids.map((id) => {
          const unlocked = earned.includes(id);
          const badge = BADGE_CATALOG[id];
          return (
            <div
              key={id}
              className={`rounded-2xl border p-4 transition duration-300 ${
                unlocked
                  ? 'border-lime-500/50 bg-lime-500/10'
                  : 'border-slate-800 bg-slate-950/60'
              }`}
            >
              <div className="flex items-center gap-2">
                {!unlocked && <Lock className="h-4 w-4 shrink-0 text-slate-500" />}
                <p className={`text-sm font-bold ${unlocked ? 'text-white' : 'text-slate-400'}`}>{badge.title}</p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{badge.hint}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
