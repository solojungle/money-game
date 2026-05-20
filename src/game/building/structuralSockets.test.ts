import { describe, expect, it } from "vitest";
import type { PlacedPiece } from "./types";
import { snapToStructuralSocket } from "./structuralSockets";

describe("structuralSockets", () => {
  it("snaps corridor flush to room +z face", () => {
    const placed: PlacedPiece[] = [
      {
        id: "r1",
        pieceId: "piece_room",
        position: [-3, 1.2, -4],
        rotationY: 0,
      },
    ];
    const snap = snapToStructuralSocket({
      pieceId: "piece_corridor",
      hitPoint: [-3, 1.2, -1.5],
      placed,
      snapEnabled: true,
    });
    expect(snap).not.toBeNull();
    expect(snap!.position[2]).toBeGreaterThan(-4);
    expect(snap!.position[1]).toBeCloseTo(1.2, 1);
  });
});
