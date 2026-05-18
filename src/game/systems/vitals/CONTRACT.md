# M01 vitals — Contract v1

## Depends on (read-only)

- CORE: tick scheduler
- `game/combat/damage` (HP clamp helper)

## Exports (public `index.ts` only)

- `getO2DrainPerSecond(depthM, hasRebreather)`
- `applyDamage`, `isNearDeath`, near-death thresholds
- `createVitalsTick(getSlice, patch)` — register on kernel tick order 10

## Events emitted

- (none in v0)

## Save slice (planned)

- `vitals: { o2, hp, hunger, thirst }`

## Tests required

- `vitals.test.ts` — O₂ bands, rebreather, damage, tick drain
