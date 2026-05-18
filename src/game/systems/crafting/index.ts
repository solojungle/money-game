import recipeData from "../../crafting/recipes.fabricator.json";
import type { BlueprintId } from "../../_kernel/types";
import type {
  CraftJob,
  CraftRecipe,
  FabricatorCategory,
  FabricatorTier,
} from "../../crafting/types";
import {
  DEFAULT_CRAFT_DURATION_MS,
  FABRICATOR_CATEGORIES,
} from "../../crafting/types";

export { FABRICATOR_CATEGORIES };
export type { CraftJob, CraftRecipe, FabricatorCategory, FabricatorTier };
import type { InventorySlot } from "../inventory/items.catalog";
import { addItem, removeItem } from "../inventory/stacks";
import { countOwnedItem } from "../inventory/inventoryActions";

const RECIPES = recipeData as CraftRecipe[];
const BY_ID = new Map(RECIPES.map((r) => [r.id, r]));

export function getRecipe(id: string): CraftRecipe | undefined {
  return BY_ID.get(id);
}

export function getAllRecipes(): readonly CraftRecipe[] {
  return RECIPES;
}

export type IngredientStatus = {
  itemId: string;
  have: number;
  need: number;
};

export function getIngredientCounts(
  inventory: InventorySlot[],
  hotbarSlots: readonly (string | null)[],
  recipe: CraftRecipe,
): IngredientStatus[] {
  return recipe.ingredients.map((ing) => ({
    itemId: ing.itemId,
    need: ing.count,
    have: countOwnedItem(inventory, hotbarSlots, ing.itemId),
  }));
}

export function canCraft(
  inventory: InventorySlot[],
  hotbarSlots: readonly (string | null)[],
  recipeId: string,
): { ok: true } | { ok: false; missing: IngredientStatus[] } {
  const recipe = getRecipe(recipeId);
  if (!recipe) return { ok: false, missing: [] };

  const statuses = getIngredientCounts(inventory, hotbarSlots, recipe);
  const missing = statuses.filter((s) => s.have < s.need);
  if (missing.length > 0) return { ok: false, missing };
  return { ok: true };
}

export function craftInstant(
  inventory: InventorySlot[],
  recipeId: string,
): { ok: true; inventory: InventorySlot[] } | { ok: false } {
  const recipe = getRecipe(recipeId);
  if (!recipe) return { ok: false };

  const check = canCraft(inventory, [], recipeId);
  if (!check.ok) return { ok: false };

  let next = inventory;
  for (const ing of recipe.ingredients) {
    next = removeItem(next, ing.itemId, ing.count);
  }

  const added = addItem(next, recipe.output.itemId, recipe.output.count);
  if (!added.ok) return { ok: false };
  return { ok: true, inventory: added.slots };
}

export function recipeDurationMs(recipe: CraftRecipe): number {
  return recipe.craftDurationMs ?? DEFAULT_CRAFT_DURATION_MS;
}

export function isRecipeUnlocked(
  recipe: CraftRecipe,
  unlockedIds: readonly BlueprintId[],
): boolean {
  if (!recipe.blueprintId) return true;
  return unlockedIds.includes(recipe.blueprintId);
}

export function listFabricatorRecipes(opts: {
  tier: FabricatorTier;
  category?: FabricatorCategory;
  unlockedIds: readonly BlueprintId[];
}): CraftRecipe[] {
  return RECIPES.filter((r) => {
    if (opts.tier === "lifepod" && r.fabricatorTier === "seabase") return false;
    if (opts.category && r.category !== opts.category) return false;
    if (!isRecipeUnlocked(r, opts.unlockedIds)) return false;
    return true;
  });
}

export function subsectionLabel(subsection: string): string {
  return subsection.replace(/_/g, " ").toUpperCase();
}

export function groupRecipesBySubsection(
  recipes: CraftRecipe[],
): { subsection: string; recipes: CraftRecipe[] }[] {
  const order: string[] = [];
  const map = new Map<string, CraftRecipe[]>();
  for (const r of recipes) {
    if (!map.has(r.subsection)) {
      map.set(r.subsection, []);
      order.push(r.subsection);
    }
    map.get(r.subsection)!.push(r);
  }
  return order.map((subsection) => ({
    subsection,
    recipes: map.get(subsection)!,
  }));
}

export function enqueueCraft(
  queue: CraftJob[],
  inventory: InventorySlot[],
  hotbarSlots: readonly (string | null)[],
  recipeId: string,
): { ok: true; queue: CraftJob[] } | { ok: false } {
  const recipe = getRecipe(recipeId);
  if (!recipe) return { ok: false };
  if (!canCraft(inventory, hotbarSlots, recipeId).ok) return { ok: false };
  return {
    ok: true,
    queue: [...queue, { recipeId, progressMs: 0 }],
  };
}

export type TickQueueResult = {
  queue: CraftJob[];
  inventory: InventorySlot[];
  completedRecipeId?: string;
};

/** Deducts ingredients when a job starts; advances progress; completes into inventory. */
export function tickCraftQueue(
  queue: CraftJob[],
  inventory: InventorySlot[],
  dtMs: number,
): TickQueueResult {
  if (queue.length === 0) {
    return { queue, inventory };
  }

  const head = queue[0]!;
  const recipe = getRecipe(head.recipeId);
  if (!recipe) {
    return { queue: queue.slice(1), inventory };
  }

  const duration = recipeDurationMs(recipe);

  if (head.progressMs === 0) {
    const check = canCraft(inventory, [], head.recipeId);
    if (!check.ok) {
      return { queue: queue.slice(1), inventory };
    }
    let next = inventory;
    for (const ing of recipe.ingredients) {
      next = removeItem(next, ing.itemId, ing.count);
    }
    inventory = next;
  }

  const progressMs = head.progressMs + dtMs;
  if (progressMs < duration) {
    return {
      queue: [{ ...head, progressMs }, ...queue.slice(1)],
      inventory,
    };
  }

  const added = addItem(inventory, recipe.output.itemId, recipe.output.count);
  const nextInv = added.ok ? added.slots : inventory;
  return {
    queue: queue.slice(1),
    inventory: nextInv,
    completedRecipeId: recipe.id,
  };
}

export function getPinBlueprintIdForRecipe(
  recipeId: string,
): BlueprintId | null {
  const recipe = getRecipe(recipeId);
  if (!recipe) return null;
  return (recipe.pinBlueprintId ??
    recipe.blueprintId ??
    recipe.id) as BlueprintId;
}

export const FABRICATOR_STARTER_UNLOCK_IDS: BlueprintId[] = [
  ...new Set(
    RECIPES.map((r) => (r.blueprintId ?? r.id) as BlueprintId).filter(Boolean),
  ),
];
