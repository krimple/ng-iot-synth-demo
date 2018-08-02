import { Component } from '@angular/core';
import { PipelineService } from './services/pipeline';
import {SimpleLoggerService} from './services/simple.logger.service';

@Component({
  selector: 'polysynth-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(logger: SimpleLoggerService, pipelineService: PipelineService) {
    logger.logEnabled = true;
    pipelineService.begin();
  }
}
