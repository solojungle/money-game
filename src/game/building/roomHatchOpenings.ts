import recipeData from "./recipes.builder.json";
import type { BuilderPieceRecipe, PlacedPiece } from "./types";
import { roomHalfExtents, type RoomFace } from "./roomGeometry";

const PIECE_BY_ID = new Map(
  (recipeData as BuilderPieceRecipe[]).map((p) => [p.id, p]),
);

function pieceGhostSize(pieceId: string): [number, number, number] {
  const s = PIECE_BY_ID.get(pieceId)?.ghostSize ?? [1, 1, 1];
  return [s[0], s[1], s[2]];
}

/** How far a hatch can sit from a room face and still open that wall. */
export const HATCH_FACE_SLACK = 0.65;

export type HatchOpening = {
  face: RoomFace;
  /** Portal cutout radius on the interior wall (meters). */
  holeRadius: number;
};

export function hatchOpensRoomFace(
  hatch: PlacedPiece,
  room: PlacedPiece,
  half: [number, number, number],
): RoomFace | null {
  const [cx, cy, cz] = room.position;
  const [hx, hy, hz] = half;
  const dx = hatch.position[0] - cx;
  const dy = hatch.position[1] - cy;
  const dz = hatch.position[2] - cz;

  if (Math.abs(dx) > hx * 0.55 || Math.abs(dy) > hy * 0.55) return null;

  if (Math.abs(dz) >= Math.abs(dx)) {
    if (Math.abs(Math.abs(dz) - hz) < HATCH_FACE_SLACK) {
      return dz > 0 ? "+z" : "-z";
    }
  } else if (Math.abs(Math.abs(dx) - hx) < HATCH_FACE_SLACK) {
    return dx > 0 ? "+x" : "-x";
  }
  return null;
}

export function hatchesOnRoomFaces(
  room: PlacedPiece,
  half: [number, number, number],
  placed: readonly PlacedPiece[],
): Set<RoomFace> {
  const open = new Set<RoomFace>();
  for (const h of placed) {
    if (h.pieceId !== "piece_hatch") continue;
    const face = hatchOpensRoomFace(h, room, half);
    if (face) open.add(face);
  }
  return open;
}

/** Hatch portal openings for a room (one per face; uses largest radius if multiple). */
export function hatchOpeningsForRoom(
  room: PlacedPiece,
  placed: readonly PlacedPiece[],
): HatchOpening[] {
  const half = roomHalfExtents(room.pieceId);
  const byFace = new Map<RoomFace, number>();

  for (const h of placed) {
    if (h.pieceId !== "piece_hatch") continue;
    const face = hatchOpensRoomFace(h, room, half);
    if (!face) continue;
    const [diameter] = pieceGhostSize(h.pieceId);
    const r = diameter * 0.42;
    const prev = byFace.get(face) ?? 0;
    byFace.set(face, Math.max(prev, r));
  }

  return [...byFace.entries()].map(([face, holeRadius]) => ({
    face,
    holeRadius,
  }));
}
