import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { displayColorForItem } from "../../game/world/resourceNodes";
import type { WorldDrop } from "../../game/world/worldDrops";
import { zoneIdForWorldDrop } from "../../game/world/worldDrops";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { aimAssistRadius } from "../../game/world/interactRange";

const BASE_RADIUS = 0.18;

type WorldDropNodeProps = {
  drop: WorldDrop;
};

export function WorldDropNode({ drop }: WorldDropNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const color = useMemo(() => displayColorForItem(drop.itemId), [drop.itemId]);
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
      drop.position[1] + 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
  });

  return (
    <group position={[drop.position[0], 0, drop.position[2]]}>
      <mesh ref={meshRef} castShadow userData={zoneUserData}>
        <sphereGeometry args={[BASE_RADIUS, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.35}
        />
      </mesh>
      <mesh visible={false} userData={zoneUserData}>
        <sphereGeometry args={[aimRadius, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
