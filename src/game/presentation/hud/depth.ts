/** Convert player Y (R3F) to depth meters below surface. */
export function depthFromPlayerY(
  y: number,
  waterSurfaceY = 0,
  metersPerUnit = 10,
): number {
  return Math.max(0, Math.round((waterSurfaceY - y) * metersPerUnit));
}
