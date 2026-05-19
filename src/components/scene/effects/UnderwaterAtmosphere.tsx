import { useFrame, useThree } from "@react-three/fiber";
import type { RapierRigidBody } from "@react-three/rapier";
import { useEffect, type RefObject } from "react";
import { Color, FogExp2 } from "three";
import {
  depthMetersBelowSurface,
  submergedBlend,
  waterSurfaceWorldY,
} from "../../../game/world/waterLevel";
import { OCEAN_HORIZON } from "./horizonConfig";
import { sampleSkyAirColor, skySunDirection } from "./skySun";
import { UNDERWATER_FOG } from "./underwaterAtmosphereConfig";

type UnderwaterAtmosphereProps = {
  playerRef: RefObject<RapierRigidBody | null>;
};

const _fogColor = new Color();
const _skyAirColor = new Color();
const _waterColor = new Color(UNDERWATER_FOG.shallowColor);
const _surfaceGlow = new Color(UNDERWATER_FOG.surfaceGlowColor);

/**
 * Depth fog + background — blends air vs underwater from camera height (Subnautica H2.O-style).
 */
export function UnderwaterAtmosphere({ playerRef }: UnderwaterAtmosphereProps) {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const fog = new FogExp2(
      UNDERWATER_FOG.shallowColor,
      UNDERWATER_FOG.baseDensity,
    );
    scene.fog = fog;
    scene.background = new Color(UNDERWATER_FOG.shallowColor);

    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  useFrame(() => {
    const fog = scene.fog;
    if (!(fog instanceof FogExp2)) return;

    const camY = camera.position.y;
    const submersion = submergedBlend(camY);

    sampleSkyAirColor(skySunDirection, _skyAirColor);
    _fogColor.copy(_skyAirColor).lerp(_waterColor, submersion);

    if (submersion > 0.02) {
      const belowSurface = waterSurfaceWorldY - camY;
      const glowT = Math.max(
        0,
        1 - belowSurface / UNDERWATER_FOG.surfaceGlowDepth,
      );
      _fogColor.lerp(_surfaceGlow, glowT * submersion * 0.55);
    }

    fog.color.copy(_fogColor);
    if (scene.background instanceof Color) {
      if (submersion < 0.02) {
        scene.background.copy(_skyAirColor);
      } else {
        scene.background.copy(_fogColor);
      }
    }

    const horizDist = Math.hypot(camera.position.x, camera.position.z);
    const { airFog } = OCEAN_HORIZON;
    const airDistT = Math.max(
      0,
      Math.min(
        1,
        (horizDist - airFog.horizontalFadeStart) /
          (airFog.horizontalFadeEnd - airFog.horizontalFadeStart),
      ),
    );

    let density =
      airFog.baseDensity +
      airDistT * airFog.maxExtraDensity +
      (UNDERWATER_FOG.baseDensity -
        (airFog.baseDensity + airFog.maxExtraDensity)) *
        submersion;

    const body = playerRef.current;
    if (body && submersion > 0.01) {
      const depthM = depthMetersBelowSurface(body.translation().y);
      density += depthM * UNDERWATER_FOG.densityPerDepthMeter * submersion;
      density = Math.min(density, UNDERWATER_FOG.maxDensity);
    }

    fog.density = density;
  });

  return null;
}
