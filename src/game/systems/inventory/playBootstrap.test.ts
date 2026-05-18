import { beforeEach, describe, expect, it } from "vitest";
import {
  INVENTORY_SLOT_COUNT,
  createKitchenSinkInventory,
} from "./items.catalog";
import { createPlayBootstrap } from "./playBootstrap";
import { useGameStore } from "../../../store/gameStore";
import { HOTBAR_SLOT_COUNT } from "../../constants/hotbar";

describe("createKitchenSinkInventory", () => {
  it("pre-fills dev stress grid", () => {
    const inv = createKitchenSinkInventory();
    const filled = inv.filter(Boolean).length;
    expect(filled).toBeGreaterThan(10);
    expect(inv.length).toBe(INVENTORY_SLOT_COUNT);
  });
});

describe("createPlayBootstrap", () => {
  it("returns empty inventory, empty equipment, and starter blueprint ids only", () => {
    const boot = createPlayBootstrap();
    expect(boot.inventory.filter(Boolean).length).toBe(0);
    expect(boot.equipment.tank.kind).toBe("empty");
    expect(boot.equipment.suit.kind).toBe("locked");
    expect(boot.unlockedBlueprintIds.length).toBeGreaterThanOrEqual(3);
  });
});

describe("gameStore play mode", () => {
  beforeEach(() => {
    useGameStore.setState({
      started: false,
      gameMode: "play",
      inventoryOpen: false,
    });
  });

  it("initializes empty inventory on startGame", () => {
    useGameStore.getState().startGame();
    const s = useGameStore.getState();
    expect(s.gameMode).toBe("play");
    expect(s.started).toBe(true);
    expect(s.inventory.filter(Boolean).length).toBe(0);
    expect(s.hotbarSlots.every((id) => id === null)).toBe(true);
    expect(s.hotbarSlots.length).toBe(HOTBAR_SLOT_COUNT);
  });
});
