import { useFrame, useThree } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { type RefObject, useRef } from "react";
import type { Object3D } from "three";
import * as THREE from "three";
import { INTERACT_RAY_MAX_M } from "../../game/world/interactRange";
import { resolveInteractionFocus } from "../../game/world/resolveInteractionFocus";
import { useGameStore } from "../../store/gameStore";

const _ndc = new THREE.Vector2(0, 0);
const _raycaster = new THREE.Raycaster();

type InteractionFocusProps = {
  playerRef: RefObject<RapierRigidBody | null>;
};

export function InteractionFocus({ playerRef }: InteractionFocusProps) {
  const { camera, scene } = useThree();
  const prevKey = useRef<string | null>(null);

  useFrame(() => {
    const store = useGameStore.getState();
    if (!store.started || store.inventoryOpen) {
      if (prevKey.current !== null) {
        prevKey.current = null;
        store.setActiveInteractable(null);
      }
      return;
    }

    const body = playerRef.current;
    if (!body) return;

    const playerPos = body.translation();
    _raycaster.setFromCamera(_ndc, camera);
    _raycaster.far = INTERACT_RAY_MAX_M;
    const hits = _raycaster
      .intersectObject(scene, true)
      .filter((h) => !isPlayerObject(h.object));

    const focused = resolveInteractionFocus(
      hits.map((h) => ({ object: h.object, point: h.point })),
      playerPos,
      store.worldDrops,
    );

    const key = focused ? focusKey(focused) : null;
    if (key !== prevKey.current) {
      prevKey.current = key;
      store.setActiveInteractable(focused);
    }
  });

  return null;
}

function isPlayerObject(object: Object3D): boolean {
  let obj: Object3D | null = object;
  while (obj) {
    if (obj.userData?.role === "player") return true;
    obj = obj.parent;
  }
  return false;
}

function focusKey(
  target: NonNullable<ReturnType<typeof resolveInteractionFocus>>,
): string {
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
      return "storage_locker";
    case "world_drop":
      return `drop:${target.dropId}`;
  }
}
