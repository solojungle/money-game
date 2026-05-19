import { beforeEach, describe, expect, it } from "vitest";
import {
  disposeGameSystems,
  initGameSystems,
  runGameTick,
} from "./registerSystems";

describe("game systems integration", () => {
  beforeEach(() => {
    disposeGameSystems();
  });

  it("vitals tick drains O₂ when play mode is active", () => {
    let o2 = 100;
    initGameSystems(
      () => ({
        o2Percent: o2,
        depthM: 20,
        hasRebreather: false,
        gameMode: "play",
        inBaseInterior: false,
        aboveWaterSurface: false,
      }),
      (partial) => {
        if (partial.o2Percent !== undefined) o2 = partial.o2Percent;
      },
    );
    runGameTick(2000);
    expect(o2).toBeLessThan(100);
  });
});
