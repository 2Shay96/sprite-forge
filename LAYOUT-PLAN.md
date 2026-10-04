# Sprite Forge — Layout Makeover Plan

Studio 0.6.2 → 0.7.0 "Mojave Terminal" UI · written 1 October 2026 · for handoff to the implementing agent (ChatGPT/Codex).

This is a layout, wording and theme plan. **No tool behaviour changes.** Every control that exists today keeps working, keeps its ID, and is reachable in the new layout. Section 9 maps all 230 IDs to their new homes.

---

## 0. Ground rules (read first)

1. **Edit `src/`, never only `SpriteForge.html`.** Run `node sprite-forge/build.mjs` to regenerate the bundle and `package.mjs` for the Trial ZIP (per ALPHA-HANDOFF "Layout makeover handoff").
2. **Preserve:** every `id`, every existing `data-tab` / `data-panel` value, every `data-setting` attribute, every `<option value>`, every input `min`/`max`/`step`, the element tag of each ID (tests mock by tag), script order, and the `[hidden]{display:none!important}` rule.
3. **Allowed additions:** new wrapper elements, new classes, new IDs, one new `data-tab`/`data-panel` value (`fixes`), and two new JS modules appended **after** `action-controls` in `build.mjs` (the bundle must still have exactly 2 `<script>` tags — `tests/release.cjs` checks this).
4. **No data format changes.** Project archive stays v7, Source Pack stays v6. The new "animation checklist" is derived from existing project data, not saved as new fields.
5. **Keep it offline.** No CDN, no Google Fonts link. Fonts are embedded as base64 by `build.mjs` (see §6.2), which needs one CSP change: `font-src 'none'` → `font-src data:`.
6. **Fallout-inspired, not Fallout-branded.** No Fallout wordmark, Vault Boy, Vault-Tec logo, Pip-Boy artwork or faction insignia. We borrow the palette, type feel and texture only.
7. **The preview canvas stays clean.** Grain, scanlines and tint never sit on top of the sprite canvas — you need true colours to judge art.

---

## 1. What's wrong today (short audit)

From screenshots of all seven tabs at 1440×900:

- **Seven equal-weight tabs hide the real order of work.** Adding idle/attack animations lives in step 06 ("States & test → Add / manage animations"), after you've already tuned ground, directions and timing for the main clip only.
- **The "Main clip ID" field defaults to `dance`** and sits in the Import panel before anything is imported, with three paragraphs of help. New users can't tell what "clip", "main", "ID" and "state" mean or how they relate.
- **Frame corrections (keyframes) are buried** in a collapsed `<details>` at the bottom of the Animation (timing) panel, so the second-most fiddly task has no home of its own.
- **Directions panel shows everything at once:** mode select, 8-button grid, orbit slider, side width, rear darkening, mirror, a help disclosure, an import select, an import button, a report, a download button, plus an 8-view sheet under the stage. The same 8 direction buttons also appear under the stage.
- **Preview-only settings are mixed in with authoring settings:** preview background and Sunny reference live in Ground & scale; speaker volume lives in Audio; zoom is on the stage. This blurs the "sprite size vs preview zoom" distinction.
- **Test/demo buttons are scattered** (Load test frames, Load drift test, Add two test tones, Load action test) and look like real workflow steps.
- **Layout bug:** the left-rail "WORKBENCH" title overflows into the preview column and overlaps "Main clip".
- The Audio panel is one 50-control scroll; the Encounter card is always visible even when you're only inspecting a state.

---

## 2. The new workflow: 4 steps

| New step | What you do | Old tabs it contains |
|---|---|---|
| **01 ANIMATIONS** | Name the character. Tick which animations you have (walk, idle, attack…). Import each one; it's named and assigned to the right game states as it comes in. | 01 Import frames + "Add / manage animations" (from 06) |
| **02 TUNE** | For each animation, in order: **a** Size & ground → **b** Directions → **c** Timing → **d** Frame fixes. Switch animation with the chips above the preview. | 03 Ground & scale, 04 Directions, 02 Animation, and Frame corrections (new sub-step) |
| **03 SOUND** | Pick a cue, add takes, choose how it plays, test it. | 05 Audio |
| **04 TEST & EXPORT** | **a** Field test (check each state, run an encounter) → **b** Export (pre-flight checklist, Save Project, Export Source Pack). | 06 States & test, 07 Export |

This follows your order exactly: choose animation → import → name → resize/ground → directions → FPS → keyframe fixes → audio → game-state test → export.

### Left rail (always fully visible — 4 steps, 6 sub-items)

```
01  ANIMATIONS            3/3 imported          ← data-tab="import"
02  TUNE                  walk · idle · attack  ← new header button → clicks data-tab="ground"
     a  Size & ground                          ← data-tab="ground"
     b  Directions                             ← data-tab="directions"
     c  Timing                                 ← data-tab="animation"
     d  Frame fixes                            ← data-tab="fixes"  (new)
03  SOUND                 4 cues with takes     ← data-tab="audio"
04  TEST & EXPORT         Unsaved changes       ← new header button → clicks data-tab="states"
     a  Field test                             ← data-tab="states"
     b  Export                                 ← data-tab="pack"
────────────────
TUNING  walk (main)
24 frames · 256 × 256 px                        ← #clip-label, #media-summary
```

All original `data-tab` buttons stay visible and clickable, so existing Playwright tests that click `[data-tab="…"]` keep working. Every panel ends with a **NEXT ▸** button (e.g. "Next: Directions ▸", and after Frame fixes "Next animation: idle ▸", and after the last animation "Next: Sound ▸").

### Overall frame

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ ▣ SPRITE FORGE  Salvatore · ● UNSAVED       TEST KITS ▾  FX ◐   OPEN   SAVE   EXPORT ▸ │ 60px
├──────────────┬────────────────────────────────────────────────┬───────────────────────┤
│ 01 ANIMATIONS│ ANIMATION [WALK·MAIN ✓] [IDLE ✓] [ATTACK ✓]  ↶ ↷│ 02b · DIRECTIONS      │
│▌02 TUNE      │ ┌────────────────────────────────────────────┐ │ ───────────────────── │
│   a Size     │ │ S / FRONT · GENERATED           ┌─┬─┬─┐    │ │ Which way does the    │
│ ▸ b Directns │ │                                 ├─┼─┼─┤    │ │ artwork face?         │
│   c Timing   │ │            (clean sprite canvas)└─┴─┴─┘    │ │ [FRONT] [LEFT] [RIGHT]│
│   d Fixes    │ │                                            │ │ …                     │
│ 03 SOUND     │ │ ════════════ ground ══════════   VIEW ⚙    │ │ ▸ ADVANCED            │
│ 04 TEST &    │ └────────────────────────────────────────────┘ │                       │
│    EXPORT    │ |◂  ▶ PLAY  ▸|  ↺    FRAME 3 / 23     0.125 s   │                       │
│              │ ━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │                       │
│ TUNING walk  │ 24 frames · 24 fps · cycle 1.000 s · display 12 │ [ NEXT: TIMING ▸ ]    │
│ 24 fr 256²   │ ▸ FILMSTRIP   ▸ ALL 8 VIEWS                     │                       │
│              │ > Ready. Your media stays on this computer._    │                       │
└──────────────┴────────────────────────────────────────────────┴───────────────────────┘
   232px                         flexible                               360px
```

- **Header:** brand, project name (`#preview-name` text mirrored) and save state (`#dirty` as a chip), **Test kits ▾** menu, **FX** toggle, Open / Save / Export.
- **Animation chips** above the stage drive the existing `#active-clip` select (set `.value`, dispatch `change`). `#active-clip` stays in the DOM (visually hidden or as the narrow-screen fallback). In Step 04 the chips become a read-only "NOW PLAYING: attack (from state)" label, because the state decides the clip there.
- **Stage overlay:** view badge (`#view-label`, `#view-kind`) top-left; **mini compass** (`#quick-directions`, restyled as a 3×3 grid) top-right; **VIEW ⚙** popover bottom-right holding everything that is *preview only*: zoom (`#zoom`), preview background (`#background`), height reference (`#showReference`), speaker volume (`#preview-volume`). Label the popover "Preview only — never exported".
- **Readouts:** the four metric tiles become one mono line. Filmstrip (`#strip`) and 8-view sheet (`#contact-zone`) become collapsible drawers under the transport.
- **Status line** reads like a terminal prompt: `> Ready. Your media stays on this computer._` (cursor blink off under reduced motion).

---

## 3. Screen-by-screen spec

Each panel shows **≤ 6 primary controls**. Everything else goes into one **▸ ADVANCED** disclosure per panel. Static help text moves behind a small **?** toggle; dynamic help that the JS rewrites (`#ground-help`, `#source-facing-help`, `#state-policy-help`, `#bank-mode-help`, `#audio-cue-help`) stays visible as a one-line hint.

**Scope badges** — every control group gets a tiny tag so you always know what a change affects:
`THIS ANIMATION` · `ALL ANIMATIONS` · `THIS VIEW` · `THIS CUE` · `THIS STATE` · `PROJECT` · `PREVIEW ONLY`.
This is the cheapest way to keep the handoff's required distinctions visible (sprite size vs preview zoom, fixed root vs per-frame fixes, selected animation vs assigned state, and so on).

### 3.1 Step 01 — ANIMATIONS (`data-panel="import"`)

```
01 · ANIMATIONS
CHARACTER                                                     PROJECT
  Name     [ Salvatore                ]   shown in the pack and, later, in-game
  Pack ID  [ salvatore                ]   folder name · lower-case · keep it stable

WHICH ANIMATIONS DOES YOUR CHARACTER HAVE?
  [■] MAIN    walk     24 frames ✓   plays whenever a state has nothing else   [ REPLACE ]
  [■] IDLE    idle     12 frames ✓   → Neutral idle                             [ ⋯ ]
  [■] ATTACK  attack   — not yet —   → Attack player  → Attack enemy            [ IMPORT FRAMES ]
  [ ] DEFEAT  defeat                  → Defeat transition  → Defeated item
  ▸ More slots: Roam · Deploy · Repack · Custom…

  [ NEXT: TUNE WALK ▸ ]
  ▸ Import rules & limits
```

**Rows and default state assignments** (state chips are toggles; user can untick any):

| Row | Default ID | Assigns to states (Simulator keys) | Notes |
|---|---|---|---|
| Main (required, always ticked) | `walk` suggestion | none — Main is the fallback for every unassigned state | Uses `#clipId`, `#import`, `#files` |
| Idle | `idle` | `neutral_idle` | |
| Attack | `attack` | `hostile_attack`, `companion_combat` (two separate chips — they stay separate assignments) | Extra pre-ticked option: "Play once, then return (recommended for attacks)" → sets `policy:'once_return', retrigger:'restart'` like `#state-attack-defaults` |
| Defeat | `defeat` | `defeat_transition`, `defeated` | under "More slots" if you prefer only 3 visible |
| Roam | `roam` | `neutral_roam` (+ optional `hostile` approach) | More slots |
| Deploy | `deploy` | `deploying` | More slots |
| Repack | `repack` | `repack` | More slots |
| Custom… | user types ID | user picks chips | |

**Row behaviour (new `src/roster.js`, drives existing controls — no import logic is duplicated):**

1. Ticking a row expands it: an editable ID field (lower-case, digits, underscores — same rule as today) and **IMPORT FRAMES**.
2. **Main row:** if the ID differs from `settings.clipId`, apply it through the existing `#clipId` change path (that path already re-points state assignments when the main ID changes). Then `$('import').click()`.
3. **Extra rows:** set `$('new-clip-id').value = id`, then `$('import-clip').click()` (its handler validates the ID and opens `#clip-files`). Keep this chain synchronous inside the user's click so the browser allows the file picker.
4. The existing import review dialog opens. Add one new line, `#review-context`, set by the roster before the click: "Importing as **ATTACK** · will be used for Attack player, Attack enemy". Nothing else in the dialog changes.
5. On accept, `roster.refresh()` (called from `SF.Studio.afterRender`, see §7) notices the new clip ID and applies the row's ticked state chips with the same API the action test uses:
   `SF.Store.commitPlayback(() => { p.stateClips[state] = id; /* attack: */ p.statePlayback[state] = {...SF.Playback.defaults(), policy:'once_return', retrigger:'restart'}; })`.
   Show a status line: "attack → Attack player, Attack enemy. Change this any time in 04 › Field test."
6. Row status is **derived** on every refresh from `SF.Clips.ids(p)`, frame counts and `p.stateClips`, so reopening a project rebuilds the checklist without new save fields. Ticked-but-not-imported rows are held in memory only.
7. Row **⋯** menu: Replace frames (main → `#import`; extras → not supported today, so show "Remove and re-import"), **Remove** (select the clip via `#active-clip`, then `$('remove-clip').click()`), **Tune ▸**.
8. Optional nice-to-have: drop image files onto a row to import into that row (set `#clip-files.files` from the drop, dispatch `change`).

**"Rename files" — interpretation.** I've read "be prompted to rename files" as "name the animation as you import it". That name becomes the export folder (`source-pack/animations/<name>/<direction>/…`), so it is what renames the files in the pack. Image files on disk are never renamed. If you meant something else (e.g. renaming individual frame files), flag it before Phase 2.

**Other Step 01 content:** `#characterId` gets an optional auto-fill from Name (slugified) until the user edits it by hand. `#validation` and the limits text go into "▸ Import rules & limits". The stage drop-zone hint becomes explicit: "Drop images to **replace MAIN (walk)** frames · drop a .spriteforge.zip to open a project".

### 3.2 Step 02 — TUNE (per animation)

The animation chips at the top of the stage choose what you're tuning. The rail footer shows "TUNING walk (main)". The `ground` tab already resets the preview to the front view; keep that.

#### 02a · Size & ground (`data-panel="ground"`) — `THIS ANIMATION`

Primary:
- *(extra animations only, shown first)* **[■] Use main animation's ground & size** (`#ground-inherit`) + **Compare with main** (`#ground-compare`).
- **Ground point** X / Y (`#anchorX`, `#anchorY`) + **AUTO-DETECT** (`#suggest`). One-liner: "Drag the crosshair to the spot between the feet. This is where the animation touches the floor."
- **Size in game** `#scalePercent` + `#scale-slider` with hint "Not the same as preview zoom".
- **Shape:** NORMAL / WIDE / TALL (`#ground-normal/-wide/-tall`) and a "Stretch / squash ▸" mini-disclosure with `#shapeLinked`, width and height fields + sliders.

Advanced: `#referenceCanvasHeightUnits`, whole-animation nudge X/Y (`#offsetXUnits`, `#offsetYUnits`), `#ground-copy`, `#ground-reset`, readouts `#ground-size`, `#ground-output`, `#ground-clip`.

Moved out: `#background`, `#showReference` → VIEW ⚙ popover.

#### 02b · Directions (`data-panel="directions"`) — compact

1. **Which way does the artwork face?** `THIS ANIMATION` — `#source-facing` (moved here from Animation) shown as FRONT / LEFT / RIGHT segmented buttons that set the select and dispatch `change`. Hint `#source-facing-help` underneath.
2. **How should the other angles look?** `ALL ANIMATIONS` — `#directionMode` as three option cards:
   - **Same image every angle** (`billboard`) — "simplest; one picture faces the camera"
   - **Auto-generate angles** (`generated`) — "squashes, mirrors and darkens your front art; doesn't invent hidden sides"
   - **Upload my own angles** (`imported`) — "use real side/back artwork"
3. **Compass** — `#direction-picker` restyled as a 3×3 grid via CSS `grid-area` keyed on `[data-direction]` (no change to how the JS creates the buttons):

```
 ┌────┬────┬────┐
 │ NW │ N  │ NE │    ● your art   ◐ generated   ○ uses front
 ├────┼────┼────┤
 │ W  │ ⌖  │ E  │    click = preview that angle
 ├────┼────┼────┤
 │ SW │ S● │ SE │
 └────┴────┴────┘
```
   Status dots need one small addition in `directionButtons()`: set `button.dataset.kind` from `SF.Directions.resolve(...).kind`. In "Upload my own" mode, clicking a cell also sets `#direction-import` to that direction, and a single button reads **UPLOAD SE · FRONT RIGHT FRAMES** (`#import-direction`). `#direction-report` sits under it.
4. Advanced / "Generator settings" (only shown in generated mode): `#generatedSideWidthPercent` (rename "Side-view squash"), `#rearDarknessPercent` ("Darken back views"), `#mirrorDirections`, orbit slider `#orbit` + `#orbit-value`.
5. The 8-view sheet (`#contact-zone`) is **collapsed by default** under the stage as "▸ ALL 8 VIEWS", with `#contact-download` inside the drawer. Small JS change in §7.

#### 02c · Timing (`data-panel="animation"`) — `THIS ANIMATION`

- **Loop style** `#playbackMode` as LOOP / PING-PONG / ONCE segmented.
- **Animation FPS (timing)** `#sourceFps` — "frames per second at 100% speed; sets how long one cycle takes".
- **Speed %** `#playbackSpeedPercent`.
- **Display FPS (smoothness only)** `#displayFps` + presets `#presets` — "makes motion choppier or smoother without changing cycle length".
- **Use frames** `#rangeStart` **to** `#rangeEnd`.
- The rest of the notes ("ping-pong doesn't double endpoints", "frames count from 0") go behind **?**.

#### 02d · Frame fixes (new `data-panel="fixes"`, new `data-tab="fixes"`) — `THIS VIEW`

Move `#correction-details` here unchanged. Force it open (`open` attribute) and hide its `<summary>` with CSS. It must stay open, because `keyer.js` only draws the seam canvas when `#correction-details.open` is true. Entering this sub-step needs no JS mode change: the existing tab listener already puts any non-`states` tab into workbench mode, which drag-to-align requires.

Primary layout is a 4-step guide:

```
Use this when the character drifts or changes size inside the frame.
 ① FIRST FRAME (#correction-first)  ② DRAG ART ONTO THE CROSSHAIR (#correction-drag)
 ③ ADD KEYFRAME (#correction-save)  ④ LAST FRAME (#correction-last) → repeat ②③
 Compare:  [ ORIGINAL ] [ FIXED ]   (#correction-original / #correction-corrected)
```

Also primary: `#correction-frame`, `#correction-list`, Move X/Y, **Size at this frame** (`#correction-scalePercent` + slider), `#correction-revert` ("Undo unsaved nudge"), `#correction-status`, and the small seam canvas `#correction-seam`.

Advanced: `#correction-view`, `#correction-enabled`, `#correction-link`, `#correction-copy`, resize-around X/Y (`#correction-pivotX/Y`) + `#correction-pivot`, `#correction-interpolation`, `#correction-delete`, `#correction-reset`, `#correction-output` + `#correction-bounds`, `#correction-review` + `#correction-review-list`.

Keep the wording that says adjustments are temporary until saved as a keyframe. It's one of the handoff's required distinctions.

### 3.3 Step 03 — SOUND (`data-panel="audio"`)

Two-level layout: **cue list → selected cue card**.

**Cue list** (new UI, read-only view over existing data; clicking sets `#audio-slot` and dispatches `change`). Group the 17 cues and show a take count per cue:

| Group | Cues |
|---|---|
| Music & ambience | Combat music, Idle background, Roaming background, Defeated sound |
| Voice & reactions | Idle / roaming quips, Entering idle / roaming, Becoming hostile, Entering companion combat, Enemy alert, Victory |
| Combat | Attack, Hurt / hit |
| Lifecycle | On defeat, Summon / deployment, Pickup, Inventory, Repack / dismiss |

`#audio-slot` stays in the DOM as the narrow-screen fallback.

**Selected cue card:**
1. Header: cue name, `#audio-cue-help`, `#audio-undo` / `#audio-redo` (icons), **[■] Cue on** (`#bank-enabled`).
2. **Sound source** `#audio-reference` ("This cue's own takes" / "Reuse another cue").
3. **Takes:** `#audio-take` + **ADD TAKES** (`#import-audio`), compact icon row (↑ `#audio-up`, ↓ `#audio-down`, replace `#audio-replace`, remove `#audio-remove`), `#audio-info`, waveform `#waveform`, ▶ ORIGINAL (`#audio-source`) / ▶ EXPORTED WAV (`#audio-converted`).
4. **How it plays:** `#bank-mode` as ONCE / LOOP / REPEAT / QUIPS segmented + `#bank-mode-help`, then the fields that matter in every mode: take order `#bank-selection`, `#bank-avoidLast`, `#bank-firstDelay`. A "Repeat timing" sub-card holds exactly the four fields the JS already disables outside REPEAT / QUIPS: `#bank-gapMin`, `#bank-gapMax`, `#bank-maxPlays`, `#bank-playOnEntry`. It appears only in those two modes, via a CSS class that new UI code sets from `#bank-mode`'s value.
5. **Test bar:** ▶ TEST THIS CUE (`#audio-bank-test`), PAUSE (`#audio-bank-pause`), STOP (`#audio-stop`), live `#audio-bank-status`.

Advanced: "Edit take" (name `#audio-label`, weight `#audio-weight`, preview mute `#audio-muted`, trim/loop fields, `#audio-gainDb`, `#audio-peak`), "Trigger rules & seed" (existing details), "Sound activity" (`#audio-activity`).

Moved out: `#preview-volume` + `#volume-value` → VIEW ⚙. `#defeat-audio-preview` and `#release-audio-preview` → Step 04 Field test (they already jump to the states tab when clicked). `#audio-demo` → Test kits.

### 3.4 Step 04 — TEST & EXPORT

#### 04a · Field test (`data-panel="states"`)

1. **Mode:** CHECK ONE STATE (`#gallery-mode`) / RUN ENCOUNTER (`#encounter-mode`) as a big segmented control.
2. **State board** (new, derived): a 10-row table of every state → assigned animation → playback rule, built from `p.stateClips` and `SF.Playback.binding`. It closes the loop with the Step 01 checklist ("all my states are accounted for"). Clicking a row sets `#gallery-state` and dispatches `change`. Unassigned rows read "main (walk)" in dim text.
3. **Selected state editor:** `#gallery-state` (hidden behind the board, kept for keyboard and narrow screens), **Plays animation** `#state-clip` + `#state-fallback`, **When this state starts** `#state-policy` + `#state-policy-help`, and `#action-options` (return animation, retrigger, hit-frame marker). The JS already hides these unless the rule is "Play once, then return". Buttons `#state-test`, `#state-attack-defaults`, status `#action-status`.
4. **Encounter card**: shown only in RUN ENCOUNTER mode, CSS-only: `[data-panel=states]:has(#encounter-mode.selected) .encounter-card`. Restyle health meters as segmented bars.
5. **Scenario previews:** `#defeat-audio-preview`, `#release-audio-preview`.

Advanced: `#action-log`, roaming settings (`#sim-*`), `#event-log`.
Moved out: "Add / manage animations" (`#new-clip-id`, `#import-clip`, `#clip-files`, `#remove-clip`) → Step 01. `#action-demo` → Test kits.

#### 04b · Export (`data-panel="pack"`)

1. **Pre-flight checklist** (new, derived, read-only): Pack ID set · main animation imported · N animations · M of 10 states with their own animation · direction mode · K cues with takes · any `.error` readouts (e.g. over-8192 output) · unsaved changes.
2. Two big cards:
   - **SAVE PROJECT** — "Editable originals and every setting (.spriteforge.zip). Reopen to keep working." → proxy button calls `$('save').click()`.
   - **EXPORT SOURCE PACK** — "Game-ready PNGs, WAV takes, schedules, manifest (Source Pack v6). FNV conversion comes later." → proxy calls `$('export').click()`.
3. Advanced: "Inspect playback schedule" (`#schedule-report`) and the existing explanatory text.

### 3.5 Header extras

- **TEST KITS ▾** menu holds `#demo` (Four numbered frames), `#correction-demo` (Drift test), `#action-demo` (Idle + attack action test), `#audio-demo` (Two test tones). After a kit loads, `steps.js` routes to where it's used: frames → 01, drift test → 02d. The action and tone kits already send you to Field test and Sound.
- **FX ◐** toggles grain, scanlines and flicker (`body.fx-off`). Remember the choice in `localStorage`, wrapped in try/catch. Off automatically under `prefers-reduced-motion` (animation only) and `prefers-contrast: more` (all textures).
- Remove the "PLANNED" box from the rail; move it to an **About** item in the brand menu, together with the "Local & offline" note.

---

## 4. Copy changes (old → new)

| Where | Old | New |
|---|---|---|
| Rail | Workbench (h1) | *(removed; step titles carry it — also fixes the overflow bug)* |
| Rail | 01 Import frames … 07 Export Source Pack | 01 Animations · 02 Tune (a–d) · 03 Sound · 04 Test & export (a–b) |
| Import | Import / replace main animation | Import frames *(main row)* · Replace frames |
| Import | Main clip ID | Main animation name (e.g. walk) — "becomes the export folder name" |
| Import | Character ID | Pack ID (folder name) |
| Global | Main clip | Main animation — "plays whenever a state has no animation of its own" |
| Global | clip / extra animation | animation |
| Ground | Inherit main grounding & scale | Use main animation's ground & size |
| Ground | Feet/root X / Y | Ground point X / Y |
| Ground | Suggest feet from transparency | Auto-detect ground point |
| Ground | Sprite scale | Size in game |
| Ground | Whole-clip offset X / Y | Nudge whole animation X / Y |
| Ground | Canvas height in world units | Canvas height (world units at 100%) *(advanced)* |
| Ground | Transparency background | Preview background *(VIEW ⚙)* |
| Ground | Show Sunny · Height Reference | Height reference (Sunny) *(VIEW ⚙)* |
| Directions | Source faces | Artwork faces |
| Directions | Reuse one source view / Generate approximations / Import real directions | Same image every angle / Auto-generate angles / Upload my own angles |
| Directions | Side width / Rear darkening | Side-view squash / Darken back views |
| Directions | Choose image sequence | Upload {DIR} frames |
| Timing | Source FPS | Animation FPS (timing) |
| Timing | Display FPS — visual choppiness | Display FPS (smoothness only) |
| Timing | First frame / Last frame | Use frames ___ to ___ |
| Fixes | Frame corrections · align feet & size | Frame fixes — keep feet planted |
| Fixes | Correction view | Fixing view |
| Fixes | Discard unsaved adjustment | Undo unsaved nudge |
| Fixes | Scale pivot X / Y | Resize around X / Y |
| Fixes | Export image bounds | If fixes push art off the canvas |
| Fixes | View original / View corrections | ORIGINAL / FIXED |
| Sound | Sound event / state | Cue |
| Sound | Test sound bank | Test this cue |
| Sound | Random selection weight | How often (weight) |
| Sound | Enable cue | Cue on |
| Test | States & encounter | Field test |
| Test | Inspect a state / Test encounter | Check one state / Run encounter |
| Test | Animation used by this state | Plays animation |
| Test | Playback rule: Keep animation running / Restart when state begins / Play once, then return | When this state starts: Keep playing / Start from the first frame / Play once, then return to… |
| Test | Visual strike marker | Hit-frame marker (visual only) |
| Export | Export Source Pack (panel) | Export — with pre-flight checklist |

Dynamic strings written by JS also need matching updates. `studio.js` sets `#clip-context`, `#state-status`, `#ground-help`, `#direction-report`, and the `active-clip` labels ('Main clip'); `action-controls.js` sets `#state-policy-help`; `app.js` sets status messages. Change wording only, never logic. Option *labels* may change; option *values* may not.

---

## 5. Hide-by-default summary

| Panel | Visible by default | Behind ▸ ADVANCED / ? |
|---|---|---|
| 01 Animations | Name, Pack ID, 3 common rows, More slots link, Next | Import rules & limits, help text |
| 02a Size & ground | inherit/compare (extras), ground X/Y + auto, size, shape presets | canvas height, nudge, copy/reset, output readouts, stretch fields |
| 02b Directions | facing, mode cards, compass, upload button | generator settings, orbit, 8-view drawer (under stage) |
| 02c Timing | loop style, FPS, speed, display FPS + presets, range | explanatory notes |
| 02d Frame fixes | 4-step guide, frame, keys, move, size, compare, seam | view, link/copy, pivot, interpolation, delete/reset, bounds, review |
| 03 Sound | cue list, source, takes, mode, test bar | edit take, trigger rules, activity |
| 04a Field test | mode, state board, state editor, encounter card (encounter mode only) | action log, roaming, event log |
| 04b Export | pre-flight, Save, Export | schedule inspector |

Aim: the first screen a new user sees (Step 01, empty project) has **one obvious action**: tick your animations and import MAIN.

---

## 6. Fallout: New Vegas theme — "Mojave Terminal"

Two visual sources: the amber Pip-Boy screen (FNV's default HUD colour) and the sun-bleached, dusty Mojave around it. Mostly one colour (amber on warm black), with sand for readable body text and one red for danger.

### 6.1 Palette tokens (replace the `:root` blocks in `theme.css`)

```css
:root{
  /* warm blacks */
  --ink-0:#0b0805;  --ink-1:#110c06;  --ink-2:#19120a;  --ink-3:#231a0e;
  /* Pip-Boy amber ramp */
  --amber-hi:#ffd27a;   /* hover glow, focus ring            13.0:1 on --ink-2 */
  --amber:#ffb642;      /* active text, values, selection    10.6:1 */
  --amber-mid:#de9b34;  /* labels, rules, borders on focus    7.8:1 */
  --amber-dim:#9a6a28;  /* idle borders, inactive ticks (non-text only, 3.9:1) */
  --amber-ghost:#ffb6421f; /* fills, selected rows */
  /* Mojave */
  --sand:#d8c39a;       /* body / help text                  10.8:1 */
  --dust:#a8936c;       /* muted text                         6.2:1 */
  --rust:#b5532a;       /* warning borders (non-text)         3.7:1 */
  --blood:#e5533a;      /* errors, destructive                5.0:1 */
  --glow:0 0 6px #ffb64259, 0 0 1px #ffb642;
}
```

Ratios are WCAG contrast against `--ink-2` (panel), computed for this plan. Every text token passes AA (4.5:1). `--amber-dim` and `--rust` are for borders and icons only. There's no official spec for the FNV amber: `#ffb642` is the usual community value, and the Fallout 4 "New Vegas Amber HUD" mod reproduces it as RGB 222/155/52 (`#de9b34`, used here as `--amber-mid`). Hold a screenshot of your own game next to the tool and adjust only `--amber` if it looks off.

### 6.2 Type

| Role | Font | Why | Licence |
|---|---|---|---|
| Terminal / UI: nav, labels, buttons, numbers, status | **Share Tech Mono** | Closest free match to the Pip-Boy's mono look | SIL OFL, embeddable |
| Titles + readable body text | **Barlow Condensed** 400 / 600 / 700 | Based on California highway signs and plates, which suits the Mojave | SIL OFL, embeddable |

- **Monofonto** is the actual Pip-Boy font, but its free licence forbids embedding it in websites, apps or software. A paid embedding licence from MyFonts would be required. The plan defines `--font-term` so you can swap it in later if you buy one.
- **Embedding:** put the WOFF2 files in `assets/fonts/` with `OFL.txt`. `build.mjs` replaces a `/*FONTS*/` placeholder in `theme.css` with `@font-face{src:url(data:font/woff2;base64,…)}`. Change the CSP to `font-src data:`. Add the OFL licence to the Trial ZIP (`package.mjs`), the same way JSZip's licence is included. Expect roughly 80–120 KB added to the 1.58 MB bundle.
- **Usage:** nav, labels and buttons uppercase with `letter-spacing:.08em`. Numbers use `font-variant-numeric:tabular-nums`. Help text in Barlow Condensed 15px / 1.5. Never set long help text in the mono face.

```css
--font-term:'Share Tech Mono','Menlo',ui-monospace,monospace;
--font-sign:'Barlow Condensed','Avenir Next Condensed','Arial Narrow',sans-serif;
```

### 6.3 Texture & atmosphere (FX layer)

All layers are `pointer-events:none`, and all switch off with `body.fx-off`.

1. **Film grain.** An SVG `feTurbulence` noise data-URI tile (the current `--grain` is a good start) on `::after` overlays of the header, rail, settings panel and workspace, *above* their content at ~5–7% opacity with `mix-blend-mode:soft-light`. It jitters with a `steps(6)` transform animation (~8 fps). Static under `prefers-reduced-motion`.
2. **Keep the canvas clean.** Inside `.workspace` (already `isolation:isolate`), give the grain overlay `z-index:1` and the `.stage` `position:relative; z-index:2`. The grain then sits over the transport and readouts but never over the sprite.
3. **Vignette.** One fixed full-viewport radial gradient, transparent centre → `#000a` at the corners. The stage is centred, so it is barely touched.
4. **Sand / dust.** A second, lower-frequency warm noise on the body background plus a sparse speckle layer (a few 1px `--sand` dots at 6% opacity in a 300px tile). Panels get a "weathered metal" edge: 1px top highlight `--amber-ghost`, 1px bottom `#000`.
5. **CRT scanlines.** `repeating-linear-gradient(#0000 0 2px, #0000002e 2px 3px)` on the header, the rail, the stage *bezel* (border frame, not the canvas) and dialogs.
6. **Phosphor glow.** `text-shadow: var(--glow)` on step titles, the active nav item, readout numbers and the primary button label. Never on body text.
7. **Page-change flicker.** A 180 ms opacity/brightness flicker on the settings panel when the step changes, like turning a Pip-Boy page. Off under reduced motion.

### 6.4 Components

- **Nav / selected rows:** Pip-Boy inverted highlight: selected = `--amber` background, `--ink-0` text, no glow. Hover = `--amber-ghost` fill.
- **Buttons:** transparent with a 1px `--amber-dim` border and uppercase mono text. Hover: `--amber-ghost` fill and amber border. **Primary:** solid `--amber`, ink text. **Destructive** (remove, clear keys, discard): `--blood` text and border.
- **Segmented controls** (loop style, mode cards, facing, cue mode) share one style: a bracketed row, with the selected segment inverted.
- **Inputs:** `--ink-0` field, 1px `--amber-dim` bottom border only (terminal underline), mono right-aligned numbers. Focus: 2px `--amber-hi` outline, 2px offset.
- **Checkboxes:** square `[ ]` / `[■]` look via `appearance:none` with an amber fill. **Sliders:** 2px `--amber-dim` track, 10×16 amber block thumb.
- **Section headings:** Barlow Condensed 700 uppercase. Bracket underline like the FNV Pip-Boy tab bar: a horizontal rule with short upward ticks at both ends, made from `::before`/`::after` borders.
- **Disclosures:** `▸ ADVANCED` in mono `--amber-mid`, rotating to ▾.
- **Scope badges:** 9px mono uppercase, 1px `--amber-dim` border; `PREVIEW ONLY` uses dashed `--dust`.
- **Status line:** `> message_` in mono `--sand`; errors in `--blood` with a `!` prefix.
- **Dialog:** terminal window with a scanlined title bar ("IMPORT REVIEW ▮"), `--ink-1` body, `--amber-dim` frame.
- **Encounter meters:** 10-segment bars (PLAYER / SPRITE) like the Pip-Boy HP gauge.
- **Brand mark:** keep the original "SF" monogram; restyle it as a stencilled plate in amber. No Fallout logos.

### 6.5 Accessibility & performance

- Text contrast ≥ 4.5:1 (all tokens above qualify). Focus is always visible. Hit targets ≥ 32px. Narrow-window controls are re-checked (ALPHA-HANDOFF check 11).
- `prefers-reduced-motion`: no grain animation, flicker or cursor blink. `prefers-contrast: more`: textures off, `--dust` → `--sand`.
- Animate only `transform` / `opacity` on the FX layers, never SVG filter parameters. The sprite canvas render loop must not slow down: profile with FX on and FX off.

---

## 7. Implementation guide

### Files

| File | Change |
|---|---|
| `src/index.html` | Re-arrange markup into the new shell. Move elements (do not re-create them) so IDs and tags survive. Add the step rail, animation chips, VIEW popover, Test kits menu, `data-panel="fixes"` section, roster / state-board / pre-flight / cue-list containers, `#review-context`. CSP `font-src data:`. Add `/*FONTS*/` support via `build.mjs`. |
| `src/theme.css` | Rewrite as "Mojave Terminal" (§6). Keep functional rules: `[hidden]{display:none!important}`, canvas `touch-action:none`, `.drag-over`, `.error`, scroll containment. |
| `src/style.css` | Leave as the base layer, or fold it into `theme.css` once everything passes. |
| **new** `src/steps.js` | Rail / step state: header buttons for 02 and 04 click their first sub-tab. Sync `body[data-step]` and rail highlights with a `MutationObserver` on `[data-panel]` `hidden` attributes, so programmatic `app.tab('states'/'audio')` calls are reflected without touching `app.js`. Also: NEXT buttons, Test kits routing, FX toggle, VIEW popover, 8-view drawer toggle, animation chips ↔ `#active-clip`, segmented controls ↔ their selects. |
| **new** `src/roster.js` | Step 01 checklist (derived status, import orchestration, auto state assignment), state board (04a), cue list (03), pre-flight (04b). Exposes `SF.Roster.refresh()`. |
| `build.mjs` | Append `'steps','roster'` after `'action-controls'`. Inline fonts. |
| `src/studio.js` | Exactly these small edits: **(1)** in `refresh()`, `#contact-zone` hidden = directions panel hidden **or** drawer closed (read a flag set by `steps.js`, e.g. `document.body.dataset.sheet!=='open'`); **(2)** in `afterRender()`, add `SF.Roster?.refresh();` next to `SF.ActionControls?.refresh()`; **(3)** in `directionButtons()`, set `button.dataset.kind` for compass dots; **(4)** wording-only edits to dynamic strings (§4). |
| `src/app.js`, `keyer.js`, `action-controls.js` | Wording-only edits to user-facing strings. No logic changes. |
| `package.mjs` | Include `OFL.txt` for the fonts. |
| Tests | See below. |
| Docs | Update `FEATURE-GUIDE.md`, `README.md`, `TRIAL-README.txt`, and the click-paths in `ALPHA-HANDOFF.md` browser checks (e.g. "States & test → Add / manage animations" → "01 Animations → tick Idle → Import frames"). Bump version to 0.7.0 and the brand label. |

### Tests to update / add

- **New `tests/layout-ids.cjs`:** before editing, copy the current `src/index.html` to `tests/fixtures/index-0.6.2.html`. The test asserts that every old `id` still exists in the new file with the same tag, and that every old `data-tab`, `data-panel`, `data-setting` and `<option value>` (per select) is still present. Run it in every phase.
- `tests/release.cjs`: modules list (+`steps`, `roster`), CSP assertion `font-src data:`, and the result fields `staticGrain` / `goldInk` / `externalFontDownloads` (still 0 — fonts are embedded).
- `tests/control-test-runtime.cjs`, `tests/placement-controls.cjs`: panel mock list → add `'fixes'`.
- `tests/milestone2.cjs`: it opens `[data-panel="states"] details` first `summary` to reach "Add / manage animations". Point it at the new Step 01 location (or drive `#new-clip-id` / `#import-clip` directly).
- Run every suite listed in README "Development", then `build.mjs` → `package.mjs` → `release.cjs`.

---

## 8. Phases & acceptance

| Phase | Scope | Done when |
|---|---|---|
| **0 · Safety net** | Snapshot `index.html`, add `layout-ids.cjs`, capture baseline screenshots of all 7 tabs (with test frames loaded). | All existing suites green on 0.6.2. |
| **1 · Shell & 4-step rail** *(priorities 1–2)* | Header, rail, NEXT buttons, VIEW popover, Test kits, `steps.js`, `fixes` sub-step, overflow bug fixed. Old panels still have their old content. | Every old tab reachable; programmatic tab jumps highlight the right step; ID test green. |
| **2 · Animations checklist** *(priority 3)* | `roster.js`, move Add/manage animations, import context line, auto state assignment, derived status. | Import main walk + idle + attack from scratch without opening Step 04; states show correct assignments; save → reopen rebuilds the checklist. |
| **3 · Panel regroup & wording** *(priorities 1, 3)* | §3 layouts, compass, mode cards, cue list, state board, pre-flight, encounter-only card, Advanced disclosures, §4 copy. | Each panel ≤ 6 primary controls; handoff distinctions visible via scope badges. |
| **4 · Mojave Terminal theme** *(priority 4)* | Tokens, fonts, FX layer, components, reduced-motion / contrast modes. | Canvas colours are unchanged with FX on (pixel-compare a stage screenshot with FX on vs off); contrast checks pass. |
| **5 · Sign-off** | Re-run ALPHA-HANDOFF browser checks 1–11 using the new paths; narrow-window pass; docs and version bump; package. | Checks logged with browser/version as the handoff requires. |

Phase 4 is CSS-only. If you want a quick visual win first, the tokens and fonts can land before Phase 1, at the cost of re-touching some selectors later.

---

## 9. Control placement map (all 230 IDs)

**P** = primary (visible) · **A** = inside ▸ Advanced / drawer / popover · **H** = kept in DOM but hidden (driven by new UI or file inputs).

| New home | IDs |
|---|---|
| Header | **P** `reopen` `save` `export` `dirty` (chip) · **H** `project-file` · Test kits menu **A** `demo` `correction-demo` `action-demo` `audio-demo` |
| Rail footer | **P** `clip-label` `media-summary` |
| Above stage | **P** `preview-name` `single-clip-label` `clip-context` `undo` `redo` · **H** `clip-picker-label` `active-clip` (driven by chips) |
| Stage | **P** `dropzone` `preview` `view-label` `view-kind` `view-toolbar` `state-status` `quick-directions` (mini compass) |
| VIEW ⚙ popover | **A** `zoom` `zoom-value` `background` `showReference` `preview-volume` `volume-value` |
| Transport & readouts | **P** `prev` `play` `next` `reset` `frame-label` `elapsed` `scrub` `duration-label` `count` `rate` `duration` `display` `status` `cancel` · drawers **A** `strip`, `contact-zone` `contact-preview` `contact-download` |
| 01 Animations (`import`) | **P** `import` `displayName` `characterId` `clipId` (main row name) · **H** `files` `new-clip-id` `import-clip` `clip-files` `remove-clip` (driven by roster rows; also shown in the Custom row) · **A** `name-help` `id-help` `clip-help` `validation` |
| 02a Size & ground (`ground`) | **P** `ground-inherit` `ground-compare` `anchorX` `anchorY` `suggest` `scalePercent` `scale-slider` `ground-normal` `ground-wide` `ground-tall` `ground-help` · **A** `shapeLinked` `widthPercent` `width-slider` `heightPercent` `height-slider` `referenceCanvasHeightUnits` `offsetXUnits` `offsetYUnits` `ground-copy` `ground-reset` `ground-clip` `ground-size` `ground-output` |
| 02b Directions (`directions`) | **P** `source-facing` `source-facing-help` `directionMode` `direction-picker` `import-direction` `direction-report` · **H** `direction-import` (set by compass) `direction-files` · **A** `generatedSideWidthPercent` `rearDarknessPercent` `mirrorDirections` `orbit` `orbit-value` |
| 02c Timing (`animation`) | **P** `playbackMode` `sourceFps` `playbackSpeedPercent` `displayFps` `presets` `rangeStart` `rangeEnd` |
| 02d Frame fixes (`fixes`, new) | **P** `correction-details` (forced open) `correction-first` `correction-last` `correction-drag` `correction-save` `correction-frame` `correction-list` `correction-offsetX` `correction-offsetY` `correction-scalePercent` `correction-scale-slider` `correction-revert` `correction-original` `correction-corrected` `correction-status` `correction-seam` · **A** `correction-view` `correction-enabled` `correction-link` `correction-copy` `correction-pivotX` `correction-pivotY` `correction-pivot` `correction-interpolation` `correction-delete` `correction-reset` `correction-output` `correction-bounds` `correction-review` `correction-review-list` |
| 03 Sound (`audio`) | **P** `audio-cue-help` `audio-reference` `import-audio` `audio-take` `audio-info` `audio-up` `audio-down` `audio-replace` `audio-remove` `waveform` `audio-source` `audio-converted` `bank-mode` `bank-mode-help` `bank-enabled` `audio-bank-test` `audio-bank-pause` `audio-stop` `audio-bank-status` `audio-undo` `audio-redo` `bank-selection` `bank-avoidLast` `bank-firstDelay` · repeat sub-card (REPEAT / QUIPS only) `bank-playOnEntry` `bank-maxPlays` `bank-gapMin` `bank-gapMax` · **H** `audio-slot` (driven by cue list) `audio-file` `audio-replace-file` · **A** `audio-label` `audio-weight` `audio-muted` `audio-trimStart` `audio-trimEnd` `audio-loopStart` `audio-loopEnd` `audio-gainDb` `audio-peak` `bank-cooldown` `bank-seed` `bank-retrigger` `bank-maxVoices` `audio-activity` |
| 04a Field test (`states`) | **P** `gallery-mode` `encounter-mode` `state-clip` `state-fallback` `state-policy` `state-policy-help` `action-options` `state-return` `state-retrigger` `state-marker` `state-marker-help` `state-test` `state-attack-defaults` `action-status` `defeat-audio-preview` `release-audio-preview` · encounter-only `encounter-state` `inventory-count` `player-hp` `player-health` `sprite-hp` `sprite-health` `attack` `defeat-now` `pickup` `deploy` `spawn-enemy` `repack` `encounter-reset` `pause-all` · **H** `gallery-state` (driven by state board) · **A** `action-log` `sim-seed` `sim-roamRadius` `sim-moveSpeed` `sim-leashDistance` `sim-pauseMin` `sim-pauseMax` `event-log` |
| 04b Export (`pack`) | **P** new pre-flight + Save/Export proxies · **A** `schedule-report` |
| Import dialog | unchanged: `import-dialog` `review-title` `review-info` `review-issues` `padding-label` `padding` `review-strip` `discard` `accept` · new `review-context` |

"Hidden" controls must stay real form elements of the same tag. Don't remove them, swap them for divs, or add extra `disabled` logic: the new UI drives them with `.value` and `change`/`click` events, and the existing JS still owns their enabled/disabled state. For keyboard and screen-reader users, either keep them visible on narrow screens or give the new chips, cards and board proper `role`/`aria-pressed`/`aria-controls`.

---

## 10. Decisions for you before work starts

1. **Font:** OFL stand-ins (Share Tech Mono + Barlow Condensed), or buy a Monofonto embedding licence? *Plan default: OFL stand-ins.*
2. **"Rename files":** OK to read it as "name each animation on import, which names the exported files"? *Plan default: yes.*
3. **Checklist rows shown up front:** Main / Idle / Attack, with Defeat / Roam / Deploy / Repack / Custom under "More slots"? *Plan default: yes.*
4. **FX on by default?** Grain, scanlines and flicker on, with a header toggle. *Plan default: on, and the canvas is always clean.*
