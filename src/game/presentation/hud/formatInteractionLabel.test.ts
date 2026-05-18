import { describe, expect, it } from "vitest";
import { formatInteractionLabel } from "./formatInteractionLabel";

describe("formatInteractionLabel", () => {
  it("capitalizes first letter only", () => {
    expect(formatInteractionLabel("pick up titanium")).toBe("Pick up titanium");
    expect(formatInteractionLabel("Requires Scanner")).toBe("Requires Scanner");
  });
});
