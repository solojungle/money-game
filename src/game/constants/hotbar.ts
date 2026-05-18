/** SN2 quick-slot count (1–5). */
export const HOTBAR_SLOT_COUNT = 5;

export const DEFAULT_HOTBAR_TOOL_IDS = [
  "scanner",
  "knife",
  "builder",
  "repair_tool",
  "welder",
] as const;

export function createEmptyHotbarSlots(): (string | null)[] {
  return Array.from({ length: HOTBAR_SLOT_COUNT }, () => null);
}

/** Play start — Survival Multitool + Habitat Builder. */
export function createStarterHotbarSlots(): (string | null)[] {
  const slots = createEmptyHotbarSlots();
  slots[0] = "knife";
  slots[1] = "builder";
  return slots;
}

/** Dev default — pre-assigns starter tools. */
export function createDefaultHotbarSlots(): (string | null)[] {
  const slots = createEmptyHotbarSlots();
  DEFAULT_HOTBAR_TOOL_IDS.forEach((itemId, index) => {
    if (index < slots.length) slots[index] = itemId;
  });
  return slots;
}
