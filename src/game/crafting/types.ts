import type { BlueprintId } from "../_kernel/types";

export type FabricatorCategory =
  | "personal"
  | "resources"
  | "sustenance"
  | "consumables";

export type FabricatorTier = "lifepod" | "seabase" | "all";

export type CraftIngredient = {
  itemId: string;
  count: number;
};

export type CraftRecipe = {
  id: string;
  displayName: string;
  description: string;
  station: "fabricator";
  fabricatorTier: FabricatorTier;
  category: FabricatorCategory;
  subsection: string;
  blueprintId?: BlueprintId;
  pinBlueprintId?: BlueprintId;
  ingredients: CraftIngredient[];
  output: { itemId: string; count: number };
  craftDurationMs?: number;
};

export type CraftJob = {
  recipeId: string;
  progressMs: number;
};

export const FABRICATOR_CATEGORIES: {
  id: FabricatorCategory;
  label: string;
}[] = [
  { id: "personal", label: "Personal" },
  { id: "resources", label: "Resources" },
  { id: "sustenance", label: "Sustenance" },
  { id: "consumables", label: "Consumables" },
];

export const DEFAULT_CRAFT_DURATION_MS = 2500;
