import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Color, type Mesh, type MeshStandardMaterial } from "three";
import { oreModelForItem } from "./models/oreModelForItem";
import {
  ORE_CRYSTAL_GLB_URL,
  ORE_MINERAL_GLB_URL,
} from "./models/oreModelPaths";
import { prepareGlbWithCaustics } from "./models/prepareGlbCaustics";
import { isCausticTargetMaterial } from "./effects/applyCausticsToStandardMaterial";

const MINERAL_BASE_SCALE = 0.3;
const CRYSTAL_BASE_SCALE = 0.34;

type ResourceOreMeshProps = {
  itemId: string;
  color: string;
  scale: number;
  emissiveIntensity: number;
};

function applyOreMaterialLook(
  root: ReturnType<typeof prepareGlbWithCaustics>,
  color: string,
  emissiveIntensity: number,
): void {
  const emissive = new Color(color);
  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    for (const mat of materials) {
      if (!isCausticTargetMaterial(mat)) continue;
      const std = mat as MeshStandardMaterial;
      std.emissive.copy(emissive);
      std.emissiveIntensity = emissiveIntensity;
      std.userData.baseEmissive = emissiveIntensity;
    }
  });
}

/** Low-poly ore mesh (Quaternius) with item tint, emissive pulse, and caustics. */
export function ResourceOreMesh({
  itemId,
  color,
  scale,
  emissiveIntensity,
}: ResourceOreMeshProps) {
  const kind = oreModelForItem(itemId);
  const { scene: mineralScene } = useGLTF(ORE_MINERAL_GLB_URL);
  const { scene: crystalScene } = useGLTF(ORE_CRYSTAL_GLB_URL);
  const source = kind === "crystal" ? crystalScene : mineralScene;
  const baseScale =
    kind === "crystal" ? CRYSTAL_BASE_SCALE : MINERAL_BASE_SCALE;

  const ore = useMemo(() => {
    const root = prepareGlbWithCaustics(source, {
      tintColor: color,
      causticWorldScale: 0.1,
      meshScale: scale * baseScale,
      castShadow: true,
      receiveShadow: true,
    });
    applyOreMaterialLook(root, color, emissiveIntensity);
    root.rotation.x = kind === "crystal" ? -0.08 : -0.22;
    root.rotation.y = kind === "crystal" ? 0.35 : 0.55;
    return root;
  }, [source, color, scale, emissiveIntensity, baseScale, kind]);

  return <primitive object={ore} />;
}
