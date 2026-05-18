import { describe, expect, it } from "vitest";
import {
  deserializeSave,
  migrateV1ToV2,
  migrateV2ToV3,
  migrateV3ToV4,
  normalizeSave,
  parseSaveV1,
  serializeSave,
  type SaveSnapshotV2,
  type SaveSnapshotV3,
} from "./schema";

const v1 = {
  version: 1 as const,
};

const v2Play: SaveSnapshotV2 = {
  version: 2,
  gameMode: "play",
  teamTech: ["seaglide"],
  inventory: [{ itemId: "titanium", count: 4 }],
  o2Percent: 88,
  healthPercent: 100,
  flashlightOn: true,
};

const v3Play: SaveSnapshotV3 = {
  ...migrateV2ToV3(v2Play),
  hungerPercent: 80,
  thirstPercent: 75,
};

describe("parseSaveV1", () => {
  it("accepts minimal v1", () => {
    expect(parseSaveV1(v1)?.version).toBe(1);
  });
});

describe("migrateV1ToV2", () => {
  it("maps legacy v1 to play snapshot", () => {
    const v2 = migrateV1ToV2();
    expect(v2.gameMode).toBe("play");
    expect(v2.teamTech).toEqual([]);
  });
});

describe("normalizeSave", () => {
  it("roundtrips v4 play save", () => {
    const raw = serializeSave(migrateV3ToV4(v3Play));
    const loaded = normalizeSave(JSON.parse(raw));
    expect(loaded?.gameMode).toBe("play");
    expect(loaded?.teamTech).toEqual(["seaglide"]);
    expect(loaded?.flashlightOn).toBe(true);
    expect(loaded?.hotbarSlots.length).toBe(5);
  });

  it("migrates v2 to v3", () => {
    const loaded = normalizeSave(v2Play);
    expect(loaded?.version).toBe(4);
    expect(loaded?.inventory).toEqual(v2Play.inventory);
  });

  it("migrates legacy kitchen_sink mode to play", () => {
    const legacy = {
      version: 2,
      gameMode: "kitchen_sink",
      teamTech: ["seaglide"],
      inventory: [],
    };
    const loaded = normalizeSave(legacy);
    expect(loaded?.gameMode).toBe("play");
  });
});

describe("deserializeSave", () => {
  it("returns null for invalid json", () => {
    expect(deserializeSave("not json")).toBeNull();
  });
});
