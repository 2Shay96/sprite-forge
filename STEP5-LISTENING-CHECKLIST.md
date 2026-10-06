# Step 5 listening and visible-browser checks

Prepared 6 October 2026. Pending human results; Step 5 is not signed off yet.

Use this checkout's **SpriteForge.html** (0.7.0), SHA-256 `d2fcabbfcba3f9cd6fb9bd798b1deb1ad28cdc93e8468013b42cee0611d25032`.
Open it in Windows Chrome, then repeat in Edge. No server or internet connection is needed.
Choose **Open project** and load `evidence/step5/final-chrome-audio/salvatore-listening.spriteforge.zip` from the same folder.
This prepared project has three real Salvatore frames and four original recordings. It is an acceptance fixture, not a recovered user-authored project.

1. Open **03 Sound**. For **Combat music**, **Defeated sound**, **On defeat** and **Summon / deployment**, select the take, click **Listen: original**, then **Stop audio**, then **Listen: exported WAV**. Confirm both are audible and recognizable, without clipping or unexpected speed/pitch changes. Stereo originals becoming mono is expected.
2. On **Combat music** and **Defeated sound**, use **Test this cue**. Listen through a full wrap (music about 12 seconds; defeated about 29 seconds). Note any click, gap or jump. A recording's original seam may itself need editing; report what you hear rather than assuming seamless source material.
3. While a loop plays, click **Pause sounds**. Confirm silence. Wait a few seconds, click **Resume sounds**, and confirm playback resumes rather than playing during the pause. **Stop audio** must stop it completely.
4. Start a cue, switch to another browser tab for a few seconds, then return. Confirm audio stops when hidden and stays paused on return. Resume explicitly. Repeat with the main preview playing. This requires an actual visible browser: headless tests do not prove tab visibility.
5. Open **Test kits → Two test tones**. In Sound, **Test this cue**, listen for both distinct tones with pauses. Check **Pause sounds** during a pause: no tone should fire while paused. Resume, then Stop; no delayed tone should return afterward. This is a synthetic scheduling check, not real voice/idle/attack media acceptance.
6. Reopen the prepared Salvatore project. Export a **Source Pack**, extract it in a new folder and listen to the four WAVs under `Modding_Ready_Sprite_Files/my_sprite/source-pack/audio/`. Confirm they match **Listen: exported WAV**. They are mono 44.1 kHz PCM16.

Reply with the browser(s) checked and either **all pass** or the cue/control and what went wrong. If there is a defect, include whether it affects original playback, WAV playback, or both. Do not advance to Step 6 until remaining Step 5 issues and this acceptance gate are resolved.

Automated native decoding, non-silent conversion, archive CRCs/original hashes and real AudioContext pause/cancellation checks pass separately. These checks cannot confirm audible output, device volume or perceptual loop quality. Latest user project, Emet media and distinct real idle/attack recordings were not found in Desktop, Downloads, Documents, Pictures, Videos or the local OneDrive folder; their later real-project acceptance remains a recorded dependency.
