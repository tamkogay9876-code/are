import type { Visitor } from "../data";
export type Decision = "allow" | "deny";
export function isDecisionCorrect(decision:Decision, visitor:Pick<Visitor,"anomaly">):boolean {
  return (decision==="allow") !== visitor.anomaly;
}
export function identityClueCount(visitor:Pick<Visitor,"anomaly"|"clue"|"micro">):number {
  if(!visitor.anomaly)return 0;
  return Number(visitor.clue!=="NONE")+Number(visitor.micro==="NG-31-A");
}