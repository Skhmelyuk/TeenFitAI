import { AI_MODELS } from '@/lib/aiModels';

interface ModelSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-semibold text-slate-200">Модель штучного інтелекту</legend>
      <div className="grid gap-2">
        {AI_MODELS.map((model) => {
          const selected = model.id === value;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onChange(model.id)}
              aria-pressed={selected}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 ${
                selected
                  ? 'border-lime-500 bg-lime-500/10'
                  : 'border-slate-700 bg-slate-950 hover:border-slate-500'
              }`}
            >
              <span
                className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-lime-400' : 'border-slate-500'
                }`}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-lime-400" />}
              </span>
              <span className="min-w-0 space-y-0.5">
                <span className="block text-sm font-bold text-white">{model.name}</span>
                <span className="block text-xs leading-relaxed text-slate-400">{model.hint}</span>
                <span className="block truncate font-mono text-[11px] text-slate-500">{model.id}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
