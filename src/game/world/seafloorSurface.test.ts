import { describe, expect, it } from "vitest";
import {
  clearSeafloorDunesMeshes,
  seafloorMeshSurfaceY,
  seabedSurfaceY,
} from "./seafloorSurface";

describe("seafloorSurface", () => {
  it("fallback mesh surface sits above seafloor body", () => {
    clearSeafloorDunesMeshes();
    const y = seafloorMeshSurfaceY(0, 0);
    expect(y).toBeGreaterThan(-0.5);
    expect(y).toBeLessThan(1.5);
  });

  it("seabedSurfaceY is at least collider top without dunes", () => {
    clearSeafloorDunesMeshes();
    expect(seabedSurfaceY(0, 0)).toBeGreaterThanOrEqual(-0.3);
  });
});
