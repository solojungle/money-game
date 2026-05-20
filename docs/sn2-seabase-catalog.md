# Subnautica 2 — Seabase Catalog (Money Game)

Reference for Habitat Builder pieces in the four primary SN2 wiki categories. Hover text in-game comes from `displayName` / `description` in [`recipes.builder.json`](../src/game/building/recipes.builder.json).

**Wiki source:** [Seabases](https://wiki.subnautica.com/sn2/Seabases) (CC BY-NC-SA 3.0 — reference only; do not ship wiki images).

**Implementation rules:** [`subnautica-2-building.md`](subnautica-2-building.md)

## Visual language (habitat modules)

| Element | Spec |
|---------|------|
| Hull | Warm off-white / quartz-tinted metal (`BUILDING_WHITE`), gloss metalness ~0.48 |
| Corners | ~0.18 m radius on boxes; corridors use capsule / rounded tube |
| Glass | Cyan-tinted observation panels |
| Hatches | Circular collar, emissive cyan trim (`HATCH_EMISSIVE`) |
| Grid | 0.5 m snap; structural pieces socket on ±X / ±Z faces |

---

## Standard Elements (13)

| Item | Wiki | Visual spec | `piece_*` | Status |
|------|------|-------------|-----------|--------|
| Corridor | [Corridor](https://wiki.subnautica.com/sn2/Corridor) | White tubular capsule; rounded ends; optional side windows; T/curve auto in SN2 | `piece_corridor` | placeable, `CorridorShellMesh` |
| Room | [Room](https://wiki.subnautica.com/sn2/Room) | Large white box; flat floor/ceiling; four wall faces | `piece_room` | placeable, `RoomShellMesh` |
| Hatch | [Hatch](https://wiki.subnautica.com/sn2/Hatch) | Circular door; cyan ring; wall cutout | `piece_hatch` | placeable, `HatchMesh` |
| Window | [Window](https://wiki.subnautica.com/sn2/Window) | Rectangular cyan glass inset | `piece_window` | placeable, box |
| Nook | [Nook](https://wiki.subnautica.com/sn2/Nook) | Compact module; upward-viewing ceiling glass | `piece_nook` | stub |
| Half Round Room | [Half Round Room](https://wiki.subnautica.com/sn2/Half_Round_Room) | D-shaped plan; curved outer wall | `piece_half_round_room` | placeable, `RoomShellMesh` |
| Moonpool | [Moonpool](https://wiki.subnautica.com/sn2/Moonpool) | Vertical shaft; water surface; vehicle access | `piece_moonpool` | stub |
| Interior Wall | [Interior Wall](https://wiki.subnautica.com/sn2/Interior_Wall) | Thin white partition | `piece_interior_wall` | placeable |
| Interior Arch | [Interior Arch](https://wiki.subnautica.com/sn2/Interior_Arch) | Archway cutout panel | `piece_interior_arch` | placeable |
| Interior Door | [Interior Door](https://wiki.subnautica.com/sn2/Interior_Door) | Sliding interior door | `piece_interior_door` | placeable |
| Ladder | [Ladder](https://wiki.subnautica.com/sn2/Ladder) | Vertical rungs in shaft | `piece_ladder` | placeable |
| Tadpole Dock | [Tadpole Dock](https://wiki.subnautica.com/sn2/Tadpole_Dock) | Exterior dock clamp + pad | `piece_tadpole_dock` | stub |
| Vehicle Fabricator | [Vehicle Fabricator](https://wiki.subnautica.com/sn2/Vehicle_Fabricator) | Large vehicle bay fabricator | `piece_vehicle_fabricator` | stub |

---

## Interior Facilities (21)

| Item | Wiki | Visual spec | `piece_*` | Status |
|------|------|-------------|-----------|--------|
| Fabricator | [Fabricator](https://wiki.subnautica.com/sn2/Fabricator) | Green-screen console | `piece_fabricator` | placeable |
| Processor | [Processor](https://wiki.subnautica.com/sn2/Processor) | Tall lab machine with tanks | `piece_processor` | stub |
| Biolab | [Biolab](https://wiki.subnautica.com/sn2/Biolab) | Bio tank + console | `piece_biolab` | stub |
| Modification Station | [Modification Station](https://wiki.subnautica.com/sn2/Modification_Station) | Yellow-arm workstation | `piece_modification_station` | stub |
| Wall Locker | [Wall Locker](https://wiki.subnautica.com/sn2/Wall_Locker) | Wall cabinet, orange accent | `piece_wall_locker` | placeable |
| Floor Locker | [Floor Locker](https://wiki.subnautica.com/sn2/Floor_Locker) | Tall floor cabinet | `piece_floor_locker` | placeable |
| Tailing Chest | [Tailing Chest](https://wiki.subnautica.com/sn2/Tailing_Chest) | Large scrap chest | `piece_tailing_chest` | stub |
| Wall Rack | [Wall Rack](https://wiki.subnautica.com/sn2/Wall_Rack) | Single-item wall shelf | `piece_wall_rack` | stub |
| Small Ceiling Light | [Small Ceiling Light](https://wiki.subnautica.com/sn2/Small_Ceiling_Light) | Round flush disc | `piece_small_ceiling_light` | stub |
| Rectangular Ceiling Light | [Rectangular Ceiling Light](https://wiki.subnautica.com/sn2/Rectangular_Ceiling_Light) | Rect panel light | `piece_rectangular_ceiling_light` | stub |
| Wall Light Small | [Wall Light Small](https://wiki.subnautica.com/sn2/Wall_Light_Small) | Small sconce | `piece_wall_light_small` | stub |
| Wall Light Large | [Wall Light Large](https://wiki.subnautica.com/sn2/Wall_Light_Large) | Large mood sconce | `piece_wall_light_large` | stub |
| Axum Wall Lamp | [Axum Wall Lamp](https://wiki.subnautica.com/sn2/Axum_Wall_Lamp) | Ornate hanging lamp | `piece_axum_wall_lamp` | stub |
| Battery Terminal | [Battery Terminal](https://wiki.subnautica.com/sn2/Battery_Terminal) | Wall recharge slot | `piece_battery_terminal` | stub |
| Power Cell Terminal | [Power Cell Terminal](https://wiki.subnautica.com/sn2/Power_Cell_Terminal) | Larger cell terminal | `piece_power_cell_terminal` | stub |
| Bioreactor | [Bioreactor](https://wiki.subnautica.com/sn2/Bioreactor) | Cylindrical organic digester | `piece_bioreactor` | placeable |
| Power Storage | [Power Storage](https://wiki.subnautica.com/sn2/Power_Storage) | Battery rack | `piece_power_storage` | placeable |
| Biobed | [Biobed](https://wiki.subnautica.com/sn2/Biobed) | Medical respawn pod | `piece_biobed` | stub |
| NoA Terminal | [NoA Terminal](https://wiki.subnautica.com/sn2/NoA_Terminal) | Holo mission desk | `piece_noa_terminal` | stub |
| Scanner Station | [Scanner Station](https://wiki.subnautica.com/sn2/Scanner_Station) | Dish + displays | `piece_scanner_station` | stub |
| Time of Day Display | [Time of Day Display](https://wiki.subnautica.com/sn2/Time_of_Day_Display) | Wall clock | `piece_time_of_day_display` | stub |

---

## Exterior Facilities (7)

| Item | Wiki | Visual spec | `piece_*` | Status |
|------|------|-------------|-----------|--------|
| Solar Panel | [Solar Panel](https://wiki.subnautica.com/sn2/Solar_Panel) | Blue PV panel on frame | `piece_solar_panel` | placeable |
| Hydroelectric Turbine | [Hydroelectric Turbine](https://wiki.subnautica.com/sn2/Hydroelectric_Turbine) | Propeller on strut | `piece_hydroelectric_turbine` | stub |
| Thermal Plant | [Thermal Plant](https://wiki.subnautica.com/sn2/Thermal_Plant) | Red heat exchanger | `piece_thermal_plant` | stub |
| Power Transmitter | [Power Transmitter](https://wiki.subnautica.com/sn2/Power_Transmitter) | Tall coil pole | `piece_power_transmitter` | placeable |
| Exterior Wall Light | [Exterior Wall Light](https://wiki.subnautica.com/sn2/Exterior_Wall_Light) | Small hull lamp | `piece_exterior_wall_light` | placeable |
| Spotlight | [Spotlight](https://wiki.subnautica.com/sn2/Spotlight) | Swivel flood lamp | `piece_spotlight` | stub |
| Habitat Beacon | [Habitat Beacon](https://wiki.subnautica.com/sn2/Habitat_Beacon) | Blinking locator puck | `piece_habitat_beacon` | stub |

---

## Utility (5)

| Item | Wiki | Visual spec | `piece_*` | Status |
|------|------|-------------|-----------|--------|
| Portable Locker | [Portable Locker](https://wiki.subnautica.com/sn2/Portable_Locker) | Handheld crate | `piece_portable_locker` | stub |
| Beacon | [Beacon](https://wiki.subnautica.com/sn2/Beacon) | Ultrasound buoy | `piece_beacon` | stub |
| Portable Oxygen Generator | [Portable Oxygen Generator](https://wiki.subnautica.com/sn2/Portable_Oxygen_Generator) | Electrolysis unit | `piece_portable_oxygen_generator` | stub |
| Work Light | [Work Light](https://wiki.subnautica.com/sn2/Work_Light) | Handheld lamp | `piece_work_light` | stub |
| Dive Elevator | [Dive Elevator](https://wiki.subnautica.com/sn2/Dive_Elevator) | Vertical elevator shaft | `piece_dive_elevator` | stub |

---

## Dev reference images

Gallery PNGs from the wiki may be saved under `docs/reference/sn2-gallery/` for art tuning (not shipped in builds).

## Assets (CC0)

See [`public/models/base/CREDITS.md`](../public/models/base/CREDITS.md) for third-party GLB used as P1 props.
