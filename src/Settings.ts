import { isSomething } from 'ts-type-guards';

export function isSettings(value: unknown): value is Settings {
  return (
    (value as Settings).hasOwnProperty('timer')
    && isSomething((value as Settings).timer)
    && (value as Settings).hasOwnProperty('pause')
    && isSomething((value as Settings).pause)
    && (value as Settings).hasOwnProperty('shortBreak')
    && isSomething((value as Settings).shortBreak)
    && (value as Settings).hasOwnProperty('longBreak')
    && isSomething((value as Settings).longBreak)
    && (value as Settings).hasOwnProperty('interval')
    && isSomething((value as Settings).interval)
  );
}

export type Settings = {
  timer: number;
  pause: number;
  shortBreak: number;
  longBreak: number;
  interval: string;
};
