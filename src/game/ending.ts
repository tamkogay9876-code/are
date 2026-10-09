import type { Score } from "./types";
export function selectEnding(score:Score):string {
  if(score.suspicion>=25)return "FALSE SECURITY — THE STATION DOES NOT TRUST YOU";
  if(score.admitted>0)return "THE WRONG PERSON ENTERED";
  if(score.rejected>=2)return "TOO PARANOID — NORTHGATE LOST TRUST";
  if(score.trust>=55)return "F.A.F.E RECRUIT";
  return "SHIFT COMPLETE — THE CASE REMAINS OPEN";
}