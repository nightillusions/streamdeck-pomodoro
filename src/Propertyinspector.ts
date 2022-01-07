import { Settings, isSettings } from './Settings';

import { FormBuilder } from '@rweich/streamdeck-formbuilder';
import { Streamdeck } from '@rweich/streamdeck-ts';

const pi = new Streamdeck().propertyinspector();
let builder: FormBuilder<Settings> | undefined;

pi.on('websocketOpen', ({ uuid }) => {
  console.log('got websocket-open-event!', event);
  return pi.getSettings(uuid);
});

pi.on('didReceiveSettings', ({ settings }) => {
  console.log('got didReceiveSettings event!', settings);
  if (builder === undefined) {
    const initialData: Settings = isSettings(settings)
      ? settings
      : {
          pomodoro: '25',
          shortBreak: '5',
          longBreak: '15',
          autoStartBreaks: '0',
          autoStartPomodoro: '0',
          longBreakInterval: '4',
        };
    builder = new FormBuilder<Settings>(initialData);
    const numbers = builder.createDropdown().setLabel('Change Value');
    for (const [index] of Array.from({ length: 10 }).entries()) {
      numbers.addOption(String(index), String(index));
    }
    builder.addElement('pomodoro', numbers);
    builder.addElement(
      'shortBreak',
      builder
        .createDropdown()
        .setLabel('Background')
        .addOption('Orange Background', 'orange')
        .addOption('Red Background', 'red')
        .addOption('Green Background', 'green')
        .addOption('Blue Background', 'blue'),
    );
    builder.appendTo(document.querySelector('.sdpi-wrapper') ?? document.body);
    builder.on('change-settings', () => {
      if (pi.pluginUUID === undefined) {
        console.error('pi has no uuid! is it registered already?', pi.pluginUUID);
        return;
      }
      pi.setSettings(pi.pluginUUID, builder?.getFormData());
    });
  } else if (isSettings(settings)) {
    builder.setFormData(settings);
  }
});

export default pi;
