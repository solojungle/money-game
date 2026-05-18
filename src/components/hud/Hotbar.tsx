import { ITEM_CATALOG } from "../../game/systems/inventory";
import { itemIsOwned, useGameStore } from "../../store/gameStore";
import "./Hotbar.css";

const POWERED_TOOLS = new Set<string>([
  "scanner",
  "knife",
  "builder",
  "repair_tool",
  "welder",
]);

export function Hotbar() {
  const inventory = useGameStore((s) => s.inventory);
  const hotbarSlots = useGameStore((s) => s.hotbarSlots);
  const quickSlot = useGameStore((s) => s.quickSlot);

  return (
    <div className="hotbar" aria-label="Quick slots">
      {hotbarSlots.map((itemId, index) => {
        const active = index === quickSlot;
        const owned =
          itemId !== null && itemIsOwned(inventory, hotbarSlots, itemId);
        const def = itemId ? ITEM_CATALOG[itemId] : undefined;
        const initials = def
          ? def.displayName
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "";

        return (
          <div
            key={`slot-${index}`}
            className={`hotbar__slot${active ? " hotbar__slot--active" : ""}${
              !itemId || !owned ? " hotbar__slot--empty" : ""
            }`}
            aria-selected={active}
          >
            {active ? (
              <span className="hotbar__selector" aria-hidden>
                <span className="hotbar__selector-caret" />
              </span>
            ) : null}
            {itemId && owned && POWERED_TOOLS.has(itemId) && (
              <div className="hotbar__charge" aria-hidden>
                <div className="hotbar__charge-fill" />
              </div>
            )}
            <div
              className="hotbar__icon"
              style={
                def && owned
                  ? {
                      backgroundColor: `${def.color}33`,
                      borderColor: def.color,
                    }
                  : undefined
              }
            >
              {def && owned ? (
                <span className="hotbar__initials">{initials}</span>
              ) : null}
            </div>
            <span className="hotbar__slot-num" aria-hidden>
              {index + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}
