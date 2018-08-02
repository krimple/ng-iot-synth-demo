import { MidiInputService } from './inputs/midi-input.service';
import { SynthesisService } from './synthesis/synthesis.service';
import { AudioOutputService } from './outputs/audio-output.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SynthNoteMessage, SynthNoteOn, SynthNoteOff, SynthMessage} from '../../models/synth-note-message';
import {DrumPCMTriggeringService} from './synthesis/drum-pcm-triggering.service';
import {SimpleLoggerService} from '../simple.logger.service';

@Injectable()
export class PipelineService {

  private audioContext: AudioContext;

  // allow other objects to hook into the service and send messages
  private _synthStream$ = new Subject<SynthMessage>();

  // only provide accessor, can't replace stream
  get synthStream$() {
    return this._synthStream$;
  }

  constructor(private midiInputService: MidiInputService,
              private synthesisService: SynthesisService,
              private audioOutputService: AudioOutputService,
              private drumPCMTriggeringService: DrumPCMTriggeringService,
              private logger: SimpleLoggerService) {
      this.audioContext = window['theAudioContext'];
  }

  begin() {
    // setup outputs
    this.audioOutputService.setup(this.audioContext, this.synthStream$);

    // setup synth
    this.synthesisService.setup(this.audioContext, this.audioOutputService.mainMixCompressor);

    // setup drum service
    this.drumPCMTriggeringService.setup(this.audioContext,
                                        this.audioOutputService.mainMixCompressor,
                                        this.synthStream$);

    // setup inputs
    this.midiInputService.setup(this.synthStream$);

    // now send all note inputs coming from midi and non-midi sources (web page components, etc)
    this.synthStream$.subscribe(
        (message: SynthMessage) => {
            this.synthesisService.receiveMessage(message);
        }
    );
  }

  end() {
    this.logger.log(`Pipeline service ending...`);
  }

}
