import { getIngredientCounts, getRecipe } from "../../../game/systems/crafting";
import { getItemDef } from "../../../game/systems/inventory";
import { useGameStore } from "../../../store/gameStore";
import "./pda.css";

export function PinnedRecipesRow() {
  const pinned = useGameStore((s) => s.pinnedBlueprintIds);
  const inventory = useGameStore((s) => s.inventory);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const unpinAll = useGameStore((s) => s.unpinAllBlueprints);
  const maxPins = 8;

  if (pinned.length === 0) return null;

  return (
    <div className="pda-pinned" aria-label="Pinned recipes">
      <button type="button" className="pda-pinned__unpin" onClick={unpinAll}>
        UNPIN ALL
      </button>
      <span className="pda-pinned__count">
        {pinned.length}/{maxPins}
      </span>
      <ul className="pda-pinned__slots">
        {pinned.map((id) => {
          const recipe = getRecipe(id);
          const name = recipe?.displayName ?? id;
          const primaryIng = recipe?.ingredients[0];
          const materialId = primaryIng?.itemId ?? "titanium";
          const need = primaryIng?.count ?? 1;
          const def = getItemDef(materialId);
          const owned = recipe
            ? (getIngredientCounts(inventory, hotbarSlots, recipe).find(
                (i) => i.itemId === materialId,
              )?.have ?? 0)
            : inventory.reduce(
                (n, s) => n + (s?.itemId === materialId ? s.count : 0),
                0,
              );
          return (
            <li key={id} className="pda-pinned__slot">
              <span
                className="pda-pinned__icon"
                style={{ borderColor: def?.color ?? "#94a3b8" }}
                aria-hidden
              />
              <span className="pda-pinned__frac">
                <span className={owned < need ? "pda-pinned__short" : ""}>
                  {owned}/{need}
                </span>
              </span>
              <span className="pda-pinned__label">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
