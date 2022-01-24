import React, { useEffect, useState } from 'react';

import Range from './components/Range';
import ReactDOM from 'react-dom';
import { Streamdeck } from '@rweich/streamdeck-ts';
import Textfield from './components/Textfield';
import { convertToSeconds } from './helper/Time';
import { defaultRangeSettings } from './Settings';
import { isDev } from './helper/Env';

const pi = new Streamdeck().propertyinspector();

const PomodoroApp = () => {
  const [timer, setTimer] = useState<string>(defaultRangeSettings.timer);
  const [shortBreak, setShortBreak] = useState<string>(defaultRangeSettings.shortBreak);
  const [longBreak, setLongBreak] = useState<string>(defaultRangeSettings.longBreak);
  const [interval, setinterval] = useState<string>(defaultRangeSettings.interval);

  useEffect(() => {
    if (pi.pluginUUID) {
      console.log('Sending settings to plugin', pi.pluginUUID);

      pi.setSettings(pi.pluginUUID, {
        timer: isDev ? timer : convertToSeconds(timer),
        shortBreak: isDev ? shortBreak : convertToSeconds(shortBreak),
        longBreak: isDev ? longBreak : convertToSeconds(longBreak),
        interval,
      });
    }
  }, [timer, shortBreak, longBreak, interval]);

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

pi.on('websocketOpen', ({ uuid }) => {
  console.log('PI WebSocket opened', uuid);
  ReactDOM.render(<PomodoroApp />, document.getElementById('pomodoro'));
  return pi.getSettings(uuid);
});

pi.on('didReceiveSettings', ({ settings }) => {
  console.log('PI received settings', settings);
});

export default pi;
