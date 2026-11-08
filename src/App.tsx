import { useCallback, useRef, useState } from 'react';
import BadgeShelf from '@/components/BadgeShelf';
import CompletionModal from '@/components/CompletionModal';
import EmptyState from '@/components/EmptyState';
import Header from '@/components/Header';
import SelectorPanel from '@/components/SelectorPanel';
import SettingsModal from '@/components/SettingsModal';
import WeeklyPlan from '@/components/WeeklyPlan';
import WorkoutResult from '@/components/WorkoutResult';
import { generateWeeklyPlan, generateWorkout } from '@/lib/aiService';
import {
  getEarnedBadges,
  hasCompletedOn,
  logCompletion,
  todayKey,
  type CompletionResult,
} from '@/lib/achievements';
import { getApiKey, getModelId, removeApiKey, saveApiKey, saveModelId } from '@/lib/storage';
import type { BadgeId, Goal, Level, Minutes, WeeklyDay, WorkoutPlan } from '@/types';

const MISSING_SELECTION_MESSAGE = 'Обери свій рівень і ціль, щоб отримати план тренування';
const MISSING_LEVEL_MESSAGE = 'Обери свій рівень, щоб скласти план на тиждень';
const GENERIC_ERROR_MESSAGE = 'Щось пішло не так, спробуй ще раз за хвилинку. Ми поруч!';

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(getApiKey);
  const [model, setModel] = useState<string>(getModelId);
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [minutes, setMinutes] = useState<Minutes>(15);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [week, setWeek] = useState<WeeklyDay[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [completedToday, setCompletedToday] = useState(() => hasCompletedOn(todayKey()));
  const [earned, setEarned] = useState<BadgeId[]>(getEarnedBadges);
  const [celebration, setCelebration] = useState<CompletionResult | null>(null);
  const requestRef = useRef(0);

  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const closeCelebration = useCallback(() => setCelebration(null), []);

  const runWorkout = async (selectedLevel: Level, selectedGoal: Goal, selectedMinutes: Minutes) => {
    const requestId = ++requestRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateWorkout({
        level: selectedLevel,
        goal: selectedGoal,
        minutes: selectedMinutes,
        apiKey,
        model,
      });
      if (requestId !== requestRef.current) return;
      setWeek(null);
      setWorkout(plan);
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWorkout = () => {
    if (!level || !goal) {
      setError(MISSING_SELECTION_MESSAGE);
      return;
    }
    void runWorkout(level, goal, minutes);
  };

  const handleQuickStart = (selectedGoal: Goal) => {
    const selectedLevel = level ?? 'beginner';
    setLevel(selectedLevel);
    setGoal(selectedGoal);
    void runWorkout(selectedLevel, selectedGoal, minutes);
  };

  const handleGenerateWeek = async () => {
    if (!level) {
      setError(MISSING_LEVEL_MESSAGE);
      return;
    }
    const requestId = ++requestRef.current;
    setIsLoading(true);
    setError(null);
    try {
      const days = await generateWeeklyPlan({ level, apiKey, model });
      if (requestId !== requestRef.current) return;
      setWorkout(null);
      setWeek(days);
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    const result = logCompletion(todayKey());
    setCompletedToday(true);
    setEarned(getEarnedBadges());
    if (!result.alreadyLogged) setCelebration(result);
  };

  const handleSaveSettings = (key: string, selectedModel: string) => {
    saveApiKey(key);
    saveModelId(selectedModel);
    setApiKey(key);
    setModel(selectedModel);
    setIsSettingsOpen(false);
  };

  const handleRemoveKey = () => {
    removeApiKey();
    setApiKey(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f172a] font-sans text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-lime-500/10 to-transparent" />
      <div className="relative">
        <Header hasApiKey={apiKey !== null} onOpenSettings={() => setIsSettingsOpen(true)} />

        <main className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-10">
          <SelectorPanel
            level={level}
            goal={goal}
            minutes={minutes}
            isLoading={isLoading}
            error={error}
            onLevelChange={setLevel}
            onGoalChange={setGoal}
            onMinutesChange={setMinutes}
            onGenerateWorkout={handleGenerateWorkout}
            onGenerateWeek={handleGenerateWeek}
          />

          <section className="min-w-0">
            {week ? (
              <WeeklyPlan days={week} />
            ) : workout ? (
              <WorkoutResult plan={workout} completedToday={completedToday} onComplete={handleComplete} />
            ) : (
              <EmptyState onQuickStart={handleQuickStart} disabled={isLoading} />
            )}
          </section>

          <div className="lg:col-span-2">
            <BadgeShelf earned={earned} />
          </div>
        </main>
      </div>

      {isSettingsOpen && (
        <SettingsModal
          apiKey={apiKey}
          model={model}
          onSave={handleSaveSettings}
          onRemove={handleRemoveKey}
          onClose={closeSettings}
        />
      )}
      {celebration && <CompletionModal result={celebration} onClose={closeCelebration} />}
    </div>
  );
}
