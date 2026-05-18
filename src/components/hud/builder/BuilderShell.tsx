import { useMemo, useState } from "react";
import {
  buildLocationLabel,
  getBuilderIngredientCounts,
  getPiece,
  groupPiecesBySubsection,
  listBuilderPieces,
} from "../../../game/building";
import { getItemDef } from "../../../game/systems/inventory";
import { countOwnedItem } from "../../../game/systems/inventory/inventoryActions";
import { useGameStore } from "../../../store/gameStore";
import { InputPrompt } from "../input/InputPrompt";
import { ItemIconView } from "../pda/ItemIconView";
import { StationFooter, StationFooterAction } from "../shared/StationFooter";
import { BuilderTabBar } from "./BuilderTabBar";
import "../shared/station-shell.css";
import "../fabricator/fabricator.css";
import "./builder.css";

export function BuilderShell() {
  const open = useGameStore((s) => s.builderOpen);
  const category = useGameStore((s) => s.builderCategory);
  const hoveredId = useGameStore((s) => s.builderHoveredPieceId);
  const selectedId = useGameStore((s) => s.builderSelectedPieceId);
  const inventory = useGameStore((s) => s.inventory);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const setBuilderOpen = useGameStore((s) => s.setBuilderOpen);
  const setHovered = useGameStore((s) => s.setBuilderHoveredPiece);
  const selectPiece = useGameStore((s) => s.builderSelectHovered);
  const pinHovered = useGameStore((s) => s.builderPinHovered);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const pieces = useMemo(() => {
    if (!category) return [];
    return listBuilderPieces({ category });
  }, [category]);

  const groups = useMemo(() => groupPiecesBySubsection(pieces), [pieces]);

  const hoveredPiece = hoveredId ? getPiece(hoveredId) : null;
  const ingredients = hoveredPiece
    ? getBuilderIngredientCounts(
        inventory,
        hotbarSlots,
        hoveredPiece,
        countOwnedItem,
      )
    : [];

  if (!open) return null;

  return (
    <div
      className="station-shell builder-shell"
      role="dialog"
      aria-modal="true"
      aria-label="Builder"
      onClick={() => setBuilderOpen(false)}
    >
      <div
        className="station-shell__chrome builder-shell__chrome"
        onClick={(e) => e.stopPropagation()}
      >
        <BuilderTabBar />

        <div className="station-shell__frame">
          <main className="station-shell__content builder-shell__main">
            {category ? (
              <div className="builder-shell__body">
                <div className="builder-recipes">
                  <div className="builder-recipes__panel">
                    {groups.map((g) => {
                      const key = `${category}-${g.subsection}`;
                      const isCollapsed = collapsed[key];
                      return (
                        <section key={key} className="builder-subsection">
                          <button
                            type="button"
                            className="builder-subsection__head"
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
                            <div className="builder-subsection__row">
                              {g.pieces.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  className={`builder-recipe-btn fabricator-recipe-btn${
                                    hoveredId === p.id
                                      ? " builder-recipe-btn--hover fabricator-recipe-btn--hover"
                                      : ""
                                  }${
                                    selectedId === p.id
                                      ? " builder-recipe-btn--selected"
                                      : ""
                                  }`}
                                  onMouseEnter={() => setHovered(p.id)}
                                  onFocus={() => setHovered(p.id)}
                                  onClick={() => selectPiece()}
                                  aria-label={p.displayName}
                                >
                                  <ItemIconView
                                    itemId={
                                      p.ingredients[0]?.itemId ?? "titanium"
                                    }
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
                  className={`fabricator-detail builder-detail${
                    hoveredPiece ? "" : " fabricator-detail--empty"
                  }`}
                  aria-live="polite"
                >
                  <div className="fabricator-detail__card builder-detail__card">
                    {hoveredPiece ? (
                      <>
                        <div className="fabricator-detail__intro">
                          <h2 className="builder-detail__name">
                            {hoveredPiece.displayName}
                          </h2>
                          <p className="builder-detail__desc">
                            {hoveredPiece.description}
                          </p>
                          <p className="builder-detail__location">
                            {buildLocationLabel(hoveredPiece.buildLocation)}
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
                              <div key={ing.itemId} className="fabricator-ing">
                                <span className="fabricator-ing__icon">
                                  <ItemIconView itemId={ing.itemId} size="md" />
                                </span>
                                <span
                                  className={`fabricator-ing__frac${
                                    short ? " builder-ing__frac--short" : ""
                                  }`}
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
                        <div className="builder-detail__actions">
                          <button
                            type="button"
                            className="builder-detail__action"
                            onClick={() => selectPiece()}
                          >
                            <span className="station-footer__label">
                              SELECT
                            </span>
                            <InputPrompt
                              binding="useLeft"
                              className="station-footer__key"
                            />
                          </button>
                          <button
                            type="button"
                            className="builder-detail__action"
                            onClick={() => pinHovered()}
                          >
                            <span className="station-footer__label">
                              PIN RECIPE
                            </span>
                            <InputPrompt
                              binding="builderPin"
                              className="station-footer__key"
                            />
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="fabricator-detail__placeholder">
                        Select a piece to view details
                      </p>
                    )}
                  </div>
                </aside>
              </div>
            ) : null}
          </main>

          <StationFooter>
            <StationFooterAction label="CLOSE" binding="stationClose" />
            <StationFooterAction label="SELECT" binding="useLeft" />
            <StationFooterAction label="PIN RECIPE" binding="builderPin" />
          </StationFooter>
        </div>
      </div>
    </div>
  );
}
