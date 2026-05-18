import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { computePlacementPreview } from "../../game/building/computePlacement";
import { getEquippedToolId } from "../../game/presentation/hud/resolveInteractionPrompt";
import { useGameStore } from "../../store/gameStore";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0, 0);

export function BuilderPlacementController() {
  const { camera, scene } = useThree();
  const started = useGameStore((s) => s.started);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const quickSlot = useGameStore((s) => s.quickSlot);
  const builderOpen = useGameStore((s) => s.builderOpen);
  const selectedId = useGameStore((s) => s.builderSelectedPieceId);
  const placed = useGameStore((s) => s.placedPieces);
  const snapEnabled = useGameStore((s) => s.builderSnapEnabled);
  const rotationY = useGameStore((s) => s.builderPlacementYaw);
  const setPreview = useGameStore((s) => s.setBuilderPlacementPreview);

  const equipped = useMemo(
    () => getEquippedToolId(hotbarSlots, quickSlot),
    [hotbarSlots, quickSlot],
  );

  useFrame(() => {
    if (!started || equipped !== "builder" || builderOpen || !selectedId) {
      setPreview(null);
      return;
    }

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    const hit = hits.find(
      (h) => h.object.type === "Mesh" || h.object.type === "Group",
    );
    if (!hit) {
      setPreview(null);
      return;
    }

    const normal = hit.face
      ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
      : new THREE.Vector3(0, 1, 0);

    const preview = computePlacementPreview({
      pieceId: selectedId,
      hitPoint: [hit.point.x, hit.point.y, hit.point.z],
      hitNormal: [normal.x, normal.y, normal.z],
      placed,
      snapEnabled,
      rotationY,
    });
    setPreview(preview);
  });

  return null;
}
