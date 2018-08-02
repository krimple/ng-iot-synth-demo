import { Component, EventEmitter, Output } from '@angular/core';
import {SynthNoteOn, SynthNoteOff} from "../../models/synth-note-message";
import {PipelineService} from "../../services/pipeline/pipeline.service";
import { DrumPCMTriggeringService } from '../../services/pipeline/synthesis/drum-pcm-triggering.service';
import {SequencerService} from "../../services/sequencer.service";

@Component({
  selector: 'polysynth-keyboard',
  templateUrl: 'piano-keyboard.component.html',
  styleUrls: ['piano-keyboard.component.css'],
  providers: [SequencerService]
})
export class PianoKeyboardComponent {

  constructor(private pipelineService: PipelineService) { }

  keyboardType: string = 'ionian';

  playNote(noteValue) {
    this.pipelineService.synthStream$.next(new SynthNoteOn(noteValue));
  }
  stopNote(noteValue) {
    this.pipelineService.synthStream$.next(new SynthNoteOff(noteValue));
  }
}
