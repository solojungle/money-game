/** Subnautica-like marine-snow motes around the player. */
export const UNDERWATER_PARTICLES = {
  count: 110,
  /** Half-extents of the local drift volume (full size = 2× each axis). */
  volumeHalfExtents: [8, 5.5, 8] as const,
  /** Vertical offset from player body origin (centers cloud on torso/head). */
  followYOffset: 0.5,
  colors: ["#f8ffff", "#c8f8ff"] as const,
  size: 0.085,
  opacity: 0.42,
  /** Base drift velocity range (units/sec); upward bias mimics slow suspension. */
  driftMin: [0.008, 0.02, 0.008] as const,
  driftMax: [0.035, 0.055, 0.035] as const,
  /** Sinusoidal wobble amplitude (units/sec added to velocity). */
  wobbleAmplitude: 0.012,
  wobbleFrequency: 0.35,
};
