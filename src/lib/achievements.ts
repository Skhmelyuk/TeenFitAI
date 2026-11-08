import type { BadgeId } from '@/types';

const COMPLETIONS_STORAGE = 'teenfit.completions';
const BADGES_STORAGE = 'teenfit.badges';

export const BADGE_CATALOG: Record<BadgeId, { title: string; hint: string }> = {
  first: { title: 'Перший крок зроблено 🏆', hint: 'Заверши своє перше тренування' },
  streak3: { title: 'Три дні поспіль ⚡', hint: 'Тренуйся 3 дні поспіль' },
  streak7: { title: 'Тиждень без пропусків 💪', hint: 'Тренуйся 7 днів поспіль' },
};

export interface CompletionResult {
  alreadyLogged: boolean;
  isFirstEver: boolean;
  streak: number;
  newBadges: BadgeId[];
}

const isBadgeId = (value: string): value is BadgeId => value in BADGE_CATALOG;

function readList(key: string): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayKey(): string {
  return formatDateKey(new Date());
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function computeStreak(days: string[], today: string): number {
  const set = new Set(days);
  const cursor = parseDateKey(today);
  let streak = 0;
  while (set.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function streakTitle(streak: number): string {
  const mod10 = streak % 10;
  const mod100 = streak % 100;
  let word = 'днів';
  if (mod10 === 1 && mod100 !== 11) word = 'день';
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) word = 'дні';
  return `Стрік ${streak} ${word} 🔥`;
}

export function hasCompletedOn(dateKey: string): boolean {
  return readList(COMPLETIONS_STORAGE).includes(dateKey);
}

export function getEarnedBadges(): BadgeId[] {
  return readList(BADGES_STORAGE).filter(isBadgeId);
}

export function logCompletion(dateKey: string): CompletionResult {
  const days = readList(COMPLETIONS_STORAGE);
  const earned = getEarnedBadges();
  if (days.includes(dateKey)) {
    return { alreadyLogged: true, isFirstEver: false, streak: computeStreak(days, dateKey), newBadges: [] };
  }

  const updated = [...days, dateKey];
  const streak = computeStreak(updated, dateKey);
  const candidates: BadgeId[] = [];
  if (updated.length === 1) candidates.push('first');
  if (streak >= 3) candidates.push('streak3');
  if (streak >= 7) candidates.push('streak7');
  const newBadges = candidates.filter((id) => !earned.includes(id));

  writeList(COMPLETIONS_STORAGE, updated);
  writeList(BADGES_STORAGE, [...earned, ...newBadges]);
  return { alreadyLogged: false, isFirstEver: updated.length === 1, streak, newBadges };
}
