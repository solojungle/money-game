import type { CSSProperties } from "react";
import { getItemDef } from "../../../game/systems/inventory";
import "./pda.css";

type ItemIconViewProps = {
  itemId: string;
  count?: number;
  size?: "sm" | "md";
};

export function ItemIconView({
  itemId,
  count = 1,
  size = "md",
}: ItemIconViewProps) {
  const def = getItemDef(itemId);
  const color = def?.color ?? "#a78bfa";
  const initials = def
    ? def.displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <span
      className={`pda-item-icon pda-item-icon--${size}`}
      style={{ "--item-color": color } as CSSProperties}
    >
      <span className="pda-item-icon__gem" aria-hidden />
      <span className="pda-item-icon__initials" aria-hidden>
        {initials}
      </span>
      {count > 1 ? <span className="pda-item-icon__count">{count}</span> : null}
    </span>
  );
}
