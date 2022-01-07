/* global ESDTimerWorker */
/*eslint no-unused-vars: "off"*/
/*eslint-env es6*/

class Timers {
  ESDTimerWorker: Worker;
  timerId: number;
  timers: { callback: TimerHandler; params: any[] }[];
  public ESDDefaultTimeouts: { timeout: number; interval: number };

  constructor() {
    const blob = new Blob(
      [
        timerFn
          .toString()
          .replace(/^[^{]*{\s*/, '')
          .replace(/\s*}[^}]*$/, ''),
      ],
      { type: 'text/javascript' },
    );
    const AppUrl = URL.createObjectURL(blob);

    this.ESDTimerWorker = new Worker(AppUrl);
    this.timerId = 1;
    this.timers = [];
    this.ESDDefaultTimeouts = {
      timeout: 0,
      interval: 10,
    };
    Object.freeze(this.ESDDefaultTimeouts);
  }

  init() {
    window.setTimeout = this._setTimeoutESD;
    window.setInterval = this._setIntervalESD;
    window.clearTimeout = this._clearTimeoutESD; //timeout and interval share the same timer-pool
    window.clearInterval = this._clearTimeoutESD;
  }

  _setTimer(callback: TimerHandler, delay: number, type: string, params: any[]) {
    const id = this.timerId++;
    this.timers[id] = { callback, params };
    this.ESDTimerWorker.onmessage = (e) => {
      if (this.timers[e.data.id]) {
        if (e.data.type === 'clearTimer') {
          delete this.timers[e.data.id];
        } else {
          const cb = this.timers[e.data.id].callback;
          if (cb && typeof cb === 'function') cb(...this.timers[e.data.id].params);
        }
      }
    };
    this.ESDTimerWorker.postMessage({ type, id, delay });
    return id;
  }

  _setTimeoutESD(callback: TimerHandler, delay: number, params: any[]) {
    return this._setTimer(callback, delay, 'setTimeout', params);
  }

  _setIntervalESD(callback: TimerHandler, delay: number, params: any[]) {
    return this._setTimer(callback, delay, 'setInterval', params);
  }

  _clearTimeoutESD(id: number | undefined) {
    if (!id) {
      return;
    }
    this.ESDTimerWorker.postMessage({ type: 'clearTimeout', id }); //     ESDTimerWorker.postMessage({type: 'clearInterval', id}); = same thing
    delete this.timers[id];
  }
}

/** This is our worker-code
 *  It is executed in it's own (global) scope
 *  which is wrapped above @ `let ESDTimerWorker`
 */
function timerFn() {
  /*eslint indent: ["error", 4, { "SwitchCase": 1 }]*/

  let timers: number[] = [];
  let debug = false;
  let supportedCommands = ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'];

  function log(e?: Error) {
    console.log('Worker-Info::Timers', timers, e);
  }

  function clearTimerAndRemove(id: number) {
    if (timers[id]) {
      if (debug) console.log('clearTimerAndRemove', id, timers[id], timers);
      clearTimeout(timers[id]);
      delete timers[id];
      postMessage({ type: 'clearTimer', id: id });
      if (debug) log();
    }
  }

  onmessage = function (e) {
    // first see, if we have a timer with this id and remove it
    // this automatically fulfils clearTimeout and clearInterval
    supportedCommands.includes(e.data.type) && timers[e.data.id] && clearTimerAndRemove(e.data.id);
    if (e.data.type === 'setTimeout') {
      timers[e.data.id] = window.setTimeout(() => {
        postMessage({ id: e.data.id });
        clearTimerAndRemove(e.data.id); //cleaning up
      }, Math.max(e.data.delay || 0));
    } else if (e.data.type === 'setInterval') {
      timers[e.data.id] = window.setInterval(() => {
        postMessage({ id: e.data.id });
      }, Math.max(e.data.delay || ESDTimerWorker.ESDDefaultTimeouts.interval));
    }
  };
}

export const ESDTimerWorker = new Timers();
