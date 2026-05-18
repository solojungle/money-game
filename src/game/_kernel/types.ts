/** Shared kernel types — game.md §13.9. CORE-only edits. */

export type DepthBand = "starter" | "early" | "mid" | "deep" | "abyss";

export type ScanState = "new" | "known" | "duplicate";

export type CreatureRole =
  | "food"
  | "ambient"
  | "predator"
  | "cave_hazard"
  | "disruptor"
  | "apex"
  | "utility"
  | "story";

export type WeatherState = "clear" | "drizzle" | "rain" | "storm";

/** Blueprint identifier (content-defined string). */
export type BlueprintId = string;

export interface DepthBandConfig {
  id: DepthBand;
  minM: number;
  maxM: number;
  o2Multiplier: number;
  outcropTypes: string[];
  defaultSpawnTags: CreatureRole[];
}

export interface VehicleTierConfig {
  id: string;
  speedMs: number;
  crushDepthM: number;
  crushDepthMk3M: number;
  noiseRadiusM?: number;
}

export interface BlueprintConfig {
  id: BlueprintId;
  displayName: string;
  fragmentsRequired: number;
  depthBandMin?: DepthBand;
  storyFlag?: string;
  sharedUnlock: true;
}
