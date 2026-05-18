import { getItemDef, type InventorySlot } from "../inventory/items.catalog";
import { addItemPartial } from "../inventory/stacks";

export type TransferSide = "player" | "container";

export function moveStackBetween(
  playerSlots: InventorySlot[],
  containerSlots: InventorySlot[],
  from: TransferSide,
  fromIndex: number,
  to: TransferSide,
  toIndex: number,
):
  | {
      ok: true;
      player: InventorySlot[];
      container: InventorySlot[];
    }
  | { ok: false } {
  const player = playerSlots.map((s) => (s ? { ...s } : null));
  const container = containerSlots.map((s) => (s ? { ...s } : null));
  const fromSlots = from === "player" ? player : container;
  const toSlots = to === "player" ? player : container;

  const stack = fromSlots[fromIndex];
  if (!stack) return { ok: false };

  const def = getItemDef(stack.itemId);
  if (!def) return { ok: false };

  const target = toSlots[toIndex];
  if (target && target.itemId !== stack.itemId) return { ok: false };

  const room = target ? def.maxStack - target.count : def.maxStack;
  const moveCount = Math.min(stack.count, room);
  if (moveCount <= 0) return { ok: false };

  fromSlots[fromIndex] =
    stack.count - moveCount > 0
      ? { itemId: stack.itemId, count: stack.count - moveCount }
      : null;

  const partial = addItemPartial(toSlots, stack.itemId, moveCount);
  if (partial.remaining > 0) return { ok: false };

  return { ok: true, player, container };
}

export function transferClick(
  playerSlots: InventorySlot[],
  containerSlots: InventorySlot[],
  selected: { side: TransferSide; index: number } | null,
  clicked: { side: TransferSide; index: number },
): {
  player: InventorySlot[];
  container: InventorySlot[];
  selected: { side: TransferSide; index: number } | null;
} {
  if (!selected) {
    const slots = clicked.side === "player" ? playerSlots : containerSlots;
    if (!slots[clicked.index]) {
      return { player: playerSlots, container: containerSlots, selected: null };
    }
    return {
      player: playerSlots,
      container: containerSlots,
      selected: clicked,
    };
  }

  if (selected.side === clicked.side && selected.index === clicked.index) {
    return { player: playerSlots, container: containerSlots, selected: null };
  }

  if (selected.side !== clicked.side) {
    const result = moveStackBetween(
      playerSlots,
      containerSlots,
      selected.side,
      selected.index,
      clicked.side,
      clicked.index,
    );
    if (result.ok) {
      return {
        player: result.player,
        container: result.container,
        selected: null,
      };
    }
  }

  const slots = clicked.side === "player" ? playerSlots : containerSlots;
  if (!slots[clicked.index]) {
    return { player: playerSlots, container: containerSlots, selected: null };
  }
  return { player: playerSlots, container: containerSlots, selected: clicked };
}
