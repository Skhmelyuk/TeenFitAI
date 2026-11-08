export type Level = 'beginner' | 'amateur' | 'regular';
export type Goal = 'energy' | 'back' | 'core';
export type Minutes = 10 | 15 | 20;
export type BadgeId = 'first' | 'streak3' | 'streak7';

export interface Exercise {
  name: string;
  reps: string;
  tip: string;
}

export interface WorkoutPlan {
  title: string;
  minutes: Minutes;
  exercises: Exercise[];
  motivation: string;
  source: 'ai' | 'mock';
}

export interface WeeklyDay {
  day: string;
  title: string;
  exercises: string[];
}

export interface WorkoutParams {
  level: Level;
  goal: Goal;
  minutes: Minutes;
  apiKey: string | null;
  model: string;
}

export interface WeeklyParams {
  level: Level;
  apiKey: string | null;
  model: string;
}
