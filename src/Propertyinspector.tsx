import React, { useEffect, useState } from 'react';
import { Settings, defaultRangeSettings } from './Settings';

import Range from './components/Range';
import ReactDOM from 'react-dom';
import { Streamdeck } from '@rweich/streamdeck-ts';
import Textfield from './components/Textfield';
import { convertToSeconds } from './helper/Time';
import { isDev } from './helper/Env';

const pi = new Streamdeck().propertyinspector();
const settingsStore: Record<string, Settings> = {};

const PomodoroApp = () => {
  // const [store, setStore] = useState<Record<string, Settings>>({});
  const [timer, setTimer] = useState<string>(defaultRangeSettings.timer);
  const [shortBreak, setShortBreak] = useState<string>(defaultRangeSettings.shortBreak);
  const [longBreak, setLongBreak] = useState<string>(defaultRangeSettings.longBreak);
  const [interval, setinterval] = useState<string>(defaultRangeSettings.interval);

  useEffect(() => {
    if (pi.pluginUUID && settingsStore[pi.pluginUUID]) {
      const initialSettings = settingsStore[pi.pluginUUID];
      setTimer(initialSettings.timer ? initialSettings.timer : defaultRangeSettings.timer);
      setShortBreak(initialSettings.shortBreak ? initialSettings.shortBreak : defaultRangeSettings.shortBreak);
      setLongBreak(initialSettings.longBreak ? initialSettings.longBreak : defaultRangeSettings.longBreak);
      setInterval(initialSettings.interval ? initialSettings.interval : defaultRangeSettings.interval);
    }
  }, []);

  useEffect(() => {
    if (pi.pluginUUID) {
      console.log('Sending settings to plugin', pi.pluginUUID);

      pi.setSettings(pi.pluginUUID, {
        timer: isDev ? timer : convertToSeconds(timer),
        shortBreak: isDev ? shortBreak : convertToSeconds(shortBreak),
        longBreak: isDev ? longBreak : convertToSeconds(longBreak),
        interval,
      });
      settingsStore[pi.pluginUUID] = {
        timer: isDev ? timer : convertToSeconds(timer),
        shortBreak: isDev ? shortBreak : convertToSeconds(shortBreak),
        longBreak: isDev ? longBreak : convertToSeconds(longBreak),
        interval,
      };
    }
  }, [timer, shortBreak, longBreak, interval]);

  pi.on('didReceiveSettings', ({ context, settings }) => {
    console.log('PI received settings', settings);
    // setStore({ context: { ...store[context], ...(settings as Settings) } });
    settingsStore[context] = {
      timer: isDev ? timer : convertToSeconds(timer),
      shortBreak: isDev ? shortBreak : convertToSeconds(shortBreak),
      longBreak: isDev ? longBreak : convertToSeconds(longBreak),
      interval,
    };
  });

  return (
    <div className="sdpi-wrapper">
      {}
      <Range
        id="timer"
        label="Duration"
        min={defaultRangeSettings.min}
        max={defaultRangeSettings.max}
        step={defaultRangeSettings.step}
        value={timer}
        handleChange={setTimer}
      />
      <Range
        id="short-break"
        label="Short Break"
        min={defaultRangeSettings.min}
        max={defaultRangeSettings.max}
        step={defaultRangeSettings.step}
        value={shortBreak}
        handleChange={setShortBreak}
      />
      <Range
        id="long-break"
        label="Long Break"
        min={defaultRangeSettings.min}
        max={defaultRangeSettings.max}
        step={defaultRangeSettings.step}
        value={longBreak}
        handleChange={setLongBreak}
      />
      <Textfield
        id="interval"
        label="Long Brake Interval"
        value={interval}
        placeholder={interval}
        handleChange={setinterval}
      />
    </div>
  );
};
// ReactDOM.render(<PomodoroApp />, document.getElementById('pomodoro'));
pi.on('websocketOpen', ({ uuid }) => {
  console.log('PI WebSocket opened', uuid);
  ReactDOM.render(<PomodoroApp />, document.getElementById('pomodoro'));
  return pi.getSettings(uuid);
});

// pi.on('sendToPropertyInspector', ({ action, context, payload: incomingPayload }) => {
//   const payload = incomingPayload[context] as any;
//   console.log('PI received persistence settings', payload);
//   switch (payload[context].action) {
//     case 'create':
//     case 'update':
//       settingsStore[context] = payload[context].settings as Settings;
//       break;
//     case 'read':
//       pi.sendToPlugin(context, { read: settingsStore[context] }, action);
//       break;
//     case 'delete':
//       break;
//   }
// });

// pi.on('didReceiveSettings', ({ settings: incomingSettings, context }) => {
//   console.log('PI received settings', incomingSettings);
//   const settings = incomingSettings as Settings;
//   const { timer, shortBreak, longBreak, interval } = settings;

//   settingsStore[context] = {
//     timer: isDev ? timer : convertToSeconds(timer),
//     shortBreak: isDev ? shortBreak : convertToSeconds(shortBreak),
//     longBreak: isDev ? longBreak : convertToSeconds(longBreak),
//     interval,
//   };
// });

// pi.on('sendToPropertyInspector', ({ action, context, payload: incomingPayload }) => {
//   const payload = incomingPayload[context] as any;
//   console.log('PI received persistence settings', payload);
//   switch (payload[context].action) {
//     case 'create':
//     case 'update':
//       settingsStore[context] = payload[context].settings as Settings;
//       break;
//     case 'read':
//       pi.sendToPlugin(context, { read: settingsStore[context] }, action);
//       break;
//     case 'delete':
//       break;
//   }
// });

export default pi;
