import { describe, expect, it } from "vitest";
import { createStarterPlacedPieces } from "../building";
import type { PlacedPiece } from "../building/types";
import {
  canAccessInteriorStation,
  requiresBaseInteriorAccess,
} from "./interiorStationAccess";
import type { WorldInteractable } from "./interactables";

const starter = createStarterPlacedPieces();

const room: PlacedPiece = {
  id: "r1",
  pieceId: "piece_room",
  position: [-3, 1.2, -4],
  rotationY: 0,
};

describe("requiresBaseInteriorAccess", () => {
  it("includes fabricator and interior lockers", () => {
    expect(requiresBaseInteriorAccess({ kind: "fabricator" }, starter)).toBe(
      true,
    );
    const wallLocker = starter.find((p) => p.pieceId === "piece_wall_locker");
    expect(wallLocker).toBeDefined();
    expect(
      requiresBaseInteriorAccess(
        { kind: "storage_locker", containerId: wallLocker!.id },
        starter,
      ),
    ).toBe(true);
  });

  it("excludes world resources", () => {
    expect(
      requiresBaseInteriorAccess(
        {
          kind: "resource_node",
          nodeId: "ti_small_01",
          tier: "small",
          itemId: "titanium",
        },
        starter,
      ),
    ).toBe(false);
  });
});

describe("canAccessInteriorStation", () => {
  const fabricator: WorldInteractable = { kind: "fabricator" };
  const floorLocker: WorldInteractable = {
    kind: "storage_locker",
    containerId: "placed_floor_locker",
  };
  const placed: PlacedPiece[] = [
    room,
    {
      id: "placed_floor_locker",
      pieceId: "piece_floor_locker",
      position: [-2, 0.55, -4],
      rotationY: 0,
    },
  ];

  it("allows fabricator inside the room", () => {
    expect(canAccessInteriorStation([-3, 1.2, -4], [room], fabricator)).toBe(
      true,
    );
  });

  it("blocks fabricator outside the room", () => {
    expect(canAccessInteriorStation([0, 4, 0], [room], fabricator)).toBe(false);
  });

  it("blocks floor locker outside the room", () => {
    expect(canAccessInteriorStation([0, 4, 0], placed, floorLocker)).toBe(
      false,
    );
  });
});
