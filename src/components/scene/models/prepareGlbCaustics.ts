import { Color, type Material, type Mesh, type Object3D } from "three";
import {
  applyCausticsToStandardMaterial,
  isCausticTargetMaterial,
} from "../effects/applyCausticsToStandardMaterial";

type PrepareGlbOptions = {
  sandColor?: string;
  /** Fish bodies use ~0.1; dunes/coral use config default. */
  causticWorldScale?: number;
  /** When false, skip onBeforeCompile caustics (use projected layers on sand). */
  applyCaustics?: boolean;
  meshScale?: number;
  scaleUvs?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  tintColor?: string;
};

function cloneStandardMaterial(
  material: Material,
  opts: PrepareGlbOptions,
): Material {
  if (!isCausticTargetMaterial(material)) return material;
  const m = material.clone();
  if (opts.sandColor) m.color.set(opts.sandColor);
  if (opts.tintColor) m.color.multiply(new Color(opts.tintColor));
  if (opts.applyCaustics !== false) {
    applyCausticsToStandardMaterial(m, {
      worldScale: opts.causticWorldScale,
    });
  }
  return m;
}

/** Clone a GLB root, optionally scale UVs, apply fish-style caustic inject. */
export function prepareGlbWithCaustics(
  source: Object3D,
  opts: PrepareGlbOptions = {},
): Object3D {
  const root = source.clone(true);
  const meshScale = opts.meshScale ?? 1;
  const uvScale = opts.scaleUvs;

  root.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = opts.castShadow ?? false;
    mesh.receiveShadow = opts.receiveShadow ?? true;

    if (uvScale !== undefined && mesh.geometry.attributes.uv) {
      const arr = mesh.geometry.attributes.uv.array as Float32Array;
      for (let i = 0; i < arr.length; i += 2) {
        arr[i] *= uvScale;
        arr[i + 1] *= uvScale;
      }
      mesh.geometry.attributes.uv.needsUpdate = true;
    }

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];
    const next = materials.map((mat) => cloneStandardMaterial(mat, opts));
    mesh.material = next.length === 1 ? next[0]! : next;
  });

  if (meshScale !== 1) root.scale.multiplyScalar(meshScale);

  return root;
}
