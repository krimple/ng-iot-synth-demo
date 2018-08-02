# NgIotSynthDemo

A simple synth demo, with built-in MIDI controller. This is not perfect, I've used it with a IoT board for midi input; see the
`services/pipeline/inputs/midi-input.service.ts for details on hooking up your own midi controller. If you have a touch-screen
laptop (Surface Book, etc) you can play the keyboard onscreen with your fingers. It is multi-touch enabled.

This was updated to version 6 of Angular and 6 of RxJS in August 2018.

## Setup

```bash
git clone https://github.com/krimple/ng-iot-synth-demo
npm install
```

## Running

```bash
npm run start
```

## Tips

* Use a touch input screen, or use Chrome Developer Tools' device emulation (pick any mobile device, touch inputs will work)
* Play with the super-lame sequencer - records messages from MIDI and plays back in real time using a captured array.
* Look at the midi input service, wire up your own USB-class-compliant MIDI controller and tweak. This isn't the most stable thing, as I've seen it crash with my Bare Conductive Touch Board.

## Things to check out in the code

* Services supporting an RxJS message pipeline from input -> outputs
* Piped subscriptions to transform data from one format to another
* The WebAudio API - you can gut this and replace with a better audio API (there are a number out there)
* Synth controls - various controller messages trigger wave changes (if configured), volume changes, and mod wheel settings.

Enjoy!

Ken Rimple, Chariot Solutions @RimpleOnTech
