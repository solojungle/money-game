import type { ControlBinding } from "../../../controls/inputPromptTypes";
import {
  getItemActions,
  getItemDef,
  getItemDescription,
  type ItemAction,
} from "../../systems/inventory";

export type TooltipActionRow = {
  action: ItemAction;
  label: string;
  bindings: ControlBinding[];
};

const ACTION_LABELS: Record<ItemAction, string> = {
  equip: "Equip",
  assignHotbar: "Assign to quick slot",
  drop: "Drop",
  consume: "Consume",
};

const ACTION_BINDINGS: Record<ItemAction, ControlBinding[]> = {
  equip: ["useLeft"],
  assignHotbar: ["useLeft", "slot1"],
  drop: ["useRight"],
  consume: ["useLeft"],
};

export function resolveItemTooltipActions(itemId: string): TooltipActionRow[] {
  const def = getItemDef(itemId);
  if (!def) return [];
  return getItemActions(def).map((action) => ({
    action,
    label: ACTION_LABELS[action],
    bindings: ACTION_BINDINGS[action],
  }));
}

export function resolveItemTooltip(itemId: string) {
  const def = getItemDef(itemId);
  if (!def) return null;
  return {
    displayName: def.displayName,
    description: getItemDescription(def),
    food: def.food,
    water: def.water,
    battery: def.battery,
    health: def.health,
    actions: resolveItemTooltipActions(itemId),
  };
}
