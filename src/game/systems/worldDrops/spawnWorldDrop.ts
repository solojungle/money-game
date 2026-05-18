import { getItemDef } from "../inventory/items.catalog";
import type { WorldDrop } from "../../world/worldDrops";
import { scatterOffset } from "../../world/worldDrops";

export function createWorldDropId(): string {
  return `drop_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Spawns one or more world drops (non-stackable items become separate pickups). */
export function spawnWorldDropsAt(
  itemId: string,
  count: number,
  origin: [number, number, number],
  scatterStartIndex = 0,
): WorldDrop[] {
  if (count <= 0) return [];

  const maxStack = getItemDef(itemId)?.maxStack ?? 1;
  const drops: WorldDrop[] = [];
  let index = scatterStartIndex;

  if (maxStack <= 1) {
    for (let i = 0; i < count; i++) {
      const [ox, oy, oz] = scatterOffset(index++);
      drops.push({
        id: createWorldDropId(),
        itemId,
        count: 1,
        position: [origin[0] + ox, origin[1] + oy, origin[2] + oz],
      });
    }
    return drops;
  }

  const [ox, oy, oz] = scatterOffset(index);
  drops.push({
    id: createWorldDropId(),
    itemId,
    count,
    position: [origin[0] + ox, origin[1] + oy, origin[2] + oz],
  });
  return drops;
}

export function defaultDropOrigin(
  playerPos: { x: number; y: number; z: number } | null,
): [number, number, number] {
  if (!playerPos) return [0, 0.35, 0];
  return [playerPos.x, playerPos.y - 0.5, playerPos.z + 0.65];
}

export function scatterOffsetForIndex(index: number): [number, number, number] {
  return scatterOffset(index);
}
