import type { CreatureRole } from "../progression/types";
import type { WorldDrop } from "./worldDrops";

export type ResourceNodeTier = "small" | "medium" | "large";

export type WorldInteractable =
  | {
      kind: "resource_node";
      nodeId: string;
      tier: ResourceNodeTier;
      itemId: string;
    }
  | {
      kind: "fauna";
      faunaId: string;
      role: CreatureRole;
      displayName: string;
    }
  | {
      kind: "scan_target";
      scanId: string;
      blueprintId: string;
      displayName: string;
    }
  | { kind: "fabricator" }
  | { kind: "storage_locker"; containerId: string; defId?: string }
  | { kind: "world_drop"; dropId: string; itemId: string; count: number };

export function zoneIdForInteractable(target: WorldInteractable): string {
  switch (target.kind) {
    case "resource_node":
      return `resource:${target.nodeId}`;
    case "fauna":
      return `fauna:${target.faunaId}`;
    case "scan_target":
      return `scan:${target.scanId}`;
    case "fabricator":
      return "fabricator";
    case "storage_locker":
      return `storage:${target.containerId}`;
    case "world_drop":
      return `drop:${target.dropId}`;
  }
}

export function interactableFromZoneId(
  zoneId: string,
  worldDrops: readonly WorldDrop[] = [],
): WorldInteractable | null {
  if (zoneId === "fabricator") return { kind: "fabricator" };

  const storageMatch = /^storage:(.+)$/.exec(zoneId);
  if (storageMatch) {
    return {
      kind: "storage_locker",
      containerId: storageMatch[1]!,
      defId: "small_locker",
    };
  }
  if (zoneId === "storage_locker") {
    return {
      kind: "storage_locker",
      containerId: "locker_default",
      defId: "small_locker",
    };
  }

  const resourceMatch = /^resource:(.+)$/.exec(zoneId);
  if (resourceMatch) {
    const node = RESOURCE_NODE_BY_ID.get(resourceMatch[1]);
    if (!node) return null;
    return {
      kind: "resource_node",
      nodeId: node.id,
      tier: node.tier,
      itemId: node.itemId,
    };
  }

  const faunaMatch = /^fauna:(.+)$/.exec(zoneId);
  if (faunaMatch) {
    const fauna = FAUNA_BY_ID.get(faunaMatch[1]);
    if (!fauna) return null;
    return {
      kind: "fauna",
      faunaId: fauna.id,
      role: fauna.role,
      displayName: fauna.displayName,
    };
  }

  const scanMatch = /^scan:(.+)$/.exec(zoneId);
  if (scanMatch) {
    const scan = SCAN_TARGET_BY_ID.get(scanMatch[1]);
    if (!scan) return null;
    return {
      kind: "scan_target",
      scanId: scan.id,
      blueprintId: scan.blueprintId,
      displayName: scan.displayName,
    };
  }

  const dropMatch = /^drop:(.+)$/.exec(zoneId);
  if (dropMatch) {
    const drop = worldDrops.find((d) => d.id === dropMatch[1]);
    if (!drop) return null;
    return {
      kind: "world_drop",
      dropId: drop.id,
      itemId: drop.itemId,
      count: drop.count,
    };
  }

  return null;
}

/** @internal — populated by resourceNodes / fauna spawns modules */
export const RESOURCE_NODE_BY_ID = new Map<
  string,
  { id: string; tier: ResourceNodeTier; itemId: string }
>();

export const FAUNA_BY_ID = new Map<
  string,
  { id: string; role: CreatureRole; displayName: string }
>();

export const SCAN_TARGET_BY_ID = new Map<
  string,
  { id: string; blueprintId: string; displayName: string }
>();

export function harvestableIdFor(target: WorldInteractable): string | null {
  switch (target.kind) {
    case "resource_node":
      return target.nodeId;
    case "fauna":
      return target.faunaId;
    case "scan_target":
      return target.scanId;
    default:
      return null;
  }
}
