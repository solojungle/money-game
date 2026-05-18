import { useMemo } from "react";
import { aimAssistRadius } from "../../game/world/interactRange";
import {
  faunaHasInteractZone,
  type FaunaSpawnDef,
} from "../../game/world/faunaSpawns";
import { zoneIdForInteractable } from "../../game/world/interactables";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { useGameStore } from "../../store/gameStore";
import { useCollectAnimation } from "./useCollectAnimation";

const FAUNA_MESH_RADIUS = 0.35;

type FaunaPlaceholderProps = {
  def: FaunaSpawnDef;
};

export function FaunaPlaceholder({ def }: FaunaPlaceholderProps) {
  const harvested = useGameStore((s) => s.harvestedIds.includes(def.id));
  const { done, groupRef } = useCollectAnimation(harvested);
  const hasZone = faunaHasInteractZone(def.role);
  const visualRadius = FAUNA_MESH_RADIUS * def.scale;

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

  const emissive = def.emissiveIntensity ?? 0.12;

  return (
    <group ref={groupRef} position={def.position}>
      <mesh castShadow scale={def.scale} userData={zoneUserData}>
        <sphereGeometry args={[FAUNA_MESH_RADIUS, 14, 14]} />
        <meshStandardMaterial
          color={def.color}
          emissive={def.emissive ?? def.color}
          emissiveIntensity={emissive}
          roughness={0.45}
          ref={(mat) => {
            if (mat) mat.userData.baseEmissive = emissive;
          }}
        />
      </mesh>
      {zoneId ? (
        <mesh visible={false} userData={zoneUserData}>
          <sphereGeometry args={[aimAssistRadius(visualRadius), 8, 8]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ) : null}
    </group>
  );
}
