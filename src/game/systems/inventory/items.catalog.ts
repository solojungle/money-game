export type ItemActionKind = "equip" | "assignHotbar" | "drop" | "consume";

export type ItemDef = {
  id: string;
  displayName: string;
  maxStack: number;
  /** Placeholder icon tint for UI */
  color: string;
  category: "raw" | "crafted" | "equipment" | "tool";
  description?: string;
  equipmentSlot?: EquipmentSlotId;
  actions?: ItemActionKind[];
  food?: number;
  water?: number;
  health?: number;
  battery?: number;
};

export const ITEM_CATALOG: Record<string, ItemDef> = {
  titanium: {
    id: "titanium",
    displayName: "Titanium",
    maxStack: 48,
    color: "#94a3b8",
    category: "raw",
  },
  copper: {
    id: "copper",
    displayName: "Copper Ore",
    maxStack: 48,
    color: "#b45309",
    category: "raw",
  },
  silver: {
    id: "silver",
    displayName: "Silver Ore",
    maxStack: 48,
    color: "#cbd5e1",
    category: "raw",
  },
  gold: {
    id: "gold",
    displayName: "Gold",
    maxStack: 48,
    color: "#fbbf24",
    category: "raw",
  },
  diamond: {
    id: "diamond",
    displayName: "Diamond",
    maxStack: 48,
    color: "#a78bfa",
    category: "raw",
  },
  quartz: {
    id: "quartz",
    displayName: "Quartz",
    maxStack: 48,
    color: "#e2e8f0",
    category: "raw",
  },
  limestone: {
    id: "limestone",
    displayName: "Limestone",
    maxStack: 48,
    color: "#d6d3d1",
    category: "raw",
  },
  sandstone: {
    id: "sandstone",
    displayName: "Sandstone",
    maxStack: 48,
    color: "#fcd34d",
    category: "raw",
  },
  shale: {
    id: "shale",
    displayName: "Shale",
    maxStack: 48,
    color: "#78716c",
    category: "raw",
  },
  ruby: {
    id: "ruby",
    displayName: "Ruby",
    maxStack: 48,
    color: "#ef4444",
    category: "raw",
  },
  nickel: {
    id: "nickel",
    displayName: "Nickel Ore",
    maxStack: 48,
    color: "#86efac",
    category: "raw",
  },
  lead: {
    id: "lead",
    displayName: "Lead",
    maxStack: 48,
    color: "#64748b",
    category: "raw",
  },
  lithium: {
    id: "lithium",
    displayName: "Lithium",
    maxStack: 48,
    color: "#67e8f9",
    category: "raw",
  },
  magnetite: {
    id: "magnetite",
    displayName: "Magnetite",
    maxStack: 48,
    color: "#1e293b",
    category: "raw",
  },
  uraninite: {
    id: "uraninite",
    displayName: "Uraninite",
    maxStack: 48,
    color: "#84cc16",
    category: "raw",
  },
  table_coral: {
    id: "table_coral",
    displayName: "Table Coral Sample",
    maxStack: 48,
    color: "#f472b6",
    category: "raw",
  },
  creepvine: {
    id: "creepvine",
    displayName: "Creepvine",
    maxStack: 48,
    color: "#65a30d",
    category: "raw",
  },
  fiber_mesh: {
    id: "fiber_mesh",
    displayName: "Fiber Mesh",
    maxStack: 48,
    color: "#86efac",
    category: "crafted",
  },
  silicone: {
    id: "silicone",
    displayName: "Silicone Rubber",
    maxStack: 48,
    color: "#f8fafc",
    category: "crafted",
  },
  glass: {
    id: "glass",
    displayName: "Glass",
    maxStack: 48,
    color: "#7dd3fc",
    category: "crafted",
  },
  lubricant: {
    id: "lubricant",
    displayName: "Lubricant",
    maxStack: 48,
    color: "#fde047",
    category: "crafted",
  },
  battery: {
    id: "battery",
    displayName: "Battery",
    maxStack: 48,
    color: "#22c55e",
    category: "crafted",
  },
  wiring: {
    id: "wiring",
    displayName: "Wiring Kit",
    maxStack: 48,
    color: "#f97316",
    category: "crafted",
  },
  computer_chip: {
    id: "computer_chip",
    displayName: "Computer Chip",
    maxStack: 48,
    color: "#38bdf8",
    category: "crafted",
  },
  advanced_wiring: {
    id: "advanced_wiring",
    displayName: "Advanced Wiring Kit",
    maxStack: 48,
    color: "#fb923c",
    category: "crafted",
  },
  plasteel: {
    id: "plasteel",
    displayName: "Plasteel Ingot",
    maxStack: 48,
    color: "#818cf8",
    category: "crafted",
  },
  titanium_ingot: {
    id: "titanium_ingot",
    displayName: "Titanium Ingot",
    maxStack: 48,
    color: "#cbd5e1",
    category: "crafted",
  },
  copper_wire: {
    id: "copper_wire",
    displayName: "Copper Wire",
    maxStack: 48,
    color: "#ea580c",
    category: "crafted",
  },
  power_cell: {
    id: "power_cell",
    displayName: "Power Cell",
    maxStack: 48,
    color: "#4ade80",
    category: "crafted",
  },
  reactor_rod: {
    id: "reactor_rod",
    displayName: "Reactor Rod",
    maxStack: 48,
    color: "#a3e635",
    category: "crafted",
  },
  water: {
    id: "water",
    displayName: "Filtered Water",
    maxStack: 48,
    color: "#60a5fa",
    category: "crafted",
    water: 15,
    actions: ["consume", "drop"],
  },
  cured_fish: {
    id: "cured_fish",
    displayName: "Cured Fish",
    maxStack: 48,
    color: "#fca5a5",
    category: "crafted",
  },
  lubricant_gel: {
    id: "lubricant_gel",
    displayName: "Aerogel",
    maxStack: 48,
    color: "#e0f2fe",
    category: "crafted",
  },
  polyaniline: {
    id: "polyaniline",
    displayName: "Polyaniline",
    maxStack: 48,
    color: "#c084fc",
    category: "crafted",
  },
  hydrochloric_acid: {
    id: "hydrochloric_acid",
    displayName: "Hydrochloric Acid",
    maxStack: 48,
    color: "#bef264",
    category: "crafted",
  },
  benzene: {
    id: "benzene",
    displayName: "Benzene",
    maxStack: 48,
    color: "#fef08a",
    category: "crafted",
  },
  enamel: {
    id: "enamel",
    displayName: "Enameled Glass",
    maxStack: 48,
    color: "#bae6fd",
    category: "crafted",
  },
  fiber_bandage: {
    id: "fiber_bandage",
    displayName: "Fiber Bandage",
    maxStack: 48,
    color: "#fda4af",
    category: "crafted",
  },
  scanner: {
    id: "scanner",
    displayName: "Hand Scanner",
    maxStack: 1,
    color: "#22d3ee",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  knife: {
    id: "knife",
    displayName: "Survival Multitool",
    maxStack: 1,
    color: "#94a3b8",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  sonic_resonator: {
    id: "sonic_resonator",
    displayName: "Sonic Resonator",
    maxStack: 1,
    color: "#a78bfa",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  builder: {
    id: "builder",
    displayName: "Builder Tool",
    maxStack: 1,
    color: "#fbbf24",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  repair_tool: {
    id: "repair_tool",
    displayName: "Repair Tool",
    maxStack: 1,
    color: "#f97316",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  welder: {
    id: "welder",
    displayName: "Welder",
    maxStack: 1,
    color: "#fb7185",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  seaglide: {
    id: "seaglide",
    displayName: "Seaglide",
    maxStack: 1,
    color: "#38bdf8",
    category: "tool",
    actions: ["assignHotbar", "drop"],
  },
  rebreather: {
    id: "rebreather",
    displayName: "Rebreather",
    maxStack: 1,
    color: "#2dd4bf",
    category: "equipment",
    equipmentSlot: "head",
    actions: ["equip", "drop"],
  },
  fins: {
    id: "fins",
    displayName: "Fins",
    maxStack: 1,
    color: "#facc15",
    category: "equipment",
    equipmentSlot: "fins",
    actions: ["equip", "drop"],
  },
  tank: {
    id: "tank",
    displayName: "O₂ Tank",
    maxStack: 1,
    color: "#60a5fa",
    category: "equipment",
    equipmentSlot: "tank",
    actions: ["equip", "drop"],
  },
  mask: {
    id: "mask",
    displayName: "Rebreather Mask",
    maxStack: 1,
    color: "#fef9c3",
    category: "equipment",
    equipmentSlot: "head",
    actions: ["equip", "drop"],
  },
  reinforced_suit: {
    id: "reinforced_suit",
    displayName: "Reinforced Suit",
    maxStack: 1,
    color: "#26a69a",
    category: "equipment",
    equipmentSlot: "suit",
    actions: ["equip", "drop"],
  },
  gloves: {
    id: "gloves",
    displayName: "Insulated Gloves",
    maxStack: 1,
    color: "#f57c00",
    category: "equipment",
    equipmentSlot: "gloves",
    actions: ["equip", "drop"],
  },
};

export const INVENTORY_GRID_COLS = 5;
export const INVENTORY_GRID_ROWS = 5;
export const INVENTORY_SLOT_COUNT = INVENTORY_GRID_COLS * INVENTORY_GRID_ROWS;

export type ItemStack = {
  itemId: string;
  count: number;
};

export type InventorySlot = ItemStack | null;

export type EquipmentSlotId = "head" | "tank" | "suit" | "gloves" | "fins";

export type EquipmentSlotState =
  | { kind: "empty" }
  | { kind: "filled"; itemId: string }
  | { kind: "locked" };

export type EquipmentState = Record<EquipmentSlotId, EquipmentSlotState>;

export function getItemDef(id: string): ItemDef | undefined {
  return ITEM_CATALOG[id];
}

export function createEmptyInventory(): InventorySlot[] {
  return Array.from({ length: INVENTORY_SLOT_COUNT }, () => null);
}

const KITCHEN_SINK_FILL: ItemStack[] = [
  { itemId: "titanium", count: 24 },
  { itemId: "copper", count: 18 },
  { itemId: "silver", count: 12 },
  { itemId: "gold", count: 8 },
  { itemId: "diamond", count: 6 },
  { itemId: "quartz", count: 20 },
  { itemId: "limestone", count: 30 },
  { itemId: "sandstone", count: 16 },
  { itemId: "shale", count: 14 },
  { itemId: "ruby", count: 4 },
  { itemId: "nickel", count: 10 },
  { itemId: "lead", count: 9 },
  { itemId: "lithium", count: 7 },
  { itemId: "magnetite", count: 5 },
  { itemId: "fiber_mesh", count: 12 },
  { itemId: "silicone", count: 8 },
  { itemId: "glass", count: 15 },
  { itemId: "battery", count: 6 },
  { itemId: "wiring", count: 10 },
  { itemId: "computer_chip", count: 4 },
  { itemId: "advanced_wiring", count: 3 },
  { itemId: "plasteel", count: 6 },
  { itemId: "titanium_ingot", count: 8 },
  { itemId: "power_cell", count: 4 },
  { itemId: "water", count: 6 },
  { itemId: "scanner", count: 1 },
  { itemId: "knife", count: 1 },
  { itemId: "builder", count: 1 },
  { itemId: "repair_tool", count: 1 },
  { itemId: "welder", count: 1 },
  { itemId: "sonic_resonator", count: 1 },
];

/** Dev / QA stress grid — not used for normal play spawn. */
export function createKitchenSinkInventory(): InventorySlot[] {
  const slots = createEmptyInventory();
  KITCHEN_SINK_FILL.forEach((stack, i) => {
    if (i < slots.length) slots[i] = stack;
  });
  return slots;
}

/** @deprecated Use createEmptyInventory for play; kitchen sink is dev-only. */
export function createPlayInventory(): InventorySlot[] {
  return createEmptyInventory();
}

export function createPlayEquipment(): EquipmentState {
  return {
    head: { kind: "empty" },
    tank: { kind: "empty" },
    suit: { kind: "locked" },
    gloves: { kind: "locked" },
    fins: { kind: "empty" },
  };
}

export const PLAY_STARTER_BLUEPRINT_IDS = [
  "seaglide",
  "interior_wall",
  "standard_oxygen_tank",
] as const;
