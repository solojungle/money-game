# Milestone v0 — Vertical Slice

**Status:** In progress (play mode + FP swim landed)  
**Authority:** [`game.md`](game.md) §9, §13.7 · [`agent-orchestration.md`](agent-orchestration.md)

---

## Definition of Done

| # | Criterion | Owner module | Done |
|---|-----------|--------------|------|
| 1 | Menu → **Play Single Player** → playable scene | M17, menu | [x] |
| 2 | First-person underwater swim (SN1 keybinds) | M09, M17 | [x] |
| 3 | Seabed + water fog; late-game test layout | M17, WORLD | [x] |
| 4 | O₂ display + depth/compass HUD | M01, M15 | [x] |
| 5 | Scan fragment zone → `unlockBlueprint` → `BlueprintToast` | M04, M15 | [x] |
| 6 | Tab / I PDA inventory + equipment (empty spawn, SN2 interactions) | M02, M15 | [x] |
| 7 | Save/load roundtrip (v4 play schema) | M14 | [x] |
| 11 | E at fabricator → SN2 fabricator UI; craft with materials | M03, M15 | [ ] |
| 12 | E at storage locker → transfer items; persists in save | M02, M15 | [ ] |
| 8 | `npm run test` passes | PLATFORM | [x] |
| 9 | `npm run lint` passes | PLATFORM | [x] |
| 10 | `npm run build` passes | PLATFORM | [x] |

---

## Play path (v0)

1. Main menu → **Play Single Player** (loading chrome unchanged)
2. Click canvas for pointer-lock; **WASD** swim, **Space**/**C** up/down, **Shift** sprint
3. **Tab** / **I** — full PDA (inventory, blueprints, signals, logs, databank, adaptations)
4. Walk to scan zone → **E · Scan fragment**
5. **E** at fabricator → fabricator UI (categories → recipes → craft queue)
6. **E** at storage locker → INVENTORY | STORAGE transfer
7. **F** toggles flashlight stub; **Esc** closes PDA / stations (free cursor)

---

## L0 sign-off checklist (Program Orchestrator)

- [x] Dependency DAG §4 in `agent-orchestration.md` — CORE kernel merged before SYSTEMS burst
- [ ] All DoD rows above verified manually once
- [ ] G0 `npm run lint && npm run test` green
- [x] G4 Save: `schema.test.ts` roundtrip; legacy modes migrate to `play`
- [x] No duplicate kernel types outside `src/game/_kernel/`
- [ ] `MILESTONE.md` status updated to **Done** when slice ships

---

## Gates (quick reference)

| Gate | Command |
|------|---------|
| G0 | `npm run lint && npm run test:run` |
| G1 | `npm run test:run -- **/*.contract.test.ts` |
| G3 | Manual: menu → Play → scan → toast |
| G4 | `npm run test:run -- src/game/save/schema.test.ts` |

---

*Last updated: 2026-05-17*
