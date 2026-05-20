import * as THREE from "three";
import { seafloorHeightAt } from "../../game/world/seafloorHeight";

export { seafloorHeightAt };

const SAND_BASE = new THREE.Color("#e4b868");
const SAND_DARK = new THREE.Color("#c89840");
const SAND_LIGHT = new THREE.Color("#f5d070");

export type SeafloorGeometryOptions = {
  size?: number;
  segments?: number;
};

export function createSeafloorGeometry(
  opts: SeafloorGeometryOptions = {},
): THREE.PlaneGeometry {
  const size = opts.size ?? 36;
  const segments = opts.segments ?? 72;
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);

  let minH = Infinity;
  let maxH = -Infinity;
  const heights: number[] = [];

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const h = seafloorHeightAt(x, y);
    heights.push(h);
    minH = Math.min(minH, h);
    maxH = Math.max(maxH, h);
    positions.setZ(i, h);
  }

  const range = Math.max(maxH - minH, 1e-6);
  const color = new THREE.Color();

  for (let i = 0; i < positions.count; i++) {
    const t = (heights[i]! - minH) / range;
    if (t < 0.4) {
      color.copy(SAND_DARK).lerp(SAND_BASE, t / 0.4);
    } else {
      color.copy(SAND_BASE).lerp(SAND_LIGHT, (t - 0.4) / 0.6);
    }
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}
