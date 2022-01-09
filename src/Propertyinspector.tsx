import React, { useEffect, useState } from 'react';

import Range from './components/Range';
import ReactDOM from 'react-dom';
import { Streamdeck } from '@rweich/streamdeck-ts';
import Textfield from './components/Textfield';

const pi = new Streamdeck().propertyinspector();

function convertToSeconds(option: string) {
  return Number(option) * 60;
}

const PomodoroApp = () => {
  const [timer, setTimer] = useState<string>('25');
  const [shortBreak, setShortBreak] = useState<string>('5');
  const [longBreak, setLongBreak] = useState<string>('15');
  const [interval, setinterval] = useState<string>('4');

  useEffect(() => {
    if (pi.pluginUUID) {
      pi.setSettings(pi.pluginUUID, {
        timer: convertToSeconds(timer),
        shortBreak: convertToSeconds(shortBreak),
        longBreak: convertToSeconds(longBreak),
        interval,
      });
    }
  }, [timer, shortBreak, longBreak, interval]);

  return (
    <div className="sdpi-wrapper">
      <Range id="timer" label="Duration" min="5" max="60" step="5" value={timer} handleChange={setTimer} />
      <Range
        id="short-break"
        label="Short Break"
        min="5"
        max="60"
        step="5"
        value={shortBreak}
        handleChange={setShortBreak}
      />
      <Range
        id="long-break"
        label="Long Break"
        min="5"
        max="60"
        step="5"
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
  console.log('got websocket-open-event!', uuid);
  return pi.getSettings(uuid);
});

pi.on('didReceiveSettings', ({ settings }) => {
  console.log('got didReceiveSettings event!', settings);

  ReactDOM.render(<PomodoroApp />, document.getElementById('pomodoro'));
});

export default pi;
