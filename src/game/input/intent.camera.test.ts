import { describe, expect, it } from "vitest";
import { moveIntentToWorldXZ, type SwimIntent } from "./intent";

const idle: SwimIntent = {
  forward: false,
  back: false,
  left: false,
  right: false,
  ascend: false,
  descend: false,
  sprint: false,
  interact: false,
};

describe("moveIntentToWorldXZ", () => {
  it("W moves along forward", () => {
    const v = moveIntentToWorldXZ(
      { ...idle, forward: true },
      { x: 0, z: -1 },
      { x: 1, z: 0 },
    );
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.z).toBeCloseTo(-1, 5);
  });

  it("D moves along right", () => {
    const v = moveIntentToWorldXZ(
      { ...idle, right: true },
      { x: 0, z: -1 },
      { x: 1, z: 0 },
    );
    expect(v.x).toBeCloseTo(1, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it("normalizes diagonal", () => {
    const v = moveIntentToWorldXZ(
      { ...idle, forward: true, right: true },
      { x: 0, z: -1 },
      { x: 1, z: 0 },
    );
    expect(Math.hypot(v.x, v.z)).toBeCloseTo(1, 5);
  });
});
