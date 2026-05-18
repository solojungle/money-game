import { describe, expect, it } from "vitest";
import { createEmptyInventory } from "./items.catalog";
import { addItem, removeItem } from "./stacks";

describe("inventory stacks", () => {
  it("fills empty slots and respects max stack", () => {
    const empty = createEmptyInventory();
    const r = addItem(empty, "titanium", 50);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.slots[0]).toEqual({ itemId: "titanium", count: 48 });
    expect(r.slots[1]).toEqual({ itemId: "titanium", count: 2 });
  });

  it("merges into existing stacks before new slots", () => {
    const base = createEmptyInventory();
    base[0] = { itemId: "copper", count: 40 };
    const r = addItem(base, "copper", 5);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.slots[0]?.count).toBe(45);
  });

  it("returns inventory_full when no room", () => {
    const full = createEmptyInventory().map(() => ({
      itemId: "titanium",
      count: 48,
    }));
    const r = addItem(full, "titanium", 1);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toBe("inventory_full");
  });

  it("removeItem depletes stacks", () => {
    const base = createEmptyInventory();
    base[0] = { itemId: "gold", count: 10 };
    const next = removeItem(base, "gold", 4);
    expect(next[0]?.count).toBe(6);
  });
});
