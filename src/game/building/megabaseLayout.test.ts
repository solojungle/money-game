import { describe, expect, it } from "vitest";
import recipeData from "./recipes.builder.json";
import { createMegabasePlacedPieces } from "./megabaseLayout";
import type { BuilderPieceRecipe } from "./types";

describe("createMegabasePlacedPieces", () => {
  it("places every builder recipe exactly once", () => {
    const pieces = createMegabasePlacedPieces();
    const recipeIds = (recipeData as BuilderPieceRecipe[]).map((p) => p.id);
    const placedIds = pieces.map((p) => p.pieceId);
    const placedSet = new Set(placedIds);

    for (const id of recipeIds) {
      expect(placedSet.has(id), `missing ${id}`).toBe(true);
    }
    expect(placedSet.size).toBe(recipeIds.length);
    expect(placedIds.length).toBeGreaterThanOrEqual(recipeIds.length);
  });
});
