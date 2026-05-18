import { describe, expect, it } from "vitest";
import { getPiece } from "./index";
import { canPlacePiece, occupantsFromPlaced } from "./placementRules";
import type { PlacedPiece } from "./types";

describe("placementRules", () => {
  const wallLocker = getPiece("piece_wall_locker")!;

  it("rejects interior piece in open water", () => {
    const r = canPlacePiece({
      piece: getPiece("piece_fabricator")!,
      surface: "open_water",
      occupants: [],
      targetPosition: [0, 0, 0],
    });
    expect(r.ok).toBe(false);
  });

  it("allows fabricator inside base interior", () => {
    const r = canPlacePiece({
      piece: getPiece("piece_fabricator")!,
      surface: "interior",
      occupants: [],
      targetPosition: [0, 0, 0],
    });
    expect(r.ok).toBe(true);
  });

  it("allows solar on base exterior", () => {
    const r = canPlacePiece({
      piece: getPiece("piece_solar_panel")!,
      surface: "base_exterior",
      occupants: [],
      targetPosition: [0, 0, 0],
    });
    expect(r.ok).toBe(true);
  });

  it("blocks wall locker on floor locker cell", () => {
    const placed: PlacedPiece[] = [
      {
        id: "f1",
        pieceId: "piece_floor_locker",
        position: [1, 0, 1],
        rotationY: 0,
      },
    ];
    const occupants = occupantsFromPlaced(placed);
    const r = canPlacePiece({
      piece: wallLocker,
      surface: "interior_wall",
      occupants,
      targetPosition: [1, 1, 1],
    });
    expect(r.ok).toBe(false);
  });

  it("allows two wall lockers stacked on same wall", () => {
    const placed: PlacedPiece[] = [
      {
        id: "w1",
        pieceId: "piece_wall_locker",
        position: [1, 1, 0],
        rotationY: 0,
        wallStack: 0,
      },
    ];
    const occupants = occupantsFromPlaced(placed);
    const r = canPlacePiece({
      piece: wallLocker,
      surface: "interior_wall",
      occupants,
      targetPosition: [1, 1, 0],
      wallStack: 1,
    });
    expect(r.ok).toBe(true);
  });

  it("rejects third wall locker on same wall", () => {
    const placed: PlacedPiece[] = [
      {
        id: "w1",
        pieceId: "piece_wall_locker",
        position: [1, 1, 0],
        rotationY: 0,
        wallStack: 0,
      },
      {
        id: "w2",
        pieceId: "piece_wall_locker",
        position: [1, 1, 0],
        rotationY: 0,
        wallStack: 1,
      },
    ];
    const occupants = occupantsFromPlaced(placed);
    const r = canPlacePiece({
      piece: wallLocker,
      surface: "interior_wall",
      occupants,
      targetPosition: [1, 1, 0],
      wallStack: 2,
    });
    expect(r.ok).toBe(false);
  });
});
