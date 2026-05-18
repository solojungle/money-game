import { create } from "zustand";
import type { GameMode } from "../game/types";
import { createVitalsStub } from "../game/presentation/hud";
import {
  deserializeSave,
  serializeSave,
  type SaveSnapshotV4,
} from "../game/save/schema";
import type { CraftJob } from "../game/crafting/types";
import type { FabricatorCategory } from "../game/crafting/types";
import {
  enqueueCraft,
  getPinBlueprintIdForRecipe,
  tickCraftQueue,
} from "../game/systems/crafting";
import {
  createEmptyContainerSlots,
  transferClick,
  type TransferSide,
} from "../game/systems/storage";
import type { BlueprintId } from "../game/_kernel/types";
import type {
  PdaHoverTarget,
  PdaTabId,
} from "../game/presentation/pda/pdaTypes";
import {
  createEmptyInventory,
  createPlayBootstrap,
  createPlayEquipment,
  assignToolToHotbar,
  consumeItemFromSlot,
  dropEquippedItem,
  dropHotbarItem,
  dropItemFromSlot,
  equipItemFromSlot,
  pinBlueprint,
  unassignHotbarSlot,
  unequipItem,
  unpinAllBlueprints,
  unpinBlueprint,
  type EquipmentState,
  type InventorySlot,
} from "../game/systems/inventory";
import { getItemDef } from "../game/systems/inventory";
import { isToolItem } from "../game/systems/inventory/itemMeta";
import { restoreTeamTech } from "../game/systems/progression";
import {
  disposeGameSystems,
  initGameSystems,
  runGameTick,
} from "../game/systems/registerSystems";
import {
  createEmptyHotbarSlots,
  HOTBAR_SLOT_COUNT,
} from "../game/constants/hotbar";
import { isNearDeath } from "../game/systems/vitals";
import type { WorldInteractable } from "../game/world/interactables";
import type { WorldDrop } from "../game/world/worldDrops";
import { pickupFloatTextFor } from "../game/world/pickupFeedback";
import {
  performInteraction,
  resolveCurrentPrompt,
} from "../game/world/performInteraction";
import {
  countOwnedItem,
  type DroppedStack,
} from "../game/systems/inventory/inventoryActions";
import {
  defaultDropOrigin,
  spawnWorldDropsAt,
} from "../game/systems/worldDrops";

const SAVE_KEY = "money-game-save-v4";

export type FabricatorView = "categories" | "browse";

export type StorageHover = { side: TransferSide; index: number };

export type PickupFloat = {
  id: string;
  text: string;
};

export { HOTBAR_SLOT_COUNT } from "../game/constants/hotbar";

const defaultVitals = createVitalsStub();

function equipmentHasRebreather(equipment: EquipmentState): boolean {
  for (const slot of Object.values(equipment)) {
    if (slot.kind === "filled" && slot.itemId === "rebreather") return true;
  }
  return false;
}

function syncRebreatherFlag(equipment: EquipmentState): boolean {
  return equipmentHasRebreather(equipment) || equipment.tank.kind === "filled";
}

function appendWorldDrops(
  existing: WorldDrop[],
  dropped: DroppedStack | undefined,
  playerWorldPos: { x: number; y: number; z: number } | null,
): WorldDrop[] {
  if (!dropped) return existing;
  const origin = defaultDropOrigin(playerWorldPos);
  return [
    ...existing,
    ...spawnWorldDropsAt(
      dropped.itemId,
      dropped.count,
      origin,
      existing.length,
    ),
  ];
}

type GameState = {
  started: boolean;
  gameMode: GameMode;
  o2Percent: number;
  depthM: number;
  healthPercent: number;
  hungerPercent: number;
  thirstPercent: number;
  hasRebreather: boolean;
  headingDeg: number;
  inventory: InventorySlot[];
  equipment: EquipmentState;
  inventoryOpen: boolean;
  pdaTab: PdaTabId;
  pdaHover: PdaHoverTarget | null;
  pdaAssignHotbarIndex: number;
  pinnedBlueprintIds: BlueprintId[];
  unlockedBlueprintIds: BlueprintId[];
  activeInteractable: WorldInteractable | null;
  harvestedIds: string[];
  flashlightOn: boolean;
  hotbarSlots: (string | null)[];
  quickSlot: number;
  pickupFloats: PickupFloat[];
  worldDrops: WorldDrop[];
  playerWorldPos: { x: number; y: number; z: number } | null;
  fabricatorOpen: boolean;
  fabricatorView: FabricatorView;
  fabricatorCategory: FabricatorCategory | null;
  fabricatorHoveredRecipeId: string | null;
  craftQueue: CraftJob[];
  storageOpen: boolean;
  activeContainerId: string | null;
  storageSelected: StorageHover | null;
  storageHover: StorageHover | null;
  containers: Record<string, InventorySlot[]>;
  pauseOpen: boolean;

  tick: (dtMs: number) => void;
  setStarted: (v: boolean) => void;
  startGame: () => void;
  setPauseOpen: (open: boolean) => void;
  togglePause: () => void;
  quitToMainMenu: () => void;
  setPlayerDepth: (depthM: number) => void;
  setPlayerWorldPos: (pos: { x: number; y: number; z: number }) => void;
  setHeadingDeg: (deg: number) => void;
  toggleInventory: () => void;
  toggleInventoryOpen: () => void;
  setInventoryOpen: (open: boolean) => void;
  setPdaTab: (tab: PdaTabId) => void;
  cyclePdaTab: (delta: 1 | -1) => void;
  setPdaHover: (target: PdaHoverTarget | null) => void;
  setPdaAssignHotbarIndex: (index: number) => void;
  pinBlueprintId: (id: BlueprintId) => void;
  unpinBlueprintId: (id: BlueprintId) => void;
  unpinAllBlueprints: () => void;
  pdaPrimaryAction: (target?: PdaHoverTarget) => void;
  pdaSecondaryAction: (target?: PdaHoverTarget) => void;
  setActiveInteractable: (target: WorldInteractable | null) => void;
  toggleFlashlight: () => void;
  setQuickSlot: (index: number) => void;
  cycleQuickSlot: (delta: 1 | -1) => void;
  tryInteract: (via: "holster" | "useLeft") => void;
  pushPickupFloat: (text: string) => void;
  dismissPickupFloat: (id: string) => void;
  onUseLeft: () => void;
  onLoadTool: () => void;
  onReload: () => void;
  onDeconstruct: () => void;
  saveToLocal: () => void;
  loadFromLocal: () => boolean;
  nearDeath: () => boolean;
  setFabricatorOpen: (open: boolean) => void;
  selectFabricatorCategory: (category: FabricatorCategory) => void;
  setFabricatorHoveredRecipe: (recipeId: string | null) => void;
  fabricatorEnqueueCraft: () => void;
  fabricatorPinHovered: () => void;
  setStorageOpen: (open: boolean) => void;
  openStorage: (containerId: string) => void;
  getActiveContainerSlots: () => InventorySlot[];
  storageCellClick: (side: TransferSide, index: number) => void;
  setStorageHover: (hover: StorageHover | null) => void;
  closeAllStationUis: () => void;
  fabricatorCraftClick: () => void;
  fabricatorPinClick: () => void;
};

function ensureContainer(
  containers: Record<string, InventorySlot[]>,
  containerId: string,
): Record<string, InventorySlot[]> {
  if (containers[containerId]) return containers;
  return {
    ...containers,
    [containerId]: createEmptyContainerSlots("small_locker"),
  };
}

function snapshotFromState(s: GameState): SaveSnapshotV4 {
  return {
    version: 4,
    gameMode: "play",
    teamTech: [...s.unlockedBlueprintIds],
    inventory: s.inventory.map((slot) =>
      slot ? { itemId: slot.itemId, count: slot.count } : null,
    ),
    equipment: { ...s.equipment },
    hotbarSlots: [...s.hotbarSlots],
    quickSlot: s.quickSlot,
    pinnedBlueprintIds: [...s.pinnedBlueprintIds],
    pdaTab: s.pdaTab,
    o2Percent: s.o2Percent,
    healthPercent: s.healthPercent,
    hungerPercent: s.hungerPercent,
    thirstPercent: s.thirstPercent,
    flashlightOn: s.flashlightOn,
    containers: Object.fromEntries(
      Object.entries(s.containers).map(([id, slots]) => [
        id,
        slots.map((slot) =>
          slot ? { itemId: slot.itemId, count: slot.count } : null,
        ),
      ]),
    ),
  };
}

function bindSystems(set: (fn: (s: GameState) => Partial<GameState>) => void) {
  initGameSystems(
    () => {
      const s = useGameStore.getState();
      return {
        o2Percent: s.o2Percent,
        depthM: s.depthM,
        hasRebreather: s.hasRebreather,
        gameMode: s.gameMode,
      };
    },
    (partial) => set(() => partial),
  );
}

const PDA_TAB_ORDER: PdaTabId[] = [
  "inventory",
  "blueprints",
  "signals",
  "logs",
  "databank",
  "adaptations",
];

export const useGameStore = create<GameState>((set, get) => ({
  started: false,
  gameMode: "play",
  o2Percent: defaultVitals.o2Percent,
  depthM: defaultVitals.depthM,
  healthPercent: defaultVitals.healthPercent ?? 100,
  hungerPercent: defaultVitals.hungerPercent ?? 85,
  thirstPercent: defaultVitals.thirstPercent ?? 90,
  hasRebreather: false,
  headingDeg: 0,
  inventory: createEmptyInventory(),
  equipment: createPlayEquipment(),
  inventoryOpen: false,
  pdaTab: "inventory",
  pdaHover: null,
  pdaAssignHotbarIndex: 0,
  pinnedBlueprintIds: [],
  unlockedBlueprintIds: [],
  activeInteractable: null,
  harvestedIds: [],
  flashlightOn: false,
  hotbarSlots: createEmptyHotbarSlots(),
  quickSlot: 0,
  pickupFloats: [],
  worldDrops: [],
  playerWorldPos: null,
  fabricatorOpen: false,
  fabricatorView: "categories",
  fabricatorCategory: null,
  fabricatorHoveredRecipeId: null,
  craftQueue: [],
  storageOpen: false,
  activeContainerId: null,
  storageSelected: null,
  storageHover: null,
  containers: {},
  pauseOpen: false,

  nearDeath: () => {
    const s = get();
    return isNearDeath(s.healthPercent, s.o2Percent);
  },

  tick: (dtMs) => {
    runGameTick(dtMs);
    const s = get();
    if (!s.fabricatorOpen || s.craftQueue.length === 0) return;
    const result = tickCraftQueue(s.craftQueue, s.inventory, dtMs);
    if (result.inventory !== s.inventory || result.queue !== s.craftQueue) {
      set({ inventory: result.inventory, craftQueue: result.queue });
    }
  },

  setStarted: (v) => set({ started: v }),

  startGame: () => {
    disposeGameSystems();
    const boot = createPlayBootstrap();
    set({
      started: true,
      gameMode: "play",
      o2Percent: 100,
      depthM: 24,
      healthPercent: 100,
      hungerPercent: 92,
      thirstPercent: 88,
      hasRebreather: syncRebreatherFlag(boot.equipment),
      inventory: boot.inventory,
      equipment: boot.equipment,
      unlockedBlueprintIds: boot.unlockedBlueprintIds,
      inventoryOpen: false,
      pdaTab: "inventory",
      pdaHover: null,
      pinnedBlueprintIds: [],
      activeInteractable: null,
      harvestedIds: [],
      flashlightOn: false,
      hotbarSlots: createEmptyHotbarSlots(),
      quickSlot: 0,
      pickupFloats: [],
      worldDrops: [],
      playerWorldPos: null,
      fabricatorOpen: false,
      fabricatorView: "categories",
      fabricatorCategory: null,
      fabricatorHoveredRecipeId: null,
      craftQueue: [],
      storageOpen: false,
      activeContainerId: null,
      storageSelected: null,
      storageHover: null,
      containers: {},
      pauseOpen: false,
    });
    bindSystems(set);
  },

  setPauseOpen: (open) => set({ pauseOpen: open }),

  togglePause: () =>
    set((s) => {
      if (!s.started) return s;
      const next = !s.pauseOpen;
      if (next) {
        return {
          pauseOpen: true,
          inventoryOpen: false,
          fabricatorOpen: false,
          storageOpen: false,
          craftQueue: [],
          storageSelected: null,
          storageHover: null,
          pdaHover: null,
        };
      }
      return { pauseOpen: false };
    }),

  quitToMainMenu: () => {
    disposeGameSystems();
    set({
      started: false,
      pauseOpen: false,
      inventoryOpen: false,
      fabricatorOpen: false,
      storageOpen: false,
      craftQueue: [],
      storageSelected: null,
      storageHover: null,
      pdaHover: null,
    });
  },

  setPlayerDepth: (depthM) => set({ depthM }),
  setPlayerWorldPos: (playerWorldPos) => set({ playerWorldPos }),
  setHeadingDeg: (headingDeg) => set({ headingDeg }),

  toggleInventory: () =>
    set((s) => ({
      inventoryOpen: !s.inventoryOpen,
      pdaHover: !s.inventoryOpen ? null : s.pdaHover,
    })),

  toggleInventoryOpen: () => get().toggleInventory(),

  setInventoryOpen: (open) =>
    set({ inventoryOpen: open, pdaHover: open ? get().pdaHover : null }),

  setPdaTab: (tab) => set({ pdaTab: tab, pdaHover: null }),

  cyclePdaTab: (delta) =>
    set((s) => {
      const i = PDA_TAB_ORDER.indexOf(s.pdaTab);
      const next = (i + delta + PDA_TAB_ORDER.length) % PDA_TAB_ORDER.length;
      return { pdaTab: PDA_TAB_ORDER[next], pdaHover: null };
    }),

  setPdaHover: (target) => set({ pdaHover: target }),

  setPdaAssignHotbarIndex: (index) =>
    set({
      pdaAssignHotbarIndex: Math.max(0, Math.min(HOTBAR_SLOT_COUNT - 1, index)),
    }),

  pinBlueprintId: (id) =>
    set((s) => ({
      pinnedBlueprintIds: pinBlueprint(s.pinnedBlueprintIds, id),
    })),

  unpinBlueprintId: (id) =>
    set((s) => ({
      pinnedBlueprintIds: unpinBlueprint(s.pinnedBlueprintIds, id),
    })),

  unpinAllBlueprints: () => set({ pinnedBlueprintIds: unpinAllBlueprints() }),

  pdaPrimaryAction: (target) => {
    const s = get();
    const t = target ?? s.pdaHover;
    if (!t) return;

    if (t.source === "blueprint") return;

    if (t.source === "equip") {
      const result = unequipItem(s.inventory, s.equipment, t.slot);
      if (!result.ok) return;
      set({
        inventory: result.inventory,
        equipment: result.equipment ?? s.equipment,
        hasRebreather: syncRebreatherFlag(result.equipment ?? s.equipment),
      });
      return;
    }

    if (t.source === "hotbar") {
      const result = unassignHotbarSlot(s.inventory, s.hotbarSlots, t.index);
      if (!result.ok) return;
      set({
        inventory: result.inventory,
        hotbarSlots: result.hotbarSlots ?? s.hotbarSlots,
      });
      return;
    }

    const stack = s.inventory[t.index];
    if (!stack) return;
    const def = getItemDef(stack.itemId);
    if (!def) return;

    if (isToolItem(stack.itemId)) {
      const result = assignToolToHotbar(
        s.inventory,
        s.hotbarSlots,
        t.index,
        s.pdaAssignHotbarIndex,
      );
      if (!result.ok) return;
      set({
        inventory: result.inventory,
        hotbarSlots: result.hotbarSlots ?? s.hotbarSlots,
        quickSlot: s.pdaAssignHotbarIndex,
      });
      return;
    }

    if (def.category === "equipment" || def.equipmentSlot) {
      const result = equipItemFromSlot(s.inventory, s.equipment, t.index);
      if (!result.ok) return;
      const equipment = result.equipment ?? s.equipment;
      set({
        inventory: result.inventory,
        equipment,
        hasRebreather: syncRebreatherFlag(equipment),
      });
      return;
    }

    if (
      def.food != null ||
      def.water != null ||
      def.actions?.includes("consume")
    ) {
      const result = consumeItemFromSlot(s.inventory, t.index);
      if (!result.ok) return;
      set({
        inventory: result.inventory,
        hungerPercent: Math.min(
          100,
          s.hungerPercent + (result.hungerDelta ?? 0),
        ),
        thirstPercent: Math.min(
          100,
          s.thirstPercent + (result.thirstDelta ?? 0),
        ),
        healthPercent: Math.min(
          100,
          s.healthPercent + (result.healthDelta ?? 0),
        ),
      });
      return;
    }
  },

  pdaSecondaryAction: (target) => {
    const s = get();
    const t = target ?? s.pdaHover;
    if (!t) return;
    if (t.source === "blueprint") {
      if (s.pinnedBlueprintIds.includes(t.blueprintId as BlueprintId)) {
        get().unpinBlueprintId(t.blueprintId as BlueprintId);
      } else {
        get().pinBlueprintId(t.blueprintId as BlueprintId);
      }
      return;
    }

    if (t.source === "grid") {
      const result = dropItemFromSlot(s.inventory, t.index);
      if (!result.ok) return;
      set({
        inventory: result.inventory,
        worldDrops: appendWorldDrops(
          s.worldDrops,
          result.dropped,
          s.playerWorldPos,
        ),
      });
      return;
    }

    if (t.source === "equip") {
      const result = dropEquippedItem(s.inventory, s.equipment, t.slot);
      if (!result.ok) return;
      set({
        inventory: result.inventory,
        equipment: result.equipment ?? s.equipment,
        hasRebreather: syncRebreatherFlag(result.equipment ?? s.equipment),
        worldDrops: appendWorldDrops(
          s.worldDrops,
          result.dropped,
          s.playerWorldPos,
        ),
      });
      return;
    }

    if (t.source === "hotbar") {
      const result = dropHotbarItem(s.inventory, s.hotbarSlots, t.index);
      if (!result.ok) return;
      set({
        hotbarSlots: result.hotbarSlots ?? s.hotbarSlots,
        worldDrops: appendWorldDrops(
          s.worldDrops,
          result.dropped,
          s.playerWorldPos,
        ),
      });
    }
  },

  setActiveInteractable: (target) => set({ activeInteractable: target }),

  toggleFlashlight: () => set((s) => ({ flashlightOn: !s.flashlightOn })),

  tryInteract: (via) => {
    const s = get();
    const prompt = resolveCurrentPrompt(
      s.activeInteractable,
      s.hotbarSlots,
      s.quickSlot,
    );
    if (!prompt?.actionable || !prompt.action) return;

    const wantsE = via === "holster";
    const wantsLmb = via === "useLeft";
    if (
      wantsE &&
      prompt.action !== "pickup" &&
      prompt.action !== "open_inventory" &&
      prompt.action !== "open_fabricator" &&
      prompt.action !== "open_storage"
    ) {
      return;
    }
    if (wantsLmb && prompt.action !== "harvest" && prompt.action !== "scan") {
      return;
    }

    const target = s.activeInteractable;
    const floatText =
      prompt.action === "pickup" || prompt.action === "harvest"
        ? pickupFloatTextFor(target)
        : null;

    const outcome = performInteraction(
      target,
      s.hotbarSlots,
      s.quickSlot,
      s.inventory,
      s.harvestedIds,
      s.worldDrops,
    );
    if (!outcome.result.ok) return;

    const patch: Partial<GameState> = {};
    if (outcome.inventory) patch.inventory = outcome.inventory;
    if (outcome.harvestedIds) patch.harvestedIds = outcome.harvestedIds;
    if (outcome.worldDrops) patch.worldDrops = outcome.worldDrops;
    if (outcome.removedDropId) {
      patch.worldDrops = s.worldDrops.filter(
        (d) => d.id !== outcome.removedDropId,
      );
    }
    if (outcome.result.kind === "open_inventory") {
      patch.inventoryOpen = true;
      patch.pdaTab = "inventory";
    }
    if (outcome.result.kind === "open_fabricator") {
      patch.fabricatorOpen = true;
      patch.fabricatorView = "categories";
      patch.fabricatorCategory = null;
      patch.fabricatorHoveredRecipeId = null;
      patch.craftQueue = [];
    }
    if (
      outcome.result.kind === "open_storage" &&
      target?.kind === "storage_locker"
    ) {
      const containers = ensureContainer(s.containers, target.containerId);
      patch.storageOpen = true;
      patch.activeContainerId = target.containerId;
      patch.containers = containers;
      patch.storageSelected = null;
      patch.storageHover = null;
    }
    set(patch);

    if (
      outcome.resonatorHarvest &&
      outcome.totalAdded &&
      outcome.totalAdded > 0
    ) {
      get().pushPickupFloat(`+${outcome.totalAdded} collected`);
    } else if (
      floatText &&
      (outcome.result.kind === "pickup" || outcome.result.kind === "harvest")
    ) {
      get().pushPickupFloat(floatText);
    }
  },

  pushPickupFloat: (text) =>
    set((s) => ({
      pickupFloats: [
        ...s.pickupFloats,
        { id: crypto.randomUUID(), text },
      ].slice(-4),
    })),

  dismissPickupFloat: (id) =>
    set((s) => ({
      pickupFloats: s.pickupFloats.filter((f) => f.id !== id),
    })),

  setQuickSlot: (index) =>
    set((s) => {
      const slot = Math.max(0, Math.min(HOTBAR_SLOT_COUNT - 1, index));
      if (s.inventoryOpen) {
        return { pdaAssignHotbarIndex: slot };
      }
      return { quickSlot: slot };
    }),

  cycleQuickSlot: (delta) =>
    set((s) => {
      const next =
        (s.quickSlot + delta + HOTBAR_SLOT_COUNT) % HOTBAR_SLOT_COUNT;
      if (s.inventoryOpen) {
        return { pdaAssignHotbarIndex: next };
      }
      return { quickSlot: next };
    }),

  onUseLeft: () => {
    const s = get();
    if (s.fabricatorOpen) {
      s.fabricatorCraftClick();
      return;
    }
    if (s.inventoryOpen) {
      s.pdaPrimaryAction();
      return;
    }
    get().tryInteract("useLeft");
  },

  onLoadTool: () => {
    /* SN1: F loads propulsion cannon — reserved */
  },

  onReload: () => {
    /* SN1: R reloads held tool battery */
  },

  onDeconstruct: () => {
    /* SN1: Q deconstructs in build mode */
  },

  saveToLocal: () => {
    try {
      const snap = snapshotFromState(get());
      localStorage.setItem(SAVE_KEY, serializeSave(snap));
    } catch {
      /* ignore quota */
    }
  },

  loadFromLocal: () => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = deserializeSave(raw);
      if (!data) return false;
      restoreTeamTech(data.teamTech);
      const boot = createPlayBootstrap();
      set({
        gameMode: "play",
        unlockedBlueprintIds: [...data.teamTech],
        o2Percent: data.o2Percent ?? defaultVitals.o2Percent,
        healthPercent: data.healthPercent ?? 100,
        hungerPercent: data.hungerPercent ?? 85,
        thirstPercent: data.thirstPercent ?? 90,
        flashlightOn: data.flashlightOn ?? false,
        inventory: data.inventory.map((slot) => (slot ? { ...slot } : null)),
        equipment: data.equipment ?? boot.equipment,
        hotbarSlots: data.hotbarSlots ?? createEmptyHotbarSlots(),
        quickSlot: data.quickSlot ?? 0,
        pinnedBlueprintIds: [...(data.pinnedBlueprintIds ?? [])],
        pdaTab: data.pdaTab ?? "inventory",
        hasRebreather: syncRebreatherFlag(data.equipment ?? boot.equipment),
        containers: Object.fromEntries(
          Object.entries(data.containers ?? {}).map(([id, slots]) => [
            id,
            slots.map((slot) => (slot ? { ...slot } : null)),
          ]),
        ),
        fabricatorOpen: false,
        fabricatorView: "categories",
        fabricatorCategory: null,
        fabricatorHoveredRecipeId: null,
        craftQueue: [],
        storageOpen: false,
        activeContainerId: null,
        storageSelected: null,
        storageHover: null,
      });
      bindSystems(set);
      return true;
    } catch {
      return false;
    }
  },

  closeAllStationUis: () =>
    set({
      fabricatorOpen: false,
      storageOpen: false,
      craftQueue: [],
      storageSelected: null,
      storageHover: null,
    }),

  setFabricatorOpen: (open) =>
    set({
      fabricatorOpen: open,
      fabricatorView: open ? get().fabricatorView : "categories",
      fabricatorCategory: open ? get().fabricatorCategory : null,
      fabricatorHoveredRecipeId: open ? get().fabricatorHoveredRecipeId : null,
      craftQueue: open ? get().craftQueue : [],
    }),

  selectFabricatorCategory: (category) =>
    set({
      fabricatorCategory: category,
      fabricatorView: "browse",
      fabricatorHoveredRecipeId: null,
    }),

  setFabricatorHoveredRecipe: (recipeId) =>
    set({ fabricatorHoveredRecipeId: recipeId }),

  fabricatorEnqueueCraft: () => {
    const s = get();
    const id = s.fabricatorHoveredRecipeId;
    if (!id) return;
    const result = enqueueCraft(s.craftQueue, s.inventory, s.hotbarSlots, id);
    if (result.ok) set({ craftQueue: result.queue });
  },

  fabricatorCraftClick: () => get().fabricatorEnqueueCraft(),

  fabricatorPinHovered: () => {
    const s = get();
    const id = s.fabricatorHoveredRecipeId;
    if (!id) return;
    const bp = getPinBlueprintIdForRecipe(id);
    if (!bp) return;
    if (s.pinnedBlueprintIds.includes(bp)) {
      get().unpinBlueprintId(bp);
    } else {
      get().pinBlueprintId(bp);
    }
  },

  fabricatorPinClick: () => get().fabricatorPinHovered(),

  setStorageOpen: (open) =>
    set({
      storageOpen: open,
      storageSelected: open ? get().storageSelected : null,
      storageHover: open ? get().storageHover : null,
      activeContainerId: open ? get().activeContainerId : null,
    }),

  openStorage: (containerId) => {
    const s = get();
    set({
      storageOpen: true,
      activeContainerId: containerId,
      containers: ensureContainer(s.containers, containerId),
      storageSelected: null,
      storageHover: null,
    });
  },

  getActiveContainerSlots: () => {
    const s = get();
    const id = s.activeContainerId;
    if (!id) return createEmptyContainerSlots("small_locker");
    return s.containers[id] ?? createEmptyContainerSlots("small_locker");
  },

  setStorageHover: (hover) => set({ storageHover: hover }),

  storageCellClick: (side, index) => {
    const s = get();
    const containerId = s.activeContainerId;
    if (!containerId) return;
    const containerSlots =
      s.containers[containerId] ?? createEmptyContainerSlots("small_locker");
    const result = transferClick(
      s.inventory,
      containerSlots,
      s.storageSelected,
      { side, index },
    );
    set({
      inventory: result.player,
      containers: {
        ...s.containers,
        [containerId]: result.container,
      },
      storageSelected: result.selected,
    });
  },
}));

export function itemIsOwned(
  inventory: InventorySlot[],
  hotbarSlots: (string | null)[],
  itemId: string,
): boolean {
  return countOwnedItem(inventory, hotbarSlots, itemId) > 0;
}
