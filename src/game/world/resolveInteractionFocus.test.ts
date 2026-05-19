import { describe, expect, it } from "vitest";
import { createStarterPlacedPieces } from "../building";
import "./resourceNodes";
import "./faunaSpawns";
import "./scanTargets";
import {
  INTERACT_ZONE_ID_KEY,
  maxInteractDistanceFor,
  resolveInteractionFocus,
} from "./resolveInteractionFocus";
import {
  HARVEST_RANGE_M,
  PICKUP_RANGE_M,
  STATION_RANGE_M,
  aimAssistRadius,
} from "./interactRange";
import type { Object3D } from "three";

function mockObject(zoneId: string | null): Object3D {
  return {
    userData: zoneId ? { [INTERACT_ZONE_ID_KEY]: zoneId } : {},
    parent: null,
  } as Object3D;
}

describe("maxInteractDistanceFor", () => {
  it("uses pickup range for small resources", () => {
    expect(
      maxInteractDistanceFor({
        kind: "resource_node",
        nodeId: "ti_small_01",
        tier: "small",
        itemId: "titanium",
      }),
    ).toBe(PICKUP_RANGE_M);
  });

  it("uses harvest range for medium resources", () => {
    expect(
      maxInteractDistanceFor({
        kind: "resource_node",
        nodeId: "ag_medium_01",
        tier: "medium",
        itemId: "silver",
      }),
    ).toBe(HARVEST_RANGE_M);
  });

  it("uses station range for fabricator", () => {
    expect(maxInteractDistanceFor({ kind: "fabricator" })).toBe(
      STATION_RANGE_M,
    );
  });
});

describe("resolveInteractionFocus", () => {
  const player = { x: 0, y: 0, z: 0 };

  it("returns resource when ray hits zone within range", () => {
    const focused = resolveInteractionFocus(
      [
        {
          object: mockObject("resource:ti_small_01"),
          point: { x: 0, y: 0, z: 1 },
        },
      ],
      player,
    );
    expect(focused).toMatchObject({
      kind: "resource_node",
      nodeId: "ti_small_01",
    });
  });

  it("returns null when out of range", () => {
    const focused = resolveInteractionFocus(
      [
        {
          object: mockObject("resource:ti_small_01"),
          point: { x: 0, y: 0, z: 10 },
        },
      ],
      player,
    );
    expect(focused).toBeNull();
  });

  it("returns null when hit has no zone id", () => {
    const focused = resolveInteractionFocus(
      [{ object: mockObject(null), point: { x: 0, y: 0, z: 1 } }],
      player,
    );
    expect(focused).toBeNull();
  });

  it("picks closest valid hit", () => {
    const focused = resolveInteractionFocus(
      [
        {
          object: mockObject("resource:cu_small_01"),
          point: { x: 0, y: 0, z: 2 },
        },
        {
          object: mockObject("resource:ti_small_01"),
          point: { x: 0, y: 0, z: 1 },
        },
      ],
      player,
    );
    expect(focused).toMatchObject({ nodeId: "ti_small_01" });
  });

  it("ignores fabricator when player is outside the base", () => {
    const focused = resolveInteractionFocus(
      [
        {
          object: mockObject("fabricator"),
          point: { x: 0, y: 0, z: 1 },
        },
      ],
      { x: 0, y: 4, z: 0 },
      [],
      createStarterPlacedPieces(),
    );
    expect(focused).toBeNull();
  });

  it("allows fabricator when player is inside the base", () => {
    const player = { x: -3, y: 1.2, z: -4 };
    const focused = resolveInteractionFocus(
      [
        {
          object: mockObject("fabricator"),
          point: { x: -1.5, y: 0.55, z: -4 },
        },
      ],
      player,
      [],
      createStarterPlacedPieces(),
    );
    expect(focused).toMatchObject({ kind: "fabricator" });
  });
});

describe("aimAssistRadius", () => {
  it("scales visual radius", () => {
    expect(aimAssistRadius(0.5)).toBeCloseTo(0.6);
  });
});
