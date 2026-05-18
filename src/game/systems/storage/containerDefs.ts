export type ContainerDefId = "small_locker";

export type ContainerDef = {
  id: ContainerDefId;
  cols: number;
  rows: number;
  slotCount: number;
};

export const CONTAINER_DEFS: Record<ContainerDefId, ContainerDef> = {
  small_locker: { id: "small_locker", cols: 5, rows: 3, slotCount: 15 },
};

export function createEmptyContainerSlots(defId: ContainerDefId) {
  const def = CONTAINER_DEFS[defId];
  return Array.from({ length: def.slotCount }, () => null) as ({
    itemId: string;
    count: number;
  } | null)[];
}
