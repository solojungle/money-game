import { SKY } from "./skyConfig";

/**
 * Ocean horizon — water fades to sky horizon color; air fog matches by distance.
 */
export const OCEAN_HORIZON = {
  water: {
    /** Horizontal distance (world XZ) from camera where fade begins. */
    fadeStart: 20,
    fadeEnd: 48,
    /** Fade fragments near the finite plane edge (distance from world origin on XZ). */
    /** Set at runtime to `WATER_SURFACE.size / 2`. */
    meshHalfSize: 80,
    meshEdgeSoftness: 14,
    fresnelPower: 2.6,
    fresnelWeight: 0.5,
    distanceWeight: 0.82,
  },
  airFog: {
    horizontalFadeStart: 12,
    horizontalFadeEnd: 50,
    /** Minimum FogExp2 density when above the surface. */
    baseDensity: 0.0045,
    /** Added at {@link horizontalFadeEnd} (open-water views). */
    maxExtraDensity: 0.024,
  },
} as const;

/** Re-export sky palette keys used for horizon tinting. */
export const HORIZON_SKY_COLORS = SKY.colors;
