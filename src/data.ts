import { residents, type Person } from "./data/residents";
import { anomalyKinds, type AnomalyKind } from "./data/anomalies";
import { nightEvents } from "./data/night-events";
import { chance, pick } from "./utils/random";
import { esc, timeText } from "./utils/format";
import { beep } from "./audio/sfx";
import { anomalyChanceForShift } from "./core/rules";
import { alterCheckDigit } from "./game/ids";

export type { Person } from "./data/residents";
export type Visitor = Person & { anomaly:boolean; clue:"NONE" | AnomalyKind; micro:string };
export { residents, nightEvents, esc, timeText, beep };

export function makeVisitor(index:number, random:()=>number=Math.random):Visitor {
  const base=residents[index%residents.length];
  const anomaly=chance(anomalyChanceForShift(index),random);
  const clue:Visitor["clue"]=anomaly?pick(anomalyKinds,random):"NONE";
  const visitor:Visitor={...base,anomaly,clue,micro:"NG-31-B"};
  switch(clue) {
    case "ID NUMBER MISMATCH": visitor.id=alterCheckDigit(visitor.id); break;
    case "ROOM NUMBER MISMATCH": visitor.room=String(Number(visitor.room)+1); break;
    case "RELATIVE RECORD MISSING": visitor.relative="MISSING RECORD"; break;
    case "NEIGHBOR RECORD MISMATCH": visitor.neighbor="ROOM 000"; break;
    case "TIMELINE INCONSISTENCY": visitor.phrase="I was never here before."; break;
    case "BEHAVIORAL ANOMALY": visitor.phrase="Why do you keep checking the same thing?"; break;
    case "MICROCODE MISMATCH": visitor.micro="NG-31-A"; break;
    case "NONE": break;
  }
  return visitor;
}