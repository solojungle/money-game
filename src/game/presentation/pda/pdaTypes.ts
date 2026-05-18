import type { EquipmentSlotId } from "../../systems/inventory";

export type PdaTabId =
  | "inventory"
  | "blueprints"
  | "signals"
  | "logs"
  | "databank"
  | "adaptations";

export const PDA_TABS: { id: PdaTabId; label: string }[] = [
  { id: "inventory", label: "INVENTORY" },
  { id: "blueprints", label: "BLUEPRINTS" },
  { id: "signals", label: "SIGNALS" },
  { id: "logs", label: "LOGS" },
  { id: "databank", label: "DATABANK" },
  { id: "adaptations", label: "ADAPTATIONS" },
];

export type PdaHoverTarget =
  | { source: "grid"; index: number }
  | { source: "equip"; slot: EquipmentSlotId }
  | { source: "hotbar"; index: number }
  | { source: "blueprint"; blueprintId: string };

export type PdaSelection = PdaHoverTarget;
