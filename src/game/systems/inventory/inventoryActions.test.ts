import { describe, expect, it } from "vitest";
import { createEmptyInventory, createPlayEquipment } from "./items.catalog";
import {
  assignToolToHotbar,
  consumeItemFromSlot,
  equipItemFromSlot,
  unequipItem,
} from "./inventoryActions";
import { createEmptyHotbarSlots } from "../../constants/hotbar";

describe("inventoryActions", () => {
  it("equips item from grid into head slot", () => {
    const inventory = createEmptyInventory();
    inventory[0] = { itemId: "mask", count: 1 };
    const equipment = createPlayEquipment();

    const result = equipItemFromSlot(inventory, equipment, 0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.equipment?.head.kind).toBe("filled");
    if (result.equipment?.head.kind === "filled") {
      expect(result.equipment.head.itemId).toBe("mask");
    }
  });

  it("assigns tool to hotbar and clears grid stack", () => {
    const inventory = createEmptyInventory();
    inventory[0] = { itemId: "scanner", count: 1 };
    const hotbar = createEmptyHotbarSlots();
    const result = assignToolToHotbar(inventory, hotbar, 0, 0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.hotbarSlots?.[0]).toBe("scanner");
    expect(result.inventory[0]).toBeNull();
  });

  it("consumes water and removes one from stack", () => {
    const inventory = createEmptyInventory();
    inventory[0] = { itemId: "water", count: 2 };
    const result = consumeItemFromSlot(inventory, 0);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.thirstDelta).toBe(15);
    expect(result.inventory[0]?.count).toBe(1);
  });

  it("unequips worn item into inventory", () => {
    const inventory = createEmptyInventory();
    const equipment = createPlayEquipment();
    equipment.tank = { kind: "filled", itemId: "tank" };
    const result = unequipItem(inventory, equipment, "tank");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.equipment?.tank.kind).toBe("empty");
    expect(result.inventory.some((s) => s?.itemId === "tank")).toBe(true);
  });
});
