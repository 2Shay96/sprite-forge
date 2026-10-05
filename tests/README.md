# Portable test entry point

Run from the project directory with Node.js 22 or newer:

```powershell
node tests/run.cjs
```

This runs 16 mandatory self-contained suites, sequentially in isolated processes. The checkout can have any name and contain spaces. From another directory, pass the absolute path to tests/run.cjs. No application build or package command is part of testing.

## Development dependencies

Building the offline HTML needs only Node; native tests additionally need @napi-rs/canvas and sharp. Optional browser checks need Playwright and an installed Chrome/Edge. Versions used here are pinned as development dependencies in package.json. On a normal Node/npm installation, run `npm install` once, then `npm test`. Dependencies are test tools, not end-user requirements. npm installation itself was not tested on this PC; the configured bundled packages were used.

Alternatively use an existing package directory explicitly, without installing into the project. On this PC the discovered bundle was:

```powershell
$env:SPRITE_FORGE_NODE_MODULES = 'C:\Users\Shadow\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node tests/run.cjs
```

This environment value is machine-specific setup, never a baked-in fallback. With no override, resolution uses the project's node_modules. An unavailable native dependency makes affected suites BLOCKED; pure/source suites can still run. Do not copy or rename the checkout to satisfy paths.

## Suite groups and results

| Command / group | Evidence |
| --- | --- |
| Default | Pure timing/reference/simulator/playback/bank scheduler/audio clock; native placement/corrections/PNG/archive/media; mocked DOM controls; source-facing; source/bundle syntax and bindings |
| `--browser` | Fresh isolated offline browser smoke: startup, demo review/accept, transport, no page errors or HTTP requests. Not full workflow sign-off or listening |
| `--external` | Historical archive reopen, three real Emet sample frames, full Salvatore eight-direction browser workflow; missing configured inputs are BLOCKED |
| `--package` | Existing Trial ZIP CRC/HTML/doc consistency; never regenerates stale packages |
| `--legacy-browser` | Older browser.cjs and milestone2.cjs workflows with original assertions. They contain pre-bank/schema assumptions and need review before Step 5; not release acceptance |
| `--suite NAME` | Only named suites (repeat flag to select several); same preflight/results policy |

Combine optional flags to run them alongside mandatory suites. `node tests/run.cjs --help` lists choices. A result is PASS only when its actual assertions complete. Exit 0 means every selected suite passed; exit 1 means at least one failed; exit 2 means no failures but at least one selected suite is blocked. Unrequested groups are listed as notRequested, never passed. A missing browser executable/dependency is blocked; assertion errors remain failed.

Each invocation writes a unique ignored `evidence/test-runs/<timestamp>-<pid>/results.json`, per-suite logs and isolated output subfolders. Reports include platform/Node, dependency versions, exact stable/preview SHA-256 and individual statuses. Do not overwrite historical evidence. `SPRITE_FORGE_TEST_OUTPUT` can select a separate output directory. Generated PNGs/WAVs/ZIPs/logs stay out of commits; small checked summaries belong in documentation. Native audio uses explicit fake Web Audio clocks/resampling; GIF extraction uses a mock ImageDecoder with real GIF/PNG bytes. Neither proves browser decoding or human audibility.

## Optional browser configuration

```powershell
$env:SPRITE_FORGE_BROWSER_CHANNEL = 'chrome'  # default; use 'msedge' for Edge
node tests/run.cjs --suite smoke
```

Or set `SPRITE_FORGE_BROWSER` to the full installed executable path. Files are opened through a correctly encoded file URL, including Windows spaces. Tests launch a new headless browser; they do not refresh the user's loaded project/tab. Browser startup failures should stay visible. Full Chrome/Edge workflow and listening acceptance is Step 5 after source integration.

## Optional external inputs

| Variable | Required input |
| --- | --- |
| SPRITE_FORGE_ARCHIVES | Folder containing legacy-v1.spriteforge.zip, fixture.spriteforge.zip, salvatore_front.spriteforge.zip and a4-project.spriteforge.zip; defaults to local evidence/ if present |
| SPRITE_FORGE_EMET | Original Emet PNG folder, at least three frames; first/middle/last are sampled read-only |
| SPRITE_FORGE_SALVATORE_DIRECTIONS | Folder with S/SE/E/NE/N/NW/W/SW subfolders, the historical 70-frame 1080² sequences |
| SPRITE_FORGE_SALVATORE | Historical source root containing assets/salvatore_angle_sprites/S and assets/sounds/res_sound_effect.mp3 for the older browser workflows |

These suites preserve source bytes and inspect them read-only. They no longer require a GECK configuration, installed game or unrelated repository. Do not point them at synthetic substitutes and call the result real-media acceptance. Supplied original media and historical archives are optional local inputs, not dependencies of the 16 mandatory suites.

## Step 2 Windows evidence — 5 October 2026

- Before adaptation, all 20 original executable test scripts exited 1 before assertions because of checkout-relative paths or missing Mac dependencies. Full local report: evidence/windows-step2/pre-portability.json. No application source change was needed.
- Final mandatory run: 16/16 passed on Windows, Node v24.19.0, @napi-rs/canvas 0.1.100 and sharp 0.35.4. Includes actual native PNG/archive bytes, 8192² media boundary and source-facing controls/save/reopen/legacy/export metadata.
- Keyer-controls initially exposed two old wording expectations: Draft and Crop to base. Updated to 0.6.2's Unsaved adjustment and Original canvas with overflow cropped. Their underlying draft/commit/history/crop assertions were preserved and pass.
- Optional historical archives passed, including the actual 70-frame Salvatore front archive and A4 audio-bank archive. Emet/original eight-direction checks are BLOCKED until their variables identify actual source folders.
- Playwright 1.62.1 offline Chrome and Edge smoke passed; versions 154.0.8037.98 and 154.0.4258.53. This covers only the smoke actions above. No human listening or full browser sign-off.
- Existing package check FAILS: packaged ALPHA-HANDOFF.md differs from the pre-existing working document. This was identified in Step 1. Preserve the old ZIP; reconcile packaging after integration rather than rebuild the older application now.
- Entry point invoked from an unrelated parent directory passed. Injecting a nonexistent package directory returned BLOCKED/exit 2; the stale-package assertion returned FAIL/exit 1 with the exact mismatched document.
- Historical browser/milestone2 workflows remain outside the mandatory gate. Missing configured source is BLOCKED; obsolete assertions are not silently promoted to current acceptance.

Exact tested stable HTML SHA-256: 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b (0.6.2). Supplied preview SHA-256: 908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3. No build, package, source or HTML edit performed in Step 2.
