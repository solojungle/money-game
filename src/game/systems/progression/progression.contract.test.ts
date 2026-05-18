import { describe, expect, it, beforeEach } from "vitest";
import type { BlueprintId, ScanState } from "../../_kernel/types";
import {
  getScanState,
  getTeamTech,
  resetProgressionState,
  unlockBlueprint,
} from "./index";

describe("M04 progression contract", () => {
  beforeEach(() => {
    resetProgressionState();
  });

  it("exports ScanState compatible with kernel", () => {
    const state: ScanState = getScanState("seaglide");
    expect(["new", "known", "duplicate"]).toContain(state);
  });

  it("unlockBlueprint adds to teamTech", () => {
    const id: BlueprintId = "seaglide";
    expect(unlockBlueprint(id)).toBe(true);
    expect(getTeamTech().has(id)).toBe(true);
    expect(getScanState(id)).toBe("known");
  });

  it("duplicate unlock returns false and marks duplicate", () => {
    unlockBlueprint("interior_wall");
    expect(unlockBlueprint("interior_wall")).toBe(false);
    expect(getScanState("interior_wall")).toBe("duplicate");
  });
});
