# Base building assets

## Procedural (in-repo)

Structural habitat shells (`RoomShellMesh`, `CorridorShellMesh`, `HatchMesh`) are procedural geometry in `src/components/scene/building/`. No external mesh files required for MVP modules.

## Recommended CC0 kits (P1 props — not bundled yet)

When importing GLB props for fabricators, lockers, and lights, prefer:

| Asset | License | URL |
|-------|---------|-----|
| Modular Sci-Fi MegaKit | CC0 | https://quaternius.itch.io/modular-sci-fi-megakit |
| Kenney Sci-Fi Kit | CC0 | https://kenney.nl/assets |

Retarget materials to `BUILDING_WHITE` in `buildingMaterials.ts` and scale to the 0.5 m builder snap grid.

## Reference art

Subnautica 2 wiki gallery images (CC BY-NC-SA 3.0) may be stored under `docs/reference/sn2-gallery/` for development only — do not ship in game builds.
