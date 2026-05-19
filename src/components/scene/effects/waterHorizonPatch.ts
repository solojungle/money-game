import { Color, type ShaderMaterial } from "three";
import { HORIZON_SKY_COLORS, OCEAN_HORIZON } from "./horizonConfig";

export type WaterHorizonUniforms = {
  uHorizonColor: { value: Color };
  uHorizonFadeStart: { value: number };
  uHorizonFadeEnd: { value: number };
  uMeshHalfSize: { value: number };
  uMeshEdgeSoftness: { value: number };
  uHorizonFresnelPower: { value: number };
  uHorizonFresnelWeight: { value: number };
  uHorizonDistWeight: { value: number };
};

const HORIZON_UNIFORM_DECL = /* glsl */ `
uniform vec3 uHorizonColor;
uniform float uHorizonFadeStart;
uniform float uHorizonFadeEnd;
uniform float uMeshHalfSize;
uniform float uMeshEdgeSoftness;
uniform float uHorizonFresnelPower;
uniform float uHorizonFresnelWeight;
uniform float uHorizonDistWeight;
`;

const HORIZON_BLEND = /* glsl */ `
{
  float horizDist = length(worldPosition.xz - eye.xz);
  float distFade = smoothstep(uHorizonFadeStart, uHorizonFadeEnd, horizDist);
  float edgeDist = length(worldPosition.xz);
  float edgeFade = smoothstep(
    uMeshHalfSize - uMeshEdgeSoftness,
    uMeshHalfSize,
    edgeDist
  );
  float horizonFade = max(distFade, edgeFade);
  float fresnelHorizon = pow(1.0 - theta, uHorizonFresnelPower);
  float horizonMix = clamp(
    horizonFade * (uHorizonDistWeight + fresnelHorizon * uHorizonFresnelWeight),
    0.0,
    1.0
  );
  outgoingLight = mix(outgoingLight, uHorizonColor, horizonMix);
}
`;

/** Injects horizon distance + Fresnel fade into three.js {@link Water} mirror shader. */
export function createWaterHorizonUniforms(): WaterHorizonUniforms {
  const { water } = OCEAN_HORIZON;
  return {
    uHorizonColor: { value: new Color(HORIZON_SKY_COLORS.horizonDay) },
    uHorizonFadeStart: { value: water.fadeStart },
    uHorizonFadeEnd: { value: water.fadeEnd },
    uMeshHalfSize: { value: water.meshHalfSize },
    uMeshEdgeSoftness: { value: water.meshEdgeSoftness },
    uHorizonFresnelPower: { value: water.fresnelPower },
    uHorizonFresnelWeight: { value: water.fresnelWeight },
    uHorizonDistWeight: { value: water.distanceWeight },
  };
}

export function applyWaterHorizonPatch(
  material: ShaderMaterial,
  horizonUniforms: WaterHorizonUniforms,
  meshHalfSize: number,
): void {
  horizonUniforms.uMeshHalfSize.value = meshHalfSize;

  material.customProgramCacheKey = () => "water-horizon-v1";

  material.onBeforeCompile = (shader) => {
    for (const [key, uniform] of Object.entries(horizonUniforms)) {
      shader.uniforms[key] = uniform;
    }

    if (!shader.fragmentShader.includes("MG_HORIZON_FADE")) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "uniform vec3 waterColor;",
        `uniform vec3 waterColor;\n${HORIZON_UNIFORM_DECL}`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "vec3 outgoingLight = albedo;",
        `vec3 outgoingLight = albedo;\n${HORIZON_BLEND}\n// MG_HORIZON_FADE`,
      );
    }
  };

  material.needsUpdate = true;
}
