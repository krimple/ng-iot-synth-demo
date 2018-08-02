import { Injectable } from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import {SimpleLoggerService} from './simple.logger.service';
import {StreamEvent} from '../models/stream-event';
import {ClockTick} from '../models/synth-note-message';

@Injectable()
export class QuantizerService {

  private dataStream$: any;
  private outStream$: Subject<any> = new Subject<any>();
  private streamBuffer: StreamEvent[] = [];
  private subscription: Subscription;
  private bpm: number;

  constructor(private logger: SimpleLoggerService) { }

  setDataStream(dataStream) {
    this.dataStream$ = dataStream;
  }

  setBPM(bpm: number) {
    this.bpm = bpm;
  }

  record() {
    // guard, guard, guard
    if (!this.dataStream$) {
      throw new Error('Must provide a data stream with setDataStream');
    }

    const startTime = Date.now();
    this.subscription = this.dataStream$
      .pipe(
      debounceTime(Math.min((this.bpm / 60) * 1000)),
      tap(() => {
        this.logger.log('sending a tick!');
        this.dataStream$.next(new ClockTick());
      })
      ).subscribe((eventPayload: number) => {
        this.streamBuffer.push(new StreamEvent(eventPayload, Date.now() - startTime));
      });
  }

  stop() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.logger.log('stopped recorder');
      this.logger.log('events');
      console.dir(this.streamBuffer);
    } else {
      this.logger.log('doing nothing - not recording...');
    }
  }

  playback() {
    if (!this.streamBuffer || this.streamBuffer.length === 0) {
      this.logger.log('no events!');
      return;
    }

    this.streamBuffer.forEach((event: StreamEvent) => {
      setTimeout(() => {
        this.dataStream$.next(event.payload);
      }, event.timeOffset);
    });
  }
}
