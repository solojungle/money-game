import { applyDamage as applyHpDamage } from "../../combat/damage";

export const NEAR_DEATH_HP_PERCENT = 15;
export const NEAR_DEATH_O2_PERCENT = 15;
export const DEFAULT_MAX_HP = 100;

export function applyDamage(
  currentHp: number,
  maxHp: number,
  damage: number,
): number {
  return applyHpDamage(currentHp, maxHp, damage);
}

export function isNearDeath(hpPercent: number, o2Percent: number): boolean {
  return (
    hpPercent <= NEAR_DEATH_HP_PERCENT || o2Percent <= NEAR_DEATH_O2_PERCENT
  );
}
