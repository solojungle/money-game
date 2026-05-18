import { DoubleSide } from "three";

import { ROOM_WALL_THICK } from "../../../game/building/buildingConstants";
import { BUILDING_HULL, BUILDING_WHITE } from "./buildingMaterials";
import { HatchPortalSurface } from "./HatchPortalSurface";

type HatchMeshProps = {
  /** Portal outer diameter (~85% of room height). */
  diameter: number;
  /** Recipe depth — drives exterior pipe extension. */
  depth: number;
  ghostColor?: string;
  ghostOpacity?: number;
};

const PORTAL_TRIM = "#4a6cf7";

/**
 * Airlock tube through the hull wall: pipe shell spans the slab and extends
 * outward; portal sits on the interior opening (+Z local = exterior).
 */
export function HatchMesh({
  diameter,
  depth,
  ghostColor,
  ghostOpacity,
}: HatchMeshProps) {
  const d = diameter;
  const exteriorExt = Math.max(depth * 0.42, 0.32);
  const interiorLip = 0.06;
  const wallHalf = ROOM_WALL_THICK / 2;

  const zInteriorFace = -wallHalf;
  const zPipeEndIn = zInteriorFace - interiorLip;
  const zPipeEndOut = wallHalf + exteriorExt;
  const pipeLen = zPipeEndOut - zPipeEndIn;
  const pipeCenterZ = (zPipeEndOut + zPipeEndIn) / 2;

  const rPortal = d * 0.39;
  const rFrameInner = d * 0.36;
  const rFrameOuter = d * 0.48;
  const rPipe = rFrameOuter;
  const ghost = ghostColor != null;

  const hullMat = (
    <meshStandardMaterial
      color={ghost ? ghostColor! : BUILDING_WHITE}
      transparent={ghost}
      opacity={ghost ? ghostOpacity : 1}
      {...(ghost ? { side: DoubleSide } : BUILDING_HULL)}
    />
  );

  return (
    <group>
      <mesh
        position={[0, 0, pipeCenterZ]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={0}
      >
        <cylinderGeometry args={[rPipe, rPipe, pipeLen, 48, 1, true]} />
        {hullMat}
      </mesh>

      <mesh position={[0, 0, zInteriorFace]} renderOrder={1}>
        <ringGeometry args={[rFrameInner, rFrameOuter, 64]} />
        {hullMat}
      </mesh>

      <mesh position={[0, 0, zPipeEndOut]} renderOrder={1}>
        <ringGeometry args={[rFrameInner, rFrameOuter, 64]} />
        {hullMat}
      </mesh>

      <mesh position={[0, 0, zInteriorFace - 0.02]} renderOrder={2}>
        <ringGeometry args={[rPortal + 0.02, rFrameInner - 0.01, 48]} />
        <meshStandardMaterial
          color={ghost ? ghostColor! : PORTAL_TRIM}
          emissive={ghost ? ghostColor! : PORTAL_TRIM}
          emissiveIntensity={ghost ? 0.35 : 0.7}
          transparent
          opacity={ghost ? ghostOpacity : 0.9}
          side={DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <HatchPortalSurface
        radius={rPortal}
        z={zInteriorFace - 0.03}
        ghostColor={ghostColor}
        ghostOpacity={ghostOpacity}
      />
    </group>
  );
}
