/** Bright tropical lagoon murk — PS2-era saturated aqua. */
export const UNDERWATER_FOG = {
  shallowColor: "#48d4f0",
  /** Brighter cyan near the underside of the surface (Snell window bleed). */
  surfaceGlowColor: "#a8f8ff",
  /** World units below surface where fog brightens toward {@link surfaceGlowColor}. */
  surfaceGlowDepth: 2.2,
  /** Sky / air above the water column. */
  surfaceColor: "#90ecff",
  baseDensity: 0.032,
  /** Extra FogExp2 density per meter below surface (depthFromPlayerY). */
  densityPerDepthMeter: 0.00045,
  maxDensity: 0.055,
  /** Fog density when the camera is above the surface. */
  airDensity: 0.004,
};
