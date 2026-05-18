import { clearSystems, registerSystem, runTick } from "../_kernel/tick";
import { createVitalsTick } from "./vitals";
import type { GameMode } from "../types";

export type SystemsStoreSlice = {
  o2Percent: number;
  depthM: number;
  hasRebreather: boolean;
  gameMode: GameMode;
  inBaseInterior: boolean;
};

let vitalsUnsub: (() => void) | null = null;

export function initGameSystems(
  getSlice: () => SystemsStoreSlice,
  patch: (partial: Partial<SystemsStoreSlice>) => void,
): void {
  disposeGameSystems();
  vitalsUnsub = registerSystem(createVitalsTick(getSlice, patch), 10);
}

export function disposeGameSystems(): void {
  vitalsUnsub?.();
  vitalsUnsub = null;
  clearSystems();
}

export function runGameTick(dtMs: number): void {
  runTick(dtMs);
}
