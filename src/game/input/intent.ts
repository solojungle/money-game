/**
 * Input intent — device-agnostic; map keys/gamepad to booleans in the scene layer.
 */

export type SwimIntent = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  ascend: boolean;
  descend: boolean;
  sprint: boolean;
  interact: boolean;
};

/** @deprecated Use SwimIntent — kept for camera-relative XZ helpers */
export type MoveIntent = Pick<
  SwimIntent,
  "forward" | "back" | "left" | "right" | "interact"
> & { jump: boolean };

export const SWIM_SPEED = 6.5;
export const SWIM_SPRINT_MULT = 1.55;

/** Camera yaw in radians; forward is -Z in Three.js when yaw=0 for typical setups. */
export function intentToXZ(
  intent: Pick<SwimIntent, "forward" | "back" | "left" | "right">,
  cameraYawY: number,
): { x: number; z: number } {
  let lx = 0;
  let lz = 0;
  if (intent.forward) lz -= 1;
  if (intent.back) lz += 1;
  if (intent.left) lx -= 1;
  if (intent.right) lx += 1;

  const len = Math.hypot(lx, lz);
  if (len < 1e-6) return { x: 0, z: 0 };

  const nx = lx / len;
  const nz = lz / len;
  const cos = Math.cos(cameraYawY);
  const sin = Math.sin(cameraYawY);
  return {
    x: nx * cos - nz * sin,
    z: nx * sin + nz * cos,
  };
}

/**
 * Camera-relative swim on XZ: forward/right are unit vectors on the horizontal plane
 * (from the camera’s world direction and its horizontal right).
 */
export function moveIntentToWorldXZ(
  intent: Pick<SwimIntent, "forward" | "back" | "left" | "right">,
  forward: { x: number; z: number },
  right: { x: number; z: number },
): { x: number; z: number } {
  let x = 0;
  let z = 0;
  if (intent.forward) {
    x += forward.x;
    z += forward.z;
  }
  if (intent.back) {
    x -= forward.x;
    z -= forward.z;
  }
  if (intent.right) {
    x += right.x;
    z += right.z;
  }
  if (intent.left) {
    x -= right.x;
    z -= right.z;
  }
  const len = Math.hypot(x, z);
  if (len < 1e-6) return { x: 0, z: 0 };
  return { x: x / len, z: z / len };
}

/** World-vertical swim (SN1: Space up, C down). */
export function swimVerticalComponent(
  intent: Pick<SwimIntent, "ascend" | "descend">,
): number {
  let y = 0;
  if (intent.ascend) y += 1;
  if (intent.descend) y -= 1;
  return y;
}

/** Full swim velocity in world space; returns zero vector when idle. */
export function swimIntentToWorldVelocity(
  intent: SwimIntent,
  forward: { x: number; z: number },
  right: { x: number; z: number },
  options?: { baseSpeed?: number; sprintMult?: number },
): { x: number; y: number; z: number } {
  const baseSpeed = options?.baseSpeed ?? SWIM_SPEED;
  const sprintMult = options?.sprintMult ?? SWIM_SPRINT_MULT;
  const speed = intent.sprint ? baseSpeed * sprintMult : baseSpeed;

  const { x: hx, z: hz } = moveIntentToWorldXZ(intent, forward, right);
  const vy = swimVerticalComponent(intent);

  const x = hx;
  const y = vy;
  const z = hz;
  const len = Math.hypot(x, y, z);
  if (len < 1e-6) return { x: 0, y: 0, z: 0 };

  const scale = speed / len;
  return { x: x * scale, y: y * scale, z: z * scale };
}
