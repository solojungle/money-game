import { useCallback } from "react";
import {
  INVENTORY_GRID_COLS,
  INVENTORY_GRID_ROWS,
  INVENTORY_SLOT_COUNT,
  type EquipmentSlotId,
  type EquipmentSlotState,
} from "../../../game/systems/inventory";
import { useGameStore } from "../../../store/gameStore";
import { ItemGrid } from "../shared/ItemGrid";
import { PanelTitle } from "../shared/PanelTitle";
import { ItemIconView } from "./ItemIconView";
import { ItemTooltip } from "./ItemTooltip";
import "./pda.css";

const EQUIPMENT_LAYOUT: {
  slot: EquipmentSlotId;
  label: string;
  className: string;
}[] = [
  { slot: "head", label: "Rebreather", className: "pda-equip__slot--head" },
  { slot: "tank", label: "Tank", className: "pda-equip__slot--tank" },
  { slot: "suit", label: "Suit", className: "pda-equip__slot--suit" },
  { slot: "gloves", label: "Gloves", className: "pda-equip__slot--gloves" },
  { slot: "fins", label: "Fins", className: "pda-equip__slot--fins" },
];

function EquipmentSlotView({
  state,
  label,
  className,
  slot,
}: {
  state: EquipmentSlotState;
  label: string;
  className: string;
  slot: EquipmentSlotId;
}) {
  const setPdaHover = useGameStore((s) => s.setPdaHover);
  const pdaHover = useGameStore((s) => s.pdaHover);
  const pdaPrimaryAction = useGameStore((s) => s.pdaPrimaryAction);
  const filled = state.kind === "filled";
  const locked = state.kind === "locked";
  const hovered = pdaHover?.source === "equip" && pdaHover.slot === slot;

  return (
    <button
      type="button"
      className={`pda-equip__slot ${className}${locked ? " pda-equip__slot--locked" : ""}${
        hovered ? " pda-equip__slot--hover" : ""
      }`}
      aria-label={label}
      disabled={locked}
      onMouseEnter={() => {
        if (filled) setPdaHover({ source: "equip", slot });
      }}
      onMouseLeave={() => setPdaHover(null)}
      onClick={() => {
        if (filled) {
          setPdaHover({ source: "equip", slot });
          pdaPrimaryAction({ source: "equip", slot });
        }
      }}
    >
      {locked && (
        <span className="pda-equip__lock" aria-hidden>
          🔒
        </span>
      )}
      {filled && <ItemIconView itemId={state.itemId} size="sm" />}
    </button>
  );
}

function PdaInventoryHotbar({ assignIndex }: { assignIndex: number }) {
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const setPdaHover = useGameStore((s) => s.setPdaHover);
  const pdaHover = useGameStore((s) => s.pdaHover);
  const pdaPrimaryAction = useGameStore((s) => s.pdaPrimaryAction);

  return (
    <div className="pda-hotbar" aria-label="Quick slots in PDA">
      {hotbarSlots.map((itemId, index) => {
        const hovered =
          pdaHover?.source === "hotbar" && pdaHover.index === index;
        const active = index === assignIndex;
        return (
          <button
            key={index}
            type="button"
            className={`pda-hotbar__slot${active ? " pda-hotbar__slot--active" : ""}${
              hovered ? " pda-hotbar__slot--hover" : ""
            }`}
            onMouseEnter={() => {
              if (itemId) setPdaHover({ source: "hotbar", index });
            }}
            onMouseLeave={() => setPdaHover(null)}
            onClick={() => {
              setPdaHover({ source: "hotbar", index });
              pdaPrimaryAction({ source: "hotbar", index });
            }}
          >
            <span className="pda-hotbar__num">{index + 1}</span>
            {itemId ? <ItemIconView itemId={itemId} size="sm" /> : null}
          </button>
        );
      })}
    </div>
  );
}

export function PdaTabInventory() {
  const inventory = useGameStore((s) => s.inventory);
  const equipment = useGameStore((s) => s.equipment);
  const pdaHover = useGameStore((s) => s.pdaHover);
  const pdaAssignHotbarIndex = useGameStore((s) => s.pdaAssignHotbarIndex);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const setPdaHover = useGameStore((s) => s.setPdaHover);
  const pdaPrimaryAction = useGameStore((s) => s.pdaPrimaryAction);

  const slots =
    inventory.length >= INVENTORY_SLOT_COUNT
      ? inventory
      : [
          ...inventory,
          ...Array<null>(INVENTORY_SLOT_COUNT - inventory.length).fill(null),
        ];

  const gridHoverIndex = pdaHover?.source === "grid" ? pdaHover.index : null;

  const onGridHover = useCallback(
    (index: number | null) => {
      setPdaHover(index === null ? null : { source: "grid", index });
    },
    [setPdaHover],
  );

  const onGridClick = useCallback(
    (index: number) => {
      setPdaHover({ source: "grid", index });
      if (slots[index]) {
        pdaPrimaryAction({ source: "grid", index });
      }
    },
    [slots, setPdaHover, pdaPrimaryAction],
  );

  const hoverItemId = (() => {
    if (!pdaHover) return undefined;
    if (pdaHover.source === "grid") return slots[pdaHover.index]?.itemId;
    if (pdaHover.source === "hotbar")
      return hotbarSlots[pdaHover.index] ?? undefined;
    if (pdaHover.source === "equip") {
      const worn = equipment[pdaHover.slot];
      return worn.kind === "filled" ? worn.itemId : undefined;
    }
    return undefined;
  })();

  return (
    <div className="pda-tab-inventory">
      <div className="pda-tab-inventory__panels">
        <div className="pda-tab-inventory__inventory">
          <ItemGrid
            title="INVENTORY"
            cols={INVENTORY_GRID_COLS}
            rows={INVENTORY_GRID_ROWS}
            slots={slots}
            showPlusMarkers
            bracketed
            hoveredIndex={gridHoverIndex}
            onCellClick={onGridClick}
            onCellHover={onGridHover}
          />
          {hoverItemId &&
          (pdaHover?.source === "grid" ||
            pdaHover?.source === "equip" ||
            pdaHover?.source === "hotbar") ? (
            <ItemTooltip
              itemId={hoverItemId}
              className="pda-tab-inventory__tooltip"
            />
          ) : null}
        </div>

        <div className="pda-panel pda-panel--equip">
          <PanelTitle title="EQUIPPED" />
          <div className="pda-panel__body pda-panel__body--equip">
            <div className="pda-equip__status" aria-hidden>
              <span className="pda-equip__status-icon pda-equip__status-icon--speed" />
              <span className="pda-equip__status-icon pda-equip__status-icon--boost" />
            </div>
            <div className="pda-equip__stage">
              <div className="pda-equip__grid-bg" aria-hidden />
              <div className="pda-equip__mannequin" aria-hidden>
                <span className="pda-equip__torso" />
                <span className="pda-equip__leg pda-equip__leg--l" />
                <span className="pda-equip__leg pda-equip__leg--r" />
                <span className="pda-equip__arm pda-equip__arm--l" />
                <span className="pda-equip__arm pda-equip__arm--r" />
              </div>
              {EQUIPMENT_LAYOUT.map(({ slot, label, className }) => (
                <EquipmentSlotView
                  key={slot}
                  slot={slot}
                  state={equipment[slot]}
                  label={label}
                  className={className}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <PdaInventoryHotbar assignIndex={pdaAssignHotbarIndex} />
    </div>
  );
}
