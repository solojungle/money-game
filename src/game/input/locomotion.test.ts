import { describe, expect, it } from "vitest";
import { isInsideBaseInterior } from "../building/interiorVolume";
import type { PlacedPiece } from "../building/types";
import {
  isGroundedOnInteriorFloor,
  walkHorizontalVelocity,
  WALK_SPEED,
} from "./locomotion";

const room: PlacedPiece = {
  id: "r1",
  pieceId: "piece_room",
  position: [-3, 1.2, -4],
  rotationY: 0,
};

describe("isInsideBaseInterior", () => {
  it("is true at room center", () => {
    expect(isInsideBaseInterior([-3, 1.2, -4], [room])).toBe(true);
  });

  it("is false far outside", () => {
    expect(isInsideBaseInterior([0, 4, 0], [room])).toBe(false);
  });
});

describe("walkHorizontalVelocity", () => {
  const fwd = { x: 0, z: -1 };
  const right = { x: 1, z: 0 };

  it("forward walk uses walk speed on XZ only", () => {
    const v = walkHorizontalVelocity(
      { forward: true, back: false, left: false, right: false, sprint: false },
      fwd,
      right,
    );
    expect(v.z).toBeCloseTo(-WALK_SPEED, 3);
    expect(v.x).toBeCloseTo(0, 3);
  });
});

describe("isGroundedOnInteriorFloor", () => {
  it("detects feet on floor", () => {
    expect(
      isGroundedOnInteriorFloor({
        feetY: 0.1,
        floorY: 0,
        verticalVelocity: 0,
      }),
    ).toBe(true);
  });
});
