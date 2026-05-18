import { describe, expect, it } from "vitest";
import {
  getEquippedToolId,
  resolveInteractionPrompt,
} from "./resolveInteractionPrompt";
import type { WorldInteractable } from "../../world/interactables";

const smallNode: WorldInteractable = {
  kind: "resource_node",
  nodeId: "ti_small_01",
  tier: "small",
  itemId: "titanium",
};

const mediumNode: WorldInteractable = {
  kind: "resource_node",
  nodeId: "ag_medium_01",
  tier: "medium",
  itemId: "silver",
};

const largeNode: WorldInteractable = {
  kind: "resource_node",
  nodeId: "dm_large_01",
  tier: "large",
  itemId: "diamond",
};

const foodFauna: WorldInteractable = {
  kind: "fauna",
  faunaId: "peeper_01",
  role: "food",
  displayName: "Peeper",
};

const scanTarget: WorldInteractable = {
  kind: "scan_target",
  scanId: "seaglide_fragment",
  blueprintId: "seaglide",
  displayName: "Fragment",
};

describe("resolveInteractionPrompt", () => {
  it("small node + knife → pick up with E", () => {
    const r = resolveInteractionPrompt(smallNode, "knife");
    expect(r).toMatchObject({
      label: "Pick up Titanium",
      bindings: ["holster"],
      actionable: true,
      action: "pickup",
    });
  });

  it("medium node + knife → harvest with LMB", () => {
    const r = resolveInteractionPrompt(mediumNode, "knife");
    expect(r).toMatchObject({
      label: "Harvest Silver Ore",
      bindings: ["useLeft"],
      actionable: true,
      action: "harvest",
    });
  });

  it("medium node + builder → requires multitool, no bindings", () => {
    const r = resolveInteractionPrompt(mediumNode, "builder");
    expect(r).toMatchObject({
      label: "Requires Survival Multitool",
      bindings: [],
      actionable: false,
    });
  });

  it("large node + knife → requires resonator", () => {
    const r = resolveInteractionPrompt(largeNode, "knife");
    expect(r).toMatchObject({
      label: "Requires Sonic Resonator",
      bindings: [],
      actionable: false,
    });
  });

  it("large node + sonic_resonator → harvest", () => {
    const r = resolveInteractionPrompt(largeNode, "sonic_resonator");
    expect(r?.actionable).toBe(true);
    expect(r?.bindings).toEqual(["useLeft"]);
  });

  it("food fauna + knife → harvest", () => {
    const r = resolveInteractionPrompt(foodFauna, "knife");
    expect(r).toMatchObject({
      label: "Harvest Peeper",
      bindings: ["useLeft"],
      action: "harvest",
    });
  });

  it("food fauna + scanner → requires multitool", () => {
    const r = resolveInteractionPrompt(foodFauna, "scanner");
    expect(r?.label).toBe("Requires Survival Multitool");
    expect(r?.bindings).toEqual([]);
  });

  it("scan target + scanner → scan with LMB", () => {
    const r = resolveInteractionPrompt(scanTarget, "scanner");
    expect(r).toMatchObject({
      label: "Scan Fragment",
      bindings: ["useLeft"],
      action: "scan",
    });
  });

  it("scan target + knife → requires scanner", () => {
    const r = resolveInteractionPrompt(scanTarget, "knife");
    expect(r?.label).toBe("Requires Scanner");
    expect(r?.bindings).toEqual([]);
  });

  it("fabricator → E open fabricator", () => {
    const r = resolveInteractionPrompt({ kind: "fabricator" }, null);
    expect(r).toMatchObject({
      label: "Fabricator",
      bindings: ["holster"],
      action: "open_fabricator",
    });
  });

  it("storage locker → E open storage", () => {
    const r = resolveInteractionPrompt(
      { kind: "storage_locker", containerId: "locker_0" },
      null,
    );
    expect(r).toMatchObject({
      label: "Storage locker",
      action: "open_storage",
    });
  });
});

describe("getEquippedToolId", () => {
  it("returns hotbar slot item", () => {
    const slots = ["scanner", "knife", null, null, null, null, null, null];
    expect(getEquippedToolId(slots, 1)).toBe("knife");
  });
});
