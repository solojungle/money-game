import { describe, expect, it } from "vitest";
import { interactableFromZoneId } from "./interactables";
import "./resourceNodes";
import "./faunaSpawns";
import "./scanTargets";
import { getResourceNodeDef, yieldForTier } from "./resourceNodes";

describe("resourceNodes", () => {
  it("yieldForTier matches SN2 tiers", () => {
    expect(yieldForTier("small")).toBe(1);
    expect(yieldForTier("medium")).toBe(2);
    expect(yieldForTier("large")).toBe(3);
  });

  it("interactableFromZoneId resolves resource nodes", () => {
    const def = getResourceNodeDef("ti_small_01");
    expect(def).toBeDefined();
    const target = interactableFromZoneId("resource:ti_small_01");
    expect(target).toMatchObject({
      kind: "resource_node",
      tier: "small",
      itemId: "titanium",
    });
  });
});
