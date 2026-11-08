import type { Exercise, Goal, Level, Minutes, WeeklyDay, WorkoutPlan } from '@/types';

export const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 'beginner', label: '🐣 Тільки починаю' },
  { value: 'amateur', label: '⚡ Любитель' },
  { value: 'regular', label: '🔥 Займаюся регулярно' },
];

export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: 'energy', label: 'Швидкий заряд енергії (10 хв)' },
  { value: 'back', label: 'Зняти напругу в спині після уроків (15 хв)' },
  { value: 'core', label: 'Потужний прес і руки (15 хв)' },
];

export const TIME_OPTIONS: Minutes[] = [10, 15, 20];

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'Тільки починаю',
  amateur: 'Любитель',
  regular: 'Займаюся регулярно',
};

export const GOAL_LABELS: Record<Goal, string> = {
  energy: 'Швидкий заряд енергії',
  back: 'Зняти напругу в спині',
  core: 'Прес і руки',
};

interface ExerciseTemplate {
  name: string;
  kind: 'reps' | 'time';
  base: Record<Level, number>;
  tip: string;
}

const GOAL_TEMPLATES: Record<Goal, { title: string; exercises: ExerciseTemplate[] }> = {
  energy: {
    title: 'Заряд енергії',
    exercises: [
      {
        name: 'Стрибки «джампінг-джек»',
        kind: 'reps',
        base: { beginner: 10, amateur: 20, regular: 30 },
        tip: 'М’яко приземляйся на носки, коліна трохи зігнуті, дихай рівно.',
      },
      {
        name: 'Високе коліно на місці',
        kind: 'time',
        base: { beginner: 20, amateur: 30, regular: 45 },
        tip: 'Працюй руками в такт і тримай корпус прямо, без відхилів назад.',
      },
      {
        name: 'Присідання з вагою тіла',
        kind: 'reps',
        base: { beginner: 8, amateur: 15, regular: 20 },
        tip: 'Коліна ведуть за носками, спина рівна, п’яти притиснуті до підлоги.',
      },
    ],
  },
  back: {
    title: 'Розслаблення спини',
    exercises: [
      {
        name: 'Кішка-корова',
        kind: 'reps',
        base: { beginner: 6, amateur: 10, regular: 12 },
        tip: 'Рухайся плавно разом із диханням: вдих — прогин, видих — округлення.',
      },
      {
        name: 'Поза дитини',
        kind: 'time',
        base: { beginner: 30, amateur: 40, regular: 60 },
        tip: 'Тягнися руками вперед і дай спині розслабитися, не поспішай із дихання.',
      },
      {
        name: 'Супермен лежачи',
        kind: 'reps',
        base: { beginner: 6, amateur: 10, regular: 14 },
        tip: 'Піднімай руки й ноги лише настільки, наскільки комфортно, шия довга.',
      },
    ],
  },
  core: {
    title: 'Прес і руки',
    exercises: [
      {
        name: 'Віджимання від підлоги',
        kind: 'reps',
        base: { beginner: 5, amateur: 10, regular: 20 },
        tip: 'Тіло прямою лінією від голови до п’ят; якщо важко — відштовхуйся від колін.',
      },
      {
        name: 'Скручування лежачи',
        kind: 'reps',
        base: { beginner: 10, amateur: 16, regular: 24 },
        tip: 'Піднімай плечі, а не шию; руки за головою не тягни, тільки торкайся.',
      },
      {
        name: 'Планка на передпліччях',
        kind: 'time',
        base: { beginner: 15, amateur: 30, regular: 45 },
        tip: 'Лікті під плечима, сідниці напружені, живіт втягнутий, дихай носом.',
      },
    ],
  },
};

const MOTIVATION_LINES = [
  'Ти крутіший, ніж здається! Зроби 10 присідань — і мозок перезавантажиться. Кожна вправа сьогодні — це твоя маленька перемога.',
  'Не треба ідеально, достатньо почати. Ти вже тут, і це найважливіше. Викладайся стільки, скільки комфортно, і пишайся собою.',
  'Твоє тіло вміє більше, ніж думаєш. Крок за кроком ти стаєш сильнішим, і це помітно. Поїхали, ти цього варта!',
  'Сьогодні ти вибрав себе, а не відмовки. Це вже супер-сила. Тренуйся у своєму темпі, і результат прийде сам.',
];

const WEEK_ORDER: (Goal | 'rest')[] = ['energy', 'core', 'back', 'energy', 'core', 'back', 'rest'];
const WEEK_DAYS = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П’ятниця", 'Субота', 'Неділя'];

export function setsForMinutes(minutes: Minutes): number {
  if (minutes === 10) return 2;
  if (minutes === 15) return 3;
  return 4;
}

export function buildMockWorkout(level: Level, goal: Goal, minutes: Minutes): WorkoutPlan {
  const template = GOAL_TEMPLATES[goal];
  const sets = setsForMinutes(minutes);
  const exercises: Exercise[] = template.exercises.map((item) => {
    const amount = item.base[level];
    const reps = item.kind === 'reps'
      ? `${amount} повторень × ${sets} підходи`
      : `${amount} сек × ${sets} підходи`;
    return { name: item.name, reps, tip: item.tip };
  });
  const motivation = MOTIVATION_LINES[Math.floor(Math.random() * MOTIVATION_LINES.length)];
  return {
    title: `${template.title} · ${minutes} хв`,
    minutes,
    exercises,
    motivation,
    source: 'mock',
  };
}

export function buildMockWeek(): WeeklyDay[] {
  return WEEK_ORDER.map((focus, index) => {
    if (focus === 'rest') {
      return {
        day: WEEK_DAYS[index],
        title: 'Відпочинок і прогулянка',
        exercises: ['Легка прогулянка 20 хв', 'Розтяжка всього тіла 5 хв'],
      };
    }
    const template = GOAL_TEMPLATES[focus];
    return {
      day: WEEK_DAYS[index],
      title: template.title,
      exercises: template.exercises.map((item) => item.name),
    };
  });
}
