# Subnautica 2 — Building & Recipes (Reference)

Money Game uses SN2’s Habitat Builder UX and placement rules. **All builder pieces unlock on play start**; ingredients are the only gate.

**Sources:** [Epic base-building guide](https://store.epicgames.com/news/subnautica-2-base-building-guide), [Wikily base building](https://wikily.gg/subnautica-2/base-building/), [subnautica2.gg blueprints](https://subnautica2.gg/blueprints), [PC Gamer habitat builder](https://www.pcgamer.com/games/survival-crafting/subnautica-2-base-habitat-builder/). EA reference: May 2026.

**Full piece catalog (46 items, four categories):** [`sn2-seabase-catalog.md`](sn2-seabase-catalog.md)

---

## Habitat Builder

| | SN2 (reference) | Money Game |
|--|-----------------|------------|
| Unlock | Scan 2 fragments (Welcome Center, wrecks) | All pieces unlocked at `startGame` |
| Craft tool | 2 Ti, 1 Glass, 1 Basic Battery, 1 Copper Wire | Via fabricator (`recipe_builder`) |
| Menu | RMB with tool equipped | Same |
| Deconstruct | Q mode + LMB; full refund | Same |

---

## Menu tabs (SN2 UI)

1. **Standard Elements** — rooms, corridors, hatches, windows (seabed / base faces)
2. **Interior Facilities** — fabricator, biolab, interior walls (inside base)
3. **Exterior Facilities** — solar, roof gear, dive elevator (hull / roof)
4. **Utility** — lockers, power (mixed surfaces per piece)
5. **Furniture & Decor** — interior only
6. **Cultivation** — growbed (interior floor), metal farm (exterior)

---

## Placement rules

### Surfaces (`buildLocation`)

| Value | Detail panel copy | Valid targets |
|-------|-------------------|---------------|
| `seabed` | Buildable on seabed or foundation | First room, foundation, exterior seabed gear |
| `base_exterior` | Buildable on base exterior | Roof, outer hull |
| `base_face` | Buildable on module faces | Hatch, window, door |
| `interior` | Buildable in base interiors | Generic inside powered room |
| `interior_floor` | Buildable on interior floor | Floor locker, growbed, chairs |
| `interior_wall` | Buildable on interior walls | Wall locker, posters, wall lamps |
| `interior_ceiling` | Buildable on ceiling | Ceiling lights, hanging jars |

### Category defaults

| Tab | Default surface |
|-----|-----------------|
| Standard Elements | `seabed` / `base_face` |
| Interior Facilities | `interior` |
| Exterior Facilities | `base_exterior` |
| Utility | Per-piece (lockers → wall/floor) |
| Furniture & Decor | `interior` |
| Cultivation | `interior_floor` or `base_exterior` |

### Stacking (Money Game)

- **Wall locker:** 20 slots; max **2** stacked on same wall cell → 40 slots.
- **Floor locker:** 30 slots; **cannot** place wall locker on floor locker.
- **SN1:** Wall mounts at corridor joints block new module attachment; deconstruct obstructions before expanding.

### SN1 lineage (still relevant)

1. First module on seabed/foundation; ghost green = valid.
2. Interior modules not in open water.
3. Exterior power on roof/hull.
4. Base needs power for O₂ / life support.

---

## Storage scale

| Piece | Slots | Mesh (m) |
|-------|-------|----------|
| Wall locker | 20 (×2 stack = 40) | 1.0 × 0.9 × 0.35 |
| Floor locker | 30 | 1.0 × 1.2 × 0.7 |

---

## Megabase showcase (play mode)

New games spawn the **megabase** at the origin: every builder recipe placed once for visual review. See [`megabase-floorplan.md`](megabase-floorplan.md) and [`src/game/building/megabaseLayout.ts`](../src/game/building/megabaseLayout.ts).

## MVP pieces (implemented in code)

See `src/game/building/recipes.builder.json` and `pieceDefs.ts`.

**Standard:** foundation, corridor, room, half_round_room, hatch, window, interior_door, ladder, pillar  
**Interior:** fabricator, modification_station, interior_wall, interior_arch  
**Exterior:** solar_panel, duplex_solar, exterior_wall_light  
**Utility:** wall_locker, floor_locker, storage_cache, power_storage, bioreactor, power_transmitter, growbed  

Furniture/decor/cultivation extras appear in menu data for UI; placement meshes phased in after MVP.

---

## Modular dimensions (SN2 EA — doc only)

SN2 allows resizing standard elements and custom windows. **Money Game v1:** fixed snap grid (see `game.md` §8.5).

---

## Controls (builder equipped)

| Context | Label | Input |
|---------|-------|-------|
| Menu open | CLOSE | Esc |
| Menu open | SELECT | LMB |
| Menu open | PIN RECIPE | RMB |
| Build mode | PLACE | LMB |
| Build mode | ROTATE | Mouse wheel |
| Build mode | TOGGLE SNAPPING | G |
| Build mode | CANCEL | Esc |
| Build mode | DECONSTRUCT | Q (toggle), LMB to remove |
| Build mode | MOVE | X (toggle) |
| Build mode | OPEN MENU | RMB |

---

## Appendix — SN2 placeable catalog (reference)

~76 placeable parts in EA ([Wikily](https://wikily.gg/subnautica-2/base-building/)). Grouped by Wikily subcategory:

| Group | Examples | Typical surface |
|-------|----------|-----------------|
| Structural | Corridor, room, hatch, dive elevator | seabed / base_face |
| Lighting | Wall/ceiling/street lamps | interior_* / base_exterior |
| Furniture | Chairs, beds, tables, jars, posters | interior |
| Storage | Wall/floor locker, cache, barrels | interior_wall / interior_floor |
| Power | Solar, bioreactor, power storage, transmitter | base_exterior / interior |
| Labs | Biolab, biobed, scanner station | interior |
| Posters & decor | Posters, signs, pots | interior_wall |
| Roof/wall greebles | Antennas, vents, pumps | base_exterior |
| Cultivation | Growbed, metal farm | interior_floor / base_exterior |

Co-op: shared base, shared lockers, full refund on deconstruct.
