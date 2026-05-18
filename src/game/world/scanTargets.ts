import { SCAN_TARGET_BY_ID } from "./interactables";

export type ScanTargetDef = {
  id: string;
  blueprintId: string;
  displayName: string;
  position: [number, number, number];
};

export const SCAN_TARGET_SPAWNS: ScanTargetDef[] = [
  {
    id: "seaglide_fragment",
    blueprintId: "seaglide",
    displayName: "Fragment",
    position: [0, 0.6, -6],
  },
];

for (const scan of SCAN_TARGET_SPAWNS) {
  SCAN_TARGET_BY_ID.set(scan.id, {
    id: scan.id,
    blueprintId: scan.blueprintId,
    displayName: scan.displayName,
  });
}
