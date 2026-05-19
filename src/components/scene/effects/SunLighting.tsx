import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { type DirectionalLight, Vector3 } from "three";
import { isSunAboveHorizon } from "../../../game/world/celestial";
import { skySunDirection } from "./skySun";

const _offset = new Vector3();

/**
 * Directional light that follows the sky sun; dims at night.
 */
export function SunLighting() {
  const lightRef = useRef<DirectionalLight>(null);

  useFrame(() => {
    const light = lightRef.current;
    if (!light) return;

    const above = isSunAboveHorizon(skySunDirection);
    const daylight = above ? Math.min(1, skySunDirection.y * 1.4 + 0.15) : 0;

    _offset.copy(skySunDirection).multiplyScalar(40);
    light.position.copy(_offset);
    light.intensity = 0.14 + daylight * 0.82;
    light.color.setRGB(1, 0.97 + daylight * 0.02, 0.86 + daylight * 0.1);
  });

  return (
    <directionalLight ref={lightRef} castShadow shadow-mapSize={[1024, 1024]} />
  );
}
