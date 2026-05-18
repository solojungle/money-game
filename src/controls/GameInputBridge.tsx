import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { AudioService } from "../audio/audioService";
import { useGameStore } from "../store/gameStore";
import {
  edgeActionFromKeyboard,
  mouseActionFromButton,
  type EdgeControlAction,
} from "./subnauticaBindings";

function slotIndex(action: EdgeControlAction): number | null {
  if (action === "slot1") return 0;
  if (action === "slot2") return 1;
  if (action === "slot3") return 2;
  if (action === "slot4") return 3;
  if (action === "slot5") return 4;
  if (action === "slot6") return 5;
  if (action === "slot7") return 6;
  if (action === "slot8") return 7;
  return null;
}

type GameInputBridgeProps = {
  audio: AudioService;
};

export function GameInputBridge({ audio }: GameInputBridgeProps) {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      const store = useGameStore.getState();
      if (!store.started) return;

      const action = edgeActionFromKeyboard(e.code);
      if (!action) return;

      if (store.fabricatorOpen || store.storageOpen) {
        return;
      }

      if (store.inventoryOpen) {
        const slot = slotIndex(action);
        if (slot !== null && slot < 5) {
          e.preventDefault();
          store.setQuickSlot(slot);
          return;
        }
        return;
      }

      const slot = slotIndex(action);
      if (slot !== null) {
        e.preventDefault();
        store.setQuickSlot(slot);
        return;
      }

      if (action === "loadTool") {
        e.preventDefault();
        store.onLoadTool();
        return;
      }

      if (action === "reload") {
        e.preventDefault();
        store.onReload();
        return;
      }

      if (action === "deconstruct") {
        e.preventDefault();
        store.onDeconstruct();
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const store = useGameStore.getState();
      if (!store.started) return;

      const action = mouseActionFromButton(e.button);

      if (store.fabricatorOpen) {
        if (action === "useLeft") {
          e.preventDefault();
          store.fabricatorCraftClick();
        } else if (action === "useRight") {
          e.preventDefault();
          store.fabricatorPinClick();
        }
        return;
      }

      if (store.storageOpen) {
        return;
      }

      if (store.inventoryOpen) {
        if (action === "useLeft") {
          e.preventDefault();
          store.pdaPrimaryAction();
        } else if (action === "useRight") {
          e.preventDefault();
          store.pdaSecondaryAction();
        }
        return;
      }

      if (action === "useLeft") {
        const beforeHarvested = store.harvestedIds.length;
        store.onUseLeft();
        const next = useGameStore.getState();
        if (next.harvestedIds.length > beforeHarvested) {
          audio.playOneShot(
            next.activeInteractable?.kind === "scan_target"
              ? "ui_confirm"
              : "pickup",
          );
        }
      } else if (action === "useRight") {
        store.toggleFlashlight();
      }
    };

    const onWheel = (e: WheelEvent) => {
      const store = useGameStore.getState();
      if (
        !store.started ||
        store.inventoryOpen ||
        store.fabricatorOpen ||
        store.storageOpen
      )
        return;
      e.preventDefault();
      if (e.deltaY < 0) store.cycleQuickSlot(1);
      else if (e.deltaY > 0) store.cycleQuickSlot(-1);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", onKeyDown);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContextMenu);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, [gl, audio]);

  useEffect(() => {
    const canvas = gl.domElement;
    const unsub = useGameStore.subscribe((state, prev) => {
      const menuOpened =
        (state.inventoryOpen && !prev.inventoryOpen) ||
        (state.fabricatorOpen && !prev.fabricatorOpen) ||
        (state.storageOpen && !prev.storageOpen);
      if (menuOpened && document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    });
    return unsub;
  }, [gl]);

  return null;
}
