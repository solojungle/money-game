import {
  getItemDef,
  type InventorySlot,
  type ItemStack,
} from "./items.catalog";

export type AddItemResult =
  | { ok: true; slots: InventorySlot[] }
  | { ok: false; reason: "unknown_item" | "inventory_full" };

export type AddItemPartialResult = {
  slots: InventorySlot[];
  added: number;
  remaining: number;
};

export function addItem(
  slots: InventorySlot[],
  itemId: string,
  count: number,
): AddItemResult {
  const partial = addItemPartial(slots, itemId, count);
  if (partial.remaining > 0) {
    return { ok: false, reason: "inventory_full" };
  }
  return { ok: true, slots: partial.slots };
}

/** Adds as much as possible; returns how much could not fit. */
export function addItemPartial(
  slots: InventorySlot[],
  itemId: string,
  count: number,
): AddItemPartialResult {
  const def = getItemDef(itemId);
  if (!def || count <= 0) {
    return { slots, added: 0, remaining: count };
  }

  let remaining = count;
  const next = slots.map((s) => (s ? { ...s } : null)) as InventorySlot[];

  for (let i = 0; i < next.length && remaining > 0; i++) {
    const slot = next[i];
    if (!slot || slot.itemId !== itemId) continue;
    const room = def.maxStack - slot.count;
    if (room <= 0) continue;
    const add = Math.min(room, remaining);
    next[i] = { itemId, count: slot.count + add };
    remaining -= add;
  }

  for (let i = 0; i < next.length && remaining > 0; i++) {
    if (next[i]) continue;
    const add = Math.min(def.maxStack, remaining);
    next[i] = { itemId, count: add };
    remaining -= add;
  }

  return {
    slots: next,
    added: count - remaining,
    remaining,
  };
}

export function removeItem(
  slots: InventorySlot[],
  itemId: string,
  count: number,
): InventorySlot[] {
  let remaining = count;
  const next = slots.map((s) => (s ? { ...s } : null)) as InventorySlot[];

  for (let i = next.length - 1; i >= 0 && remaining > 0; i--) {
    const slot = next[i];
    if (!slot || slot.itemId !== itemId) continue;
    const take = Math.min(slot.count, remaining);
    const left = slot.count - take;
    next[i] = left > 0 ? { itemId, count: left } : null;
    remaining -= take;
  }

  return next;
}

export function countItem(slots: InventorySlot[], itemId: string): number {
  return slots.reduce(
    (sum, s) => sum + (s?.itemId === itemId ? s.count : 0),
    0,
  );
}

export function canStack(stack: ItemStack, itemId: string): boolean {
  const def = getItemDef(itemId);
  if (!def) return false;
  return stack.itemId === itemId && stack.count < def.maxStack;
}
