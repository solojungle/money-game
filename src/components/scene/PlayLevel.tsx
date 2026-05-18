import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { FAUNA_SPAWNS } from "../../game/world/faunaSpawns";
import { RESOURCE_NODE_SPAWNS } from "../../game/world/resourceNodes";
import { SCAN_TARGET_SPAWNS } from "../../game/world/scanTargets";
import { INTERACT_ZONE_ID_KEY } from "../../game/world/resolveInteractionFocus";
import { FaunaPlaceholder } from "./FaunaPlaceholder";
import { ResourceNode } from "./ResourceNode";
import { ScanTargetZone } from "./ScanTargetZone";
import { WorldDropsLayer } from "./WorldDropsLayer";

const STATION_DEVICE_MATERIAL = {
  color: "#1e3a5f",
  emissive: "#0ea5e9",
  emissiveIntensity: 0.35,
} as const;

/** Play mode — late-game test layout: base, vehicles, fauna, storage, resource nodes. */
export function PlayLevel() {
  const moduleColor = "#334155";

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={[0, -0.5, 0]}>
        <CuboidCollider args={[18, 0.2, 18]} />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[36, 36]} />
          <meshStandardMaterial color="#3d2820" roughness={0.95} />
        </mesh>
      </RigidBody>

      {[
        [-6, 1.2, -4, 4, 2.4, 4],
        [0, 1.2, -4, 5, 2.4, 4],
        [6, 1.2, -4, 4, 2.4, 3],
        [-3, 1.2, 3, 6, 2.4, 5],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`mod-${i}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color={moduleColor} roughness={0.7} />
        </mesh>
      ))}

      <mesh position={[-3, 2.5, -4]} castShadow>
        <boxGeometry args={[5.5, 0.08, 3.8]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          roughness={0.2}
        />
      </mesh>

      {[
        [-8, 0.9, 6],
        [-6.5, 0.9, 6],
        [8, 0.9, 5],
      ].map(([x, y, z], i) => (
        <RigidBody
          key={`locker-${i}`}
          type="fixed"
          colliders={false}
          position={[x, y, z]}
        >
          <CuboidCollider args={[0.5, 0.9, 0.35]} />
          <mesh
            castShadow
            userData={{
              [INTERACT_ZONE_ID_KEY]: `storage:locker_${i}`,
            }}
          >
            <boxGeometry args={[1, 1.8, 0.7]} />
            <meshStandardMaterial {...STATION_DEVICE_MATERIAL} />
          </mesh>
        </RigidBody>
      ))}

      <RigidBody type="fixed" colliders={false} position={[3, 0.55, 3]}>
        <CuboidCollider args={[0.7, 0.55, 0.7]} />
        <mesh castShadow userData={{ [INTERACT_ZONE_ID_KEY]: "fabricator" }}>
          <boxGeometry args={[1.4, 1.1, 1.4]} />
          <meshStandardMaterial {...STATION_DEVICE_MATERIAL} />
        </mesh>
      </RigidBody>

      <mesh position={[-10, 0.35, -2]} rotation={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.2, 0.6, 4, 8]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.45} />
      </mesh>
      <mesh position={[10, 0.9, -3]} castShadow>
        <boxGeometry args={[3.5, 1.2, 1.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.65} />
      </mesh>
      <mesh position={[10, 1.35, -3]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.9, 12]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[10, 0.45, 0.5]} castShadow>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#ea580c"
          emissiveIntensity={0.2}
        />
      </mesh>

      {RESOURCE_NODE_SPAWNS.map((def) => (
        <ResourceNode key={def.id} def={def} />
      ))}

      {FAUNA_SPAWNS.map((def) => (
        <FaunaPlaceholder key={def.id} def={def} />
      ))}

      {SCAN_TARGET_SPAWNS.map((def) => (
        <ScanTargetZone key={def.id} def={def} />
      ))}

      <WorldDropsLayer />
    </>
  );
}
