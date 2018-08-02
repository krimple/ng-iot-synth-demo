import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SynthNote } from '../../../models/synth-note';
import {
  SynthNoteMessage, SynthNoteOff, SynthNoteOn, ClockTick, SynthMessage,
  WaveformChange
} from '../../../models/synth-note-message';
import {SimpleLoggerService} from '../../simple.logger.service';

@Injectable()
export class SynthesisService {

  private audioContext: AudioContext;
  private targetNode: AudioNode;

  // TODO - figure out how to modify on the fly (event?)
  private currentWaveForm: OscillatorType = 'sawtooth';

  // object literal
  private notes: any;

  // central switchboard observable / observer
  public noteStream$: Subject<SynthMessage>;

  // send a message to the synth upon receipt from outside world
  public receiveMessage(message: SynthMessage) {
    this.noteStream$.next(message);
  }

  constructor(private logger: SimpleLoggerService) { }

  public setup(audioContext: AudioContext, targetNode: AudioNode) {
    this.audioContext = audioContext;
    this.targetNode = targetNode;
    this.noteStream$ = new Subject<SynthMessage>();
    // this.setupNotes(audioContext, targetNode);
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    this.noteStream$
      .subscribe(
        (message: SynthMessage) => {
          if (message instanceof SynthNoteOn) {
            this.logger.log('playing message', message, 'with waveform', this.currentWaveForm);
            const synthNote: SynthNote = new SynthNote(message.note, this.currentWaveForm,
              this.audioContext, this.targetNode);
            synthNote.play();
          } else if (message instanceof ClockTick) {
            this.logger.log('pulse!');
            this.clockTick();
          } else if (message instanceof SynthNoteOff) {
            this.logger.log('synthnote off sent. Ignoring...');
          } else if (message instanceof WaveformChange) {
            this.logger.log('new waveform value is ', message.waveForm);
            this.currentWaveForm = message.waveForm;
          } else {
            this.logger.log('unknown message');
            this.logger.dir(message);
          }
        }
      );
  }

  private clockTick() {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.2;
    oscillator.connect(gain);
    gain.connect(this.targetNode);
    oscillator.type = 'square';
    oscillator.frequency.value = 1000;
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 100);
  }
}
