import type {
  Material,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from "three";
import { CAUSTICS } from "./causticsConfig";
import { causticTextureUniform } from "./causticTextureUniform";

const CACHE_KEY = "caustics_pbr_v2";

type ApplyCausticsOptions = {
  /** World XZ scale for caustic UV (fish uses 0.0125 on dunes/coral). */
  worldScale?: number;
  /** Height fade: shallow Y, deep Y (world units). */
  heightMin?: number;
  heightMax?: number;
};

type PbrMaterial = MeshStandardMaterial | MeshPhysicalMaterial;

/**
 * Fish-style caustic darkening on PBR materials via onBeforeCompile.
 * @see https://github.com/manthrax/fish/blob/main/src/FishTank.js
 */
export function applyCausticsToStandardMaterial(
  material: PbrMaterial,
  opts: ApplyCausticsOptions = {},
): void {
  const worldScale = opts.worldScale ?? CAUSTICS.glbWorldScale;
  const heightMin = opts.heightMin ?? CAUSTICS.glbHeightMin;
  const heightMax = opts.heightMax ?? CAUSTICS.glbHeightMax;

  material.customProgramCacheKey = () => CACHE_KEY;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.tCaustic = causticTextureUniform;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      /* glsl */ `
#include <common>
varying vec3 vCausticWorldPos;
`,
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <worldpos_vertex>",
      /* glsl */ `
#include <worldpos_vertex>
vCausticWorldPos = worldPosition.xyz;
`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      /* glsl */ `
#include <common>
uniform sampler2D tCaustic;
varying vec3 vCausticWorldPos;
`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      /* glsl */ `
#include <color_fragment>
{
  vec4 causticCol = texture2D(tCaustic, vCausticWorldPos.xz * ${worldScale.toFixed(6)});
  float heightFactor = smoothstep(${heightMin.toFixed(2)}, ${heightMax.toFixed(2)}, vCausticWorldPos.y);
  vec3 blendedCaustic = mix(vec3(1.0), causticCol.rgb + 0.05, heightFactor);
  diffuseColor.rgb = min(diffuseColor.rgb, blendedCaustic);
}
`,
    );
  };

  material.needsUpdate = true;
}

export function isCausticTargetMaterial(m: Material): m is PbrMaterial {
  return (
    (m as MeshStandardMaterial).isMeshStandardMaterial === true ||
    (m as MeshPhysicalMaterial).isMeshPhysicalMaterial === true
  );
}

/** @deprecated Use {@link isCausticTargetMaterial}. */
export function isStandardMaterial(m: Material): m is MeshStandardMaterial {
  return (m as MeshStandardMaterial).isMeshStandardMaterial === true;
}
