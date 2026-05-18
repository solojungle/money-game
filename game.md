# Money Game — Design Source of Truth

Underwater survival-exploration inspired by Subnautica. We **do not ship SN2’s backlog**; we use community signal + SN lineage to build **deeper SN1 polish** with **clearer pacing** and **modular systems**.

---

## 1. Subnautica 2 — Reference Breakdown

| Layer | What SN2 does |
|-------|----------------|
| **Premise** | Colonists on *Cicada* crash on wrong ocean world (not 4546B). Prior colony failed: virus, rogue ship AI, missing settlers. |
| **Core loop** | Manage O₂ / hunger / thirst → gather → craft → build base → unlock depth/gear → explore biomes → story beats + threats. |
| **New axis** | **Genetic mods** (BioMods = swappable passives; Adaptions = permanent story unlocks) parallel to blueprints. |
| **Traversal** | Tadpole (detachable probe for tight caves), Wakemaker (personal mobility), procedural bases + vertical elevators. |
| **Social** | Up to 4-player co-op (EA focus still solo); proximity VO planned. |
| **Story (EA)** | ~**Chapters 1–3 of 10**; environmental + PDA/audio lore; mods tied to progression. |
| **Setting** | New planet, biomes (e.g. kelp, coral, spires, void); Leviathans as apex threats. |

---

## 2. Main Game Loop

```
SURVIVE (vitals, threats)
    → EXPLORE (biome, resource, blueprint/mod)
    → CRAFT / UPGRADE (tools, vehicle, base, biology)
    → UNLOCK DEPTH / ZONE (pressure, story gate)
    → REPEAT with higher stakes + narrative payoff
```

**Gates:** depth band, vehicle crush depth, blueprint scan (see §13), story flag, biomod slot.

---

## 2.1 Controls (SN1 reference)

**Source:** [Subnautica Wiki — Key Bindings](https://subnautica.fandom.com/wiki/Key_Bindings) (default QWERTY PC). Rebindable in SN; we match defaults in `src/controls/controlMap.ts` and map to `SwimIntent` in `src/game/input/intent.ts`.

| Action | SN1 default | Money Game |
|--------|-------------|------------|
| Move forward / back / strafe | W / S / A / D | Same |
| Swim up / down | Space / C | Same (+ Left Ctrl as descend alt) |
| Sprint swim | Left Shift | Same (faster swim; O₂ drain TBD) |
| Look | Mouse | Pointer-lock first-person |
| Interact / holster | E | E (scan, fabricator, lockers) |
| PDA / inventory | Tab | Tab (+ I) |
| Flashlight / propulsion load | F | F (flashlight stub) |
| Pause / unlock cursor | Esc | Esc closes PDA; exits pointer lock |
| Scan / use tool (LMB) | Left Mouse | `onUseLeft` — scan fragment zones |
| Alt hand (RMB) | Right Mouse | Flashlight toggle |
| Quick slots | 1–5 (SN2 EA); up to 8 | Keys 1–8; wheel cycles slots |
| Deconstruct | Q | `onDeconstruct` (build mode, future) |
| Reload tool | R | `onReload` (future) |

**Underwater vs surface:** SN1 uses the same bindings; on land, Space is jump. Play mode is **always underwater** — no ground jump; vertical motion is world-up/down (Space/C), horizontal is camera-relative on the XZ plane.

**HUD interaction prompts** (see `interactionHints.ts`): scan fragment → LMB icon; fabricator / locker → E icon.

**Not yet bound:** seaglide deploy, map (M), full tool-use on LMB beyond scan stub.

---

## 3. Why Players Keep Playing (Retention)

| Driver | Mechanism |
|--------|-----------|
| **“Only way is down”** | Better gear → deeper biomes → rarer mats → next tier. |
| **Wonder + dread** | Beauty + unknown + Leviathan-tier fear; player is prey, not apex. |
| **Discovery drip** | Scans, new fauna/flora, audio logs, base fantasy. |
| **Agency fantasy** | Base as home; vehicles as mobility power spikes. |
| **Narrative pull** | What happened here? What is the AI hiding? |
| **Co-op comfort** | Shared risk; optional — solo must remain complete. |

*Design intent:* every session should offer **one reachable “next thing”** (recipe, room, biome edge, log).

---

## 4. Story Progression Model

| Phase | Player experience |
|-------|-------------------|
| **Arrival** | Crash/survival tutorial; establish vitals + fabricator loop. |
| **Settlement** | First base; meet rogue/mission AI voice; foreshadow prior colony. |
| **Investigation** | Logs, wrecks, infected zones; learn virus + AI malfunction. |
| **Adaptation** | Biomods / pressure tools; mid-game biomes; faction or territorial conflict hints. |
| **Confrontation** | Truth about colonists, AI, planet; endgame depth / Leviathan set-pieces. |

**Pacing lesson (SN2 EA feedback):** front-load **mechanics**, not **lore dumps** — story via short triggers + optional archives.

---

## 5. Lineage — SN1 → Below Zero → SN2

| | **Subnautica 1** | **Below Zero** | **Subnautica 2** |
|--|------------------|----------------|------------------|
| **Map** | Large, sparse stretches | Smaller, denser | New world; procedural base; multi-level habitats |
| **Story** | Slow-burn mystery | Named hero, faster plot, more land | 10-chapter arc; colony + virus + AI |
| **Progression** | Blueprints only | QoL UI (battery/food on icons, pinning) | Blueprints + **genetic mods** |
| **Building** | Fixed modular rooms | Similar + land bases | Procedural sculpting, paint, lights |
| **Multiplayer** | Mod only | No | Native 4-player co-op |
| **Tone** | Isolation horror | More character humor | Co-op + “change what it means to be human” |

**Takeaway for us:** keep SN1’s **depth + dread**, BZ’s **QoL clarity**, avoid BZ’s **rushed story** and SN2 EA’s **thin SN1 systems**.

---

## 6. Community Signal (Nolt >50 votes) — Our Stance

**Source:** 450 posts (>50↑ each) from [subnautica2.nolt.io/top](https://subnautica2.nolt.io/top).  
**Consolidation:** **109** posts merged into **27 duplicate themes**; **341** remain unique one-offs.  
**Data files:** `subnautica2-nolt-consolidated.json` · `subnautica2-nolt-consolidated.md` (full post links).

Players want **SN1 depth on SN2’s skeleton**, not a genre pivot. *Combined ↑ sums votes per theme (overlap possible).*

**Priority key:** **P0** = v1 / EA · **P1** = soon after vertical slice · **P2** = post-EA · **—** = defer / out of scope for web v1

### 6.1 Consolidated themes (27)

| # | Theme | Posts | Combined ↑ | **Our response** | Pri |
|---|--------|------:|-----------:|------------------|-----|
| 1 | Large submarine / Cyclops-scale | 15 | 5,067 | Mothership (Cyclops-class) + moonpool dock + crew slots later; not day-one | P1 |
| 2 | Aquariums, containment & eggs | 9 | 4,042 | Alien tank room, pickup/hatch eggs, optional breeding lab **P2** | P1 |
| 3 | Weather, rain & storms | 11 | 3,818 | §6.2 — mechanics + lightning power, not VFX-only | P0 |
| 4 | Fish killability / immersion | 3 | 3,714 | Small fauna react + optional harvest; **apex not farmable** | P0 |
| 5 | Sleep / skip night | 3 | 3,549 | Bed module → time skip (cost/risk); ties M11 + M07 day/night | P1 |
| 6 | Glass floors, roofs & observation | 3 | 3,490 | Glass hull pieces + observation deck snap modules | P1 |
| 7 | Voice / proximity chat | 6 | 2,219 | Proximity VO in MP (**M18**); text chat fallback | P2 |
| 8 | Curved / circular / multi-height rooms | 2 | 2,032 | Arc segments + atrium multi-floor (not full SN2 sculpt) | P1 |
| 9 | FOV slider | 5 | 2,001 | Settings: FOV + reduced weather particles | P0 |
| 10 | Growable plants / farming | 3 | 1,970 | Interior grow beds + edible crops; merge with water filter survival loop | P1 |
| 11 | Replay blackbox / audio logs | 2 | 1,831 | Codex replay for scanned logs (**M12**, **M15**) | P1 |
| 12 | Bigger / huge map | 2 | 1,762 | 3–4 km target (§13.1); stream biomes, don’t ship empty ocean | P1 |
| 13 | Achievements (Steam) | 3 | 1,388 | Platform layer when on Steam; not web MVP | — |
| 14 | Vehicle color & naming | 2 | 1,229 | Name + palette on small sub / mothership (**M10**) | P1 |
| 15 | Jukebox / base music | 5 | 1,153 | Interior jukebox module + biome stings (**M16**) | P2 |
| 16 | Leviathan combat music timing | 5 | 1,129 | Aggro-gated music only; no leviathan sting on zone enter | P1 |
| 17 | Prawn suit / exosuit | 2 | 426 | Walker suit (**M10**) for deep + drill deposits | P1 |
| 18 | Ladders & wall ladders | 3 | 1,040 | Ladder snap + climb anim in base corridors | P2 |
| 19 | Stairs | 2 | 555 | Stair module between multi-height floors | P2 |
| 20 | Mod support | 2 | 511 | Defer; versioned data formats for future mods | — |
| 21 | Base power / light toggles | 2 | 489 | Per-room light switch + colored lights; power save mode | P1 |
| 22 | PDA pause | 3 | 438 | Pause sim when PDA/codex open (solo); MP host-time only | P1 |
| 23 | Mac OS support | 5 | 367 | Web-first; native Mac if wrapper ships | — |
| 24 | Time capsules | 2 | 344 | Async player messages **P2** (needs backend) | P2 |
| 25 | Bring back PDA voice | 2 | 284 | Short VO stingers (“vitals stabilizing”) not full SN1 babble | P2 |
| 26 | Performance / FPS HUD | 2 | 222 | Dev/settings FPS counter + quality presets | P0 |
| 27 | Dedicated / co-op servers | 2 | 195 | Host-based co-op first; dedicated servers **—** | P2 / — |

### 6.2 Weather events (theme #3 detail)

**Lead post:** [#56 Weather events](https://subnautica2.nolt.io/56) — 1,702↑, Nolt **Planned**. Consolidated **11 posts · 3,818↑**.

**[#56 Weather events](https://subnautica2.nolt.io/56)** — 1,702↑ (10th in >50 set), **Planned** on Nolt. Players want **mechanics**, not a VFX-only overlay.

| Pitch | Our response |
|-------|----------------|
| **Rain & dynamic storms** at/near surface | Weather state machine: drizzle → storm; affects visibility, surface currents, small-craft handling |
| **Persistent storm zones** (thunder, always rough) | At least one biome/micro-biome tagged `stormPermanent`; louder audio, higher wave action |
| **Lightning → base power** | Exterior **Lightning Rod** module stores charge during storms; balances vs solar (deep bases still need reactors) |
| **Cycles near surface** ([#2658](https://subnautica2.nolt.io/2658) 688↑) | Stronger weather above ~**80 m**; calm/deep underwater default (exploration clarity below) |
| **Fauna × weather** ([#637](https://subnautica2.nolt.io/637) 110↑) | Spawn/behavior modifiers by `weatherState` + time-of-day (see 8.4) |
| **Huge waves / void storms** ([#507](https://subnautica2.nolt.io/507) 149↑) | Phase 2: directional swell in storm biomes; optional “void edge” megastorm POI |
| **Waterspouts, currents** ([#605](https://subnautica2.nolt.io/605) 96↑) | Phase 2: localized hazards pushing player/vehicles |
| **Toggleable weather VFX** ([#3545](https://subnautica2.nolt.io/3545) 54↑) | Settings: **Reduced particles** (accessibility / perf), gameplay rules unchanged |

**P0 scope:** day/night + dynamic storms + one storm biome + lightning rod. **P2:** tsunami void, waterspouts, full current sim.

### 6.3 High-vote standalone posts (no duplicate cluster)

Single post above 50↑ — still ship if they fit pillars:

| ↑ | Idea | **Our response** | Pri |
|----|------|------------------|-----|
| 2060 | Nearly drowning (consciousness fade) | Near-death vignette + audio, not instant blackout (**M01**) | P0 |
| 1901 | Water filtration station | Base water filter module (**M11**) | P1 |
| 1882 | Vehicle entering animation | Enter/exit anim on small sub (**M10**) | P1 |
| 1552 | Show battery % | On icon + HUD (**M15**, **M02**) | P0 |
| 1124 | Horror | Dread via sound + creature pacing, not jumpscare spam (**M08**, **M16**) | P0 |
| 874 | Queue PDA audio while swimming | Non-blocking codex VO (**M12**) | P2 |
| 763 | “New Blueprint Acquired” | `BlueprintToast` on `unlockBlueprint` — [`visual-language.md`](visual-language.md) §4 (**M04**, **M15**, **M16**) | P0 |

### 6.4 Survival crafting bundle (optional merge)

*Not merged in Nolt scrape; logical group for agents:* **water filtration (#1901) + growable plants (theme #10)** → one **“life support”** base tier: filter + grow bed + bed skip share power grid (**M11**).

### 6.5 Out of scope / defer (web v1)

Achievements, Mac native, mod SDK, dedicated servers — track in backlog; don’t block P0 vertical slice.

**341 unique one-offs:** see `subnautica2-nolt-consolidated.md` for full list + links; triage into modules via [`agent-orchestration.md`](agent-orchestration.md) `M##-D###` tasks.

---

## 7. Product Pillars (Money Game)

1. **Exploration pays** — every trip risks O₂ for a tangible unlock.
2. **Bases feel lived-in** — power, water, grow, observe, sleep.
3. **Creatures believe the world** — ecology reactivity without trivializing horror.
4. **Story whispers, then shouts** — optional depth; critical path stays lean.
5. **Modular code** — features behind interfaces; content data-driven. Parallel agent structure: [`agent-orchestration.md`](agent-orchestration.md).
6. **Placeholder world, polished UI** — primitives in 3D; SN2-style HUD — [`visual-language.md`](visual-language.md).

---

## 8. Modular Features & Build Requirements

Each module: **goal → requirements → deps → out of scope (v1)**.

### 8.1 Vitals & Survival
- **Goal:** Constant tension without annoyance.
- **Req:** O₂ (surface refill + tanks), hunger/thirst ticks, damage types (creature, pressure, drowning), near-death recovery (fade, not instant blackout), death/respawn with resource penalty.
- **Deps:** HUD, inventory, biome pressure table.
- **Not v1:** Complex disease sim.

### 8.2 Inventory & Crafting
- **Goal:** SN1-style gather → fabricator → upgrade chain.
- **Req:** Item defs (JSON/schema), stack rules, blueprint unlock on scan, **scan VFX** (`new` / `known` / `duplicate`), pinned recipes, battery % on powered items, fabricator queues; duplicate known fragment → titanium (or team mat).
- **Deps:** World resources, UI crafter, `game/progression` data (§13).
- **Not v1:** Full physics grab-all.

### 8.3 Exploration & World
- **Goal:** Biome identity + gated depth.
- **Req:** Biome metadata (light, fog, ambient, spawn tables), **depth bands** (§13.3), outcrop whitelist per biome, POI markers, map fog / scanner reveal, seamless biome blending.
- **Deps:** Streaming/chunk loader, save discovered set, crush-depth on vehicles.
- **Not v1:** Full open-world land continent.

### 8.4 Creatures & Ecology
- **Goal:** World feels alive; Leviathans stay scary.
- **Req:** AI states (idle, flee, investigate, aggro), **`creatureRole` tags** (§13.8), hit/react for small fauna, loot rules (apex = no kill or rare), eggs + hatch (optional containment), ambient schools; **fauna modifiers** for `weatherState` + time-of-day (§6.1); target **~45–55** species with clear teach/reward roles.
- **Deps:** Physics overlap, audio stingers, biome spawn tables, weather service.
- **Not v1:** Full ecosystem sim.

### 8.5 Base Building
- **Goal:** Expressive habitats with SN1 function.
- **Req:** Hull integrity + power grid, rooms (I/L/multi-height), glass floors/roofs, curved segments (or snap arcs), hatch/airlock, grow bed, water filter, alien tank/aquarium, bed → time skip, interior paint/lights; **Lightning Rod** exterior module (storm-charge → battery, §6.1).
- **Deps:** Snap grid, ghost placement, save structure per base, weather service.
- **Not v1:** Full procedural sculpt like SN2.

### 8.6 Vehicles
- **Goal:** Mobility milestones.
- **Req:** Small sub (Seamoth-class) with interior enter anim, mothership (Cyclops-class) with dock + **noise/speed modes**, detachable scout (Tadpole-class), **speed + crush depth** per tier (§13.2), depth modules (MK1→MK3 chain at Mod Station), damage + repair, naming/colors, MP attach indicators; docked small craft immune to mothership crush depth.
- **Deps:** Underwater physics, base vehicle bay, progression tables.
- **Not v1:** Crew NPC AI; SN1 has no vehicle *speed* modules.

### 8.7 Progression (Blueprints + Mods)
- **Goal:** Two parallel upgrade paths; **depth is the primary gate**, not map size.
- **Req:** Blueprint scanner + tech tree data; fragment counts (1/2/3/4); story/data-box unlocks; equip slots for **BioMods** (swappable) and **Adaptions** (story-locked); discovery-gated mods (sample creature → unlock); **MP: one scan unlocks for all players** (host tech pool).
- **Deps:** Creatures, story flags, save `unlockedBlueprints[]`.
- **Not v1:** Full gene splicing minigame.

### 8.8 Narrative
- **Goal:** Mystery without tutorial fatigue.
- **Req:** Chapter/beat data model, dialogue/PDA nodes, world triggers (zones), flags in save, replayable audio codex, **Act 1 = mechanics first**.
- **Deps:** `game/narrative/*` pattern (runner, JSON scripts).
- **Not v1:** Branching multiplayer story divergence.

### 8.9 Audio & Atmosphere
- **Goal:** Dread + wonder.
- **Req:** Biome ambiences, creature calls by proximity, music stingers on threat, UI/HUD mix, optional jukebox in base.
- **Deps:** `audioService` hooks.
- **Not v1:** Full orchestral adaptive score.

### 8.10 Time, Weather & Day/Night
- **Goal:** Surface atmosphere + mechanics tied to base/ecology (§6.1).
- **Req:**
  - Day/night cycle (tunable length); night visibility penalty; bed skip with cost/risk.
  - **`weatherState`**: `clear` | `drizzle` | `rain` | `storm` (host-synced in MP).
  - Surface band (~0–**80 m**): stronger cycles; underwater mostly unaffected except near-surface chop.
  - Dynamic storms: visibility, audio, push currents; small subs harder to pilot topside.
  - **`stormPermanent`** biome flag: always stormy + thunder; exploration risk/reward.
  - **Lightning strikes** → rod modules charge power grid (cap + efficiency vs solar).
  - Settings: **reduced weather particles** (gameplay unchanged).
- **Deps:** Lighting, vitals tick, biome metadata, power grid (8.5), fauna tables (8.4).
- **Not v1:** Seasonal climate, tsunami/void megastorms, waterspouts/whirlpools, weather-driven gear malfunctions.

### 8.11 Multiplayer (Later)
- **Goal:** Optional co-op without splitting design.
- **Req:** Host-authoritative vitals/inventory, revive, proximity VO, shared base permissions; **shared blueprint pool** on scan; PDA shows unlock credit optional.
- **Deps:** Net layer, all modules idempotent, §13 gating data.
- **Not v1:** Dedicated servers.

### 8.12 Save & Persistence
- **Goal:** Resume anywhere.
- **Req:** Versioned save schema, world flags, base layouts, inventory, discovered blueprints, player transform + vehicle state.
- **Deps:** `game/save/schema` pattern.
- **Not v1:** Cloud cross-save.

### 8.13 Input & Player
- **Goal:** Responsive first-person underwater movement (SN1 defaults — §2.1).
- **Req:** `SwimIntent` (WASD + ascend/descend + sprint), pointer-lock FP camera, interaction hints, inventory lock movement.
- **Deps:** `game/input/intent`, `controls/controlMap`, `FirstPersonCamera`, `Player`.
- **Not v1:** Controller glyphs per platform; seaglide vehicle mode.

### 8.14 UI / HUD
- **Goal:** SN1 clarity + BZ QoL.
- **Req:** O₂/food/water, depth, health, hotbar, interaction prompt, fabricator UI, codex, battery % on items; scanner highlights — **new** (bright pulse), **known** (muted/checkmark), **duplicate** (grey + titanium feedback); **`BlueprintToast`** queue (§4 in [`visual-language.md`](visual-language.md)).
- **Deps:** Store or UI state slice per concern, tech pool state.

---

## 9. Suggested Implementation Order

Follow §13.7 ladder. **Active milestone (v0):** [`MILESTONE.md`](MILESTONE.md) — DoD, play paths, L0 sign-off.

Milestones:

```
1. Vitals + swim speeds + depth O₂ curve + HUD
2. Outcrops (limestone/sandstone) + crafting + scan states (new/known)
3. Two biome bands + fragment unlocks + seaglide
4. Small sub + crush depth + narrative Act 1
5. Base (power, grow, bed) + shale band + rebreather
6. Creatures (roles + reactivity + one apex)
7. Mothership + moonpool + depth MK chain
8. Walker + large deposits + biomods
9. Weather / day-night
10. Multiplayer (shared teamTech + scan highlights)
```

---

## 10. Mapping to Repo (Today)

| Exists | Module |
|--------|--------|
| `game/narrative/*`, `DialogueModal` | 8.8 Narrative (prototype) |
| `game/input/intent`, `controls/` | 8.13 Input |
| `game/save/schema` | 8.12 Save |
| `game/state/movement`, `GameClock` | Movement gating; tick bridge |
| `scene/*`, `SensorZone` | Zones / interaction foundation |
| `audio/*` | 8.9 Audio hooks |

---

## 11. Open Decisions

- [ ] Setting: new planet vs homage to 4546B? *(default: new planet, SN1-style gating)*
- [ ] Combat: tools-only vs limited weapon crafting? *(default: tools + vehicle defenses, no rifle)*
- [x] Fish killability: **tiered** — small fauna react/harvest; apex Leviathan-class not farmable
- [x] Progression numbers: **§13** (SN1 wiki ratios, tuned labels)
- [ ] EA scope: solo-only until which milestone?
- [ ] Art pipeline: low-poly kits vs custom Leviathan budget?

---

## 12. References

- [Subnautica 2 — Game8 gameplay/story](https://game8.co/articles/reviews/subnautica-2-gameplay-and-story)
- [Subnautica 2 — PC Gamer summary](https://www.pcgamer.com/games/survival-crafting/subnautica-2-guide)
- [Nolt board (>50 votes)](https://subnautica2.nolt.io/top) — §6 consolidated (27 themes + standalones); `subnautica2-nolt-consolidated.md`
- Retention: [Game Studies — pervasive dread](https://gamestudies.org/2404/articles/evans); [Ars — hunted design](https://arstechnica.com/features/2019/06/war-stories-how-subnautica-made-players-love-being-hunted-by-sea-creatures/)
- Progression research: [SN1 Depth Levels](https://wiki.subnautica.com/sn/Depth_Levels), [Swimming Speed](https://wiki.subnautica.com/sn/Swimming_Speed), [Vehicles](https://wiki.subnautica.com/sn/Vehicles), [Fragments](https://wiki.subnautica.com/sn/Fragments_(Subnautica)), [Shale Outcrop](https://wiki.subnautica.com/sn/Shale_Outcrop), [Crater Fauna](https://wiki.subnautica.com/sn/Template:Crater_Fauna), [SN2 Biomes EA](https://wiki.subnautica.com/sn2/Biomes)

---

## 13. Progression & Gating (Design Spec)

Wiki-backed reference (SN1) with **Money Game target numbers**. Implement as data under `game/progression/` (JSON/TS), not hardcoded.

### 13.1 Map & scale

| | SN1 (reference) | Money Game (target) |
|--|-----------------|---------------------|
| Horizontal play | ~**4 km** crater | **3–4 km** playable; void/out-of-bounds beyond |
| Depth (content) | ~0–**1700 m** (vehicles); floor ~1120 m | **0–1400 m** EA; room to expand |
| Gating axis | **Depth + crush depth** > walking distance | Same |

### 13.2 Movement & vehicles (m/s)

**Player swim** ([wiki](https://wiki.subnautica.com/sn/Swimming_Speed)):

| Config | Underwater | Notes |
|--------|------------|--------|
| Base | 5.75 | Our baseline `player.swimBase` |
| + Fins | 7.16 | +1.41 |
| + Ultra glide | 8.13 | +2.38 |
| + Reinforced suit | −0.75 | Heat/armor tradeoff |
| Holding tool | −0.75 | |
| Seaglide | **11** | Fins do not stack (SN1) |
| O₂ drain | 1/s → 2/s @100m → **3/s @200m+** | Flat 1/s with Rebreather |

**Vehicles** — SN1 reference → our tiers:

| Tier | Role | Speed (ref → target) | Crush stock → max |
|------|------|----------------------|-------------------|
| Scout glide | Early | Seaglide 11 → **11** | — |
| Small sub | Seamoth-class | 11.25 (→19.5 strafe) → **10–12** | 200→900 → **150→900** |
| Scout pod | Tadpole-class | SN2 8–10 → **8–10** | TBD MK1–3 |
| Mothership | Cyclops-class | 6.7 / 8.9 / 10.4 → **7 / 9 / 10** | 500→1700 → **400→1400** |
| Walker | Prawn-class | ~6.4 walk + jets → **6** | 900→1700 → **600→1400** |

**Rules:** no vehicle speed modules (SN1); depth MK chain at vehicle bay → Mod Station; Cyclops **flank = louder** (attracts aggro); child vehicle docked in parent = no crush damage.

### 13.3 Depth bands (danger ↔ reward)

| Band | Depth (m) | Player pressure | Outcrops / loot | Creatures | Unlocks |
|------|-----------|-----------------|-----------------|-----------|---------|
| **0 Starter** | 0–80 | Normal O₂; **weather strongest here** (§6.1) | Limestone (Cu/Ti), fish | Passive, 1 small predator | Fabricator, fins, seaglide (2 frags) |
| **1 Early** | 80–200 | O₂ ramp @100m | + Sandstone (Ag/Pb/Au) | Stalker, crashfish caves | Small sub (3 frags), MK1 depth |
| **2 Mid** | 200–450 | **3/s O₂** w/o rebreather | **Shale** (diamond/Li/Au) — not in band 0–1 biomes | Sand/bone sharks | Moonpool, laser, MK2 depth |
| **3 Deep** | 450–800 | Rebreather expected | Magnetite, nickel, wrecks | Reaper routes, ghosts (juv.) | Mothership (9 frags), MK2–3 |
| **4 Abyss** | 800–1400 | Heat/brine modules | Large deposits (drill), kyanite | Leviathan set-pieces | Walker + drill, endgame story |

**Biome rule:** better materials live in **higher bands** with **more aggressive** `creatureRole`s and/or environmental damage (radiation, heat, acid brine).

### 13.4 Resource tiers (outcrops)

| Outcrop | Drops | Biome gate (SN1 pattern) |
|---------|-------|---------------------------|
| Limestone | 50% Cu / 50% Ti | Ubiquitous shallow |
| Sandstone | Ag, Pb, Au | Kelp, plateaus — **not** pure safe shallows |
| Shale | Diamond, Li, Au | **Excludes** shallows, kelp, grassy plateaus |
| Large deposit | 7–22 units, one mineral | Deep; requires **drill arm** |

### 13.5 Blueprint unlock rules

| Fragments | Examples (SN1) |
|-----------|----------------|
| 1 | Rare tablets, transmitter |
| 2 | Seaglide, moonpool, stasis, propulsion cannon |
| 3 | Small sub, laser cutter, scanner room, cyclops *per part* |
| 4 | Walker suit |

**Channels:** fragment scan; data box; story event (e.g. radiation suit after disaster); terminal. **Duplicate scan:** known blueprint → 2 titanium (or duplicate VFX only in MP if already team-unlocked).

**Multiplayer (required):** `unlockBlueprint(id, sourcePlayer?)` adds to **host `teamTech` set**; all clients receive PDA notification. Scanner UI uses §13.6.

### 13.6 Scan & PDA highlights

| State | Visual | Behavior |
|-------|--------|----------|
| `new` | Bright outline / pulse | Contributes to fragment count |
| `known` | Muted, checkmark | Fauna: codex only; fragment: titanium |
| `duplicate` | Grey flash | Same as known fragment post-unlock |

### 13.7 Progression ladder (implementation order)

```
Shallow gather → seaglide → small sub → sandstone wiring → rebreather
  → shale biomes + MK2 depth → mothership + moonpool → walker + drill
  → abyss large deposits + biomods + story gates
```

Aligns with §9; each step should **soft-lock** the next band until depth module or tool is crafted.

### 13.8 Creature roles (content tags)

SN1 Crater: **~49** species ([list](https://wiki.subnautica.com/sn/Template:Crater_Fauna)) — 13 carnivore, 21 herbivore, 8 scavenger, 7 leviathan types. Tag every species:

| `creatureRole` | Purpose | Hurts? | Gives / teaches |
|----------------|---------|--------|-----------------|
| `food` | Survival loop | No | Calories, water tradeoff |
| `ambient` | Life | No | Wonder |
| `predator` | Zone control | Yes | Fear, salvage (teeth, etc.) |
| `cave_hazard` | Spatial awareness | Yes | — |
| `disruptor` | Sensory twist | Yes | EMP, mesmer |
| `apex` | Route gate | Yes | Depth fear; no farm |
| `utility` | Risk/reward | Maybe | Gas, eggs, shale uncover |
| `story` | Narrative | Varies | Flags, cure, logs |

### 13.9 Data model (stubs)

```ts
// game/progression/types.ts (planned)
type DepthBand = "starter" | "early" | "mid" | "deep" | "abyss";

type ScanState = "new" | "known" | "duplicate";

type CreatureRole =
  | "food" | "ambient" | "predator" | "cave_hazard"
  | "disruptor" | "apex" | "utility" | "story";

type WeatherState = "clear" | "drizzle" | "rain" | "storm";

interface DepthBandConfig {
  id: DepthBand;
  minM: number;
  maxM: number;
  o2Multiplier: number;      // 1 | 2 | 3
  outcropTypes: string[];
  defaultSpawnTags: CreatureRole[];
}

interface VehicleTierConfig {
  id: string;
  speedMs: number;
  crushDepthM: number;
  crushDepthMk3M: number;
  noiseRadiusM?: number;       // mothership speeds
}

interface BlueprintConfig {
  id: string;
  fragmentsRequired: number;
  depthBandMin?: DepthBand;
  storyFlag?: string;
  sharedUnlock: true;          // always true in MP
}
```

---

*Last updated: 2026-05-17*
