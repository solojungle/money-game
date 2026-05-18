import { useMemo } from "react";
import { aimAssistRadius } from "../../game/world/interactRange";
import {
  displayColorForItem,
  getResourceNodeDef,
  type ResourceNodeDef,
} from "../../game/world/resourceNodes";
import { zoneIdForInteractable } from "../../game/world/interactables";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { useGameStore } from "../../store/gameStore";
import { useCollectAnimation } from "./useCollectAnimation";

const BASE_RADIUS = 0.22;

type ResourceNodeProps = {
  def: ResourceNodeDef;
};

export function ResourceNode({ def }: ResourceNodeProps) {
  const harvested = useGameStore((s) => s.harvestedIds.includes(def.id));
  const { done, groupRef } = useCollectAnimation(harvested);
  const color = useMemo(() => displayColorForItem(def.itemId), [def.itemId]);
  const radius = BASE_RADIUS * def.scale;
  const zoneId = zoneIdForInteractable({
    kind: "resource_node",
    nodeId: def.id,
    tier: def.tier,
    itemId: def.itemId,
  });
  const zoneUserData = useMemo(
    () => ({ [INTERACT_ZONE_ID_KEY]: zoneId }),
    [zoneId],
  );

  if (done) return null;

  const nodeDef = getResourceNodeDef(def.id);
  if (!nodeDef) return null;

  const aimRadius = aimAssistRadius(radius);

  return (
    <group ref={groupRef} position={def.position}>
      <mesh castShadow userData={zoneUserData}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={def.emissiveIntensity}
          roughness={0.35}
          metalness={0.15}
          ref={(mat) => {
            if (mat) mat.userData.baseEmissive = def.emissiveIntensity;
          }}
        />
      </mesh>
      <mesh visible={false} userData={zoneUserData}>
        <sphereGeometry args={[aimRadius, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
