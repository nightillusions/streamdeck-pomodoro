export type PomodoroTimer = {
  isRunning: boolean;
  intervalId: number | null;
  phase: Phase;
  cycle: number;
  start: number;
  diff: number;
  minutes: number;
  seconds: number;
};

export type Phase = 'timer' | 'shortBreak' | 'longBreak';
