import { Color, Vector3 } from "three";
import { SKY } from "./skyConfig";

/** Live sun direction — updated each frame by {@link OceanSky}. */
export const skySunDirection = new Vector3(0.4, 0.85, 0.35).normalize();

export const skyDayPhase = { value: 0.25 };

const _horizonDay = new Color(SKY.colors.horizonDay);
const _horizonNight = new Color(SKY.colors.horizonNight);
const _horizonSunset = new Color(SKY.colors.horizonSunset);
const _zenithDay = new Color(SKY.colors.zenithDay);
const _zenithNight = new Color(SKY.colors.zenithNight);

/** Horizon-line color (matches {@link OceanSky} lower sky band). */
export function sampleSkyHorizonColor(
  sunDir: Vector3,
  target = new Color(),
): Color {
  const elevation = sunDir.y;
  const night = Math.max(0, -elevation);
  const day = Math.max(0, elevation);
  const sunset = Math.max(0, 1 - Math.abs(elevation) * 4) * day;

  return target
    .copy(_horizonDay)
    .lerp(_horizonNight, night)
    .lerp(_horizonSunset, sunset * 0.85);
}

/** Approximate air / fog tint from sun height. */
export function sampleSkyAirColor(
  sunDir: Vector3,
  target = new Color(),
): Color {
  const elevation = sunDir.y;
  const night = Math.max(0, -elevation);
  const day = Math.max(0, elevation);

  sampleSkyHorizonColor(sunDir, target);
  target.lerp(_zenithDay, day * 0.35);
  target.lerp(_zenithNight, night * 0.5);
  return target;
}
