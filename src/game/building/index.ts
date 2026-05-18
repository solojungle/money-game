import recipeData from "./recipes.builder.json";
import { scaleSize } from "./buildingScale";
import type { BlueprintId } from "../_kernel/types";
import type {
  BuilderCategory,
  BuilderIngredient,
  BuilderPieceRecipe,
  PlacedPiece,
} from "./types";
export { BUILDER_CATEGORIES } from "./types";
export {
  buildLocationLabel,
  BUILD_LOCATION_LABELS,
} from "./buildLocationLabels";
export type {
  BuilderCategory,
  BuilderMode,
  BuilderPieceRecipe,
  BuildLocation,
  PlacedPiece,
  PlacementSurface,
} from "./types";
export type { PlacementPreview } from "./computePlacement";
export {
  canPlacePiece,
  occupantsFromPlaced,
  structuralPieceIds,
  isInsideRoomVolume,
  wallCellKey,
} from "./placementRules";
export {
  faceFromNormal,
  nearestStructuralRoom,
  roomHalfExtents,
  snapBaseFacePiece,
  interiorWallFaceFromNormal,
  snapInteriorWallPiece,
  snapToRoomFace,
} from "./roomGeometry";
export { interiorFloorY, isInsideBaseInterior } from "./interiorVolume";
export {
  HATCH_FACE_SLACK,
  hatchOpeningsForRoom,
  hatchOpensRoomFace,
  hatchesOnRoomFaces,
} from "./roomHatchOpenings";
export type { HatchOpening } from "./roomHatchOpenings";

const PIECES = recipeData as BuilderPieceRecipe[];
const BY_ID = new Map(PIECES.map((p) => [p.id, p]));

export function getPiece(id: string): BuilderPieceRecipe | undefined {
  return BY_ID.get(id);
}

export function getScaledGhostSize(pieceId: string): [number, number, number] {
  const piece = getPiece(pieceId);
  const size = piece?.ghostSize ?? [1, 1, 1];
  return scaleSize([size[0], size[1], size[2]]);
}

export { BUILDING_WORLD_SCALE, scaleSize } from "./buildingScale";

export function getAllPieces(): readonly BuilderPieceRecipe[] {
  return PIECES;
}

export const BUILDER_STARTER_UNLOCK_IDS: BlueprintId[] = PIECES.map(
  (p) => p.blueprintId as BlueprintId,
);

export type BuilderIngredientStatus = {
  itemId: string;
  have: number;
  need: number;
};

export function getBuilderIngredientCounts(
  inventory: import("../systems/inventory/items.catalog").InventorySlot[],
  hotbarSlots: readonly (string | null)[],
  piece: BuilderPieceRecipe,
  countOwned: (
    inv: import("../systems/inventory/items.catalog").InventorySlot[],
    hotbar: typeof hotbarSlots,
    itemId: string,
  ) => number,
): BuilderIngredientStatus[] {
  return piece.ingredients.map((ing) => ({
    itemId: ing.itemId,
    need: ing.count,
    have: countOwned(inventory, hotbarSlots, ing.itemId),
  }));
}

export function canAffordPiece(
  inventory: import("../systems/inventory/items.catalog").InventorySlot[],
  hotbarSlots: readonly (string | null)[],
  pieceId: string,
  countOwned: (
    inv: import("../systems/inventory/items.catalog").InventorySlot[],
    hotbar: typeof hotbarSlots,
    itemId: string,
  ) => number,
): { ok: true } | { ok: false; missing: BuilderIngredientStatus[] } {
  const piece = getPiece(pieceId);
  if (!piece) return { ok: false, missing: [] };
  const statuses = getBuilderIngredientCounts(
    inventory,
    hotbarSlots,
    piece,
    countOwned,
  );
  const missing = statuses.filter((s) => s.have < s.need);
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

export function consumePieceIngredients(
  inventory: import("../systems/inventory/items.catalog").InventorySlot[],
  pieceId: string,
  removeItem: (
    inv: import("../systems/inventory/items.catalog").InventorySlot[],
    itemId: string,
    count: number,
  ) => import("../systems/inventory/items.catalog").InventorySlot[],
): import("../systems/inventory/items.catalog").InventorySlot[] | null {
  const piece = getPiece(pieceId);
  if (!piece) return null;
  let next = inventory;
  for (const ing of piece.ingredients) {
    next = removeItem(next, ing.itemId, ing.count);
  }
  return next;
}

export function refundPieceIngredients(
  inventory: import("../systems/inventory/items.catalog").InventorySlot[],
  pieceId: string,
  addItem: (
    inv: import("../systems/inventory/items.catalog").InventorySlot[],
    itemId: string,
    count: number,
  ) => import("../systems/inventory/stacks").AddItemResult,
): import("../systems/inventory/items.catalog").InventorySlot[] {
  const piece = getPiece(pieceId);
  if (!piece) return inventory;
  let next = inventory;
  for (const ing of piece.ingredients) {
    const r = addItem(next, ing.itemId, ing.count);
    if (r.ok) next = r.slots;
  }
  return next;
}

export function listBuilderPieces(opts?: {
  category?: BuilderCategory;
  /** Reserved for story mode; default shows all. */
  unlockedOnly?: boolean;
}): BuilderPieceRecipe[] {
  void opts?.unlockedOnly;
  return PIECES.filter((p) => {
    if (opts?.category && p.category !== opts.category) return false;
    return true;
  });
}

export function groupPiecesBySubsection(
  pieces: BuilderPieceRecipe[],
): { subsection: string; pieces: BuilderPieceRecipe[] }[] {
  const order: string[] = [];
  const map = new Map<string, BuilderPieceRecipe[]>();
  for (const p of pieces) {
    if (!map.has(p.subsection)) {
      map.set(p.subsection, []);
      order.push(p.subsection);
    }
    map.get(p.subsection)!.push(p);
  }
  return order.map((subsection) => ({
    subsection,
    pieces: map.get(subsection)!,
  }));
}

export function getPinBlueprintIdForPiece(pieceId: string): BlueprintId | null {
  const p = getPiece(pieceId);
  return p ? (p.pinBlueprintId as BlueprintId) : null;
}

export function pieceCreatesContainer(
  pieceId: string,
): "wall_locker" | "floor_locker" | null {
  return getPiece(pieceId)?.containerDefId ?? null;
}

export function isPiecePlaceable(pieceId: string): boolean {
  return getPiece(pieceId)?.placeable === true;
}

export function createStarterPlacedPieces(): PlacedPiece[] {
  return [
    {
      id: "placed_room_starter",
      pieceId: "piece_room",
      position: [-3, 1.2, -4],
      rotationY: 0,
    },
    {
      id: "placed_hatch_starter",
      pieceId: "piece_hatch",
      position: [-3, 1.2, -2.06],
      rotationY: 0,
    },
    {
      id: "placed_fab_starter",
      pieceId: "piece_fabricator",
      position: [-1.5, 0.55, -4],
      rotationY: 0,
    },
    {
      id: "placed_wall_locker_a",
      pieceId: "piece_wall_locker",
      position: [-5.205, 1.35, -4],
      rotationY: -Math.PI / 2,
      wallStack: 0,
    },
    {
      id: "placed_wall_locker_b",
      pieceId: "piece_wall_locker",
      position: [-5.205, 2.25, -4],
      rotationY: -Math.PI / 2,
      wallStack: 1,
    },
  ];
}

export type { BuilderIngredient };
