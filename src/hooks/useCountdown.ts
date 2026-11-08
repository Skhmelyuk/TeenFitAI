import { useEffect, useState } from 'react';

export function useCountdown(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setRemaining(totalSeconds);
    setRunning(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining === 0) setRunning(false);
  }, [remaining]);

  const reset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };

  return {
    remaining,
    running,
    finished: remaining === 0,
    progress: totalSeconds > 0 ? remaining / totalSeconds : 0,
    toggle: () => setRunning((value) => !value && remaining > 0),
    reset,
  };
}
