import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { type Mesh, type Object3D } from "three";
import { CORAL_GLB_URL } from "./models/fishModelPaths";
import { prepareGlbWithCaustics } from "./models/prepareGlbCaustics";
import { useSeafloorSurface } from "./SeafloorSurfaceContext";

const CORAL_SURFACE_OFFSET = 0.04;

const CORAL_COUNT = 20;
const SEED = 42_019;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function collectMeshes(scene: Object3D): Mesh[] {
  const meshes: Mesh[] = [];
  scene.traverse((child) => {
    if ((child as Mesh).isMesh) meshes.push(child as Mesh);
  });
  return meshes;
}

/** Scattered coral props from manthrax/fish around the play patch. */
export function CoralScatter() {
  const { scene } = useGLTF(CORAL_GLB_URL);
  const { sampleSpawnY, surfaceRevision } = useSeafloorSurface();

  const instances = useMemo(() => {
    const meshes = collectMeshes(scene);
    if (meshes.length === 0) return [];

    const rand = seededRandom(SEED);
    const placements: Object3D[] = [];

    for (let i = 0; i < CORAL_COUNT; i++) {
      const source = meshes[Math.floor(rand() * meshes.length)]!;
      const coral = prepareGlbWithCaustics(source, {
        meshScale: 0.32 + rand() * 0.2,
        castShadow: true,
        receiveShadow: true,
      });

      const angle = rand() * Math.PI * 2;
      const dist = 6 + rand() * 12;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      coral.position.set(x, sampleSpawnY(x, z, CORAL_SURFACE_OFFSET), z);
      coral.rotation.y = rand() * Math.PI * 2;
      placements.push(coral);
    }

    return placements;
  }, [scene, sampleSpawnY, surfaceRevision]);

  if (instances.length === 0) return null;

  return (
    <group>
      {instances.map((coral, i) => (
        <primitive key={`coral-${i}`} object={coral} />
      ))}
    </group>
  );
}
