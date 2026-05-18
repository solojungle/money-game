import { DoubleSide } from "three";

import { getItemDef } from "../../../game/systems/inventory/items.catalog";

function blendHex(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const n = Number.parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const mix = (x: number, y: number) => Math.round(x * (1 - t) + y * t);
  const r = mix(ar, br);
  const g = mix(ag, bg);
  const bl = mix(ab, bb);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)}`;
}

/** Prior warm white hull — kept for reference when retuning tint. */
export const BUILDING_WARM_WHITE = "#fffffc";

/** Midpoint between warm hull white and raw quartz item color. */
export const BUILDING_WHITE = blendHex(
  BUILDING_WARM_WHITE,
  getItemDef("quartz")?.color ?? "#e2e8f0",
  0.5,
);

export const BUILDING_GLOSS = { metalness: 0.48, roughness: 0.16 };
/** Opaque hull — double-sided so interior views do not x-ray through walls. */
export const BUILDING_HULL = { ...BUILDING_GLOSS, side: DoubleSide };
export const HATCH_EMISSIVE = "#00e5ff";
