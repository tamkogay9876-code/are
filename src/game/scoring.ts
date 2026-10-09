import type { Score } from "./types";
export function freshScore():Score {
  return {correct:0,mistakes:0,admitted:0,rejected:0,suspicion:0,trust:50,reputation:50,fafe:50};
}
export function recordCorrect(score:Score):void {
  score.correct++;
  score.reputation=Math.min(100,score.reputation+2);
  score.trust=Math.min(100,score.trust+1);
}
export function recordMistake(score:Score):void {
  score.mistakes++;
  score.reputation=Math.max(0,score.reputation-8);
  score.suspicion=Math.min(100,score.suspicion+7);
  score.trust=Math.max(0,score.trust-5);
}
export function punishFalseReport(score:Score):void {
  score.mistakes++;
  score.suspicion=Math.min(100,score.suspicion+5);
}