# Visual Language — Placeholder World + SN2-Style UI

Reference screenshots (Subnautica 2 EA):
- `assets/Screenshot_2026-05-17_at_5.56.28_PM-013fa74e-*.png` — dialogue / reader overlay
- `assets/Screenshot_2026-05-17_at_5.56.32_PM-88b9507c-*.png` — exploration HUD
- `assets/Screenshot_2026-05-17_at_5.57.21_PM-e328fede-*.png` — blueprint unlock toast

**Rule:** 3D world = **simple geometric placeholders**. UI = **polished, translucent, cyan-on-dark** like the references — UI carries fidelity, not meshes.

---

## 1. Overall look & feel

| Layer | Treatment |
|-------|-----------|
| **World** | Low-poly primitives, flat/vertex colors, no PBR hero assets in v1 |
| **Water** | Dark murk, red-brown tint in deep zones; floating particle specks (marine snow) |
| **UI** | Glassmorphism: frosted blue panels, thin cyan glow borders, white caps text |
| **Lighting** | Underwater gloom; UI elements self-illuminate (always readable) |

**Mood:** Clinical sci-fi HUD floating over an oppressive, blurry deep-sea void — information is crisp, environment is soft and threatening.

---

## 2. Screenshot A — Dialogue / reader overlay

*What you see:* A modal “reader” over gameplay. Background is out-of-focus dark red terrain and a bright diagonal streak (artifact or distant geometry).

### Layout (top → bottom)

```
┌─────────────────────────────────────────────────────────────┐
│  [vitals cluster TL]     ┌──────────────────────────────┐  │
│                          │  large frosted panel (image)  │  │
│  O₂ ring + small icons   │  dark blue content rect       │  │
│                          ├──────────────────────────────┤  │
│                          │  subtitle pill / quote line   │  │
│                          └──────────────────────────────┘  │
│                                                             │
│   CLOSE (ESC)      ╭── SKIP (↓) ──╮      SELECT (🖱)      │
│   + soft dome glow   semi-circle HUD   + soft dome glow     │
└─────────────────────────────────────────────────────────────┘
```

### Top-left vitals cluster

- **Three small circles** (stacked): health (+, green), food (yellow), water (blue) — icon inside, colored rim glow.
- **Large O₂ gauge:** thick **cyan arc** (~270°) as fill; center text `O₂` over large number (`37`). Arc = remaining oxygen, not a full 360° pie.

### Center panel

- **Outer frame:** wide rounded rectangle, **semi-transparent blue**, 1px **light-cyan** border, heavy corner radius.
- **Inner viewport:** darker opaque blue rectangle (placeholder for photo / 3D preview / log art).
- **Caption:** single line in cyan-white below inner box, conversational tone (PDA/blackbox quote).

### Bottom action rail

- Three prompts on one baseline; each has **uppercase label** + **key cap** in a small rounded square.
- **Center “SKIP”** sits in a **large dark semi-circle** rising from bottom edge (dock shape) — primary action emphasis.
- **Side prompts** (CLOSE, SELECT): smaller, with **soft white hemispherical glow** behind text (floor reflection effect).
- **Build string** bottom-right in tiny grey monospace.

### UI tokens (A)

| Token | Value |
|-------|--------|
| Panel fill | `rgba(20, 40, 80, 0.55)` |
| Border glow | `#6ec8ff` / cyan |
| O₂ arc | `#00d4ff` |
| Health rim | `#4ade80` |
| Food rim | `#fbbf24` |
| Water rim | `#60a5fa` |
| Key cap | dark fill, light border, 4px radius |

---

## 3. Screenshot B — Exploration HUD

*What you see:* No center modal — full view of deep environment. HUD anchors top and bottom.

### Top center — navigation column

```
        N   NE   E
 330 345  15  30  60  75  105
        ─── 208m ───
           ⌢ arc ⌢
            (🔥)
```

- **Compass strip:** horizontal degree ticks; cardinals **N, NE, E** in bold white; intermediate numbers smaller.
- **Depth:** dominant **`208m`** white sans-serif directly under compass center.
- **Arc meter:** shallow white **V / smile curve** under depth; short **orange segment** on arc (temperature, crush warning, or boost heat — treat as configurable status strip).
- **Boost icon:** small **circle**, cyan ring, **orange flame/arrow** inside (movement / thrust state).

### Top right — pinned recipes

- **“Unpin all”** pill button (cyan outline).
- Counter **`1/8`** — pinned recipe slots used.
- **Row of circular slots** (4 visible), each:
  - Dark grey glass circle
  - Silhouette icon (ingot, wire, machine part)
  - **Red `current/required`** above name when short (e.g. `0/2`)
  - **White all-caps label** under icon (`TITANIUM INGOT`, etc.)
- Row follows slight **curve** along screen edge (arc layout).

### Bottom — main HUD bar

- **Thick pill bar** along bottom: dark blue fill, **bright cyan outline**, very large corner radius.
- **Left:** concentric **target rings** — orange core dot, white ring, faint outer ring (health / core stat / crosshair affordance).
- **Right:** dark **curved panel** overlapping bar (inventory or tools — mostly off-screen in crop).

### UI tokens (B)

| Token | Use |
|-------|-----|
| Missing resource | `#ef4444` on `0/n` counts |
| Pinned slot bg | `rgba(30, 35, 45, 0.8)` |
| Compass text | `#f8fafc` |
| HUD bar stroke | 2px cyan glow |

---

## 4. Screenshot C — Blueprint unlock toast

*What you see:* A **horizontal notification card** sliding into view (typically upper-left or center-top). Triggered on `unlockBlueprint` — matches Nolt **763↑ “New Blueprint Acquired”** ([`game.md`](game.md) §6.3 P0).

### Layout

```
┌──────────────────────────────────────────────────────────┐
│ ▌ BUILDER TOOL │ NEW BLUEPRINT SYNTHESIZED              │
│ ───────────────────────────────────────────────────────  │
│  [3D icon]     INTERIOR WALL UNLOCKED!                   │
│                                                          │
│  [TAB ⌨]  TO VIEW IN PDA                                 │
└──────────────────────────────────────────────────────────┘
  ↑ cyan vertical tab on left edge
```

### Anatomy

| Zone | Content | Style |
|------|---------|--------|
| **Left tab** | Small vertical **cyan pill** protruding from left edge | Accent anchor, not full-height border |
| **Header** | `{SOURCE} \| NEW BLUEPRINT SYNTHESIZED` | 10–11px, ALL CAPS, white, above cyan **hairline** |
| **Body** | Item **icon** (left) + `{ITEM NAME} UNLOCKED!` (right) | Icon = simple 3D preview or placeholder box; title 18–22px bold caps |
| **Footer** | Key cap **`TAB`** + `TO VIEW IN PDA` | 10px caps; key cap = rounded rect, dark fill, white legend |

### Container

- **Shape:** wide rounded rectangle (~520×120px ref scale).
- **Fill:** semi-transparent **dark teal/navy** `rgba(8, 26, 32, 0.88)` with subtle top-to-bottom gradient.
- **Border:** thin **cyan** line along **top** of header band + **left edge** highlight (not a full box outline).
- **Shadow:** soft outer glow `0 0 24px rgba(0, 200, 255, 0.15)` — floats over world.

### Dynamic fields (for `BlueprintToast` component)

```ts
type BlueprintToastProps = {
  source: string;           // "BUILDER TOOL" | "SCANNER" | "DATA BOX"
  itemName: string;         // "INTERIOR WALL"
  icon?: ReactNode;         // placeholder: white box mesh thumbnail
  viewKey?: string;         // default "TAB"
  viewHint?: string;        // default "TO VIEW IN PDA"
  onDismiss?: () => void;
};
```

### Behavior

| Rule | Value |
|------|--------|
| **Trigger** | `GameEvent: blueprint:unlocked` (MP: all clients) |
| **Stack** | Queue max 3; newest on top |
| **Duration** | ~5s auto-dismiss; hover pauses timer |
| **Enter** | slide from left + fade 200ms |
| **Exit** | fade out 150ms |
| **Audio** | short positive synth chirp (`M16`) |
| **Scan states** | Do not use for `duplicate` fragments — only first unlock |

### UI tokens (C)

| Token | Value |
|-------|--------|
| Header rule | `1px solid rgba(0, 242, 255, 0.6)` |
| Left tab | `#00f2ff`, 4×32px rounded |
| Title text | `#ffffff`, font-weight 700 |
| Key cap bg | `rgba(0, 0, 0, 0.4)` border `rgba(255,255,255,0.3)` |

**Icon placeholder (v1):** white `Box` thumbnail at 64×64 — swap for recipe icon mesh later.

---

## 5. 3D placeholder shapes (world)

All placeholders: **MeshStandardMaterial** or flat unlit color; **no textures** in v1. Scale in meters; axis Y up.

| Entity | Shape | Color (suggested) | Notes |
|--------|--------|-------------------|--------|
| **Terrain / seabed** | `Plane` or low-seg terrain; rocks = `Dodecahedron` clusters | Mud `#3d2820`, rock `#4a4a4a` | Large masses, soft edges |
| **Coral** | `Cone` + `Torus` stacks, `Icosahedron` blobs | Pink `#e879a0`, purple `#a78bfa`, lime `#86efac` | Clumped; non-uniform scale |
| **Kelp / plants** | Tall thin `Cylinder` or `Box` strips | Olive `#65a30d` | Sway in shader later |
| **Fish (small)** | `Capsule` or stretched `Sphere` | Cyan `#22d3ee` or yellow `#fde047` | 0.3–1.5m; flock as copies |
| **Fish (medium)** | `Capsule` + `Cone` nose | Same family, 2–4m | |
| **Leviathan** | Elongated `Capsule` + `Box` fins | Dark `#1e293b`, eye emissive dot | 20–50m; slow patrol |
| **Player** | `Capsule` 1.8m | White `#e2e8f0` or team color | No arms; camera 1st person hides |
| **Small sub** | `Capsule` hull + `Box` cockpit + `Cylinder` thruster | Yellow `#eab308` | Seamoth/Tadpole read |
| **Mothership** | Elongated `Box` + `Cylinder` mid | Grey `#64748b` | Cyclops-scale blockout |
| **Scout pod** | Small `Sphere` tethered | Orange `#f97316` | Detachable probe |
| **Resources** | `Octahedron` (crystals), `Box` (metal) | By type from game data | Spin slowly when loose |
| **Base modules** | `Box` rooms, `Plane` glass (alpha) | Blue-grey `#334155`, glass `rgba(150,200,255,0.3)` | Snap grid visible in debug |
| **Wrecks / POI** | Broken `Box` piles | Rust `#92400e` | Landmark silhouettes |

**Readability rules:**
- Silhouette > detail; color codes role at distance.
- Apex creatures **2×+** player sub length.
- Pickups **emissive pulse** (slow) so they read in murk.

---

## 6. Environment (to match UI background)

- **Fog:** heavy exponential; far geometry fades to black-red.
- **Murk color:** `#1a0a0a` → `#0a0508` gradient with depth.
- **Particles:** tiny white dots, low count, slow drift (marine snow).
- **Vignette:** subtle in post or CSS overlay for non-3D menus.

---

## 7. Typography & motion

| Use | Style |
|-----|--------|
| HUD numbers (depth, O₂) | Bold geometric sans, tabular figures |
| Labels | ALL CAPS, letter-spacing `0.06em`, 11–12px |
| Dialogue | Sentence case, 14–16px, cyan-white |
| Toast title | Bold caps 18–22px (§4) |
| Motion | UI fades 150–250ms; arcs lerp smoothly; toast slide 200ms; no bounce |

---

## 8. Component checklist (React HUD)

Map to [`game.md`](game.md) §8.14 / **M15**:

| Component | Reference |
|-----------|-----------|
| `VitalsCluster` | Screenshot A — O₂ ring + 3 mini orbs |
| `CompassDepth` | Screenshot B — compass + `Nm` + arc |
| `PinnedRecipes` | Screenshot B — unpin, slots, red counts |
| `HudBar` | Screenshot B — bottom pill + left rings |
| `ReaderOverlay` | Screenshot A — panel + SKIP dock |
| `ActionPrompt` | CLOSE / SKIP / SELECT pattern |
| `ScanHighlight` | pulsing cyan outline on `new` fragments (design in game.md §13.6) |
| `BlueprintToast` | §4 — queue on `blueprint:unlocked`; TAB hint to PDA |
| `InventoryScreen` | §10 — grid + equipment rings |

---

## 10. Inventory & equipment screen (PDA)

Reference: SN2 PDA inventory screenshot (`assets/Screenshot_2026-05-18_at_12.43.50_PM-*.png`) — full **PDA shell** with tab bar, 5×5 grid, equipment panel, pinned recipes (top-right), integrated quick slots, footer prompts. Play spawn uses an **empty grid**; dev stress fill via `createKitchenSinkInventory()`.

### Layout

```
┌─────────────────────────────┬──────────────────────────┐
│  6×5 item grid (30 slots)   │  status icons (top)      │
│  rounded squares, cyan rim  │  ┌────────────────────┐  │
│  "+" at grid intersections  │  │ mannequin + rings  │  │
│  purple crystal placeholders│  │ equipment circles  │  │
└─────────────────────────────┴──────────────────────────┘
```

### Left — inventory grid

| Element | Spec |
|---------|------|
| Grid | **5 columns × 5 rows** (25 slots); rounded square cells |
| Cell fill | Dark blue glass `rgba(15, 35, 50, 0.85)` |
| Border | 1px teal/cyan `#26A69A` |
| Intersections | Dim white **"+"** at four-corner meets (decorative) |
| Items | Icon/thumbnail per stack; minerals use **purple crystal** placeholder (`#a78bfa` clip-path gem) |
| Stack count | Small white numeral bottom-right when `count > 1` |

### Right — character & equipment

| Element | Spec |
|---------|------|
| Mannequin | Centered silhouette; **teal** `#26A69A` body, **orange** `#F57C00` shoulder/knee accents |
| Background | Fine light grid behind figure |
| Equipment slots | **Circular** rings around body: mask (head), tank (back), suit & gloves (**padlock** when locked), fins (feet) |
| Status row | Top-center: teal speed orb, orange boost orb |

### Colors (inventory UI)

| Token | Hex |
|-------|-----|
| Navy panel | `#0B1A26` |
| Teal accent | `#26A69A` |
| Orange accent | `#F57C00` |
| Overlay scrim | `rgba(3, 8, 12, 0.72)` |

### Input

| Key | Action |
|-----|--------|
| `Tab` / `I` | Toggle inventory (PDA) |
| `WASD` | Swim horizontal (camera-relative) |
| `Space` / `C` | Swim up / down |
| `Shift` | Sprint swim |
| `F` | Flashlight |
| `Esc` | Close PDA / unlock pointer |
| `Esc` | Close inventory |

**Component:** `PdaShell.tsx` + `pda/*` — wired to `gameStore`; hover tooltips, LMB equip/assign, RMB drop/pin.

---

## 11. Fabricator (station UI)

Reference: `assets/Screenshot_2026-05-18_at_1.40.*.png`

| Phase | UI |
|-------|-----|
| Open | Category rail only + CLOSE |
| After category pick | Subsections + circular recipes + detail on hover |
| Craft queue | Bottom pill `current/total` + green progress fill |

Footer actions use `InputPrompt` bindings (`fabricatorCraft` → mouse left, `fabricatorPin` → mouse right, `stationClose` → Esc) — not hardcoded gamepad letters.

**Component:** `FabricatorShell.tsx` + `fabricator.css`

---

## 12. Storage transfer

Reference: `assets/Screenshot_2026-05-18_at_1.37.16_PM-*.png`

| Element | Spec |
|---------|------|
| Layout | INVENTORY (5×5) \| STORAGE (5×3) side by side |
| Panels | Glass grid + cyan L-brackets; hover = cyan top bar on slot |
| Transfer | Click source slot, click destination |

**Component:** `StorageLockerShell.tsx` + shared `ItemGrid`

---

## 13. What we are *not* matching in v1

- Final Subnautica creature meshes or PBR materials
- Exact SN2 font files (use Inter / Rajdhani / similar geometric sans until licensed)
- Full bottom hotbar inventory (only partial bar visible in ref — extend when M02 ships)

---

*Linked from [`game.md`](game.md). Asset paths: `assets/Screenshot_*.png`.*
