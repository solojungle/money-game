export {
  getO2DrainPerSecond,
  O2_DRAIN_100M,
  O2_DRAIN_200M,
  O2_DRAIN_REBREATHER,
  O2_DRAIN_SHALLOW,
} from "./o2";
export {
  applyDamage,
  DEFAULT_MAX_HP,
  isNearDeath,
  NEAR_DEATH_HP_PERCENT,
  NEAR_DEATH_O2_PERCENT,
} from "./damage";
export { createVitalsTick, type VitalsTickSlice } from "./tick";
