import { waterSurfaceWorldY } from "../../../game/world/waterLevel";

export const WATER_SURFACE = {
  /** Horizontal extent (centered on origin); edge hidden by horizon fade. */
  size: 160,
  segments: 128,
  worldY: waterSurfaceWorldY,
  /** three.js Water (jbouny) — reflective plane resolution. */
  mirrorTextureSize: 1024,
  /** Normal-map distortion for reflection/refraction (Water.js default ~20; lower = calmer). */
  distortionScale: 3.4,
  /** Normal scroll scale on underside (matches Water.js `size` ~1). */
  undersideNormalScale: 1.0,
  shallowColor: "#32d8f0",
  deepColor: "#0a88b8",
  opacity: 0.92,
  renderOrder: 200,
  /** View from below — Snell window on animated underside. */
  underside: {
    snellColor: "#d0f8ff",
    tirColor: "#085868",
    sunDiskStrength: 0.72,
    /** Snell core — procedural caustics add fill; brightness comes from snell^2 in shader. */
    snellOpacity: 0.44,
    /** Grazing rim — nearly invisible so the disk has soft edges. */
    rimOpacity: 0.14,
  },
} as const;
