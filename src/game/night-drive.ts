import { nightEvents } from "../data/night-events";
import { randomIndex, chance } from "../utils/random";
export type DriveStatus = { nightMinutes:number; fuel:number; tires:number; alive:boolean; message:string };
export type DriveOutcome = { status:DriveStatus; event:string; breakdown:boolean };
export function simulateDriveStep(input:DriveStatus,random:()=>number=Math.random):DriveOutcome {
  const status={...input,nightMinutes:input.nightMinutes};
  status.nightMinutes+=10;
  status.fuel=Math.max(0,status.fuel-5);
  if(chance(.22,random))status.tires=Math.max(0,status.tires-18);
  const event=nightEvents[randomIndex(nightEvents.length,random)];
  status.message=event;
  let breakdown=false;
  if(status.fuel===0||status.tires===0) {
    status.message=status.fuel===0?"ENGINE STOPS. A SHAPE MOVES IN THE DARK.":"TIRE FAILURE. THE ROAD GOES SILENT.";
    breakdown=true;
    if(chance(.6,random))status.alive=false;
  }
  return {status,event,breakdown};
}
export function canReachHeadquarters(status:Pick<DriveStatus,"alive"|"nightMinutes">):boolean {
  return status.alive && status.nightMinutes>=180;
}