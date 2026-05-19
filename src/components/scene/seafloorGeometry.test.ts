import { describe, expect, it } from "vitest";
import { createSeafloorGeometry, seafloorHeightAt } from "./seafloorGeometry";

describe("seafloorGeometry", () => {
  it("keeps displacement subtle", () => {
    const samples = Array.from({ length: 200 }, (_, i) => {
      const x = (i % 20) * 1.7 - 17;
      const z = Math.floor(i / 20) * 1.9 - 17;
      return seafloorHeightAt(x, z);
    });
    const min = Math.min(...samples);
    const max = Math.max(...samples);
    expect(max - min).toBeLessThan(0.25);
    expect(max).toBeLessThan(0.2);
    expect(min).toBeGreaterThan(-0.2);
  });

  it("builds vertex colors and normals", () => {
    const geo = createSeafloorGeometry({ size: 8, segments: 16 });
    expect(geo.attributes.color).toBeDefined();
    expect(geo.attributes.normal).toBeDefined();
    geo.dispose();
  });
});
