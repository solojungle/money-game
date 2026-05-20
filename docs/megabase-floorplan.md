# Megabase showcase floorplan

Spawn-facing **hub** at world origin. All 55 Habitat Builder recipes are placed once for visual review.

## Top-down (X →, Z ↓)

```
                    [MOONPOOL]
                        |
         [NOOK]----[CORR]----[HUB]----[CORR]----[HALF ROUND]
                        |       |
                   [FOUND]   [CORR]----[INTERIOR GALLERY]
                        |              (wall/ceiling/stations)
                   [CORR]
                        |
                  [DECOR ROOM]
                        |
                 [UTILITY YARD]
            (portable locker, beacon, O₂, work light, dive elevator)
```

## Wings

| Zone | Center (X, Z) | Contents |
|------|---------------|----------|
| Hub | (0, 0) | Hatch (+Z), fabricator, floor lockers, growbed, biobed, vehicle fabricator, interior wall/arch |
| Interior gallery | (9, 0) | Processor, biolab, mod station, all lights, terminals, scanner, NoA, tailing chest, wall rack |
| Decor | (0, 9) | Posters, bed, axum jar, cultivation |
| Half round | (-9, 0) | Curved observation module |
| Nook | (-9, -6) | Small nook module |
| Moonpool | (0, -9) | Vertical access shaft |
| Exterior | Hub + gallery roofs/hulls | Solar, duplex solar, turbines, spotlight, beacon, transmitter, metal farm |
| Utility yard | (0, 16) | Deployable utility pieces on seabed |
| Standard faces | Gallery ±X/±Z | Windows, interior door, ladder, tadpole dock, pillars |

Layout data: [`src/game/building/megabaseLayout.ts`](../src/game/building/megabaseLayout.ts)
