import { Trophy } from 'lucide-react';
import Modal from '@/components/Modal';
import { BADGE_CATALOG, streakTitle, type CompletionResult } from '@/lib/achievements';

interface CompletionModalProps {
  result: CompletionResult;
  onClose: () => void;
}

export default function CompletionModal({ result, onClose }: CompletionModalProps) {
  const primary = result.isFirstEver ? BADGE_CATALOG.first.title : streakTitle(result.streak);
  const extras = result.newBadges.filter((id) => id !== 'first');

  return (
    <Modal title="Тренування зараховано!" onClose={onClose}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-lime-500/15 text-lime-300">
          <Trophy className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-400">Твій новий бейдж</p>
          <p className="text-2xl font-extrabold text-white">{primary}</p>
          <p className="text-sm leading-relaxed text-slate-300">
            Ти зробив ще один крок до сильнішої версії себе. Так тримати!
          </p>
        </div>
        {extras.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-lime-300">Нові досягнення разом</p>
            <div className="flex flex-wrap justify-center gap-2">
              {extras.map((id) => (
                <span key={id} className="rounded-full border border-lime-500/40 bg-lime-500/10 px-3 py-1.5 text-sm font-semibold text-white">
                  {BADGE_CATALOG[id].title}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-lime-500 px-6 py-3.5 text-sm font-extrabold text-slate-900 transition hover:bg-lime-400"
        >
          Чудово!
        </button>
      </div>
    </Modal>
  );
}
