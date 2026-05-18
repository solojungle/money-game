import type { Object3D } from "three";
import {
  HARVEST_RANGE_M,
  PICKUP_RANGE_M,
  STATION_RANGE_M,
} from "./interactRange";
import type { WorldDrop } from "./worldDrops";
import {
  interactableFromZoneId,
  type WorldInteractable,
} from "./interactables";

export const INTERACT_ZONE_ID_KEY = "interactZoneId";

export type InteractionRayHit = {
  object: Object3D;
  point: { x: number; y: number; z: number };
};

function findInteractZoneId(object: Object3D): string | null {
  let obj: Object3D | null = object;
  while (obj) {
    const zoneId = obj.userData?.[INTERACT_ZONE_ID_KEY];
    if (typeof zoneId === "string" && zoneId.length > 0) return zoneId;
    obj = obj.parent;
  }
  return null;
}

function distSq(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

export function maxInteractDistanceFor(target: WorldInteractable): number {
  switch (target.kind) {
    case "resource_node":
      return target.tier === "small" ? PICKUP_RANGE_M : HARVEST_RANGE_M;
    case "fauna":
    case "scan_target":
      return HARVEST_RANGE_M;
    case "fabricator":
    case "storage_locker":
      return STATION_RANGE_M;
    case "world_drop":
      return PICKUP_RANGE_M;
  }
}

/**
 * Pick the closest valid interactable along a camera ray.
 * Returns null when the ray misses, is out of range, or hits non-interactables.
 */
export function resolveInteractionFocus(
  hits: readonly InteractionRayHit[],
  playerPosition: { x: number; y: number; z: number },
  worldDrops: readonly WorldDrop[] = [],
): WorldInteractable | null {
  let best: WorldInteractable | null = null;
  let bestDistSq = Infinity;

  for (const hit of hits) {
    const zoneId = findInteractZoneId(hit.object);
    if (!zoneId) continue;

    const target = interactableFromZoneId(zoneId, worldDrops);
    if (!target) continue;

    const maxM = maxInteractDistanceFor(target);
    const maxSq = maxM * maxM;
    const dSq = distSq(playerPosition, hit.point);
    if (dSq > maxSq) continue;

    if (dSq < bestDistSq) {
      bestDistSq = dSq;
      best = target;
    }
  }

  return best;
}
