import { describe, expect, it } from "vitest";
import { createVitalsStub, HUD_MODULE_VERSION } from "./index";

describe("M15 hud contract", () => {
  it("exposes version and vitals stub", () => {
    expect(HUD_MODULE_VERSION).toBeGreaterThan(0);
    const vitals = createVitalsStub();
    expect(vitals.o2Percent).toBeGreaterThan(0);
    expect(vitals.depthM).toBeGreaterThanOrEqual(0);
  });

  it("allows partial overrides", () => {
    const vitals = createVitalsStub({ depthM: 208 });
    expect(vitals.depthM).toBe(208);
  });
});
