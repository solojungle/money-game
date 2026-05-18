/** True when a full-screen menu owns pointer input (no look, free cursor). */
export function uiCapturesInput(slice: {
  inventoryOpen: boolean;
  fabricatorOpen: boolean;
  storageOpen: boolean;
}): boolean {
  return slice.inventoryOpen || slice.fabricatorOpen || slice.storageOpen;
}
