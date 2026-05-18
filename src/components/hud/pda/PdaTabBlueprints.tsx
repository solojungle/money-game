import blueprintData from "../../../game/progression/blueprints.json";
import { useGameStore } from "../../../store/gameStore";
import "./pda.css";

export function PdaTabBlueprints() {
  const unlocked = useGameStore((s) => s.unlockedBlueprintIds);
  const pinned = useGameStore((s) => s.pinnedBlueprintIds);
  const setPdaHover = useGameStore((s) => s.setPdaHover);
  const pdaSecondaryAction = useGameStore((s) => s.pdaSecondaryAction);

  const rows = blueprintData.filter((row) => unlocked.includes(row.id));

  return (
    <div className="pda-tab-list">
      <p className="pda-tab-list__hint">
        Right-click a blueprint to pin its recipe to the HUD tracker.
      </p>
      <ul className="pda-blueprints">
        {rows.map((row) => {
          const isPinned = pinned.includes(row.id);
          return (
            <li key={row.id}>
              <button
                type="button"
                className={`pda-blueprints__row${isPinned ? " pda-blueprints__row--pinned" : ""}`}
                onMouseEnter={() =>
                  setPdaHover({ source: "blueprint", blueprintId: row.id })
                }
                onMouseLeave={() => setPdaHover(null)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setPdaHover({ source: "blueprint", blueprintId: row.id });
                  pdaSecondaryAction({
                    source: "blueprint",
                    blueprintId: row.id,
                  });
                }}
              >
                <span className="pda-blueprints__name">{row.displayName}</span>
                {isPinned ? (
                  <span className="pda-blueprints__badge">PINNED</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      {rows.length === 0 ? (
        <p className="pda-tab-list__empty">No blueprints unlocked yet.</p>
      ) : null}
    </div>
  );
}
