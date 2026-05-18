import type { BlueprintId, ScanState, WeatherState } from "./types";

/** M01 vitals — stub port for cross-domain queries. */
export interface VitalsPort {
  getO2Percent(): number;
  getDepthM(): number;
}

/** M04 progression — stub port. */
export interface ProgressionPort {
  isBlueprintUnlocked(id: BlueprintId): boolean;
  getScanState(id: BlueprintId): ScanState;
}

/** M07 weather — stub port. */
export interface WeatherPort {
  getWeatherState(): WeatherState;
}
