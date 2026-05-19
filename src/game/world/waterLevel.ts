/**
 * Canonical water column — 50 m above the seafloor rigid-body origin (PlayLevel).
 * 1 world unit = 10 m (see depth HUD).
 */

/** Matches `PlayLevel` seafloor `RigidBody` Y. */
export const SEAFLOOR_BODY_Y = -0.5;

export const METERS_PER_WORLD_UNIT = 10;

/** Depth of the water column from seafloor body origin to surface. */
export const WATER_COLUMN_DEPTH_M = 150;

export const waterSurfaceWorldY =
  SEAFLOOR_BODY_Y + WATER_COLUMN_DEPTH_M / METERS_PER_WORLD_UNIT;

export function metersToWorldUnits(meters: number): number {
  return meters / METERS_PER_WORLD_UNIT;
}

export function worldUnitsToMeters(units: number): number {
  return units * METERS_PER_WORLD_UNIT;
}

/** Depth in meters below the water surface (0 at or above surface). */
export function depthMetersBelowSurface(worldY: number): number {
  return Math.max(
    0,
    Math.round((waterSurfaceWorldY - worldY) * METERS_PER_WORLD_UNIT),
  );
}

export function isBelowWaterSurface(worldY: number): boolean {
  return worldY < waterSurfaceWorldY;
}

/** Walk + full gravity in habitat interiors or when feet are at/above the surface. */
export function usesDryLocomotion(
  feetWorldY: number,
  inBaseInterior: boolean,
): boolean {
  return inBaseInterior || !isBelowWaterSurface(feetWorldY);
}

export type LocomotionMode = "dry" | "swim";

/** Surface dive (C / descend) re-enters swim even while feet are still above the waterline. */
export function resolveLocomotionMode(
  feetWorldY: number,
  inBaseInterior: boolean,
  descendIntent: boolean,
): LocomotionMode {
  if (!inBaseInterior && descendIntent) return "swim";
  return usesDryLocomotion(feetWorldY, inBaseInterior) ? "dry" : "swim";
}

/** 0 in air, 1 fully submerged; soft band at the surface for effect blending. */
export function submergedBlend(worldY: number, bandWorldUnits = 0.14): number {
  const t = (waterSurfaceWorldY - worldY) / bandWorldUnits;
  return Math.max(0, Math.min(1, t));
}
