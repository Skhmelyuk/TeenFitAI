import { Settings, Zap } from 'lucide-react';

interface HeaderProps {
  hasApiKey: boolean;
  onOpenSettings: () => void;
}

export default function Header({ hasApiKey, onOpenSettings }: HeaderProps) {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-500 text-slate-900 shadow-lg shadow-lime-500/20">
          <Zap className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-lg font-extrabold leading-tight text-white">TeenFit AI</p>
          <p className="text-sm leading-snug text-slate-400">Твій кишеньковий спортивний ментор</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`hidden rounded-full border px-3 py-1 text-xs font-semibold sm:inline-block ${
            hasApiKey
              ? 'border-lime-500/40 bg-lime-500/10 text-lime-300'
              : 'border-slate-700 bg-slate-800 text-slate-300'
          }`}
        >
          {hasApiKey ? 'AI-режим' : 'Офлайн-режим'}
        </span>
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-semibold text-white transition hover:border-lime-500/60 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500"
        >
          <Settings className="h-4 w-4" />
          AI Налаштування
        </button>
      </div>
    </header>
  );
}
