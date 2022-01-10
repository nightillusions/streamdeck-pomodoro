import { Settings, defaultSettings, isSettings, pomodoroImages } from './Settings';
import { durationToMMSS, padTime } from './helper/Time';

import { PomodoroTimer } from './models/TimerModels';
import { Streamdeck } from '@rweich/streamdeck-ts';

const plugin = new Streamdeck().plugin();
const settings: Record<string, Settings> = {};
const pomodoroTimer: Record<string, PomodoroTimer> = {};

plugin.on('willAppear', ({ context }) => {
  console.log(`Plugin appeears`, context);
  setDefaultTimerSettings(context);
  setInitialTimerState(context);
});

plugin.on('didReceiveSettings', ({ context, settings: updatedSettings }) => {
  console.log(`Plugin received settings`, updatedSettings, context);
  if (isSettings(updatedSettings) && !pomodoroTimer[context].isRunning) {
    updateSettings(updatedSettings as Settings, context);
    pomodoroTimer[context].phase = 'timer';
  }
});

plugin.on('keyDown', ({ context }) => {
  console.log(`Plugin key pressed`, context);
  const { isRunning: isRunnging, intervalId } = pomodoroTimer[context];
  updateStartTime(context);

  if (isRunnging && intervalId) {
    stopTimer(context);
  } else {
    setImage('timer', context);
    startTimer(context);
  }
});

// function updatePiSettings(context: string): void {
//   plugin.setSettings(context, {});
// }

function updateSettings(updatedSettings: Settings, context: string): void {
  console.log(`Updating settings...`, updatedSettings, context);

  settings[context] = updatedSettings;
  resetDisplayTimer(context);
}

function timer(context: string) {
  const currentPhase = pomodoroTimer[context].phase;
  const duration = settings[context][currentPhase];

  if (!currentPhase) {
    console.error(`No phase for timer!`, context);
    return;
  }

  if (!duration) {
    console.error(`No Duration for current phase!`, context);
    return;
  }

  updateDiff(Number(duration) - (((Date.now() - pomodoroTimer[context].start) / 1000) | 0), context);
  updateMinutes((pomodoroTimer[context].diff / 60) | 0, context);
  updateSeconds(pomodoroTimer[context].diff % 60 | 0, context);
  updateMinutes(Number(padTime(Number(pomodoroTimer[context].minutes))), context);
  updateSeconds(Number(padTime(Number(pomodoroTimer[context].seconds))), context);

  plugin.setTitle(
    `${padTime(pomodoroTimer[context].minutes | 0)}:${padTime(pomodoroTimer[context].seconds | 0)}`,
    context,
  );

  if (pomodoroTimer[context].diff <= 0) {
    console.log('Adding one second to start time...');
    updateStartTime(context, Date.now() + 1000);
  }

  if (pomodoroTimer[context].minutes <= 0 && pomodoroTimer[context].seconds <= 0) {
    console.log('Time expired!');
    stopTimer(context);
    setNextPhase(context);
    startTimer(context);
    // TODO: Maybe choose in settings if pause or next phase?
    return;
  }
}

function setNextPhase(context: string) {
  console.log(`Setting next phase...`, context);
  const { phase, cycle: currentCycle } = pomodoroTimer[context];
  const { interval: intervalSetting } = settings[context];
  const interval = Number(intervalSetting);

  switch (phase) {
    case 'timer':
      if (currentCycle < interval) {
        updateCycle(currentCycle + 1, context);
        pomodoroTimer[context].phase = 'shortBreak';
      } else {
        updateCycle(1, context);
        pomodoroTimer[context].phase = 'longBreak';
      }
      setImage('break', context);
      break;
    case 'shortBreak':
    case 'longBreak':
      pomodoroTimer[context].phase = 'timer';
      setImage('timer', context);
      break;
  }
  console.log(`Next phase set to ${pomodoroTimer[context].phase} at cycle '${currentCycle}'`, context);
}

function setImage(status: 'timer' | 'break', context: string) {
  console.log(`Setting plugin image to ${status}...`, context);

  const image = new Image();
  image.addEventListener('load', () => {
    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    canvas.getContext('2d')?.drawImage(image, 0, 0);
    plugin.setImage(canvas.toDataURL('image/png'), context);
  });
  image.src = pomodoroImages[status];
}

function setInitialTimerState(context: string) {
  console.log(`Setting initial timer...`, context);
  // Clear any timeout/interval up to that id
  const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
  for (let i = 1; i < interval_id; i++) {
    window.clearInterval(i);
  }
  updateStartTime(context);
  updateDiff(0, context);
  updateMinutes(0, context);
  updateSeconds(0, context);
  updateCycle(1, context);
  setImage('break', context);
  pomodoroTimer[context].phase = 'timer';
  resetDisplayTimer(context);
}

function setDefaultTimerSettings(context: string) {
  console.log(`Setting default settings...`, context);
  settings[context] = defaultSettings;
}

function resetDisplayTimer(context: string) {
  const currentPhase = pomodoroTimer[context].phase;
  const duration = settings[context][currentPhase];
  console.log(`Resetting timer display with phase '${currentPhase}' and duration '${duration}'...`, context);
  plugin.setTitle(durationToMMSS(duration), context);
}

function startTimer(context: string) {
  console.log(`Starting timer for phase ${pomodoroTimer[context].phase}`, context);
  resetDisplayTimer(context);
  timer(context);
  updateIntervalId(
    window.setInterval(() => timer(context), 1000),
    context,
  );
  updateRunningStatus(true, context);
}

function stopTimer(context: string) {
  console.log(`Stopping timer...`, context);
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
  pomodoroTimer[context] = { ...pomodoroTimer[context], start: time };
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
  pomodoroTimer[context] = { ...pomodoroTimer[context], isRunning: runningStatus };
}
function updateCycle(cycle: number, context: string) {
  pomodoroTimer[context] = { ...pomodoroTimer[context], cycle };
}

export default plugin;
