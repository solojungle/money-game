import {
  canPlacePiece,
  getPiece,
  isInsideRoomVolume,
  occupantsFromPlaced,
  structuralPieceIds,
} from "./index";
import { getScaledGhostSize } from "./index";
import {
  roomHalfExtents,
  snapBaseFacePiece,
  snapInteriorWallPiece,
} from "./roomGeometry";
import { isInsideBaseInterior } from "./interiorVolume";
import { resolveStructuralPlacementY } from "./structuralPlacement";
import { snapToStructuralSocket } from "./structuralSockets";
import type { PlacedPiece, PlacementSurface } from "./types";

export type PlacementPreview = {
  position: [number, number, number];
  rotationY: number;
  surface: PlacementSurface;
  valid: boolean;
  wallStack: number;
};

function snapCoord(v: number, enabled: boolean): number {
  if (!enabled) return v;
  return Math.round(v * 2) / 2;
}

export function roomCentersFromPlaced(
  placed: PlacedPiece[],
): [number, number, number][] {
  return placed
    .filter(
      (p) =>
        p.pieceId === "piece_room" ||
        p.pieceId === "piece_half_round_room" ||
        p.pieceId === "piece_corridor",
    )
    .map((p) => p.position);
}

export function isInsideAnyStructuralInterior(
  pos: [number, number, number],
  placed: PlacedPiece[],
): boolean {
  return isInsideBaseInterior(pos, placed);
}

/** @deprecated Use isInsideAnyStructuralInterior */
export function isInsideAnyRoom(
  pos: [number, number, number],
  placed: PlacedPiece[],
): boolean {
  return isInsideAnyStructuralInterior(pos, placed);
}

function inferInteriorSurface(
  hitPoint: [number, number, number],
  hitNormal: [number, number, number],
  pieceBuildLocation: string,
  placed: PlacedPiece[],
): PlacementSurface {
  const ny = hitNormal[1];
  if (Math.abs(ny) > 0.75) {
    return ny > 0 ? "interior_floor" : "interior";
  }
  if (pieceBuildLocation === "interior_wall") return "interior_wall";
  if (pieceBuildLocation === "interior_floor") return "interior_floor";
  if (isInsideAnyStructuralInterior(hitPoint, placed)) return "interior";
  return "open_water";
}

export function computePlacementPreview(opts: {
  pieceId: string;
  hitPoint: [number, number, number];
  hitNormal: [number, number, number];
  placed: PlacedPiece[];
  snapEnabled: boolean;
  rotationY: number;
}): PlacementPreview | null {
  const piece = getPiece(opts.pieceId);
  if (!piece?.placeable) return null;

  const insideStructural = isInsideAnyStructuralInterior(
    opts.hitPoint,
    opts.placed,
  );
  const ny = opts.hitNormal[1];

  let surface: PlacementSurface = "open_water";
  if (structuralPieceIds().includes(opts.pieceId)) {
    if (ny > 0.6) surface = "seabed";
    else if (insideStructural) surface = "interior";
    else surface = "seabed";
  } else if (piece.buildLocation === "base_exterior") {
    surface = "base_exterior";
  } else if (piece.buildLocation === "base_face") {
    surface = "base_face";
  } else if (insideStructural) {
    surface = inferInteriorSurface(
      opts.hitPoint,
      opts.hitNormal,
      piece.buildLocation,
      opts.placed,
    );
  }

  let position: [number, number, number] = [
    snapCoord(opts.hitPoint[0], opts.snapEnabled),
    snapCoord(opts.hitPoint[1], opts.snapEnabled),
    snapCoord(opts.hitPoint[2], opts.snapEnabled),
  ];

  let rotationY = opts.rotationY;

  if (structuralPieceIds().includes(opts.pieceId) && surface === "seabed") {
    const socketSnap = snapToStructuralSocket({
      pieceId: opts.pieceId,
      hitPoint: opts.hitPoint,
      placed: opts.placed,
      snapEnabled: opts.snapEnabled,
    });
    if (socketSnap) {
      position = socketSnap.position;
      rotationY = socketSnap.rotationY;
    }
    position[1] = resolveStructuralPlacementY(
      opts.pieceId,
      position[0],
      position[2],
      opts.hitPoint[1],
    );
    position[0] = snapCoord(position[0], opts.snapEnabled);
    position[2] = snapCoord(position[2], opts.snapEnabled);
  }

  if (
    piece.buildLocation === "base_exterior" &&
    opts.pieceId.includes("solar")
  ) {
    const room = opts.placed.find((p) => p.pieceId === "piece_room");
    if (room) {
      position = [room.position[0], room.position[1] + 1.3, room.position[2]];
    }
  }

  if (piece.buildLocation === "interior_wall") {
    const [pw, ph, pd] = getScaledGhostSize(opts.pieceId);
    const snapped = snapInteriorWallPiece({
      hitPoint: opts.hitPoint,
      hitNormal: opts.hitNormal,
      placed: opts.placed,
      pieceDepth: pd,
      pieceWidth: pw,
      pieceHeight: ph,
      snapEnabled: opts.snapEnabled,
    });
    if (snapped) {
      position = snapped.position;
      rotationY = snapped.rotationY;
    }
  }

  if (piece.buildLocation === "base_face") {
    const depth = getScaledGhostSize(opts.pieceId)[2];
    const snapped = snapBaseFacePiece({
      hitPoint: opts.hitPoint,
      hitNormal: opts.hitNormal,
      placed: opts.placed,
      pieceDepth: depth,
      fallbackRotationY: opts.rotationY,
    });
    if (snapped) {
      position = snapped.position;
      rotationY = snapped.rotationY;
    }
  }

  const occupants = occupantsFromPlaced(opts.placed);
  let wallStack = 0;
  if (piece.buildLocation === "interior_wall") {
    const stacked = opts.placed.filter(
      (p) =>
        p.pieceId === "piece_wall_locker" &&
        Math.abs(p.position[0] - position[0]) < 0.2 &&
        Math.abs(p.position[2] - position[2]) < 0.2,
    );
    wallStack = stacked.length;
    if (stacked.length > 0) {
      position[1] = stacked[0]!.position[1] + 0.9;
    } else {
      const nearest = opts.placed.find(
        (p) =>
          (p.pieceId === "piece_room" ||
            p.pieceId === "piece_half_round_room" ||
            p.pieceId === "piece_corridor") &&
          isInsideRoomVolume(position, p.position, roomHalfExtents(p.pieceId)),
      );
      if (nearest) {
        const half = roomHalfExtents(nearest.pieceId);
        position[1] = nearest.position[1] - half[1] + 1.35;
      } else {
        position[1] = 1.35;
      }
    }
  }

  const check = canPlacePiece({
    piece,
    surface,
    occupants,
    targetPosition: position,
    wallStack,
    placed: opts.placed,
  });

  return {
    position,
    rotationY,
    surface,
    valid: check.ok,
    wallStack,
  };
}
