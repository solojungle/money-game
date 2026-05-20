import { useMemo } from "react";
import { CapsuleGeometry, CylinderGeometry } from "three";
import type { RoomFace } from "../../../game/building/roomGeometry";
import { ROOM_WALL_THICK } from "../../../game/building/buildingConstants";
import { CausticsProjectedLayer } from "../effects/CausticsProjectedLayer";
import { BUILDING_HULL, BUILDING_WHITE } from "./buildingMaterials";

type CorridorShellMeshProps = {
  width: number;
  height: number;
  depth: number;
  hatchOpenings?: { face: RoomFace; holeRadius: number }[];
  ghostColor?: string;
  ghostOpacity?: number;
};

/** Tubular corridor hull — capsule body with optional end rings. */
export function CorridorShellMesh({
  width,
  height,
  depth,
  ghostColor,
  ghostOpacity,
}: CorridorShellMeshProps) {
  const radius = Math.min(width, height) / 2 - ROOM_WALL_THICK * 0.5;
  const length = Math.max(depth - width, 0.5);
  const ghost = ghostColor != null;

  const capsuleGeom = useMemo(
    () => new CapsuleGeometry(radius, length, 8, 16),
    [radius, length],
  );

  const ringGeom = useMemo(
    () => new CylinderGeometry(radius + 0.04, radius + 0.04, 0.08, 24),
    [radius],
  );

  const matProps = ghost
    ? {
        color: ghostColor!,
        transparent: true,
        opacity: ghostOpacity ?? 0.5,
        depthWrite: false,
      }
    : { color: BUILDING_WHITE, ...BUILDING_HULL };

  const halfLen = length / 2 + radius;

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <mesh geometry={capsuleGeom} castShadow receiveShadow>
        <meshStandardMaterial {...matProps} />
      </mesh>
      {!ghost && (
        <CausticsProjectedLayer
          geometry={capsuleGeom}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          renderOrder={3}
        />
      )}
      <mesh geometry={ringGeom} position={[0, 0, halfLen]}>
        <meshStandardMaterial
          color="#e8e8e4"
          {...(ghost ? {} : BUILDING_HULL)}
        />
      </mesh>
      <mesh geometry={ringGeom} position={[0, 0, -halfLen]}>
        <meshStandardMaterial
          color="#e8e8e4"
          {...(ghost ? {} : BUILDING_HULL)}
        />
      </mesh>
    </group>
  );
}
