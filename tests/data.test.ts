import { describe, expect, it } from "vitest";
import { makeVisitor, residents } from "../src/data";

describe("resident records and anomaly generation", () => {
  it("ships with a useful roster of distinct resident records", () => {
    expect(residents.length).toBeGreaterThanOrEqual(8);
    expect(new Set(residents.map(person => person.room)).size).toBe(residents.length);
  });

  it("can produce a matching visitor with deterministic randomness", () => {
    const visitor = makeVisitor(0, () => 0.99);
    expect(visitor.name).toBe("Maya Chen");
    expect(visitor.anomaly).toBe(false);
    expect(visitor.room).toBe("101");
  });

  it("can produce an ID-number anomaly deterministically", () => {
    const visitor = makeVisitor(0, () => 0);
    expect(visitor.anomaly).toBe(true);
    expect(visitor.clue).toBe("ID NUMBER MISMATCH");
    expect(visitor.id).not.toBe(residents[0].id);
  });
});