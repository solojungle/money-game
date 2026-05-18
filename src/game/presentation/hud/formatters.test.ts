import { describe, expect, it } from "vitest";
import {
  COMPASS_TICKS_PER_ROTATION,
  compassCardinal,
  compassTapeMarks,
  compassTapeTranslatePx,
  formatDepthM,
  formatO2Percent,
  o2ArcDegrees,
} from "./formatters";

describe("M15 formatters", () => {
  it("formats depth and O₂", () => {
    expect(formatDepthM(208.4)).toBe("208 m");
    expect(formatO2Percent(37.6)).toBe("38");
  });

  it("maps O₂ to arc sweep", () => {
    expect(o2ArcDegrees(100)).toBe(270);
    expect(o2ArcDegrees(0)).toBe(0);
  });

  it("resolves compass cardinals", () => {
    expect(compassCardinal(0)).toBe("N");
    expect(compassCardinal(45)).toBe("NE");
  });

  it("builds compass tape marks for three full rotations", () => {
    const marks = compassTapeMarks();
    expect(marks.length).toBe(72);
    expect(marks[0]?.text).toBe("N");
    expect(marks[marks.length - 1]?.degrees).toBe(345 + 360 * 2);
  });

  it("translates compass tape monotonically with heading", () => {
    const tick = 24;
    const center = 140;
    const a = compassTapeTranslatePx(0, tick, center);
    const b = compassTapeTranslatePx(90, tick, center);
    expect(b).toBeLessThan(a);
    expect(compassTapeTranslatePx(360, tick, center)).toBe(a);
  });

  it("centers on the middle lap so west-of-N ticks are left of center at 0°", () => {
    const tick = 28;
    const center = 140;
    expect(compassTapeTranslatePx(0, tick, center)).toBe(
      center - COMPASS_TICKS_PER_ROTATION * tick,
    );
  });

  it("leaves ticks east of NW on the tape (N, 15, … after 345)", () => {
    const marks = compassTapeMarks();
    const nwHeading = 315;
    const tickIndex = nwHeading / 15 + COMPASS_TICKS_PER_ROTATION;
    const eastOfNw = marks[Math.ceil(tickIndex) + 3];
    expect(eastOfNw?.text).toBe("N");
  });
});
