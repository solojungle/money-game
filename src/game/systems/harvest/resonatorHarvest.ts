import { addItemPartial } from "../inventory/stacks";
import type { InventorySlot } from "../inventory/items.catalog";
import { spawnWorldDropsAt } from "../worldDrops/spawnWorldDrop";
import type { WorldDrop } from "../../world/worldDrops";
import {
  RESOURCE_NODE_SPAWNS,
  getResourceNodeDef,
  yieldForTier,
} from "../../world/resourceNodes";
import type { ResourceNodeDef } from "../../world/resourceNodes";

export const RESONATOR_VACUUM_RADIUS_M = 3.5;

export type ResonatorHarvestResult = {
  inventory: InventorySlot[];
  harvestedIds: string[];
  worldDrops: WorldDrop[];
  totalAdded: number;
  totalDropped: number;
};

function distSq(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

export function findResourceNodesInResonatorRadius(
  center: [number, number, number],
  harvestedIds: readonly string[],
  radiusM = RESONATOR_VACUUM_RADIUS_M,
): ResourceNodeDef[] {
  const rSq = radiusM * radiusM;
  return RESOURCE_NODE_SPAWNS.filter((node) => {
    if (harvestedIds.includes(node.id)) return false;
    return distSq(center, node.position) <= rSq;
  });
}

/**
 * Resonator harvest: vacuum all resource nodes in radius into inventory;
 * overflow spawns as world drops on the seafloor.
 */
export function harvestWithResonator(
  center: [number, number, number],
  inventory: InventorySlot[],
  harvestedIds: readonly string[],
): ResonatorHarvestResult {
  const nodes = findResourceNodesInResonatorRadius(center, harvestedIds);
  let slots = inventory;
  const nextHarvested = [...harvestedIds];
  const worldDrops: WorldDrop[] = [];
  let totalAdded = 0;
  let totalDropped = 0;
  let dropIndex = 0;

  for (const node of nodes) {
    const def = getResourceNodeDef(node.id);
    const count = def?.yield ?? yieldForTier(node.tier);
    const partial = addItemPartial(slots, node.itemId, count);
    slots = partial.slots;
    totalAdded += partial.added;

    if (partial.remaining > 0) {
      worldDrops.push(
        ...spawnWorldDropsAt(
          node.itemId,
          partial.remaining,
          node.position,
          dropIndex,
        ),
      );
      dropIndex += partial.remaining;
      totalDropped += partial.remaining;
    }

    nextHarvested.push(node.id);
  }

  return {
    inventory: slots,
    harvestedIds: nextHarvested,
    worldDrops,
    totalAdded,
    totalDropped,
  };
}
