import { moveIntentToWorldXZ, type SwimIntent } from "./intent";

export const WALK_SPEED = 5.2;
export const WALK_SPRINT_MULT = 1.45;
export const JUMP_VELOCITY = 5.5;

export type HorizontalMoveIntent = Pick<
  SwimIntent,
  "forward" | "back" | "left" | "right" | "sprint"
>;

/** Camera-relative walk velocity on XZ (Y comes from gravity/jump). */
export function walkHorizontalVelocity(
  intent: HorizontalMoveIntent,
  forward: { x: number; z: number },
  right: { x: number; z: number },
  options?: { baseSpeed?: number; sprintMult?: number },
): { x: number; z: number } {
  const baseSpeed = options?.baseSpeed ?? WALK_SPEED;
  const sprintMult = options?.sprintMult ?? WALK_SPRINT_MULT;
  const speed = intent.sprint ? baseSpeed * sprintMult : baseSpeed;

  const { x, z } = moveIntentToWorldXZ(intent, forward, right);
  if (Math.hypot(x, z) < 1e-6) return { x: 0, z: 0 };
  return { x: x * speed, z: z * speed };
}

/** Feet on interior floor collider (used with Rapier gravity). */
export function isGroundedOnInteriorFloor(opts: {
  feetY: number;
  floorY: number;
  verticalVelocity: number;
}): boolean {
  return opts.feetY <= opts.floorY + 0.22 && opts.verticalVelocity <= 0.35;
}
