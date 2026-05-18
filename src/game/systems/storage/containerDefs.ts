export type ContainerDefId = "small_locker" | "wall_locker" | "floor_locker";

export type ContainerDef = {
  id: ContainerDefId;
  cols: number;
  rows: number;
  slotCount: number;
};

export const CONTAINER_DEFS: Record<ContainerDefId, ContainerDef> = {
  small_locker: { id: "small_locker", cols: 5, rows: 3, slotCount: 15 },
  wall_locker: { id: "wall_locker", cols: 5, rows: 4, slotCount: 20 },
  floor_locker: { id: "floor_locker", cols: 6, rows: 5, slotCount: 30 },
};

export function createEmptyContainerSlots(defId: ContainerDefId) {
  const def = CONTAINER_DEFS[defId];
  return Array.from({ length: def.slotCount }, () => null) as ({
    itemId: string;
    count: number;
  } | null)[];
}
