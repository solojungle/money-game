# M15 hud — Contract v1

## Depends on (read-only)

- CORE: vitals-related types as needed
- M04: `blueprint:unlocked` via event bus (no direct progression imports in hot path)

## Exports (public `index.ts` only)

- `HUD_MODULE_VERSION`
- `createVitalsStub()` — default O₂ / depth / health for store bootstrap
- `formatDepthM`, `formatO2Percent`, `o2ArcDegrees`, `compassCardinal`
- `depthFromPlayerY()` — player Y → depth meters
- Widget props types: `VitalsClusterProps`, `CompassDepthProps`

## Events consumed

- `blueprint:unlocked` — `BlueprintToast` queue in `src/components/hud/`

## Events emitted

- (none in v0)

## Siblings may NOT

- Own game logic (vitals tick, scan rules)
- Import progression `internal/`

## Tests required

- `hud.contract.test.ts` — stub shapes compatible with kernel-facing vitals
