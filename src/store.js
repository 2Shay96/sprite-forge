SF.Store = (() => {
  const defaults = () => ({ characterId: 'my_sprite', displayName: 'My Sprite', clipId: 'dance',
    sourceFps: 24, playbackSpeedPercent: 100, displayFps: 24, playbackMode: 'forward_loop',
    rangeStart: 0, rangeEnd: 0, anchorX: 0, anchorY: 0, scalePercent: 100,
    referenceCanvasHeightUnits: 128, zoomPercent: 100, background: 'dark', showReference: true, directionMode:'generated', previewDirection:'S', generatedSideWidthPercent:45, rearDarknessPercent:85, mirrorDirections:true });
  let project = { settings: defaults(), frames: [], canvas: [0, 0], issues: [],
    audio: {}, stateClips: {}, directionOrder: ['S','SE','E','NE','N','NW','W','SW'] };
  let undo = [], redo = [], dirty = false;
  const clone = x => JSON.parse(JSON.stringify(x));
  const snapshot = () => ({settings:clone(project.settings),clipFacing:clone(project.clipFacing||{}),placements:clone(project.placements||{}),corrections:clone(project.corrections||{}),stateClips:clone(project.stateClips||{}),statePlayback:clone(project.statePlayback||{})});
  function trimHistory(){while(undo.length>100)undo.shift();while(undo.length>1&&JSON.stringify(undo).length+JSON.stringify(redo).length>16*1024*1024)undo.shift();while(redo.length>1&&JSON.stringify(undo).length+JSON.stringify(redo).length>16*1024*1024)redo.shift();}
  function remember(){undo.push(snapshot());redo=[];trimHistory();}
  function commitCorrections(fn){const before=snapshot();try{fn();SF.Corrections.validate(project);}catch(e){project.corrections=before.corrections;SF.Corrections.changed(project);throw e;}undo.push(before);redo=[];trimHistory();SF.Corrections.changed(project);dirty=true;}
  function commitPlayback(fn){const before=snapshot();try{fn();SF.Playback.validate(project);}catch(e){project.statePlayback=before.statePlayback;project.stateClips=before.stateClips;throw e;}undo.push(before);redo=[];trimHistory();dirty=true;}
  function commitFacing(id,value){if(!SF.Clips.ids(project).includes(id)||!['views','left','right'].includes(value))throw Error('Invalid source facing.');remember();project.clipFacing??={};project.clipFacing[id]=value;dirty=true;}
  function commitPlacement(id,patch){const before=snapshot();try{SF.Placement.set(project,id,patch);if(project.frames.length)SF.Placement.validate(project);}catch(e){project.settings=before.settings;project.placements=before.placements;throw e;}undo.push(before);redo=[];trimHistory();dirty=true;}
  function commit(patch) { remember();
    const oldId=project.settings.clipId;Object.assign(project.settings, patch);if(patch.clipId&&patch.clipId!==oldId&&Object.hasOwn(project.clipFacing||{},oldId)){project.clipFacing[patch.clipId]=project.clipFacing[oldId];delete project.clipFacing[oldId];}if(patch.clipId&&patch.clipId!==oldId&&project.corrections?.[oldId]){project.corrections[patch.clipId]=project.corrections[oldId];delete project.corrections[oldId];}for(const b of Object.values(project.statePlayback||{})){if(b.returnClip===oldId)b.returnClip=project.settings.clipId;if(b.marker?.clipId===oldId)b.marker.clipId=project.settings.clipId;}SF.Corrections?.changed(project);dirty = true; }
  function replace(next) { for (const f of project.frames) f.proxy?.close?.(); project = SF.Clips?SF.Clips.initialize(next):next; undo = []; redo = []; dirty = true; }
  function history(reverse) { const from = reverse ? redo : undo, to = reverse ? undo : redo;
    if (!from.length) return; to.push(snapshot());const oldId=project.settings.clipId;const restored=from.pop();project.settings=restored.settings;project.clipFacing=Object.fromEntries(Object.entries(restored.clipFacing||{}).filter(([id])=>SF.Clips.ids(project).includes(id)));project.placements=Object.fromEntries(Object.entries(restored.placements).filter(([id])=>Object.hasOwn(project.extraClips||{},id)));project.corrections=restored.corrections;project.stateClips=Object.fromEntries(Object.entries(restored.stateClips||{}).filter(([,id])=>SF.Clips.ids(project).includes(id)));project.statePlayback=restored.statePlayback||{};for(const b of Object.values(project.statePlayback)){if(b.returnClip&&!SF.Clips.ids(project).includes(b.returnClip))b.returnClip=null;if(b.marker&&!SF.Clips.ids(project).includes(b.marker.clipId))b.marker=null;}SF.Playback?.remapMarkers(project);SF.Corrections?.remapAll(project);trimHistory();if(oldId!==project.settings.clipId)for(const state of Object.keys(project.stateClips||{}))if(project.stateClips[state]===oldId)project.stateClips[state]=project.settings.clipId;dirty=true; }
  function touch(){dirty=true;}
  function validate(s, count, canvas) {
    const bounded = (key, min, max) => { if (!Number.isFinite(s[key]) || s[key] < min || s[key] > max) throw Error(`Invalid ${key}: expected ${min}–${max}.`); };
    for (const key of ['characterId','clipId']) if (typeof s[key] !== 'string' || !/^[a-z][a-z0-9_]{0,63}$/.test(s[key])) throw Error(`Invalid ${key}: use lower-case letters, digits and underscores.`);
    if (typeof s.displayName !== 'string' || !s.displayName.trim() || s.displayName.length > 120) throw Error('Enter a character name (1–120 characters).');
    bounded('sourceFps', 1, 120); bounded('displayFps', 1, 120); bounded('playbackSpeedPercent', 10, 300);
    bounded('scalePercent', 1, 200); bounded('zoomPercent', 25, 300); bounded('referenceCanvasHeightUnits', 1, 4096);
    bounded('rangeStart', 0, count - 1); bounded('rangeEnd', s.rangeStart, count - 1);
    if (!Number.isInteger(s.rangeStart) || !Number.isInteger(s.rangeEnd)) throw Error('Frame range must use whole indices.');
    bounded('anchorX', 0, canvas[0]); bounded('anchorY', 0, canvas[1]);
    if (!['forward_loop','ping_pong','once'].includes(s.playbackMode)) throw Error('Unknown playback mode.');
    if(s.directionMode&&!['billboard','generated','imported'].includes(s.directionMode))throw Error('Invalid direction mode.');
    if(s.generatedSideWidthPercent!==undefined)bounded('generatedSideWidthPercent',10,100);
    if(s.rearDarknessPercent!==undefined)bounded('rearDarknessPercent',0,100);
    if(s.previewDirection&&!['S','SE','E','NE','N','NW','W','SW'].includes(s.previewDirection))throw Error('Invalid viewing direction.');
    if (!['checker','light','dark','scene','pink','yellow'].includes(s.background) || typeof s.showReference !== 'boolean') throw Error('Invalid preview settings.');
  }
  return { defaults, clone, commit, commitFacing, commitPlacement, commitCorrections, commitPlayback, replace, history, validate, touch,
    get project() { return project; }, get dirty() { return dirty; },
    saved() { dirty = false; }, get canUndo() { return undo.length > 0; }, get canRedo() { return redo.length > 0; } };
})();
