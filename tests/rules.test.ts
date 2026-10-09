import { describe, expect, it } from "vitest";
import { isDecisionCorrect } from "../src/game/identity-check";
import { selectEnding } from "../src/game/ending";
import { freshScore } from "../src/game/scoring";

describe("identity decisions", () => {
  it("allows real residents and denies impostors", () => {
    expect(isDecisionCorrect("allow", {anomaly:false} as never)).toBe(true);
    expect(isDecisionCorrect("deny", {anomaly:true} as never)).toBe(true);
  });
  it("flags the inverse decisions as mistakes", () => {
    expect(isDecisionCorrect("allow", {anomaly:true} as never)).toBe(false);
    expect(isDecisionCorrect("deny", {anomaly:false} as never)).toBe(false);
  });
});
describe("ending selection", () => {
  it("gives the high-suspicion ending priority", () => {
    const score=freshScore();score.suspicion=25;score.admitted=1;
    expect(selectEnding(score)).toContain("FALSE SECURITY");
  });
  it("returns the unresolved ending for a neutral shift", () => {
    expect(selectEnding(freshScore())).toContain("CASE REMAINS OPEN");
  });
});