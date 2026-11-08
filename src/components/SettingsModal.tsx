import { CheckCircle2, Loader2, PlugZap, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import Modal from '@/components/Modal';
import ModelSelector from '@/components/ModelSelector';
import { AI_MODELS } from '@/lib/aiModels';
import { testConnection } from '@/lib/aiService';

interface SettingsModalProps {
  apiKey: string | null;
  model: string;
  onSave: (key: string, model: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

type TestState =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'ok' }
  | { status: 'error'; message: string };

export default function SettingsModal({ apiKey, model, onSave, onRemove, onClose }: SettingsModalProps) {
  const [draftKey, setDraftKey] = useState(apiKey ?? '');
  const [draftModel, setDraftModel] = useState(model);
  const [test, setTest] = useState<TestState>({ status: 'idle' });
  const testRunRef = useRef(0);

  const resetTest = () => {
    testRunRef.current += 1;
    setTest({ status: 'idle' });
  };

  const changeKey = (value: string) => {
    setDraftKey(value);
    resetTest();
  };

  const changeModel = (id: string) => {
    setDraftModel(id);
    resetTest();
  };

  const handleTest = async () => {
    const key = draftKey.trim();
    if (!key) return;
    const runId = ++testRunRef.current;
    setTest({ status: 'checking' });
    const result = await testConnection(key, draftModel);
    if (runId !== testRunRef.current) return;
    setTest(result.ok ? { status: 'ok' } : { status: 'error', message: result.message });
  };

  const handleSave = () => {
    const key = draftKey.trim();
    if (!key) return;
    onSave(key, draftModel);
  };

  const modelName = AI_MODELS.find((item) => item.id === draftModel)?.name ?? draftModel;
  const canTest = draftKey.trim().length > 0 && test.status !== 'checking';

  return (
    <Modal title="AI Налаштування" onClose={onClose}>
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-slate-300">
          Встав свій OpenRouter API Key, і ментор складатиме тренування з допомогою AI. Ключ зберігається
          лише в цьому браузері. Без ключа застосунок працює у безпечному офлайн-режимі.
        </p>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-200">API Key</span>
          <input
            type="password"
            value={draftKey}
            onChange={(event) => changeKey(event.target.value)}
            placeholder="sk-or-..."
            autoComplete="off"
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 transition focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/30"
          />
        </label>

        <ModelSelector value={draftModel} onChange={changeModel} />

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleTest}
            disabled={!canTest}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:border-lime-500 hover:text-lime-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {test.status === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
            Перевірити, чи працює {modelName}
          </button>

          {test.status === 'ok' && (
            <div role="status" className="animate-fade-in flex items-start gap-3 rounded-2xl border border-lime-500/40 bg-lime-500/10 p-4 text-sm leading-relaxed text-lime-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lime-400" />
              <p>Модель відповіла. Усе працює, можна складати тренування з AI!</p>
            </div>
          )}
          {test.status === 'error' && (
            <div role="alert" className="animate-fade-in flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm leading-relaxed text-rose-200">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
              <p>{test.message} Поки що тренування складатиме офлайн-режим.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {apiKey && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-2xl border border-rose-500/40 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Видалити ключ
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!draftKey.trim()}
            className="rounded-2xl bg-lime-500 px-5 py-3 text-sm font-extrabold text-slate-900 shadow-lg shadow-lime-500/20 transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Зберегти
          </button>
        </div>
      </div>
    </Modal>
  );
}
