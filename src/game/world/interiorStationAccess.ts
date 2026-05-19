import { isInsideBaseInterior } from "../building/interiorVolume";
import { pieceCreatesContainer } from "../building";
import type { PlacedPiece } from "../building/types";
import type { ContainerDefId } from "../systems/storage/containerDefs";
import type { WorldInteractable } from "./interactables";

function containerDefForLocker(
  target: WorldInteractable,
  placed: readonly PlacedPiece[],
): ContainerDefId | null {
  if (target.kind !== "storage_locker") return null;
  const piece = placed.find((p) => p.id === target.containerId);
  if (!piece) return null;
  return pieceCreatesContainer(piece.pieceId);
}

/** Stations that only work while the player is inside a habitat room volume. */
export function requiresBaseInteriorAccess(
  target: WorldInteractable,
  placed: readonly PlacedPiece[],
): boolean {
  if (target.kind === "fabricator") return true;
  const defId = containerDefForLocker(target, placed);
  return defId === "floor_locker" || defId === "wall_locker";
}

export function canAccessInteriorStation(
  playerPos: [number, number, number],
  placed: readonly PlacedPiece[],
  target: WorldInteractable,
): boolean {
  if (!requiresBaseInteriorAccess(target, placed)) return true;
  return isInsideBaseInterior(playerPos, placed);
}
