import { ANOMALY_CHANCE_BASE } from "../data/anomalies";
export function anomalyChanceForShift(visitorIndex:number):number {
  return Math.min(.58,ANOMALY_CHANCE_BASE+Math.max(0,visitorIndex)*.018);
}
export function shouldEndDay(visitorIndex:number,maxVisitors=9):boolean {
  return visitorIndex>=maxVisitors;
}
export function clampMeter(value:number):number {
  return Math.max(0,Math.min(100,value));
}