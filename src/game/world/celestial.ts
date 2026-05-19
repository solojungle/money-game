import { Vector3 } from "three";

const _axis = new Vector3();
const _sunrise = new Vector3();

/**
 * Sun direction on a great circle through the zenith, at constant angular speed.
 * `dayPhase` 0 → sunrise, 0.25 → zenith, 0.5 → sunset, 0.75 → nadir (equal day/night).
 *
 * @see https://arnaud-cheritat.fr/subnaut/
 */
export function sunDirectionFromDayPhase(
  dayPhase: number,
  sunriseAzimuthRad: number,
  target = new Vector3(),
): Vector3 {
  const phase = ((dayPhase % 1) + 1) % 1;
  _sunrise.set(Math.sin(sunriseAzimuthRad), 0, Math.cos(sunriseAzimuthRad));
  if (_sunrise.lengthSq() < 1e-8) {
    _sunrise.set(1, 0, 0);
  } else {
    _sunrise.normalize();
  }

  _axis.set(0, 1, 0).cross(_sunrise);
  if (_axis.lengthSq() < 1e-8) {
    _axis.set(1, 0, 0);
  } else {
    _axis.normalize();
  }

  /** 0 → sunrise on horizon, π/2 → zenith, π → sunset, 3π/2 → nadir. */
  const angle = -phase * Math.PI * 2;
  return target.copy(_sunrise).applyAxisAngle(_axis, angle);
}

export function isSunAboveHorizon(sunDirection: Vector3): boolean {
  return sunDirection.y > 0;
}

/** Planet spin angle (rad) — stars share this rotation. */
export function starfieldRotationRad(dayPhase: number): number {
  const phase = ((dayPhase % 1) + 1) % 1;
  return phase * Math.PI * 2;
}
