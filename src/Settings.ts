import { isSomething } from 'ts-type-guards';

export function isSettings(value: unknown): value is Settings {
  return (
    Object.prototype.hasOwnProperty.call(value as Settings, 'pomodoro')
    && isSomething((value as Settings).pomodoro)
    && Object.prototype.hasOwnProperty.call(value as Settings, 'shortBreak')
    && isSomething((value as Settings).shortBreak)
    && Object.prototype.hasOwnProperty.call(value as Settings, 'shortBreak')
    && isSomething((value as Settings).shortBreak)
    && Object.prototype.hasOwnProperty.call(value as Settings, 'longBreak')
    && isSomething((value as Settings).longBreak)
    && Object.prototype.hasOwnProperty.call(value as Settings, 'autoStartBreaks')
    && isSomething((value as Settings).autoStartBreaks)
    && Object.prototype.hasOwnProperty.call(value as Settings, 'autoStartPomodoro')
    && isSomething((value as Settings).autoStartPomodoro)
    && Object.prototype.hasOwnProperty.call(value as Settings, 'longBreakInterval')
    && isSomething((value as Settings).longBreakInterval)
  );
}

export type Settings = {
  pomodoro: string;
  shortBreak: string;
  longBreak: string;
  autoStartBreaks: string;
  autoStartPomodoro: string;
  longBreakInterval: string;
};
