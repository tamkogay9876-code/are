import { describe, expect, it } from "vitest";
import { chance, pick, randomIndex } from "../src/utils/random";

describe("random helpers", () => {
  it("supports reproducible index selection", () => {
    expect(randomIndex(4,()=>0)).toBe(0);
    expect(randomIndex(4,()=>0.5)).toBe(2);
    expect(randomIndex(4,()=>1)).toBe(3);
  });
  it("clamps probability input", () => {
    expect(chance(-1,()=>0)).toBe(false);
    expect(chance(2,()=>0.9)).toBe(true);
  });
  it("picks an item deterministically", () => {
    expect(pick(["A","B","C"],()=>0.99)).toBe("C");
  });
  it("rejects empty collections", () => {
    expect(()=>randomIndex(0)).toThrow(RangeError);
    expect(()=>pick([])).toThrow(RangeError);
  });
});