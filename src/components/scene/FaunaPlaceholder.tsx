import { useMemo } from "react";
import { aimAssistRadius } from "../../game/world/interactRange";
import {
  faunaHasInteractZone,
  type FaunaSpawnDef,
} from "../../game/world/faunaSpawns";
import { zoneIdForInteractable } from "../../game/world/interactables";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { useGameStore } from "../../store/gameStore";
import { FaunaFishMesh } from "./FaunaFishMesh";
import { useSeafloorSurface } from "./SeafloorSurfaceContext";
import { useCollectAnimation } from "./useCollectAnimation";

const FAUNA_SURFACE_OFFSET = 0.12;

const FAUNA_VISUAL_RADIUS = 0.55;

type FaunaPlaceholderProps = {
  def: FaunaSpawnDef;
};

export function FaunaPlaceholder({ def }: FaunaPlaceholderProps) {
  const harvested = useGameStore((s) => s.harvestedIds.includes(def.id));
  const { done, groupRef } = useCollectAnimation(harvested);
  const { sampleSpawnY, surfaceRevision } = useSeafloorSurface();
  const position = useMemo((): [number, number, number] => {
    const [x, , z] = def.position;
    return [x, sampleSpawnY(x, z, FAUNA_SURFACE_OFFSET * def.scale), z];
  }, [def.position, def.scale, sampleSpawnY, surfaceRevision]);
  const hasZone = faunaHasInteractZone(def.role);
  const visualRadius = FAUNA_VISUAL_RADIUS * def.scale;

  const zoneId = hasZone
    ? zoneIdForInteractable({
        kind: "fauna",
        faunaId: def.id,
        role: def.role,
        displayName: def.displayName,
      })
    : null;

  const zoneUserData = useMemo(
    () => (zoneId ? { [INTERACT_ZONE_ID_KEY]: zoneId } : {}),
    [zoneId],
  );

  if (done) return null;

  return (
    <group ref={groupRef} position={position}>
      <group userData={zoneUserData}>
        <FaunaFishMesh color={def.color} scale={def.scale} />
      </group>
      {zoneId ? (
        <mesh visible={false} userData={zoneUserData}>
          <sphereGeometry args={[aimAssistRadius(visualRadius), 8, 8]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ) : null}
    </group>
  );
}
