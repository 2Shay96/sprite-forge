Sprite Forge Studio 0.7.0 — offline Workbench

Save any project in the existing tab before refreshing it.
Unzip this folder and open SpriteForge.html directly in Chrome.
No server, account, installation or network is needed.

WORKFLOW
01 Animations: import main, then tick/name/import idle, attack or other slots.
Choose the state chips before importing; they set explicit links. Auto-fill
updates automatic links while keeping your own choices. Main replacement
keeps extra animations. Cancel import leaves the current frames untouched.
02 Tune: select an animation chip; Size & ground > Directions > Timing > Frame fixes.
03 Sound: choose a cue, add takes, and edit its bank; empty cues stay silent.
04 Field test: choose a state and its animation/action rule, or run Encounter.
05 Export: review preflight, Save project, then Export Source Pack.
FX is a viewer preference. Fonts/textures are embedded; licenses are in fonts/.

A3: ACTION PLAYBACK
Test kits > Idle + attack > Use this sequence > Field test > Test entry / action.
Watch attack frames 0–4, strike cue at 2, then idle return.
Try Restart, Ignore and Queue one; click Test again during playback.
Pause/scrub/step and resume. Play Encounter triggers attacks from actual events.
Defeat/pickup/repack cancel the action and its single queued replay.
For your clips: assign Attack to Attack player · hostile and Attack enemy · companion;
choose Play once, then return, and pick Idle/Main as return animation.
Continue phase keeps the shared clock; Restart on entry resets that state.
One action uses one authored cycle, including ping-pong if selected.
Return clips keep global phase. Strike is visual only, never extra damage/audio.
Native grounding, shape and correction keys apply to action/return separately.
Rules/assignments/markers use Undo/Redo and schema 7 save/reopen (reads 1–6).
Source Pack v6 includes resolved rules and exact one-cycle action schedules.
The fixture adds/assigns test clips; Undo restores rules, leaving imported clips.

A2: FRAME CORRECTIONS
Test kits > Drift test > Use this sequence > Tune > Frame fixes.
In an existing project this adds a clip rather than replacing main.
At First frame, set Pivot 180,450; Move 76,-14; Scale 100; Add keyframe.
At Last frame, set Pivot 310,410; Move -54,-54; Scale 55.5556; Add keyframe.
Play Corrected; compare Original. Add middle keys to tune gradual drift.
Numbers/dragging are drafts until Add/Update; Revert discards a draft.
Linear/Hold/Smooth, delete/reset, Undo/Redo and a seam comparison are included.
Keys follow full source indices through timing changes and ping-pong.
Export uses saved enabled keys, even when Original preview is selected.
Expand gives fixed bounds; Crop deliberately clips; 8192 output limit applies.
Real imported views have independent tracks, with explicit front copy/link.
Replaced footage retains unmatched keys for review instead of moving them
onto a different pose. Resolve or disable a flagged track before exporting.
Save/reopen keeps originals, keys and retained review keys (project schema 7).

A1: PER-CLIP GROUND & SCALE
Add animations through step 01's checklist or Add / manage animations (e.g. attack).
Its canvas may differ from main. Select its chip, then Tune > Size & ground.
Uncheck Inherit main, or edit a value. Set its own root/feet, native height and scale.
Unlink Width/Height for Wide/Tall, or use sliders. Offsets move the root in units.
Compare with main and back; roots meet the same floor when offsets are zero.
Copy/reset and Undo/Redo are included. Preview zoom and Sunny stay independent.
Save/reopen preserves profiles; Source Pack v6 has shape-baked PNGs plus physical
mapping. Padding does not change world size. Output above 8192 per side is rejected.
Attack restart/return (A3) is included.

A4: AUDIO BANKS
Test kits > Two test tones > Sound > Test this cue.
You should hear two synthetic tones alternating with random 1–2 second pauses.
Pause bank freezes sound and timers; Resume bank continues; Stop audio cancels.
These tones are not Salvatore voice recordings.

For idle dialogue: select Idle / roaming quips, add your recordings, choose
Periodic quips, Weighted random, Avoid immediate repeats, and set Pause min/max.
With exactly two takes they alternate; disable Avoid immediate repeats to allow repeats.
Load images and play Neutral idle in State Gallery to hear them on the character.
Idle/roam share the timer. Leaving neutral cancels pending quips. Blank is silent.

Test kits > Numbered frames > Use this sequence > Play for the animation fixture.
Try ping-pong, independent FPS/speed, feet placement, eight directions and encounter.
Audio trim/gain, per-take files, fixed/random gaps, selection, finite plays,
entry delay, cooldown/overlap, references and Undo/Redo are included.
The supplied stereo-tone-48k.wav is a separate audio import/conversion fixture.

Save Project includes original images, recordings, edits and bank policies.
Open Project restores them. Export Source Pack makes PNGs, exact schedules,
separate 44.1 kHz mono PCM16 WAVs and a manifest with bank scheduling rules.
It is not an installable game mod. FNV bridge work is deferred.

FEATURE-GUIDE.md walks through every feature and cue.
ALPHA-HANDOFF.md has the current browser acceptance checklist.
Focused offline 0.7 workflow checks pass in Windows Chrome and Edge with
numbered PNG/audio fixtures, including save/reopen and Source Pack downloads.
Native/component regression tests pass. Full real-media/browser/listening
acceptance remains Step 5; these automated checks do not establish audibility.
Video import and v1.0 additions remain later plan steps; the FNV bridge is deferred.
