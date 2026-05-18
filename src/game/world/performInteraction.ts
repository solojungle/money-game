import type { BlueprintId } from "../_kernel/types";
import { harvestWithResonator } from "../systems/harvest/resonatorHarvest";
import { scanFragment } from "../systems/progression";
import { addItem, addItemPartial } from "../systems/inventory/stacks";
import type { InventorySlot } from "../systems/inventory/items.catalog";
import {
  getEquippedToolId,
  resolveInteractionPrompt,
  type ResolvedInteractionPrompt,
} from "../presentation/hud/resolveInteractionPrompt";
import { harvestableIdFor, type WorldInteractable } from "./interactables";
import { spawnWorldDropsAt } from "../systems/worldDrops/spawnWorldDrop";
import type { WorldDrop } from "./worldDrops";
import { getResourceNodeDef, yieldForTier } from "./resourceNodes";

export type PerformInteractionResult =
  | {
      ok: true;
      kind:
        | "pickup"
        | "harvest"
        | "scan"
        | "open_inventory"
        | "open_fabricator"
        | "open_storage";
    }
  | {
      ok: false;
      reason:
        | "no_target"
        | "not_actionable"
        | "inventory_full"
        | "unknown_item";
    };

function isResonator(toolId: string | null): boolean {
  return toolId === "sonic_resonator";
}

export function resolveCurrentPrompt(
  activeInteractable: WorldInteractable | null,
  hotbarSlots: readonly (string | null)[],
  quickSlot: number,
): ResolvedInteractionPrompt | null {
  const equipped = getEquippedToolId(hotbarSlots, quickSlot);
  return resolveInteractionPrompt(activeInteractable, equipped);
}

export function performInteraction(
  activeInteractable: WorldInteractable | null,
  hotbarSlots: readonly (string | null)[],
  quickSlot: number,
  inventory: InventorySlot[],
  harvestedIds: readonly string[],
  worldDrops: readonly WorldDrop[] = [],
): {
  result: PerformInteractionResult;
  inventory?: InventorySlot[];
  harvestedIds?: string[];
  worldDrops?: WorldDrop[];
  removedDropId?: string;
  scanBlueprintId?: string;
  resonatorHarvest?: boolean;
  totalAdded?: number;
} {
  const equipped = getEquippedToolId(hotbarSlots, quickSlot);
  const prompt = resolveInteractionPrompt(activeInteractable, equipped);
  if (!activeInteractable) {
    return { result: { ok: false, reason: "no_target" } };
  }
  if (!prompt?.actionable || !prompt.action) {
    return { result: { ok: false, reason: "not_actionable" } };
  }

  const harvestId = harvestableIdFor(activeInteractable);
  if (harvestId && harvestedIds.includes(harvestId)) {
    return { result: { ok: false, reason: "not_actionable" } };
  }

  if (prompt.action === "open_inventory") {
    return { result: { ok: true, kind: "open_inventory" } };
  }

  if (prompt.action === "open_fabricator") {
    return { result: { ok: true, kind: "open_fabricator" } };
  }

  if (
    prompt.action === "open_storage" &&
    activeInteractable.kind === "storage_locker"
  ) {
    return { result: { ok: true, kind: "open_storage" } };
  }

  if (prompt.action === "scan" && activeInteractable.kind === "scan_target") {
    scanFragment(activeInteractable.blueprintId as BlueprintId);
    return {
      result: { ok: true, kind: "scan" },
      harvestedIds: [...harvestedIds, activeInteractable.scanId],
      scanBlueprintId: activeInteractable.blueprintId,
    };
  }

  if (prompt.action === "pickup" && activeInteractable.kind === "world_drop") {
    const added = addItem(
      inventory,
      activeInteractable.itemId,
      activeInteractable.count,
    );
    if (!added.ok) {
      return {
        result: {
          ok: false,
          reason:
            added.reason === "inventory_full"
              ? "inventory_full"
              : "unknown_item",
        },
      };
    }
    return {
      result: { ok: true, kind: "pickup" },
      inventory: added.slots,
      removedDropId: activeInteractable.dropId,
    };
  }

  if (
    prompt.action === "pickup" &&
    activeInteractable.kind === "resource_node"
  ) {
    const node = getResourceNodeDef(activeInteractable.nodeId);
    const count = node?.yield ?? yieldForTier(activeInteractable.tier);
    const added = addItem(inventory, activeInteractable.itemId, count);
    if (!added.ok) {
      return {
        result: {
          ok: false,
          reason:
            added.reason === "inventory_full"
              ? "inventory_full"
              : "unknown_item",
        },
      };
    }
    return {
      result: { ok: true, kind: "pickup" },
      inventory: added.slots,
      harvestedIds: [...harvestedIds, activeInteractable.nodeId],
    };
  }

  if (prompt.action === "harvest") {
    if (activeInteractable.kind === "resource_node") {
      const node = getResourceNodeDef(activeInteractable.nodeId);
      const count = node?.yield ?? yieldForTier(activeInteractable.tier);
      const center = node?.position ?? [0, 0, 0];

      if (
        isResonator(equipped) &&
        (activeInteractable.tier === "large" ||
          activeInteractable.tier === "medium")
      ) {
        const resonator = harvestWithResonator(center, inventory, harvestedIds);
        return {
          result: { ok: true, kind: "harvest" },
          inventory: resonator.inventory,
          harvestedIds: resonator.harvestedIds,
          worldDrops: [...worldDrops, ...resonator.worldDrops],
          resonatorHarvest: true,
          totalAdded: resonator.totalAdded,
        };
      }

      const partial = addItemPartial(
        inventory,
        activeInteractable.itemId,
        count,
      );
      const nextDrops = [...worldDrops];
      if (partial.remaining > 0 && node) {
        nextDrops.push(
          ...spawnWorldDropsAt(
            activeInteractable.itemId,
            partial.remaining,
            [node.position[0], node.position[1] + 0.1, node.position[2]],
            worldDrops.length,
          ),
        );
      }
      if (partial.added === 0 && partial.remaining > 0) {
        return { result: { ok: false, reason: "inventory_full" } };
      }

      return {
        result: { ok: true, kind: "harvest" },
        inventory: partial.slots,
        harvestedIds: [...harvestedIds, activeInteractable.nodeId],
        worldDrops: nextDrops,
      };
    }

    if (
      activeInteractable.kind === "fauna" &&
      activeInteractable.role === "food"
    ) {
      const added = addItem(inventory, "cured_fish", 1);
      if (!added.ok) {
        return {
          result: {
            ok: false,
            reason:
              added.reason === "inventory_full"
                ? "inventory_full"
                : "unknown_item",
          },
        };
      }
      return {
        result: { ok: true, kind: "harvest" },
        inventory: added.slots,
        harvestedIds: [...harvestedIds, activeInteractable.faunaId],
      };
    }
  }

  return { result: { ok: false, reason: "not_actionable" } };
}
