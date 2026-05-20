import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BackSide,
  Color,
  FrontSide,
  PlaneGeometry,
  ShaderMaterial,
  RepeatWrapping,
  type Texture,
} from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { sampleSkyHorizonColor, skySunDirection } from "./skySun";
import {
  applyWaterHorizonPatch,
  createWaterHorizonUniforms,
  type WaterHorizonUniforms,
} from "./waterHorizonPatch";
import { CAUSTICS } from "./causticsConfig";
import { causticTextureUniform } from "./causticTextureUniform";
import { useProceduralCausticsTexture } from "./ProceduralCausticsContext";
import { UNDERWATER_FOG } from "./underwaterAtmosphereConfig";
import { WATER_SURFACE } from "./waterSurfaceConfig";
import { WATER_NORMAL_URL } from "./waterSurfaceTextures";
import {
  WATER_UNDERSIDE_FRAGMENT,
  WATER_UNDERSIDE_VERTEX,
} from "./waterUndersideGlsl";

function configureWaterNormals(texture: Texture): Texture {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

/**
 * Ocean surface at the canonical water level.
 * Top: three.js {@link Water} — planar reflection + animated normals (jbouny / forum standard).
 * Bottom: Snell-window underside when the camera is underwater.
 *
 * @see https://discourse.threejs.org/t/make-high-performance-games-with-water-surface-simulations-with-water-bodies/74113/3
 */
export function WaterSurface() {
  const waterRef = useRef<Water | null>(null);
  const undersideMatRef = useRef<ShaderMaterial | null>(null);
  const horizonUniformsRef = useRef<WaterHorizonUniforms | null>(null);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const proceduralCaustic = useProceduralCausticsTexture();

  const normalSource = useTexture(WATER_NORMAL_URL);
  const waterNormals = useMemo(
    () => configureWaterNormals(normalSource.clone()),
    [normalSource],
  );

  const geometry = useMemo(
    () =>
      new PlaneGeometry(
        WATER_SURFACE.size,
        WATER_SURFACE.size,
        WATER_SURFACE.segments,
        WATER_SURFACE.segments,
      ),
    [],
  );

  const undersideGeometry = useMemo(() => geometry.clone(), [geometry]);

  const waterMesh = useMemo(() => {
    const sunDir = skySunDirection.clone();
    const mesh = new Water(geometry, {
      textureWidth: WATER_SURFACE.mirrorTextureSize,
      textureHeight: WATER_SURFACE.mirrorTextureSize,
      waterNormals,
      sunDirection: sunDir,
      sunColor: 0xffffff,
      waterColor: new Color(WATER_SURFACE.shallowColor).getHex(),
      distortionScale: WATER_SURFACE.distortionScale,
      alpha: WATER_SURFACE.opacity,
      fog: true,
      side: FrontSide,
    });
    mesh.renderOrder = WATER_SURFACE.renderOrder;

    const horizonUniforms = createWaterHorizonUniforms();
    applyWaterHorizonPatch(
      mesh.material,
      horizonUniforms,
      WATER_SURFACE.size / 2,
    );
    horizonUniformsRef.current = horizonUniforms;

    return mesh;
  }, [geometry, waterNormals]);

  const undersideNormals = useMemo(
    () => configureWaterNormals(normalSource.clone()),
    [normalSource],
  );

  const undersideMaterial = useMemo(() => {
    const { underside } = WATER_SURFACE;
    return new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uNormalScale: { value: WATER_SURFACE.undersideNormalScale },
        tNormalMap: { value: undersideNormals },
        uSunDir: { value: skySunDirection.clone() },
        uOpacity: { value: WATER_SURFACE.opacity },
        uSurfaceGlow: { value: new Color(UNDERWATER_FOG.surfaceGlowColor) },
        uUnderSnellColor: { value: new Color(underside.snellColor) },
        uUnderTirColor: { value: new Color(underside.tirColor) },
        uUnderSunStrength: { value: underside.sunDiskStrength },
        uUnderSnellOpacity: { value: underside.snellOpacity },
        uUnderRimOpacity: { value: underside.rimOpacity },
        uWaterSurfaceY: { value: WATER_SURFACE.worldY },
        tCaustic: { value: null as Texture | null },
        uCausticWorldScale: { value: CAUSTICS.undersideCausticScale },
        uCausticStrength: { value: CAUSTICS.undersideCausticStrength },
      },
      vertexShader: WATER_UNDERSIDE_VERTEX,
      fragmentShader: WATER_UNDERSIDE_FRAGMENT,
      transparent: true,
      side: BackSide,
      depthWrite: false,
      toneMapped: true,
    });
  }, [undersideNormals]);

  useEffect(() => {
    waterRef.current = waterMesh;
    undersideMatRef.current = undersideMaterial;
    return () => {
      waterMesh.geometry.dispose();
      waterMesh.material.dispose();
      undersideGeometry.dispose();
      undersideMaterial.dispose();
      undersideNormals.dispose();
    };
  }, [waterMesh, undersideGeometry, undersideMaterial, undersideNormals]);

  useFrame((_, delta) => {
    const water = waterRef.current;
    const underMat = undersideMatRef.current;
    if (!water) return;

    const mat = water.material;
    mat.uniforms.time.value += delta;
    mat.uniforms.eye.value.copy(camera.position);

    if (scene.fog) {
      mat.fog = true;
    }

    mat.uniforms.sunDirection.value.copy(skySunDirection);

    const horizon = horizonUniformsRef.current;
    if (horizon) {
      sampleSkyHorizonColor(skySunDirection, horizon.uHorizonColor.value);
    }

    if (underMat) {
      underMat.uniforms.uTime.value += delta;
      underMat.uniforms.uSunDir.value.copy(skySunDirection);
      const causticTex = proceduralCaustic ?? causticTextureUniform.value;
      if (causticTex) underMat.uniforms.tCaustic.value = causticTex;
    }
  });

  const surfaceLift = 0.02;

  return (
    <group
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, WATER_SURFACE.worldY, 0]}
    >
      <primitive object={waterMesh} position={[0, 0, surfaceLift]} />
      <mesh
        geometry={undersideGeometry}
        material={undersideMaterial}
        position={[0, 0, -surfaceLift]}
        renderOrder={WATER_SURFACE.renderOrder - 1}
        frustumCulled={false}
      />
    </group>
  );
}
