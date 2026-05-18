import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { edgeActionFromKeyboard } from "./subnauticaBindings";

/**
 * Document-level PDA keys (capture). Tab often fails under pointer lock on canvas-only listeners.
 */
export function usePdaKeyboard() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      const store = useGameStore.getState();
      if (!store.started) return;

      if (e.key === "Escape") {
        if (store.fabricatorOpen) {
          e.preventDefault();
          store.setFabricatorOpen(false);
          return;
        }
        if (store.storageOpen) {
          e.preventDefault();
          store.setStorageOpen(false);
          return;
        }
        if (store.inventoryOpen) {
          e.preventDefault();
          store.setInventoryOpen(false);
        }
        return;
      }

      const action = edgeActionFromKeyboard(e.code);
      if (!action) return;

      if (action === "pda") {
        e.preventDefault();
        e.stopPropagation();
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
        store.toggleInventory();
        return;
      }

      if (action === "holster" && store.inventoryOpen) {
        e.preventDefault();
        e.stopPropagation();
        store.setInventoryOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", onKeyDown, { capture: true });
  }, []);
}
