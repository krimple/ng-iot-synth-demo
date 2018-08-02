import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NetworkDataService } from './network-data.service';
import { DrumPCMTriggeringService } from './pipeline/synthesis/drum-pcm-triggering.service';
import { SimpleLoggerService } from './simple.logger.service';
import { SequencerService } from './sequencer.service';
import { NoteTranslationService } from './note-translation.service';
import { PipelineService } from './pipeline/pipeline.service';
import { QuantizerService } from './quantizer.service';
import { SynthesisService } from './pipeline/synthesis/synthesis.service';
import { MidiInputService } from './pipeline/inputs/midi-input.service';
import { AudioOutputService } from './pipeline/outputs/audio-output.service';

@NgModule({
  providers: [
    NetworkDataService,
    SimpleLoggerService,
    SequencerService,
    NoteTranslationService,
    QuantizerService,
    PipelineService,
    DrumPCMTriggeringService,
    SynthesisService,
    MidiInputService,
    AudioOutputService
  ],
  imports: [
    HttpClientModule
  ]
})
export class ServicesModule { }
