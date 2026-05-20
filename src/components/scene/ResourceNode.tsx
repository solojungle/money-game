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
import { ResourceOreMesh } from "./ResourceOreMesh";
import { useSeafloorSurface } from "./SeafloorSurfaceContext";
import { useCollectAnimation } from "./useCollectAnimation";

const BASE_RADIUS = 0.28;
/** Rest height above raycast sand hit (scaled slightly for larger nodes). */
const ORE_SURFACE_OFFSET = 0.07;

type ResourceNodeProps = {
  def: ResourceNodeDef;
};

export function ResourceNode({ def }: ResourceNodeProps) {
  const harvested = useGameStore((s) => s.harvestedIds.includes(def.id));
  const { done, groupRef } = useCollectAnimation(harvested);
  const { sampleSpawnY, surfaceRevision } = useSeafloorSurface();
  const color = useMemo(() => displayColorForItem(def.itemId), [def.itemId]);
  const position = useMemo((): [number, number, number] => {
    const [x, , z] = def.position;
    return [x, sampleSpawnY(x, z, ORE_SURFACE_OFFSET * def.scale), z];
  }, [def.position, def.scale, sampleSpawnY, surfaceRevision]);
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
    <group ref={groupRef} position={position}>
      <group userData={zoneUserData}>
        <ResourceOreMesh
          itemId={def.itemId}
          color={color}
          scale={def.scale}
          emissiveIntensity={def.emissiveIntensity}
        />
      </group>
      <mesh visible={false} userData={zoneUserData}>
        <sphereGeometry args={[aimRadius, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
