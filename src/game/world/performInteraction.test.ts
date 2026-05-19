import { describe, expect, it } from "vitest";
import { createStarterPlacedPieces } from "../building";
import "./resourceNodes";
import "./faunaSpawns";
import "./scanTargets";
import { performInteraction } from "./performInteraction";
import { createEmptyInventory } from "../systems/inventory/items.catalog";

describe("performInteraction", () => {
  it("picks up small resource node", () => {
    const inventory = createEmptyInventory();
    const outcome = performInteraction(
      {
        kind: "resource_node",
        nodeId: "ti_small_01",
        tier: "small",
        itemId: "titanium",
      },
      ["knife", "scanner", null, null, null, null, null, null],
      0,
      inventory,
      [],
    );
    expect(outcome.result).toMatchObject({ ok: true, kind: "pickup" });
    expect(outcome.harvestedIds).toContain("ti_small_01");
  });

  it("blocks fabricator use outside the base", () => {
    const outcome = performInteraction(
      { kind: "fabricator" },
      [null, null, null, null, null, null, null, null],
      0,
      createEmptyInventory(),
      [],
      [],
      { inBaseInterior: false, placedPieces: createStarterPlacedPieces() },
    );
    expect(outcome.result.ok).toBe(false);
  });

  it("opens fabricator inside the base", () => {
    const outcome = performInteraction(
      { kind: "fabricator" },
      [null, null, null, null, null, null, null, null],
      0,
      createEmptyInventory(),
      [],
      [],
      { inBaseInterior: true, placedPieces: createStarterPlacedPieces() },
    );
    expect(outcome.result).toMatchObject({ ok: true, kind: "open_fabricator" });
  });

  it("blocks medium harvest without smash tool", () => {
    const outcome = performInteraction(
      {
        kind: "resource_node",
        nodeId: "ag_medium_01",
        tier: "medium",
        itemId: "silver",
      },
      ["builder", null, null, null, null, null, null, null],
      0,
      createEmptyInventory(),
      [],
    );
    expect(outcome.result.ok).toBe(false);
  });
});
