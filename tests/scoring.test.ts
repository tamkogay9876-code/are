import { describe, expect, it } from "vitest";
import { freshScore, recordCorrect, recordMistake, punishFalseReport } from "../src/game/scoring";

describe("shift scoring", () => {
  it("starts with neutral trust and reputation", () => {
    const score = freshScore();
    expect(score.trust).toBe(50);
    expect(score.reputation).toBe(50);
  });
  it("rewards a correct decision without exceeding the score cap", () => {
    const score = freshScore();
    score.trust = 100;
    score.reputation = 99;
    recordCorrect(score);
    expect(score.correct).toBe(1);
    expect(score.trust).toBe(100);
    expect(score.reputation).toBe(100);
  });
  it("penalizes mistakes and keeps meters bounded", () => {
    const score = freshScore();
    score.trust = 2;
    score.reputation = 3;
    recordMistake(score);
    expect(score.mistakes).toBe(1);
    expect(score.trust).toBe(0);
    expect(score.reputation).toBe(0);
  });
  it("tracks false emergency reports", () => {
    const score = freshScore();
    punishFalseReport(score);
    expect(score.mistakes).toBe(1);
    expect(score.suspicion).toBe(5);
  });
});