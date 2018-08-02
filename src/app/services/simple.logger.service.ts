import { Injectable } from '@angular/core';

@Injectable()
export class SimpleLoggerService {
  private _enableLog = true;

  get logEnabled() {
    return this._enableLog;
  }

  set logEnabled(val: boolean) {
    this._enableLog = val;
  }

  log(...messages: any[]) {
    if (this.logEnabled) {
      console.log(...messages);
    }
  }

  dir(thing: any) {
    if (this.logEnabled) {
      console.dir(thing);
    }
  }

  error(...messages: any[]) {
    // always send these out
    console.error(...messages);
  }
}
