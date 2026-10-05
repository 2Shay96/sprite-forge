# Sprite Forge Studio status

Updated: 5 October 2026.

## Current task

Step 1 baseline and acceptance documentation is complete and its checkpoint is verified on GitHub. No later step started; no application behaviour changed.

## Changes and evidence

- Added BASELINE-ACCEPTANCE.md: authoritative project/artifact hashes, source/preview split, fixtures and missing real media, environment targets and release acceptance matrix for every required v1.0 feature.
- Preserved the stable 0.6.2 HTML/backup and supplied 0.7 preview. All 17 maintained modules parse and match the stable bundle; preview has 14 unchanged modules, three changed and two new. Supplied/package 0.7 SHA-256 matches: 908f06d476e40e004bcc499c6d5a62dfba267a4ddbc99802b1bfde26782307e3.
- Stable HTML SHA-256: 93ed65579cf1afb7d542f9975e362e90996a6ef0896059722d69af10fedad28b. Trial ZIP CRC reads and its HTML matches stable; packaged alpha handoff differs from the pre-existing edited working document. No build/package run.
- Verified implementation tool version 0.6.2, project schema 7 (reads 1–7), Source Pack schema 6. Studio defines desired future runtime behaviour; GECK/mod work remains outside this plan.
- Inventoried nine supplied fixture files and 32 historical evidence ZIPs. No video fixtures established. Latest user project, real idle/attack/voice media, Emet and cat video remain input dependencies for later acceptance.
- Node v24.19.0 and Git 2.53.0.windows.3 available. Installed Chrome 154.0.8037.98 and Edge 154.0.4258.53 recorded as inventory only.
- Checks: git status/diff/remotes/upstream/fetch/ahead-behind; public repository metadata; SHA-256/size comparison; node:vm source syntax and embedded-module comparison; vendored JSZip/CRC and packaged HTML/doc comparisons; fixture/test/environment inventory. No runtime suites, Studio browser acceptance or human listening performed. Tests still contain Mac paths and parent-folder assumptions; Step 2 addresses them.

## GitHub checkpoint

Confirmed repository: https://github.com/2Shay96/sprite-forge, origin URL https://github.com/2Shay96/sprite-forge.git; working branch main, upstream origin/main. Existing repository is public; visibility was preserved. GitHub Desktop Accounts confirms @2Shay96 sign-in and now manages the exact existing checkout. Commit identity is 2Shay <327810178+2Shay96@users.noreply.github.com>.

Last verified remote baseline checkpoint: 958e38e62c61a15b081a3aec66f8d21383c60f89 (5 October 2026), pushed through GitHub Desktop. git ls-remote origin refs/heads/main matched local HEAD; a fresh fetch confirmed ahead/behind 0/0. This receipt update follows that checkpoint and need not contain its own SHA. Fetch succeeded; initial local/remote ahead-behind was 0/0. CLI gh is missing and command-line credential manager has no listed account. Noninteractive CLI push dry-run failed because Git could not read the GitHub username; Desktop sign-in is separate. Desktop push succeeded using the verified account. Use Desktop for routine pushes while CLI authentication remains unavailable; there is no outstanding baseline backup blocker.

Checkpoint scope: BASELINE-ACCEPTANCE.md, STATUS.md and plan.md only. Existing ALPHA-HANDOFF.md modification and untracked CLOUD-HANDOFF.md, FILE-MANIFEST.json, START-HERE-WINDOWS.md and reference/ were preserved outside this commit. No source, HTML, archive, fixture, game or other project changes.

## Next action

Execute Step 2 of plan.md: portable Windows tests with explicit pass/fail/blocked results. Use the existing Desktop connection for checked progress backups.
