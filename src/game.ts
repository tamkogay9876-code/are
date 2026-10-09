import { makeVisitor, timeText, beep, type Visitor } from "./data";
import { DAY_START_MINUTES, DAY_END_MINUTES, MINUTES_PER_VISITOR, MAX_VISITORS_PER_SHIFT, MAX_EVIDENCE_ITEMS } from "./core/constants";
import { readSave, writeSave, hasSave as saveExists, clearSave } from "./storage/save-store";
import { appendEvidence } from "./game/evidence";
import { isDecisionCorrect } from "./game/identity-check";
import { freshScore, recordCorrect, recordMistake, punishFalseReport } from "./game/scoring";
import { simulateDriveStep, canReachHeadquarters } from "./game/night-drive";
import { selectEnding } from "./game/ending";
import type { GameState, Score, Phase } from "./game/types";

export type { GameState, Score, Phase } from "./game/types";
export const state:GameState = {
 phase:"menu",index:0,clock:DAY_START_MINUTES,nightMinutes:0,fuel:100,tires:100,ammo:1,alive:true,
 message:"WELCOME TO NORTHGATE.",evidence:[],ending:"",score:freshScore()
};
export function save():void { writeSave(state); }
export function restore():boolean {
 const snapshot=readSave<Partial<GameState>>();
 if(!snapshot)return false;
 Object.assign(state,snapshot);
 return true;
}
export const hasSave=saveExists;
export function note(text:string):void {
 appendEvidence(state.evidence,text,state.phase==="night"||state.phase==="interrogation"?DAY_END_MINUTES+state.nightMinutes:state.clock,MAX_EVIDENCE_ITEMS);
}
export function startShift():void {
 state.phase="day";state.index=0;state.clock=DAY_START_MINUTES;state.nightMinutes=0;state.fuel=100;state.tires=100;state.ammo=1;state.alive=true;
 state.current=makeVisitor(0);state.message="SHIFT STARTED. VERIFY EVERYONE.";state.ending="";state.evidence=[];
 state.score=freshScore();save();
}
function advance():void {
 state.index++;state.clock=Math.min(DAY_END_MINUTES,DAY_START_MINUTES+state.index*MINUTES_PER_VISITOR);state.current=undefined;
 if(state.clock>=DAY_END_MINUTES||state.index>=MAX_VISITORS_PER_SHIFT){
   state.clock=DAY_END_MINUTES;state.phase="night";state.nightMinutes=0;state.message="MIDNIGHT. TAKE THE FILES TO POLICE HQ.";save();
 } else { state.current=makeVisitor(state.index);save(); }
}
export function decide(allow:boolean):void {
 const v=state.current;if(!v)return;
 const correct=isDecisionCorrect(allow?"allow":"deny",v);
 if(correct){recordCorrect(state.score);state.message=allow?"ACCESS GRANTED. MATCH ACCEPTED.":"DENIAL CONFIRMED. ANOMALY KEPT OUT.";}
 else{
  recordMistake(state.score);
  if(v.anomaly&&allow)state.score.admitted++;
  if(!v.anomaly&&!allow)state.score.rejected++;
  state.message=allow?"WARNING: SOMETHING BAD ENTERED NORTHGATE.":"AN INNOCENT RESIDENT WAS DENIED.";
 }
 note(v.name+" — "+(allow?"ALLOW":"DENY")+" — "+(correct?"CORRECT":"WRONG")+(v.anomaly?" ["+v.clue+"]":""));
 beep(correct?720:150,.1,correct?"square":"sawtooth");advance();
}
export function call998():void {
 const v=state.current;if(!v)return;
 state.message="998 CONNECTED. F.A.F.E UNIT DISPATCHED.";state.score.fafe=Math.min(100,state.score.fafe+2);note("998 called for "+v.name);beep(880,.12);
 window.setTimeout(()=>{
  if(v.anomaly){recordCorrect(state.score);state.message="F.A.F.E CONFIRMED THE ANOMALY. NORTHGATE SECURED.";note("F.A.F.E confirmed the anomaly in room "+v.room+".");}
  else{punishFalseReport(state.score);state.message="F.A.F.E FOUND NO ANOMALY. FALSE REPORT.";note("F.A.F.E found no anomaly.");}
  advance();
 },600);
}
export function drive():void {
 if(!state.alive)return;
 const outcome=simulateDriveStep({nightMinutes:state.nightMinutes,fuel:state.fuel,tires:state.tires,alive:state.alive,message:state.message});
 Object.assign(state,outcome.status);
 note("NIGHT: "+outcome.event);
 if(!state.alive){state.phase="ending";state.ending="LOST IN THE DARK";save();return;}
 if(canReachHeadquarters(state)){arriveHQ();return;}
 save();
}
export function checkRadio():void {
 note("RADIO: '998? There is no unit by that name tonight.'");
 state.score.suspicion=Math.min(100,state.score.suspicion+1);state.message="RADIO RETURNS A VOICE THAT SOUNDS LIKE YOU.";beep(210,.18,"triangle");save();
}
export function fireShotgun():void {
 if(state.ammo<=0){state.message="CLICK. EMPTY.";beep(90,.06);save();return;}
 state.ammo=0;const interrupted=Math.random()>.3;
 state.message=interrupted?"THE FIGURE VANISHES INTO THE DARK.":"THE FLASH REVEALS NOTHING. YOU KEEP DRIVING.";
 note("SHOTGUN FIRED. "+(interrupted?"Encounter interrupted.":"No confirmed target."));
 state.nightMinutes+=25;beep(70,.16,"sawtooth");
 if(state.alive&&canReachHeadquarters(state)){arriveHQ();return;}
 save();
}
export function arriveHQ():void {
 if(!state.alive){state.phase="ending";state.ending="LOST IN THE DARK";save();return;}
 state.phase="interrogation";state.message="HQ ARRIVAL. CLASS-X INTERROGATION READY.";save();
}
export function finishInterrogation():void {
 state.ending=selectEnding(state.score);state.phase="ending";save();
}
export function resetSave():void { clearSave();state.phase="menu"; }
