import { ROOM_WALL_THICK } from "./buildingConstants";
import { isInsideRoomVolume } from "./placementRules";
import { roomHalfExtents } from "./roomGeometry";
import { STRUCTURAL_PIECE_IDS } from "./structuralSockets";
import type { PlacedPiece } from "./types";

/** Walkable interior aligned with room shell collider cavity. */
function walkableHalfExtents(pieceId: string): [number, number, number] {
  const half = roomHalfExtents(pieceId);
  const inset = ROOM_WALL_THICK + 0.02;
  return [
    Math.max(half[0] - inset, 0.25),
    Math.max(half[1] - inset, 0.25),
    Math.max(half[2] - inset, 0.25),
  ];
}

function isInteriorStructural(pieceId: string): boolean {
  return STRUCTURAL_PIECE_IDS.includes(
    pieceId as (typeof STRUCTURAL_PIECE_IDS)[number],
  );
}

/** True when the player is inside a structural habitat module (room, corridor, etc.). */
export function isInsideBaseInterior(
  pos: [number, number, number],
  placed: readonly PlacedPiece[],
): boolean {
  for (const p of placed) {
    if (!isInteriorStructural(p.pieceId)) continue;
    if (isInsideRoomVolume(pos, p.position, walkableHalfExtents(p.pieceId))) {
      return true;
    }
  }
  return false;
}

/** Top of interior floor collider (world Y). */
export function interiorFloorY(
  pos: [number, number, number],
  placed: readonly PlacedPiece[],
): number | null {
  for (const p of placed) {
    if (!isInteriorStructural(p.pieceId)) continue;
    const half = roomHalfExtents(p.pieceId);
    if (isInsideRoomVolume(pos, p.position, walkableHalfExtents(p.pieceId))) {
      return p.position[1] - half[1] + ROOM_WALL_THICK;
    }
  }
  return null;
}

/** Rigid-body center Y so capsule feet rest on the interior floor. */
export function bodyYOnInteriorFloor(
  floorY: number,
  capsuleHalfHeight: number,
): number {
  return floorY + capsuleHalfHeight;
}
