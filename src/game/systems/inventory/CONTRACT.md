# M02 inventory — Contract v1

## Depends on (read-only)

- CORE: (none beyond shared types)

## Exports (public `index.ts` only)

- `ITEM_CATALOG`, `getItemDef`, grid constants
- `addItem`, `removeItem`, `countItem`, `canStack`
- `createEmptyInventory`, kitchen sink bootstrap helpers

## Events emitted

- (none in v0)

## Save slice (planned)

- `inventory: ItemStack[]`, `equipment: EquipmentState`

## Tests required

- `inventory.test.ts` — stack rules, max stack overflow
- `kitchenSink.test.ts` — pre-fill bootstrap
