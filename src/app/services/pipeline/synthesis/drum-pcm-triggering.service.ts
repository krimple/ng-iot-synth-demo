import { Injectable } from '@angular/core';
import { NetworkDataService } from '../../network-data.service';
import { Sample } from '../../../models/sample';
import { Subject, throwError } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Observable, of, forkJoin, bindCallback } from 'rxjs';
import { SynthMessage, TriggerSample } from '../../../models/synth-note-message';
import {SimpleLoggerService} from '../../simple.logger.service';

@Injectable()
export class DrumPCMTriggeringService {

  public samples: any;
  public synthStream$ = new Subject<SynthMessage>();
  private boundCallback: any;

  constructor(private dataService: NetworkDataService, private logger: SimpleLoggerService) {
    this.boundCallback = bindCallback.bind(this);
  }

  setup(context: AudioContext, targetNode: AudioNode, synthStream$: Subject<SynthMessage>) {
    this.synthStream$ = synthStream$;

    this.samples = {
      bass: new Sample('assets/drums/bass-thud.wav'),
      hihat: new Sample('assets/drums/hi-hat-closed.wav'),
      hihatopen: new Sample('assets/drums/hi-hat-open.wav'),
      snare: new Sample('assets/drums/ringing-snare.wav'),
      flam: new Sample('assets/drums/snare-flam.wav'),
      rimshot: new Sample('assets/drums/snare-rimshot.wav'),
      htrimshot: new Sample('assets/drums/hi-tom-rimshot.wav'),
      tom1: new Sample('assets/drums/hi-tom-normal.wav'),
      tom2: new Sample('assets/drums/low-tom.wav'),
      crash: new Sample('assets/drums/crash-trash.wav'),
      ride: new Sample('assets/drums/ride-standard.wav'),
      ping: new Sample('assets/drums/ride-ping.wav')
    };

    this.loadAllSamples(context).subscribe(
      () => {
        this.logger.log('samples loaded...  Subscribing to streams');
        this.subscribeTo(context, this.samples, targetNode);
      },
      (error) => {
        this.logger.error(`Sample load failed. ${error}`);
      });
  }

  subscribeTo(context: AudioContext, sample: Sample, targetNode: AudioNode) {
    // now sip please, get what you want and play it!
    this.synthStream$
      .pipe(
        filter((synthMessage: SynthMessage) => {
          return synthMessage instanceof TriggerSample;
        })
      )
      .subscribe((message: TriggerSample) => {
          const instrument = message.instrument;
          const sampleValue: Sample = this.samples[instrument];
          if (sampleValue) {
            sampleValue.playing = true;
            const source = context.createBufferSource();
            sampleValue.gain = context.createGain();
            sampleValue.gain.gain.value = 1.0;
            source.connect(sampleValue.gain);
            sampleValue.gain.connect(targetNode);
            source.buffer = sampleValue.audioBuffer;
            source.start(0);
          }
        },
        (error) => {
          throwError('error in subscription', error);
        },
        () => {
          this.logger.log('stream closed.');
        });
  }

  loadAllSamples(context: AudioContext) {
    return forkJoin(
      this.loadSample(context, this.samples.bass),
      this.loadSample(context, this.samples.crash),
      this.loadSample(context, this.samples.hihat),
      this.loadSample(context, this.samples.hihatopen),
      this.loadSample(context, this.samples.ride),
      this.loadSample(context, this.samples.snare),
      this.loadSample(context, this.samples.flam),
      this.loadSample(context, this.samples.rimshot),
      this.loadSample(context, this.samples.ping),
      this.loadSample(context, this.samples.htrimshot),
      this.loadSample(context, this.samples.tom1),
      this.loadSample(context, this.samples.tom2)
    );
  }

  private loadSample(context: AudioContext, sample: Sample): Observable<null> {
    const loadAllSamplesSubject = new Subject<null>();
    this.dataService.getSampleRawData(sample.fileName)                  // load file
      .pipe(
        tap((rawData: ArrayBuffer) => {
          sample.arrayBuffer = rawData;
        }),
        switchMap((rawData: ArrayBuffer): Promise<AudioBuffer> => {
          return new Promise((resolve, reject) => {
            context.decodeAudioData(rawData, (encodedBuffer) => {
              resolve(encodedBuffer);
            });
          });
        }),
        tap((audioBuffer: AudioBuffer) => {
          sample.audioBuffer = audioBuffer;
        })
      )
      .subscribe(() => {
        loadAllSamplesSubject.next();
        loadAllSamplesSubject.complete();
        this.logger.log(`Loaded file ${sample.fileName}`);
      });
    return loadAllSamplesSubject;
  }
}
