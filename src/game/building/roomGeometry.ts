import { ROOM_WALL_THICK } from "./buildingConstants";
import { getPiece } from "./index";
import type { PlacedPiece } from "./types";

const WALL_CENTER_INSET = ROOM_WALL_THICK / 2;

export const ROOM_PIECE_IDS = ["piece_room", "piece_half_round_room"] as const;

export type RoomFace = "+x" | "-x" | "+z" | "-z";

export function roomHalfExtents(pieceId: string): [number, number, number] {
  const def = getPiece(pieceId);
  const size = def?.ghostSize ?? [5, 2.4, 4];
  return [size[0] / 2, size[1] / 2, size[2] / 2];
}

/** Wall face from outward-pointing hit normal (ignores floor/ceiling). */
export function faceFromNormal(
  normal: [number, number, number],
): RoomFace | null {
  const [nx, , nz] = normal;
  if (Math.abs(nx) < 0.45 && Math.abs(nz) < 0.45) return null;
  if (Math.abs(nx) >= Math.abs(nz)) return nx > 0 ? "+x" : "-x";
  return nz > 0 ? "+z" : "-z";
}

const OPPOSITE_FACE: Record<RoomFace, RoomFace> = {
  "+x": "-x",
  "-x": "+x",
  "+z": "-z",
  "-z": "+z",
};

/** Interior wall hits face into the room — opposite of exterior/outward normals. */
export function interiorWallFaceFromNormal(
  normal: [number, number, number],
): RoomFace | null {
  const face = faceFromNormal(normal);
  return face ? OPPOSITE_FACE[face] : null;
}

/** Hatch origin on the wall midplane; local +Z points outward from the room. */
export function snapToRoomFace(
  roomCenter: [number, number, number],
  half: [number, number, number],
  face: RoomFace,
): { position: [number, number, number]; rotationY: number } {
  switch (face) {
    case "+x":
      return {
        position: [
          roomCenter[0] + half[0] - WALL_CENTER_INSET,
          roomCenter[1],
          roomCenter[2],
        ],
        rotationY: -Math.PI / 2,
      };
    case "-x":
      return {
        position: [
          roomCenter[0] - half[0] + WALL_CENTER_INSET,
          roomCenter[1],
          roomCenter[2],
        ],
        rotationY: Math.PI / 2,
      };
    case "+z":
      return {
        position: [
          roomCenter[0],
          roomCenter[1],
          roomCenter[2] + half[2] - WALL_CENTER_INSET,
        ],
        rotationY: 0,
      };
    case "-z":
      return {
        position: [
          roomCenter[0],
          roomCenter[1],
          roomCenter[2] - half[2] + WALL_CENTER_INSET,
        ],
        rotationY: Math.PI,
      };
  }
}

function distToRoomSurface(
  point: [number, number, number],
  center: [number, number, number],
  half: [number, number, number],
): number {
  const dx = Math.max(Math.abs(point[0] - center[0]) - half[0], 0);
  const dy = Math.max(Math.abs(point[1] - center[1]) - half[1], 0);
  const dz = Math.max(Math.abs(point[2] - center[2]) - half[2], 0);
  return Math.hypot(dx, dy, dz);
}

export function nearestStructuralRoom(
  hit: [number, number, number],
  placed: PlacedPiece[],
): { piece: PlacedPiece; half: [number, number, number] } | null {
  let best: { piece: PlacedPiece; half: [number, number, number] } | null =
    null;
  let bestDist = Infinity;
  for (const p of placed) {
    if (!ROOM_PIECE_IDS.includes(p.pieceId as (typeof ROOM_PIECE_IDS)[number]))
      continue;
    const half = roomHalfExtents(p.pieceId);
    const dist = distToRoomSurface(hit, p.position, half);
    if (dist < bestDist) {
      bestDist = dist;
      best = { piece: p, half };
    }
  }
  if (!best || bestDist > 2.5) return null;
  return best;
}

function snapCoord(v: number, enabled: boolean): number {
  if (!enabled) return v;
  return Math.round(v * 2) / 2;
}

/** Wall-mounted interior piece flush on the room interior face. */
export function snapInteriorWallPiece(opts: {
  hitPoint: [number, number, number];
  hitNormal: [number, number, number];
  placed: PlacedPiece[];
  pieceDepth: number;
  pieceWidth: number;
  pieceHeight: number;
  snapEnabled: boolean;
}): { position: [number, number, number]; rotationY: number } | null {
  const room = nearestStructuralRoom(opts.hitPoint, opts.placed);
  const face = interiorWallFaceFromNormal(opts.hitNormal);
  if (!room || !face) return null;

  const [cx, cy, cz] = room.piece.position;
  const [hx, hy, hz] = room.half;
  const halfD = opts.pieceDepth / 2;
  const halfW = opts.pieceWidth / 2;
  const halfH = opts.pieceHeight / 2;
  const wall = ROOM_WALL_THICK;
  const margin = 0.08;

  let rotationY = 0;
  let position: [number, number, number];

  switch (face) {
    case "+x":
      position = [
        cx + hx - wall - halfD,
        snapCoord(opts.hitPoint[1], opts.snapEnabled),
        snapCoord(opts.hitPoint[2], opts.snapEnabled),
      ];
      rotationY = Math.PI / 2;
      position[2] = Math.min(
        cz + hz - halfW - margin,
        Math.max(cz - hz + halfW + margin, position[2]!),
      );
      break;
    case "-x":
      position = [
        cx - hx + wall + halfD,
        snapCoord(opts.hitPoint[1], opts.snapEnabled),
        snapCoord(opts.hitPoint[2], opts.snapEnabled),
      ];
      rotationY = -Math.PI / 2;
      position[2] = Math.min(
        cz + hz - halfW - margin,
        Math.max(cz - hz + halfW + margin, position[2]!),
      );
      break;
    case "+z":
      position = [
        snapCoord(opts.hitPoint[0], opts.snapEnabled),
        snapCoord(opts.hitPoint[1], opts.snapEnabled),
        cz + hz - wall - halfD,
      ];
      rotationY = Math.PI;
      position[0] = Math.min(
        cx + hx - halfW - margin,
        Math.max(cx - hx + halfW + margin, position[0]!),
      );
      break;
    case "-z":
      position = [
        snapCoord(opts.hitPoint[0], opts.snapEnabled),
        snapCoord(opts.hitPoint[1], opts.snapEnabled),
        cz - hz + wall + halfD,
      ];
      rotationY = 0;
      position[0] = Math.min(
        cx + hx - halfW - margin,
        Math.max(cx - hx + halfW + margin, position[0]!),
      );
      break;
  }

  const minY = cy - hy + wall + halfH + margin;
  const maxY = cy + hy - wall - halfH - margin;
  position[1] = Math.min(maxY, Math.max(minY, position[1]!));

  return { position, rotationY };
}

export function snapBaseFacePiece(opts: {
  hitPoint: [number, number, number];
  hitNormal: [number, number, number];
  placed: PlacedPiece[];
  pieceDepth: number;
  fallbackRotationY: number;
}): {
  position: [number, number, number];
  rotationY: number;
} | null {
  const room = nearestStructuralRoom(opts.hitPoint, opts.placed);
  const face = faceFromNormal(opts.hitNormal);
  if (!room || !face) return null;
  return snapToRoomFace(room.piece.position, room.half, face);
}
