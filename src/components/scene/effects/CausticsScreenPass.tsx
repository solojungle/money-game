import { useDepthBuffer, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AdditiveBlending,
  Matrix4,
  PerspectiveCamera,
  ShaderMaterial,
  Vector2,
} from "three";
import { CAUSTICS, causticsProjectionMatrix } from "./causticsConfig";
import { skySunDirection } from "./skySun";
import { CAUSTICS_GLSL } from "./causticsGlsl";
import {
  CAUSTICS_TEXTURE_URL,
  configureCausticsTexture,
} from "./causticsTexture";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D tDepth;
  uniform sampler2D tCaustic;
  uniform float uTime;
  uniform float uStrength;
  uniform float uChromaticSplit;
  uniform float uWorldScale;
  uniform float uSpeed;
  uniform float uWaterSurfaceY;
  uniform vec2 uScroll;
  uniform vec3 uSunDir;
  uniform mat4 uCausticProj;
  uniform mat4 uProjectionMatrixInverse;
  uniform mat4 uCameraMatrixWorld;
  uniform vec2 uResolution;

  varying vec2 vUv;

  ${CAUSTICS_GLSL}

  vec3 worldPosFromDepth(vec2 uv, float depth) {
    vec2 ndc = uv * 2.0 - 1.0;
    vec4 clip = vec4(ndc, depth * 2.0 - 1.0, 1.0);
    vec4 view = uProjectionMatrixInverse * clip;
    view /= view.w;
    return (uCameraMatrixWorld * view).xyz;
  }

  void main() {
    vec2 screenUv = gl_FragCoord.xy / uResolution;
    float depth = texture2D(tDepth, screenUv).x;
    if (depth <= 0.0001 || depth >= 0.9999) discard;

    vec3 worldPos = worldPosFromDepth(screenUv, depth);
    if (worldPos.y > uWaterSurfaceY) discard;

    vec3 dpx = dFdx(worldPos);
    vec3 dpy = dFdy(worldPos);
    vec3 worldNormal = normalize(cross(dpy, dpx));
    float horiz = smoothstep(0.1, 0.72, abs(worldNormal.y));
    float sunLit = max(dot(worldNormal, uSunDir), 0.0);
    float vert = (1.0 - smoothstep(0.08, 0.88, abs(worldNormal.y))) * (sunLit * 0.72 + 0.3);
    float surfaceMask = max(horiz, vert);

    vec2 cUv = causticsWorldUv(worldPos, uCausticProj);
    vec3 layers = causticsDualLayer(tCaustic, cUv, uTime, uScroll, uChromaticSplit, uWorldScale, uSpeed);
    float caustic = causticsSoftDissolve(causticsLuminance(layers)) * surfaceMask;

    vec3 tint = vec3(0.94, 0.98, 1.0);
    gl_FragColor = vec4(tint * caustic * uStrength, caustic * uStrength);
  }
`;

/**
 * Screen-space caustics on vertical surfaces / props (seafloor uses SeafloorCausticsLayer).
 */
export function CausticsScreenPass() {
  const { size } = useThree();
  // size: 0 → full viewport depth (drei default 256px was breaking UV alignment)
  const depthTexture = useDepthBuffer({ size: 0 });
  const causticSource = useTexture(CAUSTICS_TEXTURE_URL);
  const causticMap = useMemo(() => {
    const map = configureCausticsTexture(causticSource.clone());
    map.needsUpdate = true;
    return map;
  }, [causticSource]);

  useEffect(() => () => causticMap.dispose(), [causticMap]);

  const causticProj = useMemo(() => causticsProjectionMatrix(), []);

  const scroll = useMemo(() => new Vector2(1, 0), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          tDepth: { value: depthTexture },
          tCaustic: { value: causticMap },
          uTime: { value: 0 },
          uStrength: {
            value: CAUSTICS.strength * CAUSTICS.screenStrengthMult,
          },
          uChromaticSplit: { value: CAUSTICS.chromaticSplit },
          uWorldScale: { value: CAUSTICS.worldScale },
          uSpeed: { value: CAUSTICS.speed },
          uWaterSurfaceY: { value: CAUSTICS.waterSurfaceY },
          uScroll: { value: scroll },
          uSunDir: { value: skySunDirection.clone() },
          uCausticProj: { value: causticProj.clone() },
          uProjectionMatrixInverse: { value: new Matrix4() },
          uCameraMatrixWorld: { value: new Matrix4() },
          uResolution: { value: new Vector2(size.width, size.height) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [causticMap, causticProj, depthTexture, scroll, size.height, size.width],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const cam = state.camera as PerspectiveCamera;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.tDepth.value = depthTexture;
    material.uniforms.uSunDir.value.copy(skySunDirection);
    material.uniforms.uCausticProj.value.copy(
      causticsProjectionMatrix(skySunDirection),
    );
    const s = scroll;
    s.set(skySunDirection.x, skySunDirection.z);
    if (s.lengthSq() > 1e-6) s.normalize();
    material.uniforms.uProjectionMatrixInverse.value.copy(
      cam.projectionMatrixInverse,
    );
    material.uniforms.uCameraMatrixWorld.value.copy(cam.matrixWorld);
    material.uniforms.uResolution.value.set(
      state.size.width * state.viewport.dpr,
      state.size.height * state.viewport.dpr,
    );
  });

  return (
    <mesh renderOrder={1000} frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
