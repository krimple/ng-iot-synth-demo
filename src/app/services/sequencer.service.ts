import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import {StreamEvent} from '../models/stream-event';
import {PipelineService} from './pipeline/pipeline.service';
import {SynthMessage} from '../models/synth-note-message';
import {SimpleLoggerService} from './simple.logger.service';

export enum SequencerStates {STOPPED, RECORDING, PLAYING}

@Injectable()
export class SequencerService {

  // will hold reference to synth message observable
  private synthStream$: Subject<SynthMessage>;

  constructor(private logger: SimpleLoggerService, pipelineService: PipelineService) {
    this.synthStream$ = pipelineService.synthStream$;
  }
  private streamBuffer: StreamEvent[] = [];
  private subscription: Subscription;

  // start out idle
  private state = SequencerStates.STOPPED;

  record() {
    // guard, guard, guard
    if (!this.synthStream$) {
      throw new Error('Pipeline must provide a valid data stream.');
    }

    // guard, guard
    if (this.state !== SequencerStates.STOPPED) {
      // do nothing
      return;
    } else {
      this.state = SequencerStates.RECORDING;
    }

    // record!
    const startTime = Date.now();
    this.subscription = this.synthStream$.subscribe(
      (eventPayload: any) => {
        this.streamBuffer.push(new StreamEvent(eventPayload, Date.now() - startTime));
      }
    );
  }

  stop() {
    // guard, guard, guard
    if (this.state !== SequencerStates.RECORDING) {
      // do nothing
      return;
    } else {
      this.state = SequencerStates.STOPPED;
    }

    // stop it!
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
    // Oh, arrow functions, you don't always give me `this`
    // guard, guard, guard
    if (this.state === SequencerStates.RECORDING) {
      // first, stop it!!!
      this.stop();
    }

    if (this.state === SequencerStates.PLAYING) {
      // we shouldn't try playing while already playing, ignore
      return;
    }

    this.state = SequencerStates.PLAYING;

    // check - do we have notes???
    if (!this.streamBuffer || this.streamBuffer.length === 0) {
      this.logger.log('no events!');
      return;
    }

    // ok, we do, set up events for each note and play 'em in time
    this.streamBuffer.forEach((event: StreamEvent) => {
      setTimeout(() => {
       this.synthStream$.next(event.payload);
      }, event.timeOffset);
    });

    // I know, it isn't technically stopped yet, but it will be.
    this.state = SequencerStates.STOPPED;
    this.streamBuffer.length = 0;

  }
}
