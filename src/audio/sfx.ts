export type SoundPreset = "confirm" | "deny" | "scan" | "radio" | "dispatch";
const presets:Record<SoundPreset,{frequency:number;duration:number;type:OscillatorType}> = {
  confirm:{frequency:720,duration:.1,type:"square"},
  deny:{frequency:150,duration:.12,type:"sawtooth"},
  scan:{frequency:700,duration:.06,type:"triangle"},
  radio:{frequency:210,duration:.18,type:"triangle"},
  dispatch:{frequency:880,duration:.12,type:"square"}
};
export function beep(freq=440,duration=.08,type:OscillatorType="square"):void {
  try {
    const context=new AudioContext(),osc=context.createOscillator(),gain=context.createGain();
    osc.type=type;osc.frequency.value=freq;gain.gain.value=.02;
    osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+duration);
    osc.onended=()=>void context.close();
  } catch { /* Audio can be unavailable or blocked until a user gesture. */ }
}
export function playSound(preset:SoundPreset):void {
  const p=presets[preset];beep(p.frequency,p.duration,p.type);
}