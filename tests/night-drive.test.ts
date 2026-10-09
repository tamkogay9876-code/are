import { describe, expect, it } from "vitest";
import { simulateDriveStep } from "../src/game/night-drive";

describe("night drive simulation", () => {
  it("consumes fuel and advances time on a normal drive", () => {
    const result = simulateDriveStep({
      nightMinutes:0, fuel:100, tires:100, alive:true, message:"Ready"
    }, () => 0.99);
    expect(result.status.nightMinutes).toBe(10);
    expect(result.status.fuel).toBe(95);
    expect(result.status.tires).toBe(100);
    expect(result.status.alive).toBe(true);
  });

  it("reports a breakdown when the vehicle runs out of fuel", () => {
    const values=[0.99,0.1,0];
    let i=0;
    const result=simulateDriveStep({
      nightMinutes:0, fuel:5, tires:50, alive:true, message:"Ready"
    },()=>values[i++] ?? 0);
    expect(result.breakdown).toBe(true);
    expect(result.status.fuel).toBe(0);
    expect(result.status.alive).toBe(false);
  });
});