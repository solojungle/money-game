# Agent Orchestration — Parallel Work Structure

How to split **Money Game** into hundreds of small agent jobs with **orchestrators** that audit output and verify **sibling compatibility**.

**Design authority:** [`game.md`](game.md) (mechanics, §8 modules, §13 progression).  
**This file:** org chart, contracts, task shapes, audit gates — not gameplay balance.

---

## 1. Principles

| Rule | Why |
|------|-----|
| **Contract first** | Workers implement behind a published interface; never import sibling `internal/`. |
| **One concern per agent** | Each job touches ≤3 files or one data directory unless explicitly a “integration” job. |
| **Orchestrator never ships features** | Orchestrators review, merge contracts, run gates; workers write code. |
| **Kernel is scarce** | Only **CORE** orchestrator approves changes to shared types, events, save version. |
| **Data ≠ logic split** | Content agents edit JSON/TS constants; logic agents edit `.ts` impl; never both in one job without L2 sign-off. |
| **Idempotent siblings** | Modules communicate via **events + read-only queries**, not mutable cross-calls. |

---

## 2. Agent hierarchy (5 levels)

```
L0  Program Orchestrator          (whole repo health, milestone gates)
 └── L1  Domain Orchestrator      (6 domains — sibling integration)
      └── L2  Module Orchestrator (§8.x modules — CONTRACT.md owner)
           └── L3  Feature Worker  (one capability, e.g. "O₂ tick")
                └── L4  Atom Worker (one test, one JSON row, one UI widget)
```

| Level | Count (target) | Job summary | Delivers |
|-------|----------------|-------------|----------|
| **L0** | 1 | Milestone planning, conflict resolution, kernel RFC queue | `MILESTONE.md` status, merge order |
| **L1** | 6 | Audit domain; run integration tests across modules in domain | Signed **Domain Gate** checklist |
| **L2** | ~20 | Own `CONTRACT.md`; split work to L3/L4; review PRs from workers | Updated contract + `index.ts` public API |
| **L3** | 100–300 | Implement one feature slice with tests | PR touching only owned paths |
| **L4** | unlimited | Atoms: fauna row, recipe line, vitest case, CSS tweak | Single-file PR |

---

## 3. Domain map (L1)

Domains group **§8 modules** for parallel ownership. Arrows = **depends on** (read contracts only).

```
                    ┌─────────────┐
                    │    CORE     │  types, events, tick, save schema IDL
                    └──────┬──────┘
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  PLATFORM  │  │ PRESENTATION│  │   AUDIO    │
    └─────┬──────┘  └──────┬─────┘  └────────────┘
          │                │
          ▼                │
    ┌────────────┐         │
    │   INPUT    │         │
    └─────┬──────┘         │
          ▼                ▼
    ┌──────────────────────────────────────┐
    │              SYSTEMS                  │
    │ vitals · inventory · crafting · prog  │
    └───────────────┬──────────────────────┘
                    ▼
    ┌──────────────────────────────────────┐
    │               WORLD                   │
    │ biomes · weather · resources · zones  │
    └───────────────┬──────────────────────┘
                    ▼
    ┌──────────────────────────────────────┐
    │              ACTORS                   │
    │ player · creatures · vehicles         │
    └───────────────┬──────────────────────┘
                    ▼
    ┌──────────────────────────────────────┐
    │            EXPERIENCE                 │
    │ narrative · base-build · multiplayer  │
    └──────────────────────────────────────┘
```

### L1 roster

| Domain ID | Orchestrator audits | §8 modules | Repo prefix (target) |
|-----------|---------------------|------------|----------------------|
| `CORE` | Kernel RFCs, breaking changes | — (cross-cutting) | `src/game/_kernel/` |
| `PLATFORM` | Build, lint, test harness, save I/O | 8.12, 8.13 | `src/game/platform/`, `src/test/` |
| `PRESENTATION` | HUD, menus, scanner UX | 8.14 + menu components | `src/components/hud/`, `src/components/main-menu/` |
| `AUDIO` | Mix, hooks, no game logic | 8.9 | `src/audio/` |
| `SYSTEMS` | Vitals, items, craft, tech tree | 8.1, 8.2, 8.7 | `src/game/systems/` |
| `WORLD` | Biomes, weather, loot tables | 8.3, 8.10, §6.1 | `src/game/world/` |
| `ACTORS` | Movement, AI, vehicles | 8.4, 8.6 | `src/game/actors/` |
| `EXPERIENCE` | Story, bases, MP (later) | 8.5, 8.8, 8.11 | `src/game/experience/` |

*Note:* Current repo layout is flatter (`src/game/narrative`, `src/components/scene`). **L2 orchestrators** may migrate paths; workers follow `MODULE.json` ownership (§7).

---

## 4. Module tree (L2) — maps to `game.md` §8

Each module is a **work package root**. ID = task prefix.

| Module ID | Name | L1 domain | Public contract exports |
|-----------|------|-----------|-------------------------|
| `M01` | vitals | SYSTEMS | `tickVitals`, `applyDamage`, `getO2Rate` |
| `M02` | inventory | SYSTEMS | `InventoryPort`, stack rules |
| `M03` | crafting | SYSTEMS | `CraftingPort`, fabricator recipes |
| `M04` | progression | SYSTEMS | `unlockBlueprint`, `getScanState`, `teamTech` |
| `M05` | world-biome | WORLD | `BiomeConfig`, depth band queries |
| `M06` | world-resources | WORLD | outcrop spawn, harvest |
| `M07` | weather | WORLD | `WeatherService`, `weatherState` |
| `M08` | creatures | ACTORS | `CreatureBrain`, `creatureRole` |
| `M09` | player | ACTORS | swim speeds, rebreather modifiers |
| `M10` | vehicles | ACTORS | crush depth, vehicle tick |
| `M11` | base-build | EXPERIENCE | power grid, modules, lightning rod |
| `M12` | narrative | EXPERIENCE | dialogue runner (existing pattern) |
| `M13` | input | PLATFORM | `Intent`, control map |
| `M14` | save | PLATFORM | `SaveSnapshotV*`, migrate |
| `M15` | hud | PRESENTATION | vitals bar, scanner highlight |
| `M16` | audio | AUDIO | `audioService` play/stop |
| `M17` | scene-glue | PLATFORM | R3F scene, zones, camera (thin) |
| `M18` | multiplayer | EXPERIENCE | host sync (phase 2) |

**Dependency DAG (L2 may not start until deps green):**

```
CORE → PLATFORM (M13,M14) → SYSTEMS (M01–M04) → WORLD (M05–M07)
     → ACTORS (M08–M10) → EXPERIENCE (M11–M12) → PRESENTATION (M15)
AUDIO, M16 parallel after CORE events exist
M17 integrates last per milestone (composition only)
M18 after M04 + M14 stable
```

---

## 5. Kernel (CORE) — single writer policy

Only **CORE L1** merges to:

| Path | Contents |
|------|----------|
| `src/game/_kernel/types.ts` | Shared enums: `DepthBand`, `WeatherState`, `ScanState`, `CreatureRole` |
| `src/game/_kernel/events.ts` | `GameEvent` union + typed payloads |
| `src/game/_kernel/ports.ts` | Interface-only ports between domains |
| `src/game/_kernel/tick.ts` | `registerSystem(fn, order)` scheduler |

**RFC flow:** L3 worker proposes kernel change → L2 module orch → **CORE L1** approves → L4 atom workers update dependents.

---

## 6. Module contract template

Every L2 module maintains `src/game/<domain>/<module>/CONTRACT.md`:

```markdown
# M07 weather — Contract v1

## Depends on (read-only)
- CORE: WeatherState, GameEvent
- M05: biome flags stormPermanent

## Exports (public index.ts only)
- getWeatherState(): WeatherState
- tickWeather(dtMs): void
- onWeatherChange(cb): unsubscribe

## Events emitted
- weather:changed { state, biomeId }

## Events consumed
- time:phaseChanged

## Save slice
- weather: { seed, state, timer }

## Siblings may NOT
- Import ./internal/*
- Mutate weather state without tickWeather

## Tests required
- vitest: state transitions drizzle→storm
- contract test: snapshot shape
```

---

## 7. Worker job shapes (L3 / L4)

### L3 prompt skeleton (copy for agents)

```
ROLE: L3 Feature Worker
MODULE: M07-weather
TASK_ID: M07-F03
SCOPE: Implement drizzle→rain transition in internal/transitions.ts only
CONTRACT: src/game/world/weather/CONTRACT.md v1
FORBIDDEN: Edit siblings, kernel, game.md
DONE WHEN:
  - [ ] Tests in weather/transitions.test.ts pass
  - [ ] npm run test && npm run lint
  - [ ] CHANGELOG.md entry under M07
OUTPUT: PR description lists events touched + save fields (if any)
```

### L4 atom examples

| Task ID | Scope |
|---------|--------|
| `M04-D012` | Add blueprint row `seamoth_depth_mk1` to `progression/blueprints.json` |
| `M08-T044` | Vitest: peeper flees when `damage > 0` |
| `M15-U02` | CSS: `.scan-highlight--new` pulse animation |
| `M07-V01` | JSON: storm biome `storm_cape` flags |

---

## 8. Orchestrator audit checklists

### L2 — Module Orchestrator (per PR)

- [ ] Diff only touches `MODULE.json` `ownedPaths`
- [ ] No imports from `**/internal/**` outside module
- [ ] `index.ts` export surface matches `CONTRACT.md`
- [ ] Tests added/updated; coverage for public exports
- [ ] No drive-by refactors
- [ ] If save/events changed: version bump noted for CORE
- [ ] **Sibling ping:** list modules that must run tests (from §4 table)

### L1 — Domain Orchestrator (batch merge)

- [ ] All L2 sign-offs for domain in milestone
- [ ] **Integration script** `npm run test:domain:<id>` green (define per domain)
- [ ] Cross-module **contract tests** (`*.contract.test.ts`) pass
- [ ] No duplicate types outside `_kernel`
- [ ] `game.md` unchanged unless CORE approved design RFC

### L0 — Program Orchestrator (milestone)

- [ ] Dependency DAG order respected (§4)
- [ ] Playable vertical slice: menu → scene → one loop from §2
- [ ] Save/load roundtrip with all active modules
- [ ] Performance budget note (no unbounded spawn in WORLD)

---

## 9. Sibling compatibility gates

Run after any module changes exports or events.

| Gate | Command / artifact | Owner |
|------|-------------------|--------|
| **G0 Lint+unit** | `npm run lint && npm run test` | every worker |
| **G1 Contract** | `vitest **/*.contract.test.ts` | L2 |
| **G2 Domain** | `vitest --project domain-systems` (etc.) | L1 |
| **G3 Compose** | headless scene smoke / manual script in `MILESTONE.md` | L0 |
| **G4 Save migrate** | `schema.test.ts` + fixture roundtrip | M14 + CORE |

### Contract test pattern (siblings)

```ts
// M07-weather.contract.test.ts — owned by M07 L2, run by WORLD L1
import { getWeatherState } from "@/game/world/weather";
import type { WeatherState } from "@/game/_kernel/types";

it("exports WeatherState compatible with kernel", () => {
  const s = getWeatherState();
  const _check: WeatherState = s;
  expect(_check).toBeDefined();
});
```

---

## 10. Communication between modules

| Mechanism | Use for | Avoid for |
|-----------|---------|-----------|
| **Kernel `GameEvent` bus** | fire-and-forget (weather changed, blueprint unlocked) | synchronous game state reads |
| **Ports (`ports.ts`)** | infrequent queries across domains | per-frame hot paths |
| **Zustand slices** | UI + player session (existing `gameStore`) | creature AI internals |
| **Save snapshot** | persistence boundaries | runtime coupling |

**Rule:** If module A needs module B every frame → merge into same module or add CORE-approved shared service.

---

## 11. Directory ownership (`MODULE.json`)

Each L2 module adds:

```json
{
  "id": "M07",
  "domain": "WORLD",
  "ownedPaths": ["src/game/world/weather/**"],
  "publicEntry": "src/game/world/weather/index.ts",
  "dependsOn": ["CORE", "M05"],
  "siblings": ["M06", "M08", "M11"]
}
```

Orchestrators reject PRs outside `ownedPaths` unless `TASK_ID` is `INTEGRATION-*` and L1 approved.

---

## 12. Parallelization playbook

### Phase A — Foundation (low parallelism, ~10 agents)

| Parallel | Serial |
|----------|--------|
| CORE kernel stub + events | — |
| M13 input, M14 save scaffold | CORE first |
| M15 HUD shell | CORE types |

### Phase B — Systems burst (~40 agents)

| Module | Example parallel L4 jobs |
|--------|--------------------------|
| M01 | O₂ curve, hunger tick, damage types, near-death fade |
| M02 | stack rules, hotbar, pickup |
| M03 | one recipe file per fabricator tier |
| M04 | 20 blueprint JSON rows, scan state machine, teamTech stub |

### Phase C — World + actors (~80 agents)

| Module | Parallelism |
|--------|-------------|
| M05 | one biome JSON + spawn table per agent |
| M06 | one outcrop type handler |
| M07 | transition, VFX hook, lightning rod **logic** split |
| M08 | one species = data + AI + test |
| M10 | seamoth / cyclops / tadpole as separate L3 jobs |

### Phase D — Experience + polish (~50+ agents)

M11 room types, M12 dialogue nodes, M16 sting per biome, M15 widget per HUD element.

---

## 13. Orchestrator agents (roles)

| Agent | Inputs | Outputs |
|-------|--------|---------|
| **L0 Program** | milestone goal, open PRs | merge train order, blockers list |
| **L1 Domain** | PRs tagged `domain:WORLD` | Domain Gate sign-off comment |
| **L2 Module** | PRs tagged `module:M07` | CONTRACT version bump, sibling test list |
| **Auditor (read-only)** | diff + CONTRACT | pass/fail markdown against §8 checklist in `game.md` |

**Auditor prompt snippet:**

```
You are L2 Auditor for M07. Compare PR to CONTRACT.md v1 and game.md §6.1, §8.10.
Fail if: new export not in CONTRACT, imports from M08 internal, missing tests, changes save without M14 review.
List sibling modules to re-run: M05, M08, M11, M15.
```

---

## 14. Task ID convention

```
<ModuleId>-<Kind><Seq>

Kind:
  F = feature (L3)
  D = data/content (L4)
  T = test (L4)
  U = UI (L4)
  C = contract/doc (L2)
  I = integration (L1 only)

Examples:
  M04-F01  team blueprint pool
  M08-D17  creature def boneshark
  WORLD-I01  domain integration (L1 only)
```

---

## 15. What workers must read (minimal)

1. `game.md` — only sections referenced in `TASK_ID` line  
2. Their module `CONTRACT.md`  
3. `src/game/_kernel/types.ts` — if touching types, stop and escalate  

Never assign `game.md` edits to L3/L4.

---

## 16. Link from design doc

Add to [`game.md`](game.md) §7 pillar 5: implementation structure lives in **`agent-orchestration.md`**.

**Milestone tracking:** vertical slice Definition of Done and L0 sign-off live in [`MILESTONE.md`](MILESTONE.md) (v0).

---

*Last updated: 2026-05-17*
