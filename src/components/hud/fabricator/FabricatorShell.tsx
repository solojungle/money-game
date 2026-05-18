import { useMemo, useState } from "react";
import type { FabricatorCategory } from "../../../game/crafting/types";
import { FABRICATOR_CATEGORIES } from "../../../game/crafting/types";
import {
  getIngredientCounts,
  getRecipe,
  groupRecipesBySubsection,
  listFabricatorRecipes,
  recipeDurationMs,
} from "../../../game/systems/crafting";
import { getItemDef } from "../../../game/systems/inventory";
import { useGameStore } from "../../../store/gameStore";
import { InputPrompt } from "../input/InputPrompt";
import { ItemIconView } from "../pda/ItemIconView";
import { StationFooter, StationFooterAction } from "../shared/StationFooter";
import "../shared/station-shell.css";
import "./fabricator.css";

export function FabricatorShell() {
  const open = useGameStore((s) => s.fabricatorOpen);
  const view = useGameStore((s) => s.fabricatorView);
  const category = useGameStore((s) => s.fabricatorCategory);
  const hoveredId = useGameStore((s) => s.fabricatorHoveredRecipeId);
  const craftQueue = useGameStore((s) => s.craftQueue);
  const inventory = useGameStore((s) => s.inventory);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const unlocked = useGameStore((s) => s.unlockedBlueprintIds);
  const setFabricatorOpen = useGameStore((s) => s.setFabricatorOpen);
  const selectCategory = useGameStore((s) => s.selectFabricatorCategory);
  const setHovered = useGameStore((s) => s.setFabricatorHoveredRecipe);
  const enqueueCraft = useGameStore((s) => s.fabricatorEnqueueCraft);
  const pinHovered = useGameStore((s) => s.fabricatorPinHovered);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const recipes = useMemo(() => {
    if (!category) return [];
    return listFabricatorRecipes({
      tier: "lifepod",
      category,
      unlockedIds: unlocked,
    });
  }, [category, unlocked]);

  const groups = useMemo(() => groupRecipesBySubsection(recipes), [recipes]);

  const hoveredRecipe = hoveredId ? getRecipe(hoveredId) : null;
  const ingredients = hoveredRecipe
    ? getIngredientCounts(inventory, hotbarSlots, hoveredRecipe)
    : [];

  const queueLen = craftQueue.length;
  const active = craftQueue[0];
  const activeRecipe = active ? getRecipe(active.recipeId) : null;
  const progress =
    active && activeRecipe
      ? Math.min(1, active.progressMs / recipeDurationMs(activeRecipe))
      : 0;
  const queueLabel = queueLen > 0 ? `1/${queueLen}` : "";

  if (!open) return null;

  return (
    <div
      className="station-shell fabricator-shell"
      role="dialog"
      aria-modal="true"
      aria-label="Fabricator"
      onClick={() => setFabricatorOpen(false)}
    >
      <div
        className="station-shell__chrome fabricator-shell__chrome"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="station-shell__header fabricator-shell__header">
          <h1 className="station-shell__title">FABRICATOR</h1>
          <p className="station-shell__subtitle">IMPROVED VER. 3.6</p>
        </header>

        <div className="station-shell__frame">
          <main className="station-shell__content fabricator-shell__main">
            <div className="fabricator-shell__body">
              <nav className="fabricator-categories" aria-label="Categories">
                {FABRICATOR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`fabricator-categories__btn${
                      category === cat.id
                        ? " fabricator-categories__btn--active"
                        : ""
                    }`}
                    onClick={() => selectCategory(cat.id as FabricatorCategory)}
                    aria-pressed={category === cat.id}
                  >
                    {cat.label.slice(0, 3)}
                    <span className="fabricator-categories__tip">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </nav>

              {view === "browse" && category ? (
                <div className="fabricator-browse">
                  <div className="fabricator-recipes">
                    <div className="fabricator-recipes__panel">
                      {groups.map((g) => {
                        const key = `${category}-${g.subsection}`;
                        const isCollapsed = collapsed[key];
                        return (
                          <section key={key} className="fabricator-subsection">
                            <button
                              type="button"
                              className="fabricator-subsection__head"
                              onClick={() =>
                                setCollapsed((c) => ({
                                  ...c,
                                  [key]: !c[key],
                                }))
                              }
                            >
                              <span>
                                {g.subsection.replace(/_/g, " ").toUpperCase()}
                              </span>
                              <span aria-hidden>{isCollapsed ? "+" : "−"}</span>
                            </button>
                            {!isCollapsed ? (
                              <div className="fabricator-subsection__row">
                                {g.recipes.map((r) => (
                                  <button
                                    key={r.id}
                                    type="button"
                                    className={`fabricator-recipe-btn${
                                      hoveredId === r.id
                                        ? " fabricator-recipe-btn--hover"
                                        : ""
                                    }`}
                                    onMouseEnter={() => setHovered(r.id)}
                                    onFocus={() => setHovered(r.id)}
                                    aria-label={r.displayName}
                                  >
                                    <ItemIconView
                                      itemId={r.output.itemId}
                                      size="md"
                                    />
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </section>
                        );
                      })}
                    </div>
                  </div>

                  <aside
                    className={`fabricator-detail${
                      hoveredRecipe ? "" : " fabricator-detail--empty"
                    }`}
                    aria-live="polite"
                  >
                    <div className="fabricator-detail__card">
                      {hoveredRecipe ? (
                        <>
                          <div className="fabricator-detail__intro">
                            <h2 className="fabricator-detail__name">
                              {hoveredRecipe.displayName}
                            </h2>
                            <p className="fabricator-detail__desc">
                              {hoveredRecipe.description}
                            </p>
                          </div>
                          <p className="fabricator-detail__ing-title">
                            INGREDIENTS
                          </p>
                          <div className="fabricator-detail__ings">
                            {ingredients.map((ing) => {
                              const def = getItemDef(ing.itemId);
                              const short = ing.have < ing.need;
                              return (
                                <div
                                  key={ing.itemId}
                                  className="fabricator-ing"
                                >
                                  <span className="fabricator-ing__icon">
                                    <ItemIconView
                                      itemId={ing.itemId}
                                      size="md"
                                    />
                                  </span>
                                  <span
                                    className={`fabricator-ing__frac${short ? " fabricator-ing__frac--short" : ""}`}
                                  >
                                    {ing.have}/{ing.need}
                                  </span>
                                  <span className="fabricator-ing__label">
                                    {(
                                      def?.displayName ?? ing.itemId
                                    ).toUpperCase()}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="fabricator-detail__actions">
                            <button
                              type="button"
                              className="fabricator-detail__action"
                              onClick={() => enqueueCraft()}
                            >
                              <span className="station-footer__label">
                                CRAFT
                              </span>
                              <InputPrompt
                                binding="fabricatorCraft"
                                className="station-footer__key"
                              />
                            </button>
                            <button
                              type="button"
                              className="fabricator-detail__action"
                              onClick={() => pinHovered()}
                            >
                              <span className="station-footer__label">
                                PIN RECIPE
                              </span>
                              <InputPrompt
                                binding="fabricatorPin"
                                className="station-footer__key"
                              />
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="fabricator-detail__placeholder">
                          Select a recipe to view details
                        </p>
                      )}
                    </div>
                  </aside>
                </div>
              ) : null}
            </div>

            {queueLen > 0 ? (
              <div className="fabricator-queue" aria-label="Craft queue">
                <span
                  className="fabricator-queue__fill"
                  style={{ width: `${progress * 100}%` }}
                />
                <span className="fabricator-queue__label">{queueLabel}</span>
              </div>
            ) : null}
          </main>

          <StationFooter>
            <StationFooterAction
              label="CLOSE"
              binding="stationClose"
              onClick={() => setFabricatorOpen(false)}
            />
          </StationFooter>
        </div>
      </div>
    </div>
  );
}
