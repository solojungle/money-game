import { depthMetersBelowSurface } from "../../world/waterLevel";

/** Convert player Y (R3F) to depth meters below the water surface. */
export function depthFromPlayerY(y: number): number {
  return depthMetersBelowSurface(y);
}
