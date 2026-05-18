import { describe, expect, it } from "vitest";
import { createEmptyInventory } from "./items.catalog";
import { addItem, addItemPartial } from "./stacks";

describe("addItemPartial", () => {
  it("adds until inventory is full", () => {
    const partial = addItemPartial(createEmptyInventory(), "titanium", 5);
    expect(partial.added).toBe(5);
    expect(partial.remaining).toBe(0);
  });

  it("returns remainder when no space", () => {
    const full = createEmptyInventory().map(() => ({
      itemId: "titanium",
      count: 48,
    }));
    const partial = addItemPartial(full, "copper", 2);
    expect(partial.added).toBe(0);
    expect(partial.remaining).toBe(2);
  });
});

describe("addItem", () => {
  it("still fails when partial cannot fit all", () => {
    const full = createEmptyInventory().map(() => ({
      itemId: "titanium",
      count: 48,
    }));
    const result = addItem(full, "copper", 1);
    expect(result.ok).toBe(false);
  });
});
