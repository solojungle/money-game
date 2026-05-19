import { describe, expect, it } from "vitest";
import { Vector3 } from "three";
import {
  isSunAboveHorizon,
  starfieldRotationRad,
  sunDirectionFromDayPhase,
} from "./celestial";

const SUNRISE_AZ = Math.PI / 4;

describe("sunDirectionFromDayPhase", () => {
  it("places the sun on the horizon at sunrise and sunset", () => {
    const rise = sunDirectionFromDayPhase(0, SUNRISE_AZ);
    const set = sunDirectionFromDayPhase(0.5, SUNRISE_AZ);
    expect(rise.y).toBeCloseTo(0, 5);
    expect(set.y).toBeCloseTo(0, 5);
  });

  it("passes through the zenith at local noon", () => {
    const noon = sunDirectionFromDayPhase(0.25, SUNRISE_AZ);
    expect(noon.y).toBeCloseTo(1, 5);
  });

  it("is below the horizon for half the cycle (equal day and night)", () => {
    const samples = 48;
    let above = 0;
    for (let i = 0; i < samples; i += 1) {
      const phase = i / samples;
      const sun = sunDirectionFromDayPhase(phase, SUNRISE_AZ);
      if (isSunAboveHorizon(sun)) above += 1;
    }
    expect(above).toBe(samples / 2);
  });

  it("rotates at constant speed along a great circle", () => {
    const a = sunDirectionFromDayPhase(0.1, SUNRISE_AZ);
    const b = sunDirectionFromDayPhase(0.4, SUNRISE_AZ);
    const c = sunDirectionFromDayPhase(0.7, SUNRISE_AZ);
    const dotAB = a.dot(b);
    const dotBC = b.dot(c);
    expect(dotAB).toBeCloseTo(dotBC, 3);
  });

  it("sunrise and sunset are opposite on the horizon", () => {
    const rise = sunDirectionFromDayPhase(0, SUNRISE_AZ);
    const set = sunDirectionFromDayPhase(0.5, SUNRISE_AZ);
    const xzRise = new Vector3(rise.x, 0, rise.z).normalize();
    const xzSet = new Vector3(set.x, 0, set.z).normalize();
    expect(xzRise.dot(xzSet)).toBeCloseTo(-1, 4);
  });
});

describe("starfieldRotationRad", () => {
  it("wraps with day phase", () => {
    expect(starfieldRotationRad(0)).toBeCloseTo(0, 5);
    expect(starfieldRotationRad(1)).toBeCloseTo(0, 5);
    expect(starfieldRotationRad(0.25)).toBeCloseTo(Math.PI / 2, 5);
  });
});
