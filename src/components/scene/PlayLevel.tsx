import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { FAUNA_SPAWNS } from "../../game/world/faunaSpawns";
import { RESOURCE_NODE_SPAWNS } from "../../game/world/resourceNodes";
import { SCAN_TARGET_SPAWNS } from "../../game/world/scanTargets";
import { BuilderPlacementController } from "./BuilderPlacementController";
import { FaunaPlaceholder } from "./FaunaPlaceholder";
import { PlacedPiecesLayer } from "./PlacedPiecesLayer";
import { PlacementGhost } from "./PlacementGhost";
import { ResourceNode } from "./ResourceNode";
import { ScanTargetZone } from "./ScanTargetZone";
import { SEAFLOOR_BODY_Y } from "../../game/world/waterLevel";
import { CausticsProvider } from "./effects/CausticsProvider";
import { SeafloorMesh } from "./SeafloorMesh";
import { WorldDropsLayer } from "./WorldDropsLayer";

/** Play mode — starter base from placedPieces; resources/fauna on seafloor. */
export function PlayLevel() {
  return (
    <CausticsProvider>
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, SEAFLOOR_BODY_Y, 0]}
      >
        <CuboidCollider args={[18, 0.2, 18]} />
        <SeafloorMesh />
      </RigidBody>

      <PlacedPiecesLayer />
      <PlacementGhost />
      <BuilderPlacementController />

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
    </CausticsProvider>
  );
}
