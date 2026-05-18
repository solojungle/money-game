/** M15 HUD — public presentation API. */

export const HUD_MODULE_VERSION = 2;

export type VitalsDisplayStub = {
  o2Percent: number;
  depthM: number;
  healthPercent?: number;
  hungerPercent?: number;
  thirstPercent?: number;
};

export function createVitalsStub(
  overrides?: Partial<VitalsDisplayStub>,
): VitalsDisplayStub {
  return {
    o2Percent: 87,
    depthM: 12,
    healthPercent: 100,
    hungerPercent: 85,
    thirstPercent: 90,
    ...overrides,
  };
}

export {
  compassCardinal,
  compassTapeMarks,
  compassTapeTranslatePx,
  formatDepthM,
  formatHeadingDeg,
  formatO2Percent,
  o2ArcDegrees,
  type CompassTapeMark,
} from "./formatters";
export { depthFromPlayerY } from "./depth";

export type VitalsClusterProps = {
  o2Percent: number;
  healthPercent?: number;
  hungerPercent?: number;
  thirstPercent?: number;
  nearDeath?: boolean;
};

export type CompassDepthProps = {
  depthM: number;
  headingDeg?: number;
};
