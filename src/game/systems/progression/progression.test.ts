import { describe, expect, it, beforeEach } from "vitest";
import {
  getScanState,
  resetProgressionState,
  scanFragment,
  unlockBlueprint,
} from "./index";

describe("M04 scan states", () => {
  beforeEach(() => {
    resetProgressionState();
  });

  it("starts as new for unknown blueprints", () => {
    expect(getScanState("seaglide")).toBe("new");
  });

  it("marks known after first unlock", () => {
    unlockBlueprint("seaglide");
    expect(getScanState("seaglide")).toBe("known");
  });

  it("duplicate scan does not re-unlock", () => {
    unlockBlueprint("interior_wall");
    expect(unlockBlueprint("interior_wall")).toBe(false);
    expect(getScanState("interior_wall")).toBe("duplicate");
  });

  it("scanFragment unlocks once then duplicate", () => {
    expect(scanFragment("seaglide")).toBe("known");
    expect(scanFragment("seaglide")).toBe("duplicate");
  });
});
