import {
  SEAFLOOR_COLLIDER_HALF_Y,
  seabedSurfaceY,
} from "../world/seafloorSurface";
import { getScaledGhostSize } from "./index";

export { SEAFLOOR_COLLIDER_HALF_Y };

const SEABED_CLEARANCE = 0.05;

export { seabedSurfaceY };

/** Center Y so a structural module's bottom sits on the seabed with clearance. */
export function resolveStructuralPlacementY(
  pieceId: string,
  x: number,
  z: number,
  _hitY?: number,
): number {
  const [, h] = getScaledGhostSize(pieceId);
  return seabedSurfaceY(x, z) + h / 2 + SEABED_CLEARANCE;
}

/** Bottom of piece AABB must be at or above seabed. */
export function structuralAboveSeabed(
  pieceId: string,
  position: [number, number, number],
): boolean {
  const [, h] = getScaledGhostSize(pieceId);
  const bottom = position[1] - h / 2;
  const floor = seabedSurfaceY(position[0], position[2]);
  return bottom >= floor - 0.02;
}
