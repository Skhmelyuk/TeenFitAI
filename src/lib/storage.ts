import { AI_MODELS, DEFAULT_MODEL_ID } from '@/lib/aiModels';

const API_KEY_STORAGE = 'teenfit.openrouterKey';
const MODEL_STORAGE = 'teenfit.openrouterModel';

export function getModelId(): string {
  const stored = localStorage.getItem(MODEL_STORAGE);
  return stored && AI_MODELS.some((model) => model.id === stored) ? stored : DEFAULT_MODEL_ID;
}

export function saveModelId(id: string): void {
  localStorage.setItem(MODEL_STORAGE, id);
}

export function getApiKey(): string | null {
  const stored = localStorage.getItem(API_KEY_STORAGE)?.trim();
  return stored ? stored : null;
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function removeApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE);
}
