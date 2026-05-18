import {
  getItemDef,
  type EquipmentSlotId,
  type ItemDef,
} from "./items.catalog";

export type ItemAction = "equip" | "assignHotbar" | "drop" | "consume";

const EQUIPMENT_SLOT_BY_ITEM: Record<string, EquipmentSlotId> = {
  mask: "head",
  rebreather: "head",
  tank: "tank",
  fins: "fins",
  reinforced_suit: "suit",
  gloves: "gloves",
};

const DESCRIPTIONS: Record<string, string> = {
  titanium:
    "Titanium is a basic building material used for tools and habitat modules.",
  copper: "Copper ore. Essential for wiring and early electronics.",
  scanner:
    "Scans fragments and lifeforms to synthesize new blueprints in the PDA.",
  knife: "Survival knife for harvesting samples and self-defense.",
  sonic_resonator:
    "Sonic resonator. Breaks large deposits and vacuums loose materials.",
  builder: "Deploys habitat modules from your blueprint database.",
  repair_tool: "Repairs vehicles, tools, and base components.",
  welder: "Welds hull breaches and metal structures.",
  water: "Filtered water. Restores hydration.",
  fiber_bandage: "Sterile bandage. Restores a small amount of health.",
  rebreather:
    "Conserves oxygen while diving deeper. Adjusts gas pressure for lungs.",
  mask: "Rebreather mask. Conserves oxygen at depth.",
  tank: "Standard O₂ tank. Holds breathing air for extended dives.",
  fins: "Diving fins. Provides a small swim speed boost.",
  reinforced_suit: "Reinforced dive suit. Improves pressure resistance.",
  gloves: "Insulated gloves. Protects hands in cold biomes.",
  seaglide: "Personal propulsion device for faster surface travel.",
};

export function getItemDescription(def: ItemDef): string {
  if (def.description) return def.description;
  return (
    DESCRIPTIONS[def.id] ??
    `${def.displayName}. A standard survival resource or tool.`
  );
}

export function getEquipmentSlotForItem(
  itemId: string,
): EquipmentSlotId | undefined {
  const def = getItemDef(itemId);
  if (def?.equipmentSlot) return def.equipmentSlot;
  return EQUIPMENT_SLOT_BY_ITEM[itemId];
}

export function getItemActions(def: ItemDef): ItemAction[] {
  if (def.actions && def.actions.length > 0) return def.actions;

  switch (def.category) {
    case "tool":
      return ["assignHotbar", "drop"];
    case "equipment":
      return ["equip", "drop"];
    case "crafted":
      if (def.food != null || def.water != null) return ["consume", "drop"];
      return ["drop"];
    default:
      return ["drop"];
  }
}

export function isToolItem(itemId: string): boolean {
  return getItemDef(itemId)?.category === "tool";
}

export function canDropItem(itemId: string): boolean {
  const def = getItemDef(itemId);
  if (!def) return false;
  return getItemActions(def).includes("drop");
}

/** True when multiple units cannot share one inventory slot. */
export function isNonStackingItem(itemId: string): boolean {
  const def = getItemDef(itemId);
  return (def?.maxStack ?? 1) <= 1;
}

export function itemOwnedInHotbar(
  hotbarSlots: (string | null)[],
  itemId: string,
): boolean {
  return hotbarSlots.some((id) => id === itemId);
}
