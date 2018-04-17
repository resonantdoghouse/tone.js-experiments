/**
 * Effects
 */
let reverb1 = new Tone.Freeverb(0.9, 10000).receive("reverb").toMaster();
let reverb2 = new Tone.Freeverb(0.4, 10000).receive("reverb").toMaster();
let reverb3 = new Tone.Freeverb(0.9, 10000).receive("reverb").toMaster();

/**
 * Drums
 */
var feedbackDelay = new Tone.PingPongDelay({
  delayTime: "8n",
  feedback: 0.6,
  wet: 0.5
}).toMaster();

let drums505 = new Tone.Sampler(
  {
    "A2": "snare.[mp3|ogg]",
    "A1": "kick.[mp3|ogg]"
  },
  {
    release: 1,
    baseUrl:
      "https://raw.githubusercontent.com/Tonejs/Tone.js/master/examples/audio/505/"
  }
).toMaster();

let drum505Part = new Tone.Loop(
  function(time) {
    drums505.triggerAttackRelease("A2", "2n", time);
  },
 "2n"
).start("2:1");

// Kick
let kick = new Tone.MembraneSynth({
  envelope: {
    sustain: 0,
    attack: 0.02,
    decay: 0.8
  },
  octaves: 10
}).toMaster();

let kickPart = new Tone.Loop(function(time) {
  kick.triggerAttackRelease("C1", "8n", time);
}, "2n").start(0);

/**
 *  PIANO
 */
let piano = new Tone.PolySynth(4, Tone.Synth, {
  volume: -30,
  oscillator: {
    partials: [1, 2, 1]
  },
  portamento: 0.09
}).connect(reverb3);

let cChord = ["E4", "G4", "B4", "D4"];
let dChord = ["F4", "A4", "C4", "C4"];
let gChord = ["B4", "D4", "E4", "C4"];
let aChord = ["A4", "E4", "G4", "A4"];
let aChordAlt = ["A4", "C4", "E4", "B4"];

let pianoPart = new Tone.Part(
  function(time, chord) {
    piano.triggerAttackRelease(chord, "1n", time);
  },
  [
    ["0:0:0", dChord],
    ["0:1", cChord],
    ["0:1:3", dChord],
    ["0:2:2", cChord],
    ["0:3", dChord],
    ["0:3:2", aChord],
    ["0:6", cChord],
    ["0:8:0", dChord],
    ["0:9", cChord],
    ["0:9:3", dChord],
    ["0:10:2", cChord],
    ["0:11", dChord],
    ["0:11:2", aChordAlt]
  ]
).start("4:0");

pianoPart.loop = true;
pianoPart.loopEnd = "6m";
pianoPart.humanize = true;

// Snare
let glitchPerc = new Tone.PluckSynth({
  volume: -25
}).connect(reverb1);

let glitchPercPart = new Tone.Loop(function(time, note) {
  glitchPerc.triggerAttack("C2", time);
}, "3n").start("6:0");

/*
BASS
*/
var bass = new Tone.MonoSynth({
  volume: -25,
  envelope: {
    attack: 0.1,
    decay: 0.3,
    release: 2
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.01,
    sustain: 0.5,
    baseFrequency: 200,
    octaves: 2.6
  }
}).connect(reverb2);

var bassPart = new Tone.Sequence(
  function(time, note) {
    bass.triggerAttackRelease(note, "8n", time);
  },
  ["C1", ["D1", ["C1", "D1"]], null, [null, "A1", "A1", "A1"]]
).start(0);

bassPart.probability = 0.9;

var bell = new Tone.MetalSynth({
  harmonicity: 12,
  resonance: 800,
  modulationIndex: 20,
  envelope: {
    decay: 0.4
  },
  volume: -40
}).toMaster();

var bellPart = new Tone.Sequence(
  function(time, freq) {
    bell.frequency.setValueAtTime(freq, time, Math.random() * 0.5 + 0.5);
    bell.triggerAttack(time);
  },
  [300, null, 200, null, 200, 200, null, 200, null, 200, null, 200],
  "16t"
).start("6:0");

// let osc = new Tone.OmniOscillator();
// osc.frequency.value = "D4";
// osc.start().stop("+8n");

Tone.Transport.bpm.value = 60;

document.querySelector(".play").addEventListener("click", function(e) {
  console.log("click");
  Tone.Transport.start("+0.1");
});

document.querySelector(".stop").addEventListener("click", function(e) {
  console.log("click");
  Tone.Transport.stop();
});
