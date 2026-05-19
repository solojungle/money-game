import { describe, expect, it } from "vitest";
import {
  depthMetersBelowSurface,
  isBelowWaterSurface,
  METERS_PER_WORLD_UNIT,
  SEAFLOOR_BODY_Y,
  submergedBlend,
  resolveLocomotionMode,
  usesDryLocomotion,
  WATER_COLUMN_DEPTH_M,
  waterSurfaceWorldY,
} from "./waterLevel";

describe("waterLevel", () => {
  it("places surface 150 m above seafloor body origin", () => {
    expect(waterSurfaceWorldY).toBe(
      SEAFLOOR_BODY_Y + WATER_COLUMN_DEPTH_M / METERS_PER_WORLD_UNIT,
    );
    expect(waterSurfaceWorldY).toBe(14.5);
  });

  it("computes depth from surface", () => {
    expect(depthMetersBelowSurface(waterSurfaceWorldY)).toBe(0);
    expect(depthMetersBelowSurface(waterSurfaceWorldY - 0.5)).toBe(5);
    expect(depthMetersBelowSurface(SEAFLOOR_BODY_Y)).toBe(150);
  });

  it("blends submersion near the surface", () => {
    expect(submergedBlend(waterSurfaceWorldY + 1)).toBe(0);
    expect(submergedBlend(waterSurfaceWorldY - 1)).toBe(1);
  });

  it("switches to dry locomotion above surface or in a base", () => {
    const feetAbove = waterSurfaceWorldY;
    const feetBelow = waterSurfaceWorldY - 0.5;
    expect(isBelowWaterSurface(feetAbove)).toBe(false);
    expect(usesDryLocomotion(feetAbove, false)).toBe(true);
    expect(usesDryLocomotion(feetBelow, false)).toBe(false);
    expect(usesDryLocomotion(feetBelow, true)).toBe(true);
  });

  it("dives back into swim when descending above the surface", () => {
    const feetAbove = waterSurfaceWorldY + 0.2;
    expect(resolveLocomotionMode(feetAbove, false, false)).toBe("dry");
    expect(resolveLocomotionMode(feetAbove, false, true)).toBe("swim");
    expect(resolveLocomotionMode(feetAbove, true, true)).toBe("dry");
  });
});
