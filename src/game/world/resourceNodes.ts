import { getItemDef } from "../systems/inventory/items.catalog";
import { RESOURCE_NODE_BY_ID, type ResourceNodeTier } from "./interactables";

export type ResourceNodeDef = {
  id: string;
  itemId: string;
  tier: ResourceNodeTier;
  yield: number;
  position: [number, number, number];
  /** Visual scale multiplier for ore mesh */
  scale: number;
  emissiveIntensity: number;
};

export function yieldForTier(tier: ResourceNodeTier): number {
  switch (tier) {
    case "small":
      return 1;
    case "medium":
      return 2;
    case "large":
      return 3;
  }
}

export function displayColorForItem(itemId: string): string {
  return getItemDef(itemId)?.color ?? "#94a3b8";
}

export const RESOURCE_NODE_SPAWNS: ResourceNodeDef[] = [
  {
    id: "ti_small_01",
    itemId: "titanium",
    tier: "small",
    yield: 1,
    position: [-12, 0.3, 8],
    scale: 1,
    emissiveIntensity: 0.55,
  },
  {
    id: "cu_small_01",
    itemId: "copper",
    tier: "small",
    yield: 1,
    position: [-11, 0.28, 6],
    scale: 0.95,
    emissiveIntensity: 0.5,
  },
  {
    id: "qz_small_01",
    itemId: "quartz",
    tier: "small",
    yield: 1,
    position: [-9, 0.32, 9],
    scale: 0.9,
    emissiveIntensity: 0.48,
  },
  {
    id: "ls_small_01",
    itemId: "limestone",
    tier: "small",
    yield: 1,
    position: [12, 0.3, 7],
    scale: 1,
    emissiveIntensity: 0.45,
  },
  {
    id: "ag_medium_01",
    itemId: "silver",
    tier: "medium",
    yield: 2,
    position: [11, 0.38, 5],
    scale: 1.35,
    emissiveIntensity: 0.4,
  },
  {
    id: "au_medium_01",
    itemId: "gold",
    tier: "medium",
    yield: 2,
    position: [-7, 0.36, -9],
    scale: 1.3,
    emissiveIntensity: 0.42,
  },
  {
    id: "pb_medium_01",
    itemId: "lead",
    tier: "medium",
    yield: 2,
    position: [8, 0.35, -10],
    scale: 1.32,
    emissiveIntensity: 0.38,
  },
  {
    id: "dm_large_01",
    itemId: "diamond",
    tier: "large",
    yield: 3,
    position: [-13, 0.45, -6],
    scale: 1.75,
    emissiveIntensity: 0.65,
  },
  {
    id: "mg_large_01",
    itemId: "magnetite",
    tier: "large",
    yield: 3,
    position: [13, 0.42, -5],
    scale: 1.7,
    emissiveIntensity: 0.5,
  },
];

for (const node of RESOURCE_NODE_SPAWNS) {
  RESOURCE_NODE_BY_ID.set(node.id, {
    id: node.id,
    tier: node.tier,
    itemId: node.itemId,
  });
}

export function getResourceNodeDef(id: string): ResourceNodeDef | undefined {
  return RESOURCE_NODE_SPAWNS.find((n) => n.id === id);
}
