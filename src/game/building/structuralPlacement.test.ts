import { describe, expect, it } from "vitest";
import {
  resolveStructuralPlacementY,
  structuralAboveSeabed,
} from "./structuralPlacement";

describe("structuralPlacement", () => {
  it("places room center above seabed by half height", () => {
    const y = resolveStructuralPlacementY("piece_room", -3, -4);
    const half = 2.4 / 2;
    expect(y - half).toBeGreaterThan(-0.35);
  });

  it("rejects positions buried in seabed", () => {
    expect(structuralAboveSeabed("piece_corridor", [0, -1, 0])).toBe(false);
    const y = resolveStructuralPlacementY("piece_corridor", 4, 4);
    expect(structuralAboveSeabed("piece_corridor", [4, y, 4])).toBe(true);
  });
});
