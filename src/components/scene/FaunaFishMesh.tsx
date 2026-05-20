import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { FISH_GLB_URL } from "./models/fishModelPaths";
import { prepareGlbWithCaustics } from "./models/prepareGlbCaustics";

type FaunaFishMeshProps = {
  color: string;
  scale: number;
};

const FISH_BASE_SCALE = 0.45;

/** Fish mesh from manthrax/fish with role tint and caustics. */
export function FaunaFishMesh({ color, scale }: FaunaFishMeshProps) {
  const { scene } = useGLTF(FISH_GLB_URL);

  const fish = useMemo(() => {
    const root = prepareGlbWithCaustics(scene, {
      tintColor: color,
      causticWorldScale: 0.1,
      meshScale: scale * FISH_BASE_SCALE,
      castShadow: true,
      receiveShadow: true,
    });
    root.rotation.y = Math.PI * 0.5;
    return root;
  }, [scene, color, scale]);

  return <primitive object={fish} />;
}
