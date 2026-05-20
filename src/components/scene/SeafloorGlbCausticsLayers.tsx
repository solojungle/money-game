import { useMemo } from "react";
import type { BufferGeometry, Object3D } from "three";
import { type Mesh } from "three";
import { CausticsProjectedLayer } from "./effects/CausticsProjectedLayer";

type MeshPlacement = {
  geometry: BufferGeometry;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

function collectMeshPlacements(root: Object3D): MeshPlacement[] {
  const placements: MeshPlacement[] = [];
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    placements.push({
      geometry: mesh.geometry,
      position: [mesh.position.x, mesh.position.y, mesh.position.z],
      rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
      scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
    });
  });
  return placements;
}

type SeafloorGlbCausticsLayersProps = {
  dunesRoot: Object3D;
};

/** Additive projected caustics on upward-facing sand (same path as base floors). */
export function SeafloorGlbCausticsLayers({
  dunesRoot,
}: SeafloorGlbCausticsLayersProps) {
  const placements = useMemo(
    () => collectMeshPlacements(dunesRoot),
    [dunesRoot],
  );

  return (
    <>
      {placements.map((p, i) => (
        <group
          key={i}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
        >
          <CausticsProjectedLayer geometry={p.geometry} liftY={0.035} />
        </group>
      ))}
    </>
  );
}
