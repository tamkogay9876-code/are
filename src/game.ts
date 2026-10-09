import { makeVisitor, nightEvents, timeText, beep, type Visitor } from "./data";
export type Phase = "menu" | "day" | "night" | "interrogation" | "ending";
export type Score = { correct:number; mistakes:number; admitted:number; rejected:number; suspicion:number; trust:number; reputation:number; fafe:number };
export type GameState = {
 phase:Phase; index:number; clock:number; nightMinutes:number; fuel:number; tires:number; ammo:number; alive:boolean;
 current?:Visitor; message:string; evidence:string[]; ending:string; score:Score;
};
export const state:GameState = {
 phase:"menu",index:0,clock:360,nightMinutes:0,fuel:100,tires:100,ammo:1,alive:true,
 message:"WELCOME TO NORTHGATE.",evidence:[],ending:"",
 score:{correct:0,mistakes:0,admitted:0,rejected:0,suspicion:0,trust:50,reputation:50,fafe:50}
};
const SAVE_KEY="are-you-lying-v0.1-save";
export function save():void { localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
export function restore():boolean {
 try { const raw=localStorage.getItem(SAVE_KEY); if(!raw)return false; Object.assign(state,JSON.parse(raw)); return true; } catch { return false; }
}
export function hasSave():boolean { return !!localStorage.getItem(SAVE_KEY); }
export function note(text:string):void {
 state.evidence.push("["+timeText(state.phase==="night"||state.phase==="interrogation"?1440+state.nightMinutes:state.clock)+"] "+text);
 if(state.evidence.length>30)state.evidence.shift();
}
export function startShift():void {
 state.phase="day";state.index=0;state.clock=360;state.nightMinutes=0;state.fuel=100;state.tires=100;state.ammo=1;state.alive=true;
 state.current=makeVisitor(0);state.message="SHIFT STARTED. VERIFY EVERYONE.";state.ending="";state.evidence=[];
 state.score={correct:0,mistakes:0,admitted:0,rejected:0,suspicion:0,trust:50,reputation:50,fafe:50};save();
}
function advance():void {
 state.index++;state.clock=Math.min(1440,360+state.index*125);state.current=undefined;
 if(state.clock>=1440||state.index>=9){state.clock=1440;state.phase="night";state.nightMinutes=0;state.message="MIDNIGHT. TAKE THE FILES TO POLICE HQ.";save();}
 else {state.current=makeVisitor(state.index);save();}
}
export function decide(allow:boolean):void {
 const v=state.current;if(!v)return;const ok=allow!==v.anomaly;
 if(ok){state.score.correct++;state.score.reputation=Math.min(100,state.score.reputation+2);state.score.trust=Math.min(100,state.score.trust+1);state.message=allow?"ACCESS GRANTED. MATCH ACCEPTED.":"DENIAL CONFIRMED. ANOMALY KEPT OUT.";}
 else{state.score.mistakes++;state.score.reputation=Math.max(0,state.score.reputation-8);state.score.suspicion=Math.min(100,state.score.suspicion+7);state.score.trust=Math.max(0,state.score.trust-5);if(v.anomaly&&allow)state.score.admitted++;if(!v.anomaly&&!allow)state.score.rejected++;state.message=allow?"WARNING: SOMETHING BAD ENTERED NORTHGATE.":"AN INNOCENT RESIDENT WAS DENIED.";}
 note(v.name+" — "+(allow?"ALLOW":"DENY")+" — "+(ok?"CORRECT":"WRONG")+(v.anomaly?" ["+v.clue+"]":""));beep(ok?700:150);advance();
}
export function call998():void {
 const v=state.current;if(!v)return;state.message="998 CONNECTED. F.A.F.E UNIT DISPATCHED.";state.score.fafe=Math.min(100,state.score.fafe+2);note("998 called for "+v.name);beep(880);
 window.setTimeout(()=>{if(v.anomaly){state.score.correct++;state.message="F.A.F.E CONFIRMED THE ANOMALY. NORTHGATE SECURED.";note("F.A.F.E confirmed the anomaly in room "+v.room+".");}
 else{state.score.mistakes++;state.score.suspicion=Math.min(100,state.score.suspicion+5);state.message="F.A.F.E FOUND NO ANOMALY. FALSE REPORT.";note("F.A.F.E found no anomaly.");}advance();},600);
}
export function drive():void {
 if(!state.alive)return;state.nightMinutes+=10;state.fuel=Math.max(0,state.fuel-5);if(Math.random()<.22)state.tires=Math.max(0,state.tires-18);
 state.message=nightEvents[Math.floor(Math.random()*nightEvents.length)];note("NIGHT: "+state.message);
 if(state.fuel===0||state.tires===0){state.message=state.fuel===0?"ENGINE STOPS. A SHAPE MOVES IN THE DARK.":"TIRE FAILURE. THE ROAD GOES SILENT.";if(Math.random()<.6)state.alive=false;}
 if(state.nightMinutes>=180&&state.alive){arriveHQ();return;}save();
}
export function checkRadio():void { note("RADIO: '998? There is no unit by that name tonight.'");state.score.suspicion++;state.message="RADIO RETURNS A VOICE THAT SOUNDS LIKE YOU.";beep(210);save(); }
export function fireShotgun():void {
 if(state.ammo<=0){state.message="CLICK. EMPTY.";beep(90);save();return;}
 state.ammo=0;const interrupted=Math.random()>.3;
 state.message=interrupted?"THE FIGURE VANISHES INTO THE DARK.":"THE FLASH REVEALS NOTHING. YOU KEEP DRIVING.";
 note("SHOTGUN FIRED. "+(interrupted?"Encounter interrupted.":"No confirmed target."));
 state.nightMinutes+=25;beep(70,.16);save();
}
export function arriveHQ():void {
 if(!state.alive){state.phase="ending";state.ending="LOST IN THE DARK";save();return;}
 state.phase="interrogation";state.message="HQ ARRIVAL. CLASS-X INTERROGATION READY.";save();
}
export function finishInterrogation():void {
 const s=state.score;
 state.ending=s.suspicion>=25?"FALSE SECURITY — THE STATION DOES NOT TRUST YOU":s.admitted>0?"THE WRONG PERSON ENTERED":s.rejected>=2?"TOO PARANOID — NORTHGATE LOST TRUST":s.trust>=55?"F.A.F.E RECRUIT":"SHIFT COMPLETE — THE CASE REMAINS OPEN";
 state.phase="ending";save();
}
export function resetSave():void { localStorage.removeItem(SAVE_KEY); state.phase="menu"; }