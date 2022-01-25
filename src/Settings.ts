import { convertToSeconds } from './helper/Time';
import { isDev } from './helper/Env';
import { isSomething } from 'ts-type-guards';

export const defaultRangeSettings = {
  timer: isDev ? '10' : '25',
  shortBreak: isDev ? '5' : '5',
  longBreak: isDev ? '8' : '10',
  interval: isDev ? '2' : '4',
  min: isDev ? '1' : '5',
  max: isDev ? '10' : '60',
  step: isDev ? '1' : '5',
};

export function isSettings(value: unknown): value is Settings {
  return (
    (value as Settings).hasOwnProperty('timer')
    && isSomething((value as Settings).timer)
    && (value as Settings).hasOwnProperty('shortBreak')
    && isSomething((value as Settings).shortBreak)
    && (value as Settings).hasOwnProperty('longBreak')
    && isSomething((value as Settings).longBreak)
    && (value as Settings).hasOwnProperty('interval')
    && isSomething((value as Settings).interval)
  );
}

export type Settings = {
  timer: string;
  shortBreak: string;
  longBreak: string;
  interval: string;
};

export const defaultSettings: Settings = {
  timer: isDev ? defaultRangeSettings.timer : convertToSeconds('25'),
  shortBreak: isDev ? defaultRangeSettings.shortBreak : convertToSeconds('5'),
  longBreak: isDev ? defaultRangeSettings.longBreak : convertToSeconds('10'),
  interval: isDev ? defaultRangeSettings.interval : '4',
};

export const pomodoroImages = {
  timer: 'images/action2.key.png',
  break: 'images/action1.key.png',
};
