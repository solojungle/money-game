import type { ControlBinding } from "../../../controls/inputPromptTypes";
import { getItemDef } from "../../systems/inventory/items.catalog";
import type { WorldInteractable } from "../../world/interactables";

export type InteractionAction =
  | "pickup"
  | "harvest"
  | "scan"
  | "open_inventory"
  | "open_fabricator"
  | "open_storage";

export type ResolvedInteractionPrompt = {
  label: string;
  bindings: readonly ControlBinding[];
  actionable: boolean;
  action?: InteractionAction;
};

const LABEL_MULTITOOL = "Survival Multitool";
const LABEL_SCANNER = "Scanner";
const LABEL_RESONATOR = "Sonic Resonator";

function itemDisplayName(itemId: string): string {
  return getItemDef(itemId)?.displayName ?? itemId;
}

function isSmashTool(toolId: string | null): boolean {
  return toolId === "knife" || toolId === "scanner";
}

function isMultitool(toolId: string | null): boolean {
  return toolId === "knife";
}

function isScanner(toolId: string | null): boolean {
  return toolId === "scanner";
}

function isResonator(toolId: string | null): boolean {
  return toolId === "sonic_resonator";
}

function pickupPrompt(itemName: string): ResolvedInteractionPrompt {
  return {
    label: `Pick up ${itemName}`,
    bindings: ["holster"],
    actionable: true,
    action: "pickup",
  };
}

function harvestPrompt(itemName: string): ResolvedInteractionPrompt {
  return {
    label: `Harvest ${itemName}`,
    bindings: ["useLeft"],
    actionable: true,
    action: "harvest",
  };
}

function scanPrompt(displayName: string): ResolvedInteractionPrompt {
  return {
    label: `Scan ${displayName}`,
    bindings: ["useLeft"],
    actionable: true,
    action: "scan",
  };
}

function requiresTool(toolName: string): ResolvedInteractionPrompt {
  return {
    label: `Requires ${toolName}`,
    bindings: [],
    actionable: false,
  };
}

function stationPrompt(
  label: string,
  action: "open_fabricator" | "open_storage",
): ResolvedInteractionPrompt {
  return {
    label,
    bindings: ["holster"],
    actionable: true,
    action,
  };
}

export function resolveInteractionPrompt(
  target: WorldInteractable | null,
  equippedToolId: string | null,
): ResolvedInteractionPrompt | null {
  if (!target) return null;

  switch (target.kind) {
    case "fabricator":
      return stationPrompt("Fabricator", "open_fabricator");
    case "storage_locker":
      return stationPrompt("Storage locker", "open_storage");

    case "resource_node": {
      const name = itemDisplayName(target.itemId);
      if (target.tier === "small") {
        return pickupPrompt(name);
      }
      if (target.tier === "medium") {
        if (isSmashTool(equippedToolId) || isResonator(equippedToolId)) {
          return harvestPrompt(name);
        }
        return requiresTool(LABEL_MULTITOOL);
      }
      if (target.tier === "large") {
        if (isResonator(equippedToolId)) {
          return harvestPrompt(name);
        }
        return requiresTool(LABEL_RESONATOR);
      }
      return null;
    }

    case "fauna": {
      if (target.role !== "food") return null;
      if (isMultitool(equippedToolId)) {
        return harvestPrompt(target.displayName);
      }
      return requiresTool(LABEL_MULTITOOL);
    }

    case "scan_target": {
      if (isScanner(equippedToolId)) {
        return scanPrompt(target.displayName);
      }
      return requiresTool(LABEL_SCANNER);
    }

    case "world_drop": {
      return pickupPrompt(itemDisplayName(target.itemId));
    }
  }
}

export function getEquippedToolId(
  hotbarSlots: readonly (string | null)[],
  quickSlot: number,
): string | null {
  if (quickSlot < 0 || quickSlot >= hotbarSlots.length) return null;
  return hotbarSlots[quickSlot] ?? null;
}
