/** Extra reach beyond the visual bounds for legacy proximity sensors. */
export const INTERACT_REACH_M = 0.85;

/** Max distance from player body to interactable (meters). */
export const PICKUP_RANGE_M = 2.5;
export const HARVEST_RANGE_M = 3;
export const STATION_RANGE_M = 4;

/** Raycast far plane — longest interaction range. */
export const INTERACT_RAY_MAX_M = STATION_RANGE_M;

/** Sphere sensor radius centered on the interactable mesh. */
export function interactBallRadius(visualRadius: number): number {
  return visualRadius + INTERACT_REACH_M;
}

/** Invisible aim-assist radius multiplier for raycast hits. */
export const AIM_ASSIST_RADIUS_MULT = 1.2;

export function aimAssistRadius(visualRadius: number): number {
  return visualRadius * AIM_ASSIST_RADIUS_MULT;
}

/** Cuboid half-extents wrapping a box mesh plus reach on each axis. */
export function interactCuboidHalfExtents(
  width: number,
  height: number,
  depth: number,
  reach = INTERACT_REACH_M,
): [number, number, number] {
  return [width / 2 + reach, height / 2 + reach, depth / 2 + reach];
}
