import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { displayColorForItem } from "../../game/world/resourceNodes";
import type { WorldDrop } from "../../game/world/worldDrops";
import { zoneIdForWorldDrop } from "../../game/world/worldDrops";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { aimAssistRadius } from "../../game/world/interactRange";
import { ResourceOreMesh } from "./ResourceOreMesh";
import { useSeafloorSurface } from "./SeafloorSurfaceContext";

const BASE_RADIUS = 0.22;
const DROP_MESH_SCALE = 0.72;
const DROP_SURFACE_OFFSET = 0.06;

type WorldDropNodeProps = {
  drop: WorldDrop;
};

export function WorldDropNode({ drop }: WorldDropNodeProps) {
  const meshRef = useRef<Group>(null);
  const { sampleSpawnY, surfaceRevision } = useSeafloorSurface();
  const color = useMemo(() => displayColorForItem(drop.itemId), [drop.itemId]);
  const sandY = useMemo(
    () => sampleSpawnY(drop.position[0], drop.position[2], DROP_SURFACE_OFFSET),
    [drop.position, sampleSpawnY, surfaceRevision],
  );
  const zoneId = zoneIdForWorldDrop(drop.id);
  const zoneUserData = useMemo(
    () => ({ [INTERACT_ZONE_ID_KEY]: zoneId }),
    [zoneId],
  );
  const aimRadius = aimAssistRadius(BASE_RADIUS);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y = state.clock.elapsedTime * 1.2;
    mesh.position.y =
      sandY + 0.04 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
  });

  return (
    <group position={[drop.position[0], 0, drop.position[2]]}>
      <group ref={meshRef} userData={zoneUserData}>
        <ResourceOreMesh
          itemId={drop.itemId}
          color={color}
          scale={DROP_MESH_SCALE}
          emissiveIntensity={0.55}
        />
      </group>
      <mesh visible={false} userData={zoneUserData}>
        <sphereGeometry args={[aimRadius, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
