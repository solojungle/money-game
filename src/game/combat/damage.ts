/**
 * Requirements:
 * - HP never below 0 or above maxHp after damage/heal.
 */

export function applyDamage(
  currentHp: number,
  maxHp: number,
  damage: number,
): number {
  const current = Math.min(currentHp, maxHp);
  return Math.max(0, current - damage);
}

export function applyHeal(
  currentHp: number,
  maxHp: number,
  amount: number,
): number {
  const current = Math.min(currentHp, maxHp);
  return Math.min(maxHp, current + amount);
}
