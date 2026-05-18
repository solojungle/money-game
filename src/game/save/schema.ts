import { z } from "zod";

const GameModeSchema = z.enum(["play"]);

const EquipmentSlotStateSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("empty") }),
  z.object({ kind: z.literal("locked") }),
  z.object({ kind: z.literal("filled"), itemId: z.string() }),
]);

const ItemStackSchema = z.object({
  itemId: z.string(),
  count: z.number().int().positive(),
});

/** Legacy v1 — migrated to v2 play snapshot. */
export const SaveSchemaV1 = z.object({
  version: z.literal(1),
  timeOfNight: z.number().min(0).max(1).optional(),
  treatCount: z.number().int().min(0).optional(),
  flags: z.record(z.string(), z.unknown()).optional(),
  activeCharacter: z.string().optional(),
});

export type SaveSnapshotV1 = z.infer<typeof SaveSchemaV1>;

export const SaveSchemaV2 = z.object({
  version: z.literal(2),
  gameMode: GameModeSchema,
  teamTech: z.array(z.string()),
  inventory: z.array(ItemStackSchema.nullable()),
  o2Percent: z.number().min(0).max(100).optional(),
  healthPercent: z.number().min(0).max(100).optional(),
  flashlightOn: z.boolean().optional(),
});

export type SaveSnapshotV2 = z.infer<typeof SaveSchemaV2>;

export const SaveSchemaV3 = z.object({
  version: z.literal(3),
  gameMode: GameModeSchema,
  teamTech: z.array(z.string()),
  inventory: z.array(ItemStackSchema.nullable()),
  equipment: z.object({
    head: EquipmentSlotStateSchema,
    tank: EquipmentSlotStateSchema,
    suit: EquipmentSlotStateSchema,
    gloves: EquipmentSlotStateSchema,
    fins: EquipmentSlotStateSchema,
  }),
  hotbarSlots: z.array(z.string().nullable()),
  quickSlot: z.number().int().min(0),
  pinnedBlueprintIds: z.array(z.string()),
  pdaTab: z
    .enum([
      "inventory",
      "blueprints",
      "signals",
      "logs",
      "databank",
      "adaptations",
    ])
    .optional(),
  o2Percent: z.number().min(0).max(100).optional(),
  healthPercent: z.number().min(0).max(100).optional(),
  hungerPercent: z.number().min(0).max(100).optional(),
  thirstPercent: z.number().min(0).max(100).optional(),
  flashlightOn: z.boolean().optional(),
});

export type SaveSnapshotV3 = z.infer<typeof SaveSchemaV3>;

export const SaveSchemaV4 = SaveSchemaV3.omit({ version: true }).extend({
  version: z.literal(4),
  containers: z.record(z.string(), z.array(ItemStackSchema.nullable())),
});

export type SaveSnapshotV4 = z.infer<typeof SaveSchemaV4>;

export type SaveSnapshot =
  | SaveSnapshotV1
  | SaveSnapshotV2
  | SaveSnapshotV3
  | SaveSnapshotV4;

export function parseSaveV1(json: unknown): SaveSnapshotV1 | null {
  const r = SaveSchemaV1.safeParse(json);
  return r.success ? r.data : null;
}

export function parseSaveV2(json: unknown): SaveSnapshotV2 | null {
  const r = SaveSchemaV2.safeParse(json);
  return r.success ? r.data : null;
}

export function parseSaveV3(json: unknown): SaveSnapshotV3 | null {
  const r = SaveSchemaV3.safeParse(json);
  return r.success ? r.data : null;
}

export function parseSaveV4(json: unknown): SaveSnapshotV4 | null {
  const r = SaveSchemaV4.safeParse(json);
  return r.success ? r.data : null;
}

const LegacyModeSchema = z.enum([
  "play",
  "halloween",
  "underwater",
  "kitchen_sink",
]);

const LegacySaveSchemaV2 = z.object({
  version: z.literal(2),
  gameMode: LegacyModeSchema,
  teamTech: z.array(z.string()).optional(),
  inventory: z.array(ItemStackSchema.nullable()).optional(),
  o2Percent: z.number().min(0).max(100).optional(),
  healthPercent: z.number().min(0).max(100).optional(),
  flashlightOn: z.boolean().optional(),
});

export function migrateV2ToV3(v2: SaveSnapshotV2): SaveSnapshotV3 {
  return {
    version: 3,
    gameMode: "play",
    teamTech: v2.teamTech,
    inventory: v2.inventory,
    equipment: {
      head: { kind: "empty" },
      tank: { kind: "empty" },
      suit: { kind: "locked" },
      gloves: { kind: "locked" },
      fins: { kind: "empty" },
    },
    hotbarSlots: Array.from({ length: 5 }, () => null),
    quickSlot: 0,
    pinnedBlueprintIds: [],
    o2Percent: v2.o2Percent,
    healthPercent: v2.healthPercent,
    flashlightOn: v2.flashlightOn,
  };
}

export function migrateV3ToV4(v3: SaveSnapshotV3): SaveSnapshotV4 {
  return {
    ...v3,
    version: 4,
    containers: {},
  };
}

export function parseSave(json: unknown): SaveSnapshot | null {
  if (typeof json !== "object" || json === null) return null;
  const version = (json as { version?: number }).version;
  if (version === 4) return parseSaveV4(json);
  if (version === 3) return parseSaveV3(json);
  if (version === 2) {
    const legacy = LegacySaveSchemaV2.safeParse(json);
    if (legacy.success) {
      return {
        version: 2,
        gameMode: "play",
        teamTech: legacy.data.teamTech ?? [],
        inventory: legacy.data.inventory ?? [],
        o2Percent: legacy.data.o2Percent,
        healthPercent: legacy.data.healthPercent,
        flashlightOn: legacy.data.flashlightOn,
      };
    }
    return parseSaveV2(json);
  }
  if (version === 1) return parseSaveV1(json);
  return null;
}

export function migrateV1ToV2(): SaveSnapshotV2 {
  return {
    version: 2,
    gameMode: "play",
    teamTech: [],
    inventory: [],
  };
}

export function normalizeSave(json: unknown): SaveSnapshotV4 | null {
  const parsed = parseSave(json);
  if (!parsed) return null;
  if (parsed.version === 4) return parsed;
  if (parsed.version === 3) return migrateV3ToV4(parsed);
  if (parsed.version === 2) return migrateV3ToV4(migrateV2ToV3(parsed));
  return migrateV3ToV4(migrateV2ToV3(migrateV1ToV2()));
}

export function serializeSave(snapshot: SaveSnapshotV4): string {
  return JSON.stringify(snapshot);
}

export function deserializeSave(raw: string): SaveSnapshotV4 | null {
  try {
    return normalizeSave(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}
