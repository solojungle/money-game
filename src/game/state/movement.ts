import { uiCapturesInput } from "./uiInput";

/** Movement allowed when UI overlays are closed. */
export function movementAllowed(slice: {
  inventoryOpen: boolean;
  fabricatorOpen: boolean;
  builderOpen: boolean;
  storageOpen: boolean;
  pauseOpen: boolean;
}): boolean {
  return !uiCapturesInput(slice);
}
