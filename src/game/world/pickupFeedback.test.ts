import { describe, expect, it } from "vitest";
import "./resourceNodes";
import { pickupFloatTextFor } from "./pickupFeedback";

describe("pickupFloatTextFor", () => {
  it("formats small resource pickup", () => {
    expect(
      pickupFloatTextFor({
        kind: "resource_node",
        nodeId: "ti_small_01",
        tier: "small",
        itemId: "titanium",
      }),
    ).toBe("+1 Titanium");
  });

  it("returns null for non-pickup targets", () => {
    expect(pickupFloatTextFor({ kind: "fabricator" })).toBeNull();
  });
});
