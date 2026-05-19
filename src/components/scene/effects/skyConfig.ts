/**
 * Ocean-surface sky — consistent spin (no “fast night”), rotating stars, drifting clouds.
 *
 * @see https://arnaud-cheritat.fr/subnaut/
 */
export const SKY = {
  /** Full day/night cycle in seconds (real time). */
  dayLengthSeconds: 20 * 60,
  /**
   * Compass azimuth of sunrise (rad, 0 = +Z “north”, clockwise).
   * ~35° ≈ 10° north of east, per in-game compass notes in the article.
   */
  sunriseAzimuthRad: (35 * Math.PI) / 180,
  domeRadius: 420,
  renderOrder: -1000,
  cloudDriftRadPerSecond: 0.018,
  colors: {
    zenithDay: "#1a7ee8",
    zenithNight: "#0c1838",
    horizonDay: "#9ef4ff",
    horizonNight: "#1e3858",
    horizonSunset: "#ffb878",
    sunDisk: "#fffce0",
    sunHalo: "#ffe898",
    cloudBright: "#ffffff",
    cloudShadow: "#6ec8f0",
    star: "#f0f8ff",
  },
  sun: {
    diskPower: 1200,
    haloPower: 48,
    diskIntensity: 1.35,
    haloIntensity: 0.45,
  },
  stars: {
    density: 1.15,
    threshold: 0.992,
    nightMin: 0.08,
  },
  clouds: {
    coverage: 0.52,
    softness: 0.18,
    opacity: 0.32,
  },
  /** Hide sky dome when camera is this submerged (0 = air, 1 = deep). */
  hideWhenSubmergedAbove: 0.06,
} as const;
