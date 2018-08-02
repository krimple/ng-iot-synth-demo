import { Component, EventEmitter, Output } from '@angular/core';
import {SynthNoteOn, SynthNoteOff} from "../../models/synth-note-message";
import {PipelineService} from "../../services/pipeline/pipeline.service";
import { DrumPCMTriggeringService } from '../../services/pipeline/synthesis/drum-pcm-triggering.service';

@Component({
  templateUrl: 'blues-keyboard.component.html',
  styleUrls: ['blues-keyboard.component.css']
})
export class BluesKeyboardComponent {

  keyboardType: string = 'ionian';
  constructor(private pipelineService: PipelineService) { }

  playNote(noteValue) {
    this.pipelineService.synthStream$.next(new SynthNoteOn(noteValue));
  }
  stopNote(noteValue) {
    this.pipelineService.synthStream$.next(new SynthNoteOff(noteValue));
  }
}
