import {
  createStarterPlacedPieces,
  pieceCreatesContainer,
} from "../game/building";
import type {
  BuilderCategory,
  BuilderMode,
  PlacedPiece,
  PlacementPreview,
} from "../game/building";
import { defaultBuilderCategory } from "./builderActionsConstants";
import {
  createEmptyContainerSlots,
  type ContainerDefId,
} from "../game/systems/storage/containerDefs";
import type { InventorySlot } from "../game/systems/inventory/items.catalog";
import { getEquippedToolId } from "../game/presentation/hud/resolveInteractionPrompt";

export { defaultBuilderCategory } from "./builderActionsConstants";

export function isBuilderEquipped(
  hotbarSlots: (string | null)[],
  quickSlot: number,
): boolean {
  return getEquippedToolId(hotbarSlots, quickSlot) === "builder";
}

export function ensureContainerWithDef(
  containers: Record<string, InventorySlot[]>,
  containerId: string,
  defId: ContainerDefId,
): Record<string, InventorySlot[]> {
  if (containers[containerId]) return containers;
  return {
    ...containers,
    [containerId]: createEmptyContainerSlots(defId),
  };
}

export function containerDefForPlaced(
  placed: PlacedPiece[],
  containerId: string,
): ContainerDefId {
  const piece = placed.find((p) => p.id === containerId);
  if (!piece) return "small_locker";
  return pieceCreatesContainer(piece.pieceId) ?? "small_locker";
}

export function initialBuilderState() {
  const starter = createStarterPlacedPieces();
  let containers: Record<string, InventorySlot[]> = {};
  for (const p of starter) {
    const defId = pieceCreatesContainer(p.pieceId);
    if (defId) {
      containers = ensureContainerWithDef(containers, p.id, defId);
    }
  }
  return {
    builderOpen: false,
    builderCategory: defaultBuilderCategory as BuilderCategory,
    builderHoveredPieceId: null as string | null,
    builderSelectedPieceId: null as string | null,
    builderMode: "place" as BuilderMode,
    builderSnapEnabled: true,
    builderPlacementYaw: 0,
    builderPlacementPreview: null as PlacementPreview | null,
    builderMoveSourceId: null as string | null,
    placedPieces: starter,
    containers,
  };
}
