import { Streamdeck } from '@rweich/streamdeck-ts';

const plugin = new Streamdeck().plugin();

// your code here..
plugin.on('willAppear', ({ context }) => {
  plugin.setTitle('test', context);
});

let keypresses = 0;
plugin.on('keyDown', ({ context }) => {
  plugin.setTitle(`key pressed ${++keypresses} times`, context);
});

export default plugin;
