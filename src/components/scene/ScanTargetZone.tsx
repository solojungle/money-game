import { useMemo } from "react";
import type { ScanTargetDef } from "../../game/world/scanTargets";
import { zoneIdForInteractable } from "../../game/world/interactables";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { useGameStore } from "../../store/gameStore";
import { useCollectAnimation } from "./useCollectAnimation";

const FRAGMENT_SIZE = { w: 0.6, h: 0.35, d: 0.6 } as const;

type ScanTargetZoneProps = {
  def: ScanTargetDef;
};

export function ScanTargetZone({ def }: ScanTargetZoneProps) {
  const scanned = useGameStore((s) => s.harvestedIds.includes(def.id));
  const { done, groupRef } = useCollectAnimation(scanned);
  const zoneId = zoneIdForInteractable({
    kind: "scan_target",
    scanId: def.id,
    blueprintId: def.blueprintId,
    displayName: def.displayName,
  });
  const zoneUserData = useMemo(
    () => ({ [INTERACT_ZONE_ID_KEY]: zoneId }),
    [zoneId],
  );

  if (done) return null;

  return (
    <group ref={groupRef} position={def.position}>
      <mesh castShadow userData={zoneUserData}>
        <boxGeometry
          args={[FRAGMENT_SIZE.w, FRAGMENT_SIZE.h, FRAGMENT_SIZE.d]}
        />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0ea5e9"
          emissiveIntensity={0.4}
          roughness={0.4}
          ref={(mat) => {
            if (mat) mat.userData.baseEmissive = 0.4;
          }}
        />
      </mesh>
    </group>
  );
}
