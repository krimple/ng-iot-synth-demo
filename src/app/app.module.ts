import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { BluesKeyboardComponent,
         DrumSetComponent,
         IonianKeyboardComponent,
         MinorBluesKeyboardComponent,
         PianoKeyboardComponent } from './keyboard';

import { PolysynthRoutingModule } from './app-routing.module';
import { ServicesModule } from './services/services.module';

@NgModule({
  declarations: [
    AppComponent,
    DrumSetComponent,
    PianoKeyboardComponent,
    BluesKeyboardComponent,
    MinorBluesKeyboardComponent,
    IonianKeyboardComponent,
    ControlPanelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServicesModule,
    PolysynthRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // force booting the service instance w/o injecting into a component
  constructor() { }
}
