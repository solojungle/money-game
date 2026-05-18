import blueprintData from "../../progression/blueprints.json";
import type { BlueprintId } from "../../_kernel/types";
import { FABRICATOR_STARTER_UNLOCK_IDS } from "../crafting";
import { BUILDER_STARTER_UNLOCK_IDS } from "../../building";
import { unlockBlueprint, resetProgressionState } from "../progression";
import {
  createEmptyInventory,
  createPlayEquipment,
  PLAY_STARTER_BLUEPRINT_IDS,
} from "./items.catalog";
import type { EquipmentState, InventorySlot } from "./items.catalog";

export type PlayBootstrap = {
  inventory: InventorySlot[];
  equipment: EquipmentState;
  unlockedBlueprintIds: BlueprintId[];
};

export function bootstrapPlayProgression(): BlueprintId[] {
  resetProgressionState();
  const ids: BlueprintId[] = [];
  for (const id of PLAY_STARTER_BLUEPRINT_IDS) {
    unlockBlueprint(id, undefined, "BUILDER TOOL");
    ids.push(id);
  }
  for (const id of FABRICATOR_STARTER_UNLOCK_IDS) {
    if (!ids.includes(id)) {
      unlockBlueprint(id, undefined, "BUILDER TOOL");
      ids.push(id);
    }
  }
  for (const id of BUILDER_STARTER_UNLOCK_IDS) {
    if (!ids.includes(id)) {
      unlockBlueprint(id, undefined, "BUILDER TOOL");
      ids.push(id);
    }
  }
  return ids;
}

/** Unlocks every blueprint — dev / kitchen-sink only. */
export function bootstrapKitchenSinkProgression(): BlueprintId[] {
  resetProgressionState();
  const ids: BlueprintId[] = [];
  for (const id of PLAY_STARTER_BLUEPRINT_IDS) {
    unlockBlueprint(id, undefined, "BUILDER TOOL");
    ids.push(id);
  }
  for (const row of blueprintData) {
    if (!ids.includes(row.id as BlueprintId)) {
      unlockBlueprint(row.id as BlueprintId, undefined, "BUILDER TOOL");
      ids.push(row.id as BlueprintId);
    }
  }
  return ids;
}

export function createPlayBootstrap(): PlayBootstrap {
  return {
    inventory: createEmptyInventory(),
    equipment: createPlayEquipment(),
    unlockedBlueprintIds: bootstrapPlayProgression(),
  };
}
