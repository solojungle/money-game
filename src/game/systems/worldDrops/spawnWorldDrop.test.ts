import { describe, expect, it } from "vitest";
import "../../world/resourceNodes";
import { getItemDef } from "../inventory/items.catalog";
import { spawnWorldDropsAt } from "./spawnWorldDrop";

describe("spawnWorldDropsAt", () => {
  it("creates one pickup per unit for maxStack 1 tools", () => {
    expect(getItemDef("scanner")?.maxStack).toBe(1);
    const drops = spawnWorldDropsAt("scanner", 2, [0, 0, 0], 0);
    expect(drops).toHaveLength(2);
    expect(drops.every((d) => d.count === 1)).toBe(true);
  });

  it("creates one stacked pickup for stackable ore", () => {
    const drops = spawnWorldDropsAt("titanium", 5, [1, 0.3, 2], 0);
    expect(drops).toHaveLength(1);
    expect(drops[0]?.count).toBe(5);
  });
});
