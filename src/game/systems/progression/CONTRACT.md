# M04 progression — Contract v1

## Depends on (read-only)

- CORE: `BlueprintId`, `ScanState`, `GameEvent`

## Exports (public `index.ts` only)

- `unlockBlueprint(id, sourcePlayer?)` — team pool unlock; emits `blueprint:unlocked`
- `scanFragment(id)` — scan flow; duplicate does not re-unlock
- `getScanState(id)` — `new` | `known` | `duplicate`
- `restoreTeamTech(ids)` — save load without events
- `getTeamTech()` — read-only set of unlocked blueprint ids
- `getBlueprintConfig(id)` — lookup display metadata
- `resetProgressionState()` — test helper

## Events emitted

- `blueprint:unlocked { blueprintId, displayName, source }`

## Events consumed

- (none in v0 stub)

## Save slice (planned)

- `teamTech: string[]`, per-blueprint scan counts

## Siblings may NOT

- Import `./internal/*` (when added)
- Mutate team tech without `unlockBlueprint`

## Tests required

- `progression.contract.test.ts` — kernel type compatibility
- Unit tests for duplicate → `duplicate` scan state (future L3)
