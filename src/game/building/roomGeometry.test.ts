import { describe, expect, it } from "vitest";
import { getScaledGhostSize } from "./index";
import { ROOM_WALL_THICK } from "./buildingConstants";
import {
  faceFromNormal,
  roomHalfExtents,
  snapBaseFacePiece,
  snapInteriorWallPiece,
  snapToRoomFace,
} from "./roomGeometry";
import type { PlacedPiece } from "./types";

const starterRoom: PlacedPiece = {
  id: "room",
  pieceId: "piece_room",
  position: [-3, 1.2, -4],
  rotationY: 0,
};

describe("roomGeometry", () => {
  it("maps hit normal to wall face", () => {
    expect(faceFromNormal([0, 0, 1])).toBe("+z");
    expect(faceFromNormal([0, 1, 0])).toBeNull();
  });

  it("snaps hatch on +z wall midplane", () => {
    const half = roomHalfExtents("piece_room");
    const snap = snapToRoomFace([-3, 1.2, -4], half, "+z");
    expect(snap.position[2]).toBeCloseTo(-4 + half[2] - 0.06, 3);
    expect(snap.rotationY).toBe(0);
  });

  it("snaps wall locker flush on -x interior face", () => {
    const half = roomHalfExtents("piece_room");
    const [, ph, pd] = getScaledGhostSize("piece_wall_locker");
    const snap = snapInteriorWallPiece({
      hitPoint: [-5.1, 1.35, -4],
      hitNormal: [1, 0, 0],
      placed: [starterRoom],
      pieceDepth: pd,
      pieceWidth: 1,
      pieceHeight: ph,
      snapEnabled: true,
    });
    expect(snap?.rotationY).toBeCloseTo(-Math.PI / 2, 3);
    expect(snap?.position[0]).toBeCloseTo(
      -3 - half[0] + ROOM_WALL_THICK + pd / 2,
      3,
    );
    expect(snap?.position[2]).toBeCloseTo(-4, 3);
  });

  it("snapBaseFacePiece finds nearest room", () => {
    const depth = getScaledGhostSize("piece_hatch")[2];
    const snap = snapBaseFacePiece({
      hitPoint: [-3, 1.2, -2.1],
      hitNormal: [0, 0, 1],
      placed: [starterRoom],
      pieceDepth: depth,
      fallbackRotationY: 0,
    });
    const half = roomHalfExtents("piece_room");
    expect(snap?.position[2]).toBeCloseTo(-4 + half[2] - 0.06, 3);
  });
});
