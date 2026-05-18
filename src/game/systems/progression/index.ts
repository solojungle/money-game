import { emit } from "../../_kernel/events";
import type { BlueprintId, ScanState } from "../../_kernel/types";
import type { BlueprintUnlockSource } from "../../_kernel/events";
import blueprintData from "../../progression/blueprints.json";
import type { BlueprintConfig } from "../../progression/types";

const configs = blueprintData as BlueprintConfig[];
const configById = new Map(configs.map((c) => [c.id, c]));

const teamTech = new Set<BlueprintId>();
const scanById = new Map<BlueprintId, ScanState>();

export function getBlueprintConfig(id: BlueprintId): BlueprintConfig | undefined {
  return configById.get(id);
}

export function getTeamTech(): ReadonlySet<BlueprintId> {
  return teamTech;
}

export function getScanState(id: BlueprintId): ScanState {
  return scanById.get(id) ?? "new";
}

export function unlockBlueprint(
  id: BlueprintId,
  _sourcePlayer?: string,
  source: BlueprintUnlockSource = "SCANNER",
): boolean {
  const config = configById.get(id);
  if (!config) return false;

  if (teamTech.has(id)) {
    scanById.set(id, "duplicate");
    emit({ type: "scan:fragment", blueprintId: id, state: "duplicate" });
    return false;
  }

  teamTech.add(id);
  scanById.set(id, "known");
  emit({
    type: "blueprint:unlocked",
    blueprintId: id,
    displayName: config.displayName,
    source,
  });
  emit({ type: "scan:fragment", blueprintId: id, state: "known" });
  return true;
}

/** Scan a fragment: unlock if new, else duplicate state. */
export function scanFragment(
  id: BlueprintId,
  source: BlueprintUnlockSource = "SCANNER",
): ScanState {
  if (teamTech.has(id)) {
    scanById.set(id, "duplicate");
    emit({ type: "scan:fragment", blueprintId: id, state: "duplicate" });
    return "duplicate";
  }
  unlockBlueprint(id, undefined, source);
  return getScanState(id);
}

/** Restore unlocked tech from save without firing events. */
export function restoreTeamTech(ids: BlueprintId[]): void {
  teamTech.clear();
  scanById.clear();
  for (const id of ids) {
    if (!configById.has(id)) continue;
    teamTech.add(id);
    scanById.set(id, "known");
  }
}

/** Test-only: reset module state. */
export function resetProgressionState(): void {
  teamTech.clear();
  scanById.clear();
}
