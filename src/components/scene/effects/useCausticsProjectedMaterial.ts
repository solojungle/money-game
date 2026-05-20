import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { AdditiveBlending, DoubleSide, ShaderMaterial, Vector2 } from "three";
import { CAUSTICS, causticsProjectionMatrix } from "./causticsConfig";
import { causticTextureUniform } from "./causticTextureUniform";
import { skySunDirection } from "./skySun";
import { CAUSTICS_GLSL } from "./causticsGlsl";
import {
  CAUSTICS_TEXTURE_URL,
  configureCausticsTexture,
} from "./causticsTexture";
import { useProceduralCausticsTexture } from "./ProceduralCausticsContext";

const vertexShader = /* glsl */ `
  varying vec2 vCausticUv;
  uniform mat4 uCausticProj;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vCausticUv = (uCausticProj * worldPos).xy;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D tCaustic;
  uniform float uTime;
  uniform float uStrength;
  uniform float uChromaticSplit;
  uniform float uWorldScale;
  uniform float uSpeed;
  uniform vec2 uScroll;

  varying vec2 vCausticUv;

  ${CAUSTICS_GLSL}

  void main() {
    vec3 layers = causticsDualLayer(
      tCaustic, vCausticUv, uTime, uScroll, uChromaticSplit, uWorldScale, uSpeed
    );
    float raw = causticsLuminance(layers);
    float intensity = causticsSoftDissolve(raw) * uStrength;
    if (intensity < 0.004) discard;
    vec3 tint = vec3(0.96, 0.99, 1.0);
    gl_FragColor = vec4(tint * intensity, intensity);
  }
`;

/** Shared projected caustics material (one texture upload per provider tree). */
export function useCausticsProjectedMaterial(
  strength: number = CAUSTICS.strength,
) {
  const proceduralTex = useProceduralCausticsTexture();
  const staticSource = useTexture(CAUSTICS_TEXTURE_URL);

  const staticMap = useMemo(() => {
    if (CAUSTICS.useProceduralCaustics) return null;
    const map = configureCausticsTexture(staticSource.clone());
    map.needsUpdate = true;
    return map;
  }, [staticSource]);

  useEffect(() => () => staticMap?.dispose(), [staticMap]);

  const causticProj = useMemo(() => causticsProjectionMatrix(), []);
  const scroll = useMemo(() => new Vector2(1, 0), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          tCaustic: { value: staticMap },
          uTime: { value: 0 },
          uStrength: { value: strength },
          uChromaticSplit: { value: CAUSTICS.chromaticSplit },
          uWorldScale: { value: CAUSTICS.worldScale },
          uSpeed: { value: CAUSTICS.speed },
          uScroll: { value: scroll },
          uCausticProj: { value: causticProj.clone() },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -2,
        side: DoubleSide,
        toneMapped: false,
      }),
    [causticProj, scroll, staticMap, strength],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const tex = CAUSTICS.useProceduralCaustics
      ? (proceduralTex ?? causticTextureUniform.value)
      : staticMap;
    if (tex) material.uniforms.tCaustic.value = tex;

    material.uniforms.uTime.value = state.clock.elapsedTime;
    const s = scroll;
    s.set(skySunDirection.x, skySunDirection.z);
    if (s.lengthSq() > 1e-6) s.normalize();
    material.uniforms.uCausticProj.value.copy(
      causticsProjectionMatrix(skySunDirection),
    );
  });

  return material;
}
