import type { BlueprintId } from "../../_kernel/types";
import { canDropItem, getEquipmentSlotForItem, isToolItem } from "./itemMeta";
import {
  getItemDef,
  type EquipmentSlotId,
  type EquipmentSlotState,
  type EquipmentState,
  type InventorySlot,
} from "./items.catalog";
import { addItem, removeItem } from "./stacks";

export type DroppedStack = {
  itemId: string;
  count: number;
};

export type InventoryActionResult =
  | {
      ok: true;
      inventory: InventorySlot[];
      equipment?: EquipmentState;
      hotbarSlots?: (string | null)[];
      dropped?: DroppedStack;
    }
  | { ok: false; reason: string };

function copySlots(slots: InventorySlot[]): InventorySlot[] {
  return slots.map((s) => (s ? { ...s } : null));
}

function copyEquipment(equipment: EquipmentState): EquipmentState {
  return { ...equipment };
}

export function equipItemFromSlot(
  inventory: InventorySlot[],
  equipment: EquipmentState,
  gridIndex: number,
): InventoryActionResult {
  const stack = inventory[gridIndex];
  if (!stack) return { ok: false, reason: "empty_slot" };

  const slotId = getEquipmentSlotForItem(stack.itemId);
  if (!slotId) return { ok: false, reason: "not_equipment" };

  const target = equipment[slotId];
  if (target.kind === "locked") return { ok: false, reason: "slot_locked" };

  let nextInv = copySlots(inventory);
  const nextEquip = copyEquipment(equipment);

  if (target.kind === "filled") {
    const addBack = addItem(nextInv, target.itemId, 1);
    if (!addBack.ok) return { ok: false, reason: "inventory_full" };
    nextInv = addBack.slots;
  }

  const slot = nextInv[gridIndex];
  if (!slot || slot.count <= 0) return { ok: false, reason: "empty_slot" };

  nextInv[gridIndex] =
    slot.count > 1 ? { itemId: stack.itemId, count: slot.count - 1 } : null;
  nextEquip[slotId] = { kind: "filled", itemId: stack.itemId };

  return { ok: true, inventory: nextInv, equipment: nextEquip };
}

export function unequipItem(
  inventory: InventorySlot[],
  equipment: EquipmentState,
  slotId: EquipmentSlotId,
): InventoryActionResult {
  const worn = equipment[slotId];
  if (worn.kind !== "filled") return { ok: false, reason: "nothing_equipped" };

  const addBack = addItem(inventory, worn.itemId, 1);
  if (!addBack.ok) return { ok: false, reason: "inventory_full" };

  const nextEquip = copyEquipment(equipment);
  nextEquip[slotId] = { kind: "empty" };

  return {
    ok: true,
    inventory: addBack.slots,
    equipment: nextEquip,
  };
}

export function assignToolToHotbar(
  inventory: InventorySlot[],
  hotbarSlots: (string | null)[],
  gridIndex: number,
  hotbarIndex: number,
): InventoryActionResult {
  const stack = inventory[gridIndex];
  if (!stack) return { ok: false, reason: "empty_slot" };
  if (!isToolItem(stack.itemId)) return { ok: false, reason: "not_tool" };

  let nextInv = copySlots(inventory);
  const slot = nextInv[gridIndex];
  if (!slot) return { ok: false, reason: "empty_slot" };

  nextInv[gridIndex] =
    slot.count > 1 ? { itemId: slot.itemId, count: slot.count - 1 } : null;

  const nextHotbar = [...hotbarSlots];
  const displaced = nextHotbar[hotbarIndex];
  nextHotbar[hotbarIndex] = stack.itemId;

  if (displaced && displaced !== stack.itemId) {
    const addBack = addItem(nextInv, displaced, 1);
    if (!addBack.ok) return { ok: false, reason: "inventory_full" };
    nextInv = addBack.slots;
  }

  return { ok: true, inventory: nextInv, hotbarSlots: nextHotbar };
}

export function unassignHotbarSlot(
  inventory: InventorySlot[],
  hotbarSlots: (string | null)[],
  hotbarIndex: number,
): InventoryActionResult {
  const itemId = hotbarSlots[hotbarIndex];
  if (!itemId) return { ok: false, reason: "empty_hotbar" };

  const addBack = addItem(inventory, itemId, 1);
  if (!addBack.ok) return { ok: false, reason: "inventory_full" };

  const nextHotbar = [...hotbarSlots];
  nextHotbar[hotbarIndex] = null;

  return { ok: true, inventory: addBack.slots, hotbarSlots: nextHotbar };
}

export function dropItemFromSlot(
  inventory: InventorySlot[],
  gridIndex: number,
  count?: number,
): InventoryActionResult {
  const stack = inventory[gridIndex];
  if (!stack) return { ok: false, reason: "empty_slot" };

  const def = getItemDef(stack.itemId);
  if (!def || !canDropItem(stack.itemId)) {
    return { ok: false, reason: "not_droppable" };
  }

  const nextInv = copySlots(inventory);
  const take = Math.min(count ?? stack.count, stack.count);
  const left = stack.count - take;
  nextInv[gridIndex] = left > 0 ? { itemId: stack.itemId, count: left } : null;

  return {
    ok: true,
    inventory: nextInv,
    dropped: { itemId: stack.itemId, count: take },
  };
}

export function dropEquippedItem(
  inventory: InventorySlot[],
  equipment: EquipmentState,
  slotId: EquipmentSlotId,
): InventoryActionResult {
  const worn = equipment[slotId];
  if (worn.kind !== "filled") return { ok: false, reason: "nothing_equipped" };
  if (!canDropItem(worn.itemId)) {
    return { ok: false, reason: "not_droppable" };
  }

  const nextEquip = copyEquipment(equipment);
  nextEquip[slotId] = { kind: "empty" };

  return {
    ok: true,
    inventory,
    equipment: nextEquip,
    dropped: { itemId: worn.itemId, count: 1 },
  };
}

export function dropHotbarItem(
  inventory: InventorySlot[],
  hotbarSlots: (string | null)[],
  hotbarIndex: number,
): InventoryActionResult {
  const itemId = hotbarSlots[hotbarIndex];
  if (!itemId) return { ok: false, reason: "empty_hotbar" };
  if (!canDropItem(itemId)) return { ok: false, reason: "not_droppable" };

  const nextHotbar = [...hotbarSlots];
  nextHotbar[hotbarIndex] = null;

  return {
    ok: true,
    inventory,
    hotbarSlots: nextHotbar,
    dropped: { itemId, count: 1 },
  };
}

export function consumeItemFromSlot(
  inventory: InventorySlot[],
  gridIndex: number,
): InventoryActionResult & {
  hungerDelta?: number;
  thirstDelta?: number;
  healthDelta?: number;
} {
  const stack = inventory[gridIndex];
  if (!stack) return { ok: false, reason: "empty_slot" };

  const def = getItemDef(stack.itemId);
  if (!def) return { ok: false, reason: "unknown_item" };

  const canConsume =
    def.food != null || def.water != null || def.actions?.includes("consume");
  if (!canConsume && def.category !== "crafted") {
    return { ok: false, reason: "not_consumable" };
  }

  const nextInv = removeItem(inventory, stack.itemId, 1);

  return {
    ok: true,
    inventory: nextInv,
    hungerDelta: def.food ?? 0,
    thirstDelta: def.water ?? 0,
    healthDelta: def.health ?? 0,
  };
}

export function countOwnedItem(
  inventory: InventorySlot[],
  hotbarSlots: readonly (string | null)[],
  itemId: string,
): number {
  const inGrid = inventory.reduce(
    (sum, s) => sum + (s?.itemId === itemId ? s.count : 0),
    0,
  );
  const inHotbar = hotbarSlots.includes(itemId) ? 1 : 0;
  return inGrid + inHotbar;
}

export function pinBlueprint(
  pinned: BlueprintId[],
  blueprintId: BlueprintId,
  maxPins = 8,
): BlueprintId[] {
  if (pinned.includes(blueprintId)) return pinned;
  const next = [...pinned, blueprintId];
  if (next.length <= maxPins) return next;
  return next.slice(next.length - maxPins);
}

export function unpinBlueprint(
  pinned: BlueprintId[],
  blueprintId: BlueprintId,
): BlueprintId[] {
  return pinned.filter((id) => id !== blueprintId);
}

export function unpinAllBlueprints(): BlueprintId[] {
  return [];
}

export function isEquipmentSlotState(
  state: EquipmentSlotState,
): state is { kind: "filled"; itemId: string } {
  return state.kind === "filled";
}
