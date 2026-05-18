import { describe, expect, it } from "vitest";
import { createEmptyInventory, createPlayEquipment } from "./items.catalog";
import { createEmptyHotbarSlots } from "../../constants/hotbar";
import {
  dropEquippedItem,
  dropHotbarItem,
  dropItemFromSlot,
} from "./inventoryActions";
import { canDropItem } from "./itemMeta";

describe("inventory drop actions", () => {
  it("allows drop on all tool and equipment types", () => {
    expect(canDropItem("scanner")).toBe(true);
    expect(canDropItem("knife")).toBe(true);
    expect(canDropItem("tank")).toBe(true);
    expect(canDropItem("titanium")).toBe(true);
  });

  it("drops full stack from grid slot", () => {
    const inventory = createEmptyInventory();
    inventory[0] = { itemId: "copper", count: 3 };
    const result = dropItemFromSlot(inventory, 0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.inventory[0]).toBeNull();
    expect(result.dropped).toEqual({ itemId: "copper", count: 3 });
  });

  it("drops equipped item without changing grid", () => {
    const equipment = createPlayEquipment();
    equipment.fins = { kind: "filled", itemId: "fins" };
    const result = dropEquippedItem(createEmptyInventory(), equipment, "fins");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.equipment?.fins.kind).toBe("empty");
    expect(result.dropped).toEqual({ itemId: "fins", count: 1 });
  });

  it("drops hotbar tool", () => {
    const hotbar = createEmptyHotbarSlots();
    hotbar[2] = "builder";
    const result = dropHotbarItem(createEmptyInventory(), hotbar, 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hotbarSlots?.[2]).toBeNull();
    expect(result.dropped).toEqual({ itemId: "builder", count: 1 });
  });
});
