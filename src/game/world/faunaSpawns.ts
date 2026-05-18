import type { CreatureRole } from "../progression/types";
import { FAUNA_BY_ID } from "./interactables";

export type FaunaSpawnDef = {
  id: string;
  role: CreatureRole;
  displayName: string;
  position: [number, number, number];
  scale: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
};

export const FAUNA_ROLE_COLORS: Record<CreatureRole, string> = {
  food: "#22d3ee",
  ambient: "#fde047",
  predator: "#ef4444",
  cave_hazard: "#f97316",
  disruptor: "#c084fc",
  apex: "#1e293b",
  utility: "#a3e635",
  story: "#f472b6",
};

export const FAUNA_SPAWNS: FaunaSpawnDef[] = [
  {
    id: "peeper_01",
    role: "food",
    displayName: "Peeper",
    position: [4, 0.35, 8],
    scale: 0.22,
    color: FAUNA_ROLE_COLORS.food,
    emissive: "#0891b2",
    emissiveIntensity: 0.25,
  },
  {
    id: "school_01",
    role: "ambient",
    displayName: "School Fish",
    position: [5, 0.32, 7.5],
    scale: 0.18,
    color: FAUNA_ROLE_COLORS.ambient,
  },
  {
    id: "school_02",
    role: "ambient",
    displayName: "School Fish",
    position: [-2, 0.38, 9],
    scale: 0.2,
    color: FAUNA_ROLE_COLORS.ambient,
  },
  {
    id: "biter_01",
    role: "predator",
    displayName: "Biter",
    position: [7, 0.4, -7],
    scale: 0.28,
    color: FAUNA_ROLE_COLORS.predator,
    emissive: "#b91c1c",
    emissiveIntensity: 0.2,
  },
  {
    id: "garry_01",
    role: "ambient",
    displayName: "Garryfish",
    position: [-5, 0.34, 7],
    scale: 0.24,
    color: "#94a3b8",
  },
  {
    id: "gasopod_01",
    role: "utility",
    displayName: "Gasopod",
    position: [9, 0.36, 6],
    scale: 0.32,
    color: FAUNA_ROLE_COLORS.utility,
    emissive: "#65a30d",
    emissiveIntensity: 0.18,
  },
  {
    id: "leviathan_stub",
    role: "apex",
    displayName: "Leviathan",
    position: [-10, 0.55, -8],
    scale: 0.55,
    color: FAUNA_ROLE_COLORS.apex,
  },
];

for (const fauna of FAUNA_SPAWNS) {
  FAUNA_BY_ID.set(fauna.id, {
    id: fauna.id,
    role: fauna.role,
    displayName: fauna.displayName,
  });
}

export function getFaunaSpawn(id: string): FaunaSpawnDef | undefined {
  return FAUNA_SPAWNS.find((f) => f.id === id);
}

export function faunaHasInteractZone(role: CreatureRole): boolean {
  return role === "food";
}
