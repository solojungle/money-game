export function formatDepthM(depthM: number): string {
  return `${Math.round(Math.max(0, depthM))} m`;
}

export function formatO2Percent(o2: number): string {
  return `${Math.round(Math.max(0, Math.min(100, o2)))}`;
}

export function formatHeadingDeg(deg: number): string {
  const n = ((deg % 360) + 360) % 360;
  return `${Math.round(n)}°`;
}

export function o2ArcDegrees(o2Percent: number): number {
  return Math.round((Math.max(0, Math.min(100, o2Percent)) / 100) * 360);
}

export function compassCardinal(headingDeg: number): string {
  const n = ((headingDeg % 360) + 360) % 360;
  if (n >= 337.5 || n < 22.5) return "N";
  if (n < 67.5) return "NE";
  if (n < 112.5) return "E";
  if (n < 157.5) return "SE";
  if (n < 202.5) return "S";
  if (n < 247.5) return "SW";
  if (n < 292.5) return "W";
  return "NW";
}

export type CompassTapeMark = {
  degrees: number;
  text: string;
  emphasis: boolean;
};

const CARDINAL_DEGREES = new Set([0, 45, 90, 135, 180, 225, 270, 315]);

function labelForDegree(deg: number): string {
  const n = ((deg % 360) + 360) % 360;
  if (CARDINAL_DEGREES.has(n)) return compassCardinal(n);
  return String(n);
}

export const COMPASS_TICKS_PER_ROTATION = 360 / 15;

/** Laps on the compass strip (middle lap is centered under the needle). */
export const COMPASS_TAPE_LAPS = 3;

/** Three full rotations of 15° ticks — room on both sides of the middle lap. */
export function compassTapeMarks(): CompassTapeMark[] {
  const marks: CompassTapeMark[] = [];
  for (let cycle = 0; cycle < COMPASS_TAPE_LAPS; cycle += 1) {
    for (let d = 0; d < 360; d += 15) {
      const degrees = d + cycle * 360;
      marks.push({
        degrees,
        text: labelForDegree(d),
        emphasis: CARDINAL_DEGREES.has(d),
      });
    }
  }
  return marks;
}

/**
 * Pixel offset so `headingDeg` sits under the fixed center needle.
 * Centers the middle lap so ticks exist on both sides (e.g. N east of NW).
 */
export function compassTapeTranslatePx(
  headingDeg: number,
  tickWidthPx: number,
  centerPx: number,
): number {
  const n = ((headingDeg % 360) + 360) % 360;
  const tickIndex = n / 15 + COMPASS_TICKS_PER_ROTATION;
  return centerPx - tickIndex * tickWidthPx;
}
