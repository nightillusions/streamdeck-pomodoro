import { Settings, isSettings } from './Settings';
import { durationToMMSS, padTime } from './helper/Time';

import { Streamdeck } from '@rweich/streamdeck-ts';

type PomodoroTimer = {
  runningStatus: boolean;
  intervalId: number | null;
  start: number;
  diff: number;
  minutes: number;
  seconds: number;
};

const plugin = new Streamdeck().plugin();
const settings: Record<string, Settings> = {};
const pomodoroTimer: Record<string, PomodoroTimer> = {};
const images = {
  running: 'images/action2.key.png',
  stopped: 'images/action1.key.png',
};

// your code here..
plugin.on('willAppear', ({ context }) => {
  setImage('stopped', context);
  updateRunningStatus(false, context);
  updateIntervalId(null, context);
  updateStartTime(context);
  updateDiff(0, context);
  updateMinutes(0, context);
  updateSeconds(0, context);
});
// timer, shortBreak, longBreak, interval
plugin.on('didReceiveSettings', (event) => {
  if (isSettings(event.settings)) {
    updateSettings(event.settings as Settings, event.context);
  }
});

plugin.on('keyDown', ({ context }) => {
  const { runningStatus: isRunnging, intervalId } = pomodoroTimer[context];
  updateStartTime(context);

  if (isRunnging && intervalId) {
    console.log('Stopped');

    setImage('stopped', context);
    stopTimer(context);
    resetTimer(context);
  } else {
    console.log('Running');
    setImage('running', context);
    startTimer(context);
  }
});

function updatePiSettings(context: string): void {
  plugin.setSettings(context, {});
}

function updateSettings(updatedSettings: Settings, context: string): void {
  if (isSettings(updatedSettings)) {
    settings[context] = updatedSettings;
    plugin.setTitle(durationToMMSS(settings[context].timer), context);
  } else {
    plugin.setTitle('ERROR', context);
  }
}

function timer(phase: 'pause' | 'timer' = 'timer', context: string) {
  if (!settings[context][phase]) {
    return;
  }

  updateDiff(Number(settings[context].timer) - (((Date.now() - pomodoroTimer[context].start) / 1000) | 0), context);
  updateMinutes((pomodoroTimer[context].diff / 60) | 0, context);
  updateSeconds(pomodoroTimer[context].diff % 60 | 0, context);
  updateMinutes(
    pomodoroTimer[context].minutes < 10 ? 0 + pomodoroTimer[context].minutes : pomodoroTimer[context].minutes,
    context,
  );
  updateSeconds(
    pomodoroTimer[context].seconds < 10 ? 0 + pomodoroTimer[context].seconds : pomodoroTimer[context].seconds,
    context,
  );

  plugin.setTitle(`${padTime(pomodoroTimer[context].minutes)}:${padTime(pomodoroTimer[context].seconds)}`, context);

  if (pomodoroTimer[context].diff <= 0) {
    updateStartTime(context, Date.now() + 1000);
  }
  if (pomodoroTimer[context].minutes <= 0 && pomodoroTimer[context].seconds <= 0) {
    console.log('Timer exceeded, stoping');
    stopTimer(context);
    setImage('stopped', context);
    plugin.setTitle('PAUSE', context);
    return;
  }
}

function setImage(status: 'running' | 'stopped', context: string) {
  const image = new Image();
  image.addEventListener('load', () => {
    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    canvas.getContext('2d')?.drawImage(image, 0, 0);
    plugin.setImage(canvas.toDataURL('image/png'), context);
  });
  image.src = images[status];
}
function resetTimer(context: string) {
  plugin.setTitle(durationToMMSS(settings[context].timer), context);
}
function startTimer(context: string) {
  timer('timer', context);
  updateIntervalId(
    window.setInterval(() => timer('timer', context), 1000),
    context,
  );
  updateRunningStatus(true, context);
}
function stopTimer(context: string) {
  const { intervalId } = pomodoroTimer[context];
  if (intervalId) {
    clearInterval(intervalId);
  }
  updateIntervalId(null, context);
  updateRunningStatus(false, context);
}

function updateIntervalId(intervalId: number | null, context: string) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], intervalId };
}
function updateStartTime(context: string, time: number = Date.now()) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], start: Date.now() };
}
function updateDiff(diff: number, context: string) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], diff };
}
function updateMinutes(minutes: number, context: string) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], minutes };
}
function updateSeconds(seconds: number, context: string) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], seconds };
}
function updateRunningStatus(runningStatus: boolean, context: string) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], runningStatus };
}

export default plugin;
