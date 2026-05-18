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
      }),
      (next) => {
        if (next.o2Percent !== undefined) o2 = next.o2Percent;
      },
    );
    tick(1000);
    expect(o2).toBeLessThan(100);
  });
});
