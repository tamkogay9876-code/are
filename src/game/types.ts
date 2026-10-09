import type { Visitor } from "../data";
export type Phase = "menu" | "day" | "night" | "interrogation" | "ending";
export type Score = { correct:number; mistakes:number; admitted:number; rejected:number; suspicion:number; trust:number; reputation:number; fafe:number };
export type GameState = {
  phase:Phase; index:number; clock:number; nightMinutes:number; fuel:number; tires:number; ammo:number; alive:boolean;
  current?:Visitor; message:string; evidence:string[]; ending:string; score:Score;
};