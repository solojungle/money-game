import { describe, expect, it } from "vitest";
import { createVitalsTick } from "./tick";

describe("vitals tick", () => {
  it("drains O₂ over time for play mode", () => {
    let o2 = 100;
    const tick = createVitalsTick(
      () => ({
        o2Percent: o2,
        depthM: 30,
        hasRebreather: false,
        gameMode: "play",
        inBaseInterior: false,
        aboveWaterSurface: false,
      }),
      (next) => {
        if (next.o2Percent !== undefined) o2 = next.o2Percent;
      },
    );
    tick(1000);
    expect(o2).toBeLessThan(100);
  });

  it("refills O₂ gradually inside base interior", () => {
    let o2 = 40;
    const tick = createVitalsTick(
      () => ({
        o2Percent: o2,
        depthM: 30,
        hasRebreather: false,
        gameMode: "play",
        inBaseInterior: true,
        aboveWaterSurface: false,
      }),
      (next) => {
        if (next.o2Percent !== undefined) o2 = next.o2Percent;
      },
    );
    tick(16);
    expect(o2).toBeGreaterThan(40);
    expect(o2).toBeLessThan(100);
    tick(2000);
    expect(o2).toBe(100);
  });

  it("refills O₂ gradually above the water surface", () => {
    let o2 = 35;
    const tick = createVitalsTick(
      () => ({
        o2Percent: o2,
        depthM: 0,
        hasRebreather: false,
        gameMode: "play",
        inBaseInterior: false,
        aboveWaterSurface: true,
      }),
      (next) => {
        if (next.o2Percent !== undefined) o2 = next.o2Percent;
      },
    );
    tick(500);
    expect(o2).toBeGreaterThan(35);
    tick(2000);
    expect(o2).toBe(100);
  });
});
