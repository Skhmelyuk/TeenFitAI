import {
  GOAL_LABELS,
  LEVEL_LABELS,
  buildMockWeek,
  buildMockWorkout,
  setsForMinutes,
} from '@/lib/workoutLibrary';
import type {
  Exercise,
  WeeklyDay,
  WeeklyParams,
  WorkoutParams,
  WorkoutPlan,
} from '@/types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const REQUEST_TIMEOUT_MS = 15000;
const MOCK_DELAY_MS = 700;

const MENTOR_SYSTEM_PROMPT =
  'Ти дружній спортивний ментор для підлітків 13–17 років. Пишеш українською, тепло і підтримуюче, без крику. ' +
  'Відповідаєш ЛИШЕ валідним JSON-об’єктом без пояснень і без markdown.';

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isExercise = (value: unknown): value is Exercise =>
  isRecord(value) &&
  typeof value.name === 'string' &&
  typeof value.reps === 'string' &&
  typeof value.tip === 'string';

class OpenRouterError extends Error {
  constructor(readonly status: number | null, message: string) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

async function requestCompletion(apiKey: string, model: string, userPrompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'TeenFit AI',
      },
      body: JSON.stringify({
        model,
        temperature: 0.8,
        messages: [
          { role: 'system', content: MENTOR_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!response.ok) throw new OpenRouterError(response.status, `OpenRouter responded with ${response.status}`);
    const data: unknown = await response.json();
    const content = extractMessageContent(data);
    if (!content) throw new OpenRouterError(null, 'OpenRouter returned no content');
    return content;
  } finally {
    window.clearTimeout(timeout);
  }
}

function extractMessageContent(data: unknown): string | null {
  if (!isRecord(data) || !Array.isArray(data.choices)) return null;
  const first: unknown = data.choices[0];
  if (!isRecord(first) || !isRecord(first.message)) return null;
  return typeof first.message.content === 'string' ? first.message.content : null;
}

function parseJsonObject(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) throw new Error('No JSON object in response');
  return JSON.parse(text.slice(start, end + 1));
}

function toWorkoutPlan(raw: unknown, params: WorkoutParams): WorkoutPlan | null {
  if (!isRecord(raw)) return null;
  const { title, motivation, exercises } = raw;
  if (typeof title !== 'string' || typeof motivation !== 'string' || !Array.isArray(exercises)) {
    return null;
  }
  const valid = exercises.filter(isExercise);
  if (valid.length !== 3) return null;
  return { title, motivation, exercises: valid, minutes: params.minutes, source: 'ai' };
}

function isWeeklyDay(value: unknown): value is WeeklyDay {
  return (
    isRecord(value) &&
    typeof value.day === 'string' &&
    typeof value.title === 'string' &&
    Array.isArray(value.exercises) &&
    value.exercises.every((item) => typeof item === 'string')
  );
}

function toWeeklyPlan(raw: unknown): WeeklyDay[] | null {
  if (!isRecord(raw) || !Array.isArray(raw.days)) return null;
  if (raw.days.length !== 7 || !raw.days.every(isWeeklyDay)) return null;
  return raw.days;
}

function buildWorkoutPrompt(params: WorkoutParams): string {
  const sets = setsForMinutes(params.minutes);
  return [
    `Склади міні-тренування на ${params.minutes} хвилин без спорядження, лише з власною вагою тіла.`,
    `Рівень: ${LEVEL_LABELS[params.level]}. Ціль: ${GOAL_LABELS[params.goal]}. Підходів: ${sets}.`,
    'Потрібно рівно 3 вправи. Для кожної вкажи назву, повторення або час і коротку підказку з техніки безпеки без травм.',
    'Додай мотивацію: рівно 2 живих речення підтримки підлітку.',
    'Формат відповіді (JSON): {"title": "...", "exercises": [{"name": "...", "reps": "...", "tip": "..."}], "motivation": "..."}',
  ].join('\n');
}

function buildWeeklyPrompt(params: WeeklyParams): string {
  return [
    `Склади план тренувань на 7 днів (від понеділка до неділі) для рівня: ${LEVEL_LABELS[params.level]}.`,
    'Тренування без спорядження, один день має бути відпочинком. Кожен день: назва фокусу та 2–3 вправи.',
    'Формат відповіді (JSON): {"days": [{"day": "Понеділок", "title": "...", "exercises": ["..."]}]} рівно з 7 днями.',
  ].join('\n');
}

export async function generateWorkout(params: WorkoutParams): Promise<WorkoutPlan> {
  if (params.apiKey) {
    try {
      const text = await requestCompletion(params.apiKey, params.model, buildWorkoutPrompt(params));
      const plan = toWorkoutPlan(parseJsonObject(text), params);
      if (plan) return plan;
    } catch {
      // Network or model failure: fall back to the offline plan below.
    }
  }
  await delay(MOCK_DELAY_MS);
  return buildMockWorkout(params.level, params.goal, params.minutes);
}

export async function generateWeeklyPlan(params: WeeklyParams): Promise<WeeklyDay[]> {
  if (params.apiKey) {
    try {
      const text = await requestCompletion(params.apiKey, params.model, buildWeeklyPrompt(params));
      const week = toWeeklyPlan(parseJsonObject(text));
      if (week) return week;
    } catch {
      // Network or model failure: fall back to the offline plan below.
    }
  }
  await delay(MOCK_DELAY_MS);
  return buildMockWeek();
}

export type ConnectionTestResult = { ok: true } | { ok: false; message: string };

function describeConnectionError(error: unknown): string {
  if (error instanceof OpenRouterError) {
    if (error.status === 401 || error.status === 403) {
      return 'Ключ не підійшов. Перевір, чи він скопійований повністю.';
    }
    if (error.status === 404) return 'Ця модель зараз недоступна. Обери іншу.';
    if (error.status === 429) return 'Забагато запитів. Спробуй трохи пізніше.';
    if (error.status !== null) return 'OpenRouter відповів помилкою. Спробуй ще раз.';
    return 'Модель не відповіла. Спробуй іншу.';
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'Немає відповіді довше 15 секунд. Перевір інтернет.';
  }
  return 'Немає зв’язку з OpenRouter. Перевір інтернет.';
}

export async function testConnection(apiKey: string, model: string): Promise<ConnectionTestResult> {
  try {
    await requestCompletion(apiKey, model, 'Перевірка зв’язку. Відповідь у форматі JSON: {"status": "ok"}');
    return { ok: true };
  } catch (error) {
    return { ok: false, message: describeConnectionError(error) };
  }
}
