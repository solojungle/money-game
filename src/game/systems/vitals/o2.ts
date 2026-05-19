/** O₂ drain rates — game.md §13.2 (units: % per second at 100% tank scale). */

export const O2_DRAIN_SHALLOW = 1;
export const O2_DRAIN_100M = 2;
export const O2_DRAIN_200M = 3;
export const O2_DRAIN_REBREATHER = 1;

/** Habitat interior refill — faster than shallow drain, not instant. */
export const O2_REFILL_PER_SECOND = 40;

export function getO2DrainPerSecond(
  depthM: number,
  hasRebreather: boolean,
): number {
  if (hasRebreather) return O2_DRAIN_REBREATHER;
  if (depthM >= 200) return O2_DRAIN_200M;
  if (depthM >= 100) return O2_DRAIN_100M;
  return O2_DRAIN_SHALLOW;
}
