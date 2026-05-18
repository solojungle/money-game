import { describe, expect, it } from "vitest";
import "../../world/resourceNodes";
import { createEmptyInventory } from "../inventory/items.catalog";
import { harvestWithResonator } from "./resonatorHarvest";

describe("harvestWithResonator", () => {
  it("vacuums nearby nodes into inventory", () => {
    const result = harvestWithResonator(
      [-13, 0.45, -6],
      createEmptyInventory(),
      [],
    );
    expect(result.harvestedIds).toContain("dm_large_01");
    expect(result.totalAdded).toBeGreaterThan(0);
    expect(result.worldDrops).toHaveLength(0);
  });

  it("spawns world drops when inventory cannot fit all", () => {
    const full = createEmptyInventory().map(() => ({
      itemId: "titanium",
      count: 48,
    }));
    const result = harvestWithResonator([-12, 0.3, 8], full, []);
    expect(result.totalDropped).toBeGreaterThan(0);
    expect(result.worldDrops.length).toBeGreaterThan(0);
    expect(result.worldDrops[0]?.itemId).toBe("titanium");
  });
});
