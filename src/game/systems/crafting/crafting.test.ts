import { describe, expect, it } from "vitest";
import { createEmptyInventory } from "../inventory/items.catalog";
import {
  canCraft,
  craftInstant,
  enqueueCraft,
  getRecipe,
  tickCraftQueue,
} from "./index";

describe("crafting", () => {
  it("multitool requires 3 titanium", () => {
    const slots = createEmptyInventory();
    slots[0] = { itemId: "titanium", count: 2 };
    expect(canCraft(slots, [], "recipe_knife").ok).toBe(false);
    slots[0] = { itemId: "titanium", count: 3 };
    expect(canCraft(slots, [], "recipe_knife").ok).toBe(true);
  });

  it("craftInstant deducts and outputs", () => {
    const slots = createEmptyInventory();
    slots[0] = { itemId: "titanium", count: 3 };
    const out = craftInstant(slots, "recipe_knife");
    expect(out.ok).toBe(true);
    if (out.ok) {
      const ti = out.inventory.reduce(
        (n, s) => n + (s?.itemId === "titanium" ? s.count : 0),
        0,
      );
      expect(ti).toBe(0);
      const knife = out.inventory.some((s) => s?.itemId === "knife");
      expect(knife).toBe(true);
    }
  });

  it("queue processes jobs in order", () => {
    const slots = createEmptyInventory();
    slots[0] = { itemId: "quartz", count: 4 };
    let queue: { recipeId: string; progressMs: number }[] = [];

    const e1 = enqueueCraft([], slots, [], "recipe_glass");
    expect(e1.ok).toBe(true);
    if (e1.ok) queue = e1.queue;

    const recipe = getRecipe("recipe_glass")!;
    const duration = recipe.craftDurationMs ?? 2500;
    const r = tickCraftQueue(queue, slots, duration);
    expect(r.queue.length).toBe(0);
    expect(r.completedRecipeId).toBe("recipe_glass");
    const glass = r.inventory.some((s) => s?.itemId === "glass");
    expect(glass).toBe(true);
  });
});
