import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BackSide,
  Color,
  type Mesh,
  ShaderMaterial,
  SphereGeometry,
} from "three";
import {
  starfieldRotationRad,
  sunDirectionFromDayPhase,
} from "../../../game/world/celestial";
import { submergedBlend } from "../../../game/world/waterLevel";
import { SKY } from "./skyConfig";
import { SKY_FRAGMENT, SKY_VERTEX } from "./skyGlsl";
import { skyDayPhase, skySunDirection } from "./skySun";

function hexColor(hex: string, target = new Color()): Color {
  return target.set(hex);
}

/**
 * Infinite sky dome — sun on a great circle, equal day/night, rotating stars, drifting clouds.
 */
export function OceanSky() {
  const meshRef = useRef<Mesh>(null);
  const camera = useThree((s) => s.camera);

  const geometry = useMemo(() => new SphereGeometry(1, 48, 32), []);

  const material = useMemo(() => {
    const { colors, sun, stars, clouds } = SKY;
    return new ShaderMaterial({
      uniforms: {
        uSunDir: { value: skySunDirection.clone() },
        uDayPhase: { value: 0.25 },
        uStarRotation: { value: 0 },
        uCloudRotation: { value: 0 },
        uCloudCoverage: { value: clouds.coverage },
        uCloudOpacity: { value: clouds.opacity },
        uZenithDay: { value: hexColor(colors.zenithDay) },
        uZenithNight: { value: hexColor(colors.zenithNight) },
        uHorizonDay: { value: hexColor(colors.horizonDay) },
        uHorizonNight: { value: hexColor(colors.horizonNight) },
        uHorizonSunset: { value: hexColor(colors.horizonSunset) },
        uSunDisk: { value: hexColor(colors.sunDisk) },
        uSunHalo: { value: hexColor(colors.sunHalo) },
        uCloudBright: { value: hexColor(colors.cloudBright) },
        uCloudShadow: { value: hexColor(colors.cloudShadow) },
        uStarColor: { value: hexColor(colors.star) },
        uSunDiskPower: { value: sun.diskPower },
        uSunHaloPower: { value: sun.haloPower },
        uSunDiskIntensity: { value: sun.diskIntensity },
        uSunHaloIntensity: { value: sun.haloIntensity },
        uStarDensity: { value: stars.density },
        uStarThreshold: { value: stars.threshold },
        uVisibility: { value: 1 },
      },
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      side: BackSide,
      depthWrite: false,
      transparent: true,
      fog: false,
    });
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const dayPhase = (t / SKY.dayLengthSeconds) % 1;
    skyDayPhase.value = dayPhase;

    sunDirectionFromDayPhase(dayPhase, SKY.sunriseAzimuthRad, skySunDirection);

    material.uniforms.uSunDir.value.copy(skySunDirection);
    material.uniforms.uDayPhase.value = dayPhase;
    material.uniforms.uStarRotation.value = starfieldRotationRad(dayPhase);
    material.uniforms.uCloudRotation.value = t * SKY.cloudDriftRadPerSecond;

    const submersion = submergedBlend(camera.position.y);
    const hideStart = SKY.hideWhenSubmergedAbove;
    const visibility =
      submersion <= hideStart
        ? 1
        : Math.max(0, 1 - (submersion - hideStart) / 0.08);
    material.uniforms.uVisibility.value = visibility;

    const mesh = meshRef.current;
    if (mesh) {
      mesh.position.copy(camera.position);
      mesh.visible = visibility > 0.001;
    }
  });

  return (
    <mesh
      ref={meshRef}
      frustumCulled={false}
      renderOrder={SKY.renderOrder}
      scale={[SKY.domeRadius, SKY.domeRadius, SKY.domeRadius]}
      geometry={geometry}
      material={material}
    />
  );
}
