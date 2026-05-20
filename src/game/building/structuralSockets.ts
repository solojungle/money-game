import { getScaledGhostSize } from "./index";
import { roomHalfExtents, snapToRoomFace, type RoomFace } from "./roomGeometry";
import type { PlacedPiece } from "./types";

export const STRUCTURAL_PIECE_IDS = [
  "piece_foundation",
  "piece_corridor",
  "piece_room",
  "piece_half_round_room",
  "piece_pillar",
] as const;

const SOCKET_SEARCH_RADIUS = 2.6;

function isStructural(pieceId: string): boolean {
  return STRUCTURAL_PIECE_IDS.includes(
    pieceId as (typeof STRUCTURAL_PIECE_IDS)[number],
  );
}

function distToStructuralSurface(
  point: [number, number, number],
  center: [number, number, number],
  half: [number, number, number],
): number {
  const dx = Math.max(Math.abs(point[0] - center[0]) - half[0], 0);
  const dy = Math.max(Math.abs(point[1] - center[1]) - half[1], 0);
  const dz = Math.max(Math.abs(point[2] - center[2]) - half[2], 0);
  return Math.hypot(dx, dy, dz);
}

export function nearestStructuralModule(
  hit: [number, number, number],
  placed: PlacedPiece[],
  excludePieceId?: string,
): { piece: PlacedPiece; half: [number, number, number] } | null {
  let best: { piece: PlacedPiece; half: [number, number, number] } | null =
    null;
  let bestDist = Infinity;
  for (const p of placed) {
    if (!isStructural(p.pieceId)) continue;
    if (excludePieceId && p.pieceId === excludePieceId) continue;
    const half = roomHalfExtents(p.pieceId);
    const dist = distToStructuralSurface(hit, p.position, half);
    if (dist < bestDist) {
      bestDist = dist;
      best = { piece: p, half };
    }
  }
  if (!best || bestDist > SOCKET_SEARCH_RADIUS) return null;
  return best;
}

/** Pick exterior face on neighbor closest to hit point. */
function nearestFaceOnBox(
  hit: [number, number, number],
  center: [number, number, number],
  half: [number, number, number],
): RoomFace {
  const dx = hit[0] - center[0];
  const dz = hit[2] - center[2];
  if (Math.abs(dx) / half[0] >= Math.abs(dz) / half[2]) {
    return dx > 0 ? "+x" : "-x";
  }
  return dz > 0 ? "+z" : "-z";
}

const FACE_STEP: Record<RoomFace, [number, number, number]> = {
  "+x": [1, 0, 0],
  "-x": [-1, 0, 0],
  "+z": [0, 0, 1],
  "-z": [0, 0, -1],
};

/**
 * Snap a new structural module so it connects flush to an existing one.
 * Aligns Y to neighbor center for horizontal corridors/rooms.
 */
export function snapToStructuralSocket(opts: {
  pieceId: string;
  hitPoint: [number, number, number];
  placed: PlacedPiece[];
  snapEnabled: boolean;
}): {
  position: [number, number, number];
  rotationY: number;
} | null {
  if (!opts.snapEnabled) return null;
  if (!isStructural(opts.pieceId)) return null;

  const neighbor = nearestStructuralModule(opts.hitPoint, opts.placed);
  if (!neighbor) return null;

  const face = nearestFaceOnBox(
    opts.hitPoint,
    neighbor.piece.position,
    neighbor.half,
  );
  const [w, , d] = getScaledGhostSize(opts.pieceId);
  const newHalf: [number, number, number] = [w / 2, 0, d / 2];
  const newHalfY = roomHalfExtents(opts.pieceId)[1];

  const attach = snapToRoomFace(neighbor.piece.position, neighbor.half, face);
  const step = FACE_STEP[face];
  const offset =
    (face === "+x" || face === "-x" ? newHalf[0] : newHalf[2]) +
    (face === "+x" || face === "-x" ? neighbor.half[0] : neighbor.half[2]);

  const position: [number, number, number] = [
    attach.position[0] + step[0] * offset,
    neighbor.piece.position[1],
    attach.position[2] + step[2] * offset,
  ];

  void newHalfY;

  return { position, rotationY: attach.rotationY };
}
