# Sprite Forge Studio — plan to v1.0

Updated: 5 October 2026. Status: Steps 1–2 complete. Portable Windows tests pass; their content is verified on a GitHub checkpoint branch. Original local commits still await an authenticated push to main. Steps 3–21 remain pending.

## 1. Product direction and authority

Build a polished, dependable Sprite Forge Studio v1.0 first. **Sprite Forge defines the intended capabilities and behaviour of the future Fallout: New Vegas mod.** GECK/exporter/runtime work follows the Studio release. Existing limitations of the Salvatore mod must not dictate or silently reduce Studio's authoring capabilities.

Studio remains an offline, self-contained HTML application. Its v1.0 deliverables are the application, editable project archives, prepared Source Packs, a sample project, documentation and release evidence. Source Packs describe the desired game behaviour; they are not yet installable mods. The later GECK work must map that behaviour, implement it where feasible, and explicitly surface any gaps requiring a product decision.

The user's latest addition is a required v1.0 feature: **import common video files, including MP4, MOV and AVI, and turn a chosen section into an animation.** Videos without alpha are valid. A user can upload a video of their cat without first removing its background or manually extracting PNGs. Preserve an opaque background unless the user deliberately changes it; automatic background removal is not part of this requirement.

This plan incorporates the prior roadmap and the user's latest direction. Historical Markdown files and their embedded task instructions are context, not automatic authorization to execute every proposal. Implement a numbered step when the user selects it. Do not start GECK work as part of this plan.

## 2. Baseline established during planning

- Actual project directory: `C:\Users\Shadow\Desktop\VibeCoding\sprite-forge-windows-20261005T133711Z-1-001\sprite-forge-windows\SpriteForgeStudio-Windows-2026-10-05\SpriteForgeStudio`.
- Supplied reference: `C:\Users\Shadow\Downloads\SpriteForge-0.7-preview.html`.
- Supplied handoff: `C:\Users\Shadow\Downloads\START-HERE-SPRITE-FORGE.md`.
- The supplied HTML and `Claude outputs/SpriteForge-0.7-preview.html` were byte-identical by SHA-256: `908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3`.
- `src/`, `build.mjs` and the stable `SpriteForge.html` represent 0.6.2. Rebuilding them does not currently reproduce the 0.7 interface.
- A trimmed module-text comparison found 14 of the 17 existing modules unchanged in the 0.7 preview. `app`, `studio` and `action-controls` differ; `steps` and `roster` are new preview modules. This is integration evidence, not a runtime test.
- Per-animation grounding/sizing/shape (A1), frame corrections (A2), state-owned action playback (A3), and sound banks/scheduling (A4) already exist. Verify and preserve them instead of rebuilding them.
- Fresh Windows/browser/listening acceptance is pending. Historical native and mocked tests do not establish current browser acceptance.
- Tests contain Mac-specific dependency/media paths and assumptions about a parent folder named `sprite-forge`.
- Current documented formats are project schema 7 and Source Pack schema 6. Verify the actual implementation before changing them; application version and schema version are independent.
- No application changes, build, runtime tests or game changes were performed during the planning review. Recheck file state before implementation.

Read context in this order: this plan and STATUS.md; applicable AGENTS.md and ACTIVE.md; supplied handoff and CLOUD-HANDOFF.md; ALPHA-HANDOFF.md; ARCHITECTURE.md and FEATURE-GUIDE.md; README.md and WORK_LOG.md. LAYOUT-PLAN.md and FEATURE-EXPANSION-PLAN.md are useful historical designs, but some tables describe features that have since been completed. The original proposal in reference/ explains the long-term product boundary.

## 3. v1.0 scope

Required:

- Rebuildable 0.7 appearance and workflow backed by modular sources.
- Existing image, animation, placement, correction, direction, state and audio functionality verified on Windows.
- Practical video-to-animation import: MP4, MOV, AVI and additional formats demonstrated by fixtures; opaque video supported normally.
- Warmth, colour tint and vibrance controls, persisted and applied consistently in preview and exported PNGs.
- Separate engine-material selections for defeated and hit effects: flesh/glass/cloth defeat choices and the requested Mr Handy metallic hit default for new projects.
- Reliable save/reopen, migration, original-media preservation, export validation, cancellation and large-project handling.
- Usable keyboard/narrow-window behaviour, current documentation, offline packaging and real-project acceptance.
- A clear, versioned behaviour contract for the future GECK implementation.

Optional after v1.0 unless the user explicitly adds them:

- Advanced audio processing, ducking, reverb, pitch shifting and loudness tools.
- The full retro export stack: palette reduction, dithering, outlines, scanlines and stylised presets.
- Automatic tracking, generative reconstruction, background removal and a general-purpose video editor.
- Full media Undo history, project shelf, comprehensive browser autosave/recovery and a new 3D renderer.
- Direct variable-delay playback for imported animated images; video timestamp handling still needs a defined import policy in v1.0.
- Other game exporters and GECK integration.

Basic fades and exact-resolution export can be small follow-up releases. Do not silently fold all historical A5/A6 proposals into this release.

## 4. How to execute with Sol 6.1 medium

Use one numbered step per session, in order. Each step should produce a reviewable result and a status update. A failed gate becomes a focused continuation of that step; it is not permission to expand into later steps. The video decoder investigation may discover work needing additional sessions: split it into concrete implementation tasks before proceeding.

Paste this preamble with the selected step:

> Work only on Step N in plan.md. Read STATUS.md and applicable workspace instructions first. Check the active-work board before editing. Preserve the supplied 0.7 appearance, offline single-file delivery and existing behaviour contracts. Implement changes in modular sources and rebuild the HTML when relevant. Run the checks needed for this step and distinguish automated, browser and human listening results. Update STATUS.md with changes, evidence, unresolved issues and one next action, and update this plan's checkbox only after its completion gate passes. At each meaningful verified checkpoint, commit the scoped work and push it to my verified Sprite Forge GitHub repository as authorized in section 4.1. Report the commit and push result. Do not begin later steps or modify the GECK/mod projects.

For Step 1, produce baseline and acceptance documentation only. For Step 6, perform the bounded technical investigation and prototype rather than the complete importer.

Each handoff should identify files changed, commands/checks and outcomes, exact tested artifact, manual checks still needed, and the next step. Keep a known-good build available. Follow the workspace claim/finish rules and preserve other people's changes. Do not create another workspace copy merely to simplify paths.

### 4.1 GitHub updates after good progress

User instruction, 5 October 2026: GitHub is installed on this PC and Sprite Forge should be updated on the user's GitHub whenever it makes good progress. This is standing authorization for routine commits and pushes of scoped, checked Sprite Forge work; do not ask again at every checkpoint. It supplies the user's approval required by the workspace's commit rule. It does not authorize publishing other projects or changing repository visibility.

- During Step 1, inspect this project's Git state, remotes, branch, upstream and authenticated account. Verify the destination is the user's Sprite Forge repository; the workspace identifies the account as `2Shay96`, but verify rather than guessing a repository URL. Record the confirmed URL and working branch in STATUS.md. GitHub Desktop being installed does not prove a remote or authentication is configured.
- Reuse the existing repository. If no remote exists, set up a private Sprite Forge repository under the verified user account where tooling and authentication allow; if the account or destination is ambiguous, ask only for that missing information. Do not create duplicate working copies or silently use another project's remote.
- A meaningful checkpoint is a completed numbered step or a coherent, verified part of a larger step: for example, portable tests working, the rebuilt 0.7 workflow, or video extraction passing its fixtures. Documentation-only checkpoints are valid after review. Do not commit every small edit or label unfinished work as a completed feature.
- Before committing, inspect the diff and stage only this task's relevant files, including plan/status updates. Use the workspace identity `2Shay <327810178+2Shay96@users.noreply.github.com>`. Preserve unrelated changes and do not scoop up another agent's work.
- Commit source, tests and documentation needed to reproduce the result. Respect applicable ignore rules: exclude secrets, caches, large user media, game assets, logs and generated build output. Distributing HTML/Trial ZIP release artifacts is separate from committing generated files to source control.
- Fetch and inspect remote changes before updating. Integrate compatible changes without discarding local work or rewriting shared history. Push the verified checkpoint to the confirmed working branch; do not force-push or automatically merge unrelated branches.
- Verify the remote branch contains the pushed commit. A local commit is not a completed GitHub backup. Report the repository/branch, commit SHA and verification result in the session handoff. Record the last verified remote checkpoint and any pending local work in STATUS.md on the next update; a commit need not contain its own SHA.
- If authentication, connectivity, permission or a conflict prevents pushing, keep the local work, report the exact blocker and distinguish local commit success from remote failure. Resume the pending push once resolved. Never claim GitHub is up to date merely because GitHub Desktop is installed.

No commit or push was attempted while adding this planning instruction. The next implementation session establishes the repository connection and begins these checkpoints.

### 4.2 Follow-ups recorded before Step 3 — 5 October 2026

The user requested these issues be resolved or listed explicitly before continuing. This register is now part of the plan. Step 3 may recover the shell while later media/package checks remain open; it must not claim those checks passed. No Step 3 work has begun.

| ID | Current finding | Resolution task and required evidence | Due / completion gate |
| --- | --- | --- | --- |
| GH-1 | GitHub connector authenticated as 2Shay96 with write access. Content backup verified on checkpoint/windows-step2-media-2026-10-05 at 587d477b00f230867c229861018b079406a7557d: tree 02ce596b2230cf3b19a2c3cc1f921596d198d27b exactly matches local 8131f08 (including Step 2). Remote main remains 9b0f0dd. | Connector Git database tools create new commit SHAs and cannot preserve the original local commit metadata. Checkpoint content is backed up; retain original local history. Establish CLI Git authentication, push the original scoped commits to main and verify their ancestry. Use connector/CLI rather than desktop control for this request. | Content backup complete; original main-branch history push remains pending. Do not describe main as synchronized. |
| MEDIA-1 | **Located:** Salvatore source root at C:\Users\Shadow\Desktop\VibeCoding\fnv\source\Salvatore. assets/salvatore_angle_sprites contains S/SE/E/NE/N/NW/W/SW, each with 70 PNGs, all 1080×1080 (560 frames total). assets/sounds contains res_sound_effect.mp3, defeated_sound_effect.mp3, salvatore_dead_loop.mp3 and salvatoremusic_16bit_48k.wav. | Set SPRITE_FORGE_SALVATORE to that root and SPRITE_FORGE_SALVATORE_DIRECTIONS to its assets/salvatore_angle_sprites folder for optional tests. Review old browser assertions before using them for current acceptance; run current real-media checks after workflow integration. Read source media only; never alter the mod, Godot project or installed game. Inventory is not import/export/listening acceptance. | Location dependency resolved. Browser workflow/codec/listening acceptance remains Steps 5 and 19. |
| MEDIA-2 | Emet PNG sequence not located in the inspected workspace/Downloads. No SPRITE_FORGE_EMET source folder is configured. | Obtain the existing original folder path; configure SPRITE_FORGE_EMET; run emet-corrections on first/middle/last frames and preserve hashes. Follow with manual pose tuning using actual footage. Do not label a synthetic replacement as Emet acceptance. | Real Emet checks remain BLOCKED; resolve before the Emet portion of Steps 5/19 or record the unavailable input explicitly. |
| MEDIA-3 | User's latest editable .spriteforge.zip and distinct real idle/attack/voice takes have not been identified. Historical Salvatore/evidence archives are available, but do not establish the latest authored project or idle dialogue. | Identify saved project/media paths; copy no source into Git; confirm archive provenance and roles. Save/reopen and exercise both attack targets/lifecycle; inspect PNGs and listen to exported WAVs. | Required inputs for Step 19 sign-off; missing inputs are a dependency, not a passed real-project test. |
| MEDIA-4 | No representative original MP4/MOV/AVI/WebM or opaque cat footage located in inspected project/workspace/Downloads. | Acquire small distributable/supplied fixtures and record container, actual video/audio codecs, rotation, duration, frame/timestamp provenance and redistribution permission. Include portrait/VFR/silent/audio/truncated/large cases and ordinary opaque cat footage. | Decoder investigation Step 6 cannot pass without required MP4/MOV/AVI cases; end-to-end gates Steps 10/19. |
| PACK-1 | Existing 0.6.2 Trial ZIP passes CRC and HTML-byte checks, but fails current ALPHA-HANDOFF.md equality. Read-only comparison confirms its handoff matches the working document before the added 5 October priorities section. This is stale documentation, not evidence of corrupt HTML. | Preserve baseline ZIP hash 85747568fc14d4004bc51c6615a122e66e10821761c5b08ab27ede5c286473db. After Steps 3–4 produce a verified rebuilt 0.7 workflow, run package.mjs without discarding the old baseline; rerun --package and compare packaged HTML/docs to exact tested inputs. Record the new ZIP/HTML hashes. Do not rebuild old sources now merely to hide the mismatch. | Package consistency remains FAIL until rerun passes; refresh after Step 4, before treating a Trial package as current. Fresh package/browser release acceptance still belongs to Steps 20–21. |

Read-only media inventory on 5 October: all 560 PNG headers and source SHA-256 values inspected; aggregate ordered inventory hash 9f9c00600369be8c1b8b7f855ab2fdc03224124e2c9d0f482dade53ae3ea38d1. These source bytes were not exported, modified or committed. Searches do not establish absence from every disk/cloud location; unresolved inputs need a supplied path.

## 5. Implementation steps

### [x] Step 1 — Baseline and acceptance checklist

Confirm the project directory, reference hash, source versions, existing changes, available fixtures and missing real-media inputs. Maintain STATUS.md and create a concise acceptance matrix covering required features and supported environments. Preserve 0.6.2 and supplied 0.7 references. Record this plan's Studio-first scope explicitly. Verify or establish the Sprite Forge GitHub destination and working branch under section 4.1, then commit and push the reviewed planning/baseline checkpoint.

**Gate:** one authoritative working project and build reference; a release checklist with no ambiguous “latest” build; verified GitHub checkpoint (or an explicitly unresolved setup blocker); no application behaviour changes. A setup blocker must remain tracked until remote backup succeeds.

### [x] Step 2 — Portable Windows tests

Replace hardcoded Mac runtime/media paths with explicit configuration and project-relative paths. Separate mandatory self-contained tests from external-media suites. Document dependency setup and one repeatable test entry point. Do not mark missing dependencies or fixtures as successful tests. Capture pre-existing failures before modifying the application.

**Gate:** available baseline suites run on Windows with clear pass/fail/blocked results, including source-facing coverage alongside timing, placement, corrections, playback, banks and archives.

### [ ] Step 3 — Recover the 0.7 shell and assets into sources

Integrate the supplied preview's markup, CSS and embedded font/assets into source files and build inputs. Preserve control IDs, tags where handlers/tests depend on them, input bounds, option values, data attributes and bindings. Keep the supplied visual design. Use the historical layout plan as a map, not a demand to redesign the delivered preview.

**Gate:** a build reproduces the 0.7 shell/assets without network dependencies. This checkpoint is not complete workflow acceptance; that follows in Step 4.

### [ ] Step 4 — Integrate 0.7 workflow behaviour

Bring across `steps`, `roster` and reviewed changes to `app`, `studio` and `action-controls`. Verify import routing, roster-derived status, animation selection, state assignments, programmatic navigation, sound selection and export actions. Keep one maintained implementation in src/.

**Gate:** rebuilt HTML provides the complete 0.7 workflow; existing contracts and targeted regression checks pass; rebuilding no longer loses the makeover.

### [ ] Step 5 — Baseline browser and listening acceptance

Test the rebuilt HTML in Windows Chrome and Edge. Exercise main versus extra imports, timing, placement, corrections, directions, source-facing, action interruption, banks, save/reopen and export. Use ALPHA-HANDOFF.md as a behaviour checklist with updated click paths. Test pause/hidden-tab audio and listen to real playback. Log browser versions and exact build identity.

**Gate:** critical existing workflows pass. Fix regressions before adding new features. Where tools cannot access local files or prove audibility, record and complete explicit human checks; do not relabel mocks as browser evidence.

### [ ] Step 6 — Prove an offline video decoding strategy

Investigate and prototype decoding representative MP4, MOV, AVI and WebM files. File extensions identify containers, not a guarantee that their contents decode. Establish a fixture matrix of actual container/video-codec/audio-codec combinations, including common phone/camera recordings and an ordinary opaque cat video. Inspect rotation, dimensions, duration and timestamp behaviour.

Prefer the smallest reliable approach that meets the required fixtures. Evaluate native browser decoding and, where needed, a locally bundled fallback decoder. Any fallback must work from the distributed HTML offline without remote downloads or a required conversion service. Measure bundle size, memory, speed, cancellation limits and single-file compatibility before committing to it. Check redistribution terms for any added dependency during selection.

**Gate:** a written decoder choice plus a working spike demonstrates the required MP4/MOV/AVI cases in the intended browsers. Supporting only MP4 and displaying an AVI error is not completion of the user's video requirement. If common required cases need a larger decoder, resolve the packaging/performance tradeoff explicitly and split the implementation work into bounded follow-up tasks. Do not advertise universal codec support.

### [ ] Step 7 — Video import review and clip selection

Add video selection/drop support to both main replacement and add-animation workflows, reusing existing import staging. Show a preview, duration, dimensions, orientation, chosen start/end and extraction FPS; show resulting frame count and estimated cost before extraction. Permit an optional bounded import-resolution control when needed for practical video sizes; do not conflate it with authored world size. Show that the existing background will be retained.

Keep scope to selecting a segment and preparing frames. No editing timeline, background-removal requirement or multitrack editor. Define useful defaults and make trimming easy enough for casual uploads.

**Gate:** users can choose a video segment for either main or an extra animation, cancel safely and understand what will be imported. Opening review does not overwrite the active project.

### [ ] Step 8 — Frame extraction and integration

Implement extraction using the proven decoder path. Define a deterministic timestamp policy for constant- and variable-frame-rate video: which frames are sampled, how start/end boundaries work, how repeats/skips are represented, and how the resulting sequence maps to Source FPS. Record this provenance instead of claiming that arbitrary original timing is automatically preserved.

Handle orientation and displayed aspect ratio correctly. Retain opaque pixels; preserve alpha where the chosen decoding path actually supports it. Process incrementally with progress and cancellation, bounded temporary buffers and complete cleanup. Validate a staged result before atomically replacing/adding the clip. Enforce the shared project limits; long videos should offer trimming or reduced extraction rate/size rather than freeze the application.

**Gate:** numbered/timestamped fixtures show correct ordering, duration within a defined sampling tolerance, no accidental endpoint duplication, correct orientation, preserved backgrounds and safe cancellation. Main replacement and adding an animation retain their distinct semantics.

### [ ] Step 9 — Video project persistence and source provenance

Version the data model only as needed. Retain the original video once per distinct source, the selected segment, extraction settings/timestamps and prepared frames required to reopen without repeating decoding. Deduplicate original video bytes, calculate the combined original/extracted-media budget and preflight archive growth honestly. Preserve old project compatibility and reject malformed video metadata safely.

Default video soundtrack handling to explicitly ignored/muted, with a clear explanation. Recommended v1.0 convenience: optional “import soundtrack as an audio take” using an explicitly selected bank; if included, keep its implementation as a small separate substep. Video audio must never silently become a looping combat/music cue. Do not imply timeline-synchronised video/audio editing.

**Gate:** a video-derived project survives save/close/reopen with identical prepared frames, settings and retained source bytes. Source Packs export actual PNGs and normal schedules/provenance, not a requirement that the future mod play the original video. Any opted-in audio follows existing bank rules.

### [ ] Step 10 — Video acceptance in real browsers

Run the fixture matrix through actual offline Chrome and Edge builds: MP4/MOV/AVI, opaque cat footage, portrait/rotated footage, variable-rate material, silent and audio-bearing files, invalid/truncated media, short and large inputs. Test trimming, changing extraction settings, cancellation, reopening and export.

**Gate:** the promised common cases pass end to end and unsupported codec cases have precise guidance. Record measured limits, browser versions and sample provenance. Do not substitute merely checking the file extension for decoding acceptance.

### [ ] Step 11 — Colour settings and persistence

Define warmth, colour tint and vibrance: parameter meaning, ranges, identity defaults, processing order and reset behaviour. Recommended scope is a project-wide look with explicit per-animation overrides. Confirm that scope in the implementation notes and label controls clearly. Add validation, Undo/Redo and project migration before completing rendering integration.

**Gate:** settings round-trip; invalid values are handled; old projects use a neutral look; schema changes are documented independently of the app version.

### [ ] Step 12 — Colour controls and preview

Integrate controls into the 0.7 workflow with original/processed comparison, inheritance/override clarity and reset. Use a shared defined image-processing recipe. Preserve transparency and exclude the reference figure, interface textures and preview backgrounds. Invalidate proxies/caches correctly on edits and clip changes.

**Gate:** all relevant preview contexts display the intended look; directions, clip switching and Undo/Redo work without altering timing, root or authored size.

### [ ] Step 13 — Colour processing in Source Packs

Apply the same recipe to full-resolution PNG output exactly once. Record recipes and processed hashes; keep originals unchanged. Include video-derived and image-derived clips. Verify soft alpha edges and opaque backgrounds as separate cases.

**Gate:** representative output PNGs match the intended preview look; neutral settings preserve existing output behaviour; schedules and physical mapping remain unchanged.

### [ ] Step 14 — Engine-material sound selections

Add defeated-material choices for flesh, glass and cloth. Add hit-effect choices with the requested Mr Handy metallic-body impact as the new-project default. Define which events these choices describe and how they coexist with imported voices/music; avoid duplicating the existing bank system.

Persist stable semantic selections and export them as desired runtime behaviour. Preserve legacy projects' existing behaviour. Do not invent game record IDs or pretend the bridge exists. Inspect supplied assets/references before offering audible material previews. Without verified audio assets, configuration remains useful, but its lack of audible preview must be clear.

**Gate:** controls, reset/history where appropriate, save/reopen and Source Pack metadata agree. Imported sound banks stay independent. Later GECK mapping has an explicit contract.

### [ ] Step 15 — Save and replacement reliability

Audit dirty-state tracking across old and new settings, save failures, cancelled operations, corrupt archives, unsupported schemas and opening a replacement project. Validate candidates before swapping active data. Protect against unintended loss of unsaved work and explain what is saved. Distinguish an initiated browser download from a file the user has successfully retained.

**Gate:** failures/cancellations retain the current project; legacy and new archives preserve originals/settings; edited video/colour/material data participates in dirty tracking. Full autosave remains separate scope.

### [ ] Step 16 — Export validation and capability report

Make preflight identify real blockers and navigate to fixes: invalid bounds, unresolved correction keys, missing references, audio conversion issues and project/output limits. Report Source Pack content and versioned desired behaviour, including video provenance, colour recipes and material choices. Runtime-pending status must not silently drop Studio settings.

**Gate:** complete exports contain consistent PNG/WAV/schedule/manifest data; failed exports explain the repair; no source pack is presented as an installable mod.

### [ ] Step 17 — Large projects and cancellation

Measure image- and video-heavy import, editing, save/reopen and export; include eight directions, repeated exports and cancellation followed by reuse. Check resource cleanup, temporary buffers, proxies, original-video duplication and archive peak memory. Current documented bounds include 2,000 image frames, 512 MB original media and 128 MB decoded audio; verify and explain how extracted video frames count rather than bypassing limits.

**Gate:** supported workloads complete with recorded time/memory observations and usable progress/cancel behaviour. Fix measured problems. If a major worker/streaming redesign is necessary, split it into a dedicated task before continuing.

### [ ] Step 18 — Usability and accessibility

Test narrow windows, Windows display scaling, keyboard navigation, visible focus, dialogs, disclosures and reduced motion. Preserve the supplied design while making the import-to-export path clear for nontechnical users, including “upload a cat video.” Keep advanced settings out of the basic flow.

Keep distinctions visible: selected animation versus state assignment; fixed root versus correction pivot; world size versus preview zoom; Source FPS/speed versus Display FPS; committed keys versus drafts; original video versus extracted animation; imported recordings versus engine-material choices.

**Gate:** essential controls remain readable/reachable and a new user can complete the basic workflow without developer assistance.

### [ ] Step 19 — End-to-end real-project acceptance

Use the user's real main/idle/attack images and recordings, Emet footage where available, and at least one common opaque video. Author settings, exercise the full hostile→defeat→pickup→deploy→combat→idle/roam→repack lifecycle, interrupt it at awkward points, save, close, reopen and export. Inspect output images and listen to exported WAVs. Include both attack targets and per-animation facing.

**Gate:** representative real projects pass end to end. Missing user media is a recorded dependency, not an excuse to mark synthetic tests as real-project acceptance. Preserve a reproducible signed-off project and Source Pack.

### [ ] Step 20 — Release candidate and future GECK contract

Refresh feature guide, quick start, limitations, version labels, third-party notices and Trial ZIP. Include small distributable fixtures and a useful sample. Document tested video combinations accurately. Ensure the packaged HTML is exactly the tested one.

Produce a compact Studio-to-GECK contract: states/events, clip bindings, timing, roots/physical dimensions, correction/filter baking, source-facing/directions, bank scheduling/ownership, engine-material selections and known preview-only controls. The contract records Studio's desired behaviour; it must not erase a feature merely because the existing mod cannot yet do it.

**Gate:** a fresh extraction works offline using the instructions; the package is self-contained; the later GECK work has reproducible inputs and an explicit behaviour specification.

### [ ] Step 21 — Final sign-off and v1.0

Freeze features. Run the full applicable release checks and fresh-package smoke test in the supported Windows browsers. Resolve release blockers, then repeat affected checks after fixes. Record exact artifact hashes, test versions and accepted limitations. Update status and release notes honestly.

**Gate:** no known data-loss defects or broken core workflows; required video cases pass; advertised capabilities match evidence; Studio v1.0 is ready for use. Remaining optional authoring improvements and GECK work are separate tracked tasks.

## 6. Contracts that every step must preserve

- Main import replaces main frames; adding an animation preserves existing main media.
- Clips retain independent timing, native canvas, root/size and corrections.
- Fixed feet/root, correction pivot and intentional artwork movement are different concepts.
- Source FPS and speed govern timing; Display FPS governs sampling; preview zoom does not change authored world size.
- Directions share phase. Source Left/Right facing mirrors around the authored root toward the correct encounter target.
- Attacking the player and attacking enemies remain separate assignments.
- Action completion/retrigger rules do not create gameplay damage or reset unrelated audio.
- Empty banks remain silent; explicit links, random quips, loops, timer ownership and cancellation remain intact.
- Originals stay editable and unchanged. Baked transforms/effects are applied once; padding never changes world calibration.
- Save/reopen preserves required authoring data; unsupported future schemas fail clearly.
- Network-free playback, import, save and export remain requirements. Node is a development/build dependency, not a user prerequisite.
- Do not modify Godot assets, installed mods, GECK configuration or unrelated FNV repositories.

## 7. Release evidence and stopping rules

Keep separate evidence for pure/component tests, native raster/archive tests, actual browser interaction, human listening, real-media acceptance and future game validation. Record the build/version/hash for acceptance runs. Historical 0.2.0 evidence does not prove the new build.

Block release on data loss, broken core workflows, unfulfilled required video cases, missing offline dependencies, corrupt exports or misleading capability claims. Cosmetic nonblocking issues can remain documented. Unsupported unusual codecs need honest messaging, but must not become a blanket excuse for skipping common MP4/MOV/AVI support.

The original proposal's roughly 5 MB HTML target is a historical size goal, not an automatic veto on required video support. Measure any bundled decoder's cost and document a justified tradeoff. Preserve the single-file/offline experience unless the user explicitly changes that requirement.

Rebuild and package from the actual project directory using `node build.mjs` and `node package.mjs` once their integration is ready. Use the portable test entry point established in Step 2 rather than blindly copying obsolete README commands. Do not run a build now merely to inspect the project: it would regenerate the old bundle before reconciliation.

## 8. GECK work after Studio v1.0

This is future sequencing, not authorization to implement it during the Studio steps:

1. Compare the final Studio contract with the preserved working mod/builder; document supported mappings and gaps.
2. Adapt one Source Pack into actual compatible game assets while preserving the proven builder conventions.
3. Validate timing, alpha, roots/scale, audio and the lifecycle in GECK/FNV, including save/reload and interruptions.
4. Implement the Studio-defined directions, animation policies, roaming, banks and material effects; resolve genuinely infeasible behaviour explicitly with the user.
5. Prove independent character registrations can coexist without path collisions, duplicate actors/items or orphan sounds.
6. Package the exporter/runtime and verify fresh installation and removal. Investigate the self-contained conversion path against the validated reference implementation.

This later work needs its own bounded plan after inspecting actual mod/runtime inputs. Studio preview tests cannot establish game compatibility, and the existing mod's current limits do not redefine the intended Studio product.

## 9. Immediate next action

Step 1 baseline evidence is recorded in BASELINE-ACCEPTANCE.md; Step 2 portable tests and results are documented in tests/README.md and STATUS.md. Review section 4.2 for the recorded GitHub, media and Trial ZIP follow-ups before starting **Step 3** using the preamble above. Complete Steps 3–5 to establish a rebuildable, tested foundation, then tackle the video decoder investigation before adding the remaining features.
