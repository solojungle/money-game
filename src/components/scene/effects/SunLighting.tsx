import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { type DirectionalLight, Vector3 } from "three";
import { isSunAboveHorizon } from "../../../game/world/celestial";
import { skySunDirection } from "./skySun";

const _offset = new Vector3();

const SHADOW_MAP = 2048;
const SHADOW_ORTHO = 22;

/**
 * Directional light that follows the sky sun; dims at night.
 * Shadow tuning inspired by manthrax/fish.
 */
export function SunLighting() {
  const lightRef = useRef<DirectionalLight>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    light.shadow.mapSize.set(SHADOW_MAP, SHADOW_MAP);
    light.shadow.bias = -0.005;
    light.shadow.normalBias = 0.02;
    light.shadow.radius = 3;

    const cam = light.shadow.camera;
    cam.near = 0.5;
    cam.far = 80;
    cam.left = -SHADOW_ORTHO;
    cam.right = SHADOW_ORTHO;
    cam.top = SHADOW_ORTHO;
    cam.bottom = -SHADOW_ORTHO;
    cam.updateProjectionMatrix();
  }, []);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;

    const above = isSunAboveHorizon(skySunDirection);
    const daylight = above ? Math.min(1, skySunDirection.y * 1.4 + 0.15) : 0;

    _offset.copy(skySunDirection).multiplyScalar(40);
    light.position.copy(_offset);
    light.intensity = 0.16 + daylight * 0.92;
    light.color.setRGB(1, 0.97 + daylight * 0.02, 0.86 + daylight * 0.1);

    light.shadow.camera.position.copy(light.position);
    light.shadow.camera.lookAt(0, 0, 0);
    light.shadow.camera.updateProjectionMatrix();
  });

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      shadow-mapSize={[SHADOW_MAP, SHADOW_MAP]}
    />
  );
}
