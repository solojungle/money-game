import * as THREE from "three";

/** Warm golden sand — keep saturation; pale tints read gray under water fog. */
const SAND_BASE = new THREE.Color("#e4b868");
const SAND_DARK = new THREE.Color("#c89840");
const SAND_LIGHT = new THREE.Color("#f5d070");

function hash2(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = smoothstep(fx);
  const uy = smoothstep(fy);

  const a = hash2(ix, iy);
  const b = hash2(ix + 1, iy);
  const c = hash2(ix, iy + 1);
  const d = hash2(ix + 1, iy + 1);

  const ab = a + (b - a) * ux;
  const cd = c + (d - c) * ux;
  return ab + (cd - ab) * uy;
}

function fbm(x: number, y: number, octaves: number): number {
  let sum = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amplitude * (valueNoise(x * frequency, y * frequency) * 2 - 1);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return sum;
}

/** Gentle seabed height in plane-local Z (becomes world Y after the floor mesh rotation). */
export function seafloorHeightAt(x: number, z: number): number {
  const dunes = fbm(x * 0.11 + 12.4, z * 0.11 - 3.7, 4) * 0.11;
  const ripples = fbm(x * 0.42 - 1.2, z * 0.42 + 8.1, 3) * 0.035;
  return dunes + ripples;
}

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
