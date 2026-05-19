import { Matrix4, Vector3 } from "three";
import { waterSurfaceWorldY } from "../../../game/world/waterLevel";
import { skySunDirection } from "./skySun";

/** Default sun before the sky dome ticks; live value is {@link skySunDirection}. */
export const CAUSTICS_SUN = new Vector3(6, 12, 4).normalize();

export function getCausticsSun(): Vector3 {
  return skySunDirection;
}

export const CAUSTICS = {
  /** Additive brightness on floors / walls / exterior modules. */
  strength: 0.36,
  /** RGB split — keep 0; offset sampling creates ghost flecks on this texture. */
  chromaticSplit: 0,
  /** Higher = smaller, tighter pools (tile density on world surfaces). */
  worldScale: 0.34,
  /** Drift speed across world-projected UVs. */
  speed: 0.011,
  waterSurfaceY: waterSurfaceWorldY,
  minDepth: 0.0001,
  /**
   * Off — fullscreen depth pass doubles projected caustics and can feedback-loop.
   * Surfaces use {@link CausticsProjectedLayer} instead.
   */
  enableScreenPass: false,
  screenStrengthMult: 1.1,
} as const;

const _tangent = new Vector3();
const _bitangent = new Vector3();
const _up = new Vector3(0, 1, 0);

/** World XYZ → sun-aligned caustic UV (pattern stays anchored as you move). */
export function causticsProjectionMatrix(
  sun: Vector3 = getCausticsSun(),
): Matrix4 {
  _tangent.crossVectors(_up, sun);
  if (_tangent.lengthSq() < 1e-6) {
    _tangent.set(1, 0, 0);
  } else {
    _tangent.normalize();
  }
  _bitangent.crossVectors(sun, _tangent).normalize();

  const m = new Matrix4();
  m.set(
    _tangent.x,
    _tangent.y,
    _tangent.z,
    0,
    _bitangent.x,
    _bitangent.y,
    _bitangent.z,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
  );
  return m;
}
