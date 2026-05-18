import type { InventorySlot } from "../../../game/systems/inventory";
import { ItemIconView } from "../pda/ItemIconView";
import { cellShowsPlusMarker } from "./gridPlus";
import { BracketFrame } from "./BracketFrame";
import { PanelTitle } from "./PanelTitle";
import "./item-grid.css";

type ItemGridProps = {
  title: string;
  cols: number;
  rows: number;
  slots: InventorySlot[];
  showPlusMarkers?: boolean;
  bracketed?: boolean;
  hoveredIndex?: number | null;
  selectedIndex?: number | null;
  onCellClick?: (index: number) => void;
  onCellHover?: (index: number | null) => void;
};

export function ItemGrid({
  title,
  cols,
  rows,
  slots,
  showPlusMarkers = false,
  bracketed = false,
  hoveredIndex = null,
  selectedIndex = null,
  onCellClick,
  onCellHover,
}: ItemGridProps) {
  const count = cols * rows;

  const grid = (
    <div
      className="item-grid"
      style={{ gridTemplateColumns: `repeat(${cols}, 4rem)` }}
    >
      {Array.from({ length: count }, (_, i) => {
        const stack = slots[i] ?? null;
        const hovered = hoveredIndex === i;
        const selected = selectedIndex === i;
        const plus = showPlusMarkers && cellShowsPlusMarker(i, cols, rows);
        return (
          <button
            key={i}
            type="button"
            className={`item-grid__cell${plus ? " item-grid__cell--plus" : ""}${hovered ? " item-grid__cell--hover item-grid__cell--hover-top" : ""}${
              selected ? " item-grid__cell--selected" : ""
            }`}
            aria-label={
              stack ? `${stack.itemId} ×${stack.count}` : "Empty slot"
            }
            onClick={() => onCellClick?.(i)}
            onMouseEnter={() => onCellHover?.(i)}
            onMouseLeave={() => onCellHover?.(null)}
          >
            {stack ? (
              <ItemIconView itemId={stack.itemId} count={stack.count} />
            ) : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <section className="item-grid-panel">
      <PanelTitle title={title} />
      {bracketed ? (
        <BracketFrame>{grid}</BracketFrame>
      ) : (
        <div className="item-grid-wrap">{grid}</div>
      )}
    </section>
  );
}
