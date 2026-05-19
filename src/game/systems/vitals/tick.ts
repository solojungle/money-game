import type { TickSystem } from "../../_kernel/tick";
import type { GameMode } from "../../types";
import { getO2DrainPerSecond, O2_REFILL_PER_SECOND } from "./o2";

export type VitalsTickSlice = {
  o2Percent: number;
  depthM: number;
  hasRebreather: boolean;
  gameMode: GameMode;
  /** Habitat interior — O₂ refills toward full. */
  inBaseInterior: boolean;
  /** Feet at or above the water surface (open air). */
  aboveWaterSurface: boolean;
};

export function createVitalsTick(
  getSlice: () => VitalsTickSlice,
  patch: (next: Partial<VitalsTickSlice & { o2Percent: number }>) => void,
): TickSystem {
  return (dtMs: number) => {
    const slice = getSlice();

    if (slice.inBaseInterior || slice.aboveWaterSurface) {
      if (slice.o2Percent < 100) {
        const delta = (O2_REFILL_PER_SECOND * dtMs) / 1000;
        const next = Math.min(100, slice.o2Percent + delta);
        if (next !== slice.o2Percent) {
          patch({ o2Percent: next });
        }
      }
      return;
    }

    const drainPerSec = getO2DrainPerSecond(slice.depthM, slice.hasRebreather);
    const delta = (drainPerSec * dtMs) / 1000;
    const next = Math.max(0, slice.o2Percent - delta);
    if (next !== slice.o2Percent) {
      patch({ o2Percent: next });
    }
  };
}
