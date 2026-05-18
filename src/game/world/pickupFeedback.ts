import { getItemDef } from "../systems/inventory/items.catalog";
import type { WorldInteractable } from "./interactables";
import { getResourceNodeDef, yieldForTier } from "./resourceNodes";

export function pickupFloatTextFor(
  target: WorldInteractable | null,
): string | null {
  if (!target) return null;

  if (target.kind === "resource_node") {
    const node = getResourceNodeDef(target.nodeId);
    const count = node?.yield ?? yieldForTier(target.tier);
    const name = getItemDef(target.itemId)?.displayName ?? target.itemId;
    return `+${count} ${name}`;
  }

  if (target.kind === "fauna" && target.role === "food") {
    const name = getItemDef("cured_fish")?.displayName ?? "Cured fish";
    return `+1 ${name}`;
  }

  if (target.kind === "world_drop") {
    const name = getItemDef(target.itemId)?.displayName ?? target.itemId;
    return `+${target.count} ${name}`;
  }

  return null;
}
