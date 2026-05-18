import { describe, expect, it } from "vitest";
import { createEmptyInventory } from "../systems/inventory/items.catalog";
import { addItem, removeItem } from "../systems/inventory/stacks";
import {
  BUILDER_STARTER_UNLOCK_IDS,
  canAffordPiece,
  consumePieceIngredients,
  listBuilderPieces,
  refundPieceIngredients,
} from "./index";
import { countOwnedItem } from "../systems/inventory/inventoryActions";

describe("building index", () => {
  it("unlocks all builder pieces at start", () => {
    const pieces = listBuilderPieces();
    expect(BUILDER_STARTER_UNLOCK_IDS.length).toBe(pieces.length);
  });

  it("consumes and refunds ingredients", () => {
    let inv = createEmptyInventory();
    const added = addItem(inv, "titanium", 10);
    if (!added.ok) throw new Error("setup failed");
    inv = added.slots;
    const afford = canAffordPiece(inv, [], "piece_wall_locker", countOwnedItem);
    expect(afford.ok).toBe(true);
    const after = consumePieceIngredients(inv, "piece_wall_locker", removeItem);
    expect(after).not.toBeNull();
    const refunded = refundPieceIngredients(
      after!,
      "piece_wall_locker",
      addItem,
    );
    expect(countOwnedItem(refunded, [], "titanium")).toBe(10);
  });
});
