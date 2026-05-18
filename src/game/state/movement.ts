import { uiCapturesInput } from "./uiInput";

/** Movement allowed when UI overlays are closed. */
export function movementAllowed(slice: {
  inventoryOpen: boolean;
  fabricatorOpen: boolean;
  storageOpen: boolean;
}): boolean {
  return !uiCapturesInput(slice);
}
