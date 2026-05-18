import recipeData from "./recipes.builder.json";
import type {
  BuilderPieceRecipe,
  BuildLocation,
  PlacedPiece,
  PlacementSurface,
} from "./types";

const PIECE_BY_ID = new Map(
  (recipeData as BuilderPieceRecipe[]).map((p) => [p.id, p]),
);

function getPieceLocal(id: string): BuilderPieceRecipe | undefined {
  return PIECE_BY_ID.get(id);
}

const INTERIOR_LOCATIONS: BuildLocation[] = [
  "interior",
  "interior_floor",
  "interior_wall",
  "interior_ceiling",
];

const EXTERIOR_LOCATIONS: BuildLocation[] = ["base_exterior", "seabed"];

function locationAllowsSurface(
  loc: BuildLocation,
  surface: PlacementSurface,
): boolean {
  switch (loc) {
    case "seabed":
      return surface === "seabed" || surface === "open_water";
    case "base_exterior":
      return surface === "base_exterior" || surface === "seabed";
    case "base_face":
      return surface === "base_face";
    case "interior":
      return surface === "interior";
    case "interior_floor":
      return surface === "interior_floor" || surface === "interior";
    case "interior_wall":
      return surface === "interior_wall" || surface === "interior";
    case "interior_ceiling":
      return surface === "interior";
    default:
      return false;
  }
}

export function isInteriorBuildLocation(loc: BuildLocation): boolean {
  return INTERIOR_LOCATIONS.includes(loc);
}

export function isExteriorBuildLocation(loc: BuildLocation): boolean {
  return EXTERIOR_LOCATIONS.includes(loc);
}

export type PlacementOccupant = {
  pieceId: string;
  buildLocation: BuildLocation;
  wallStack?: number;
  cellKey?: string;
};

export function wallCellKey(position: [number, number, number]): string {
  return `wall:${position[0].toFixed(2)}:${position[1].toFixed(2)}:${position[2].toFixed(2)}`;
}

export function floorCellKey(position: [number, number, number]): string {
  return `floor:${position[0].toFixed(2)}:${position[2].toFixed(2)}`;
}

export function occupantsFromPlaced(
  placed: PlacedPiece[],
): PlacementOccupant[] {
  return placed
    .map((p) => {
      const def = getPieceLocal(p.pieceId);
      if (!def) return null;
      const o: PlacementOccupant = {
        pieceId: p.pieceId,
        buildLocation: def.buildLocation,
        wallStack: p.wallStack,
      };
      if (def.buildLocation === "interior_wall") {
        o.cellKey = wallCellKey(p.position);
      }
      if (def.buildLocation === "interior_floor") {
        o.cellKey = floorCellKey(p.position);
      }
      return o;
    })
    .filter((x): x is PlacementOccupant => x != null);
}

export function canPlacePiece(opts: {
  piece: BuilderPieceRecipe;
  surface: PlacementSurface;
  occupants: PlacementOccupant[];
  targetPosition: [number, number, number];
  wallStack?: number;
}): { ok: true } | { ok: false; reason: string } {
  const { piece, surface, occupants, targetPosition, wallStack = 0 } = opts;

  if (!piece.placeable) {
    return { ok: false, reason: "Not yet placeable in world" };
  }

  if (!locationAllowsSurface(piece.buildLocation, surface)) {
    if (
      isInteriorBuildLocation(piece.buildLocation) &&
      surface === "open_water"
    ) {
      return { ok: false, reason: "Must be placed inside a base" };
    }
    if (piece.buildLocation === "base_exterior" && surface === "interior") {
      return { ok: false, reason: "Must be placed on exterior" };
    }
    return { ok: false, reason: "Invalid placement surface" };
  }

  if (piece.buildLocation === "interior_wall") {
    const key = wallCellKey(targetPosition);
    const onCell = occupants.filter(
      (o) => o.buildLocation === "interior_wall" && o.cellKey === key,
    );
    const floorHere = occupants.some(
      (o) =>
        o.buildLocation === "interior_floor" &&
        o.cellKey === floorCellKey(targetPosition),
    );
    if (floorHere) {
      return { ok: false, reason: "Cannot place on floor locker" };
    }
    if (wallStack >= 2 || onCell.length >= 2) {
      return { ok: false, reason: "Wall section full" };
    }
    if (wallStack > 0 && onCell.length === 0) {
      return { ok: false, reason: "Stack on existing wall locker" };
    }
  }

  if (piece.buildLocation === "interior_floor") {
    const key = floorCellKey(targetPosition);
    const wallOnFloor = occupants.some(
      (o) =>
        o.buildLocation === "interior_wall" &&
        o.cellKey === wallCellKey(targetPosition),
    );
    if (wallOnFloor) {
      return { ok: false, reason: "Floor cell blocked" };
    }
    if (
      occupants.some(
        (o) => o.buildLocation === "interior_floor" && o.cellKey === key,
      )
    ) {
      return { ok: false, reason: "Floor occupied" };
    }
  }

  return { ok: true };
}

export function inferSurfaceFromContext(opts: {
  insideBase: boolean;
  hitNormalY: number;
  onRoomRoof: boolean;
  onRoomFace: boolean;
}): PlacementSurface {
  if (!opts.insideBase) {
    if (opts.onRoomFace) return "base_face";
    if (opts.onRoomRoof) return "base_exterior";
    return "open_water";
  }
  if (Math.abs(opts.hitNormalY) > 0.85) {
    return opts.hitNormalY > 0
      ? "interior_floor"
      : ("interior_ceiling" as PlacementSurface);
  }
  if (opts.onRoomRoof) return "base_exterior";
  if (opts.onRoomFace && !opts.insideBase) return "base_face";
  return opts.hitNormalY < -0.5 ? "interior_floor" : "interior_wall";
}

/** Room interior bounds check (axis-aligned box). */
export function isInsideRoomVolume(
  pos: [number, number, number],
  roomCenter: [number, number, number],
  halfExtents: [number, number, number],
): boolean {
  return (
    Math.abs(pos[0] - roomCenter[0]) <= halfExtents[0] &&
    Math.abs(pos[1] - roomCenter[1]) <= halfExtents[1] &&
    Math.abs(pos[2] - roomCenter[2]) <= halfExtents[2]
  );
}

export function structuralPieceIds(): string[] {
  return [
    "piece_foundation",
    "piece_corridor",
    "piece_room",
    "piece_half_round_room",
    "piece_pillar",
  ];
}
