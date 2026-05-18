import { describe, expect, it } from "vitest";
import {
  intentToXZ,
  moveIntentToWorldXZ,
  swimIntentToWorldVelocity,
  swimVerticalComponent,
  SWIM_SPEED,
  SWIM_SPRINT_MULT,
  type SwimIntent,
} from "./intent";

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

const camFwd = { x: 0, z: -1 };
const camRight = { x: 1, z: 0 };

describe("intentToXZ", () => {
  it("returns zero when no direction keys", () => {
    expect(intentToXZ(idle, 0)).toEqual({ x: 0, z: 0 });
  });

  it("forward at yaw 0 moves toward -Z", () => {
    const v = intentToXZ({ ...idle, forward: true }, 0);
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.z).toBeCloseTo(-1, 5);
  });

  it("rotates movement with camera yaw", () => {
    const v = intentToXZ({ ...idle, forward: true }, Math.PI / 2);
    expect(v.x).toBeCloseTo(1, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it("normalizes diagonal to unit length", () => {
    const v = intentToXZ({ ...idle, forward: true, right: true }, 0);
    expect(Math.hypot(v.x, v.z)).toBeCloseTo(1, 5);
  });
});

describe("moveIntentToWorldXZ", () => {
  it("W moves along forward", () => {
    const v = moveIntentToWorldXZ({ ...idle, forward: true }, camFwd, camRight);
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.z).toBeCloseTo(-1, 5);
  });
});

describe("swimVerticalComponent", () => {
  it("ascend adds positive Y", () => {
    expect(swimVerticalComponent({ ...idle, ascend: true })).toBe(1);
  });

  it("descend adds negative Y", () => {
    expect(swimVerticalComponent({ ...idle, descend: true })).toBe(-1);
  });

  it("ascend and descend cancel", () => {
    expect(
      swimVerticalComponent({ ...idle, ascend: true, descend: true }),
    ).toBe(0);
  });
});

describe("swimIntentToWorldVelocity", () => {
  it("returns zero when idle", () => {
    expect(swimIntentToWorldVelocity(idle, camFwd, camRight)).toEqual({
      x: 0,
      y: 0,
      z: 0,
    });
  });

  it("forward swim uses base speed", () => {
    const v = swimIntentToWorldVelocity(
      { ...idle, forward: true },
      camFwd,
      camRight,
    );
    expect(v.z).toBeCloseTo(-SWIM_SPEED, 4);
    expect(v.y).toBeCloseTo(0, 4);
  });

  it("ascend adds world-up velocity", () => {
    const v = swimIntentToWorldVelocity(
      { ...idle, ascend: true },
      camFwd,
      camRight,
    );
    expect(v.y).toBeCloseTo(SWIM_SPEED, 4);
  });

  it("sprint multiplies swim speed", () => {
    const v = swimIntentToWorldVelocity(
      { ...idle, forward: true, sprint: true },
      camFwd,
      camRight,
    );
    expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(
      SWIM_SPEED * SWIM_SPRINT_MULT,
      4,
    );
  });
});
