export interface AiModelOption {
  id: string;
  name: string;
  hint: string;
}

export const AI_MODELS: AiModelOption[] = [
  {
    id: 'nvidia/nemotron-3.5-super-vl:free',
    name: 'NVIDIA: Nemotron 3.5 Super VL (free)',
    hint: 'Мультимодальна модель, найкраща за замовчуванням',
  },
  {
    id: 'dots-studio/dots-3-note-preview:free',
    name: 'Dots Studio: Dots3-Note Preview (free)',
    hint: 'Легка універсальна модель від Dots Studio',
  },
  {
    id: 'nvidia/nemotron-3.5-lightning:free',
    name: 'NVIDIA: Nemotron 3.5 Lightning (free)',
    hint: 'Найшвидша модель для коротких відповідей',
  },
  {
    id: 'nvidia/nemotron-3.5-content-safety:free',
    name: 'NVIDIA: Nemotron 3.5 Content Safety (free)',
    hint: 'Модерація контенту; може не скласти план тренування',
  },
];

export const DEFAULT_MODEL_ID = AI_MODELS[0].id;
