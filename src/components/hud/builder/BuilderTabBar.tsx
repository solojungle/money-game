import { BUILDER_CATEGORIES } from "../../../game/building";
import type { BuilderCategory } from "../../../game/building";
import { useGameStore } from "../../../store/gameStore";
import "../pda/pda.css";

/** Short labels for the six-column tab strip (full name in `title`). */
const BUILDER_TAB_LABELS: Record<BuilderCategory, string> = {
  standard_elements: "STANDARD",
  interior_facilities: "INTERIOR",
  exterior_facilities: "EXTERIOR",
  utility: "UTILITY",
  furniture_decor: "DECOR",
  cultivation: "GROW",
};

export function BuilderTabBar() {
  const category = useGameStore((s) => s.builderCategory);
  const selectCategory = useGameStore((s) => s.selectBuilderCategory);
  const cycleCategory = useGameStore((s) => s.cycleBuilderCategory);

  return (
    <nav
      className="pda-tabs builder-tabs"
      aria-label="Build categories"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="pda-tabs__cycle"
        aria-label="Previous category"
        onClick={(e) => {
          e.stopPropagation();
          cycleCategory(-1);
        }}
      >
        LB
      </button>
      <ul className="pda-tabs__list builder-tabs__list">
        {BUILDER_CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <button
              type="button"
              className={`pda-tabs__tab${
                category === cat.id ? " pda-tabs__tab--active" : ""
              }`}
              title={cat.label}
              onClick={(e) => {
                e.stopPropagation();
                selectCategory(cat.id);
              }}
              aria-current={category === cat.id ? "page" : undefined}
            >
              {BUILDER_TAB_LABELS[cat.id]}
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="pda-tabs__cycle"
        aria-label="Next category"
        onClick={(e) => {
          e.stopPropagation();
          cycleCategory(1);
        }}
      >
        RB
      </button>
    </nav>
  );
}
