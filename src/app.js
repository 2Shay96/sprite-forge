(() => {
  const $=id=>document.getElementById(id), store=SF.Store,T=SF.Timeline;
  let elapsed=0,playing=false,last=performance.now(),manual=null,busy=false,signal=null,pending=null,dragStart=null,pendingAccept=null,pendingTab=null;
  const project=()=>store.project,settings=()=>project().settings;
  SF.Clips.initialize(project());
  const clip=()=>SF.Clips.get(project(),SF.Studio?.clipId||settings().clipId),timing=()=>SF.Clips.timing(project(),SF.Studio?.clipId||settings().clipId);
  const status=(message,error=false)=>{$('status').textContent=message;$('status').classList.toggle('error',error);};
  const frame=()=>manual??SF.Studio?.pose?.()?.frame??(project().frames.length?T.at(timing(),elapsed):0);
  function seek(seconds){if(!SF.Studio?.seek?.(seconds))elapsed=seconds;}
  function tab(name){document.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==name);document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===name));}
  document.querySelectorAll('[data-tab]').forEach(x=>x.onclick=()=>tab(x.dataset.tab));
  function pause(){playing=false;$('play').textContent='Play';SF.Audio.pause().catch(()=>{});}
  function update() {
    const p=project(),s=p.settings,t=timing(),has=p.frames.length>0;
    document.querySelectorAll('[data-setting]').forEach(el=>{if(el.type==='checkbox')el.checked=s[el.id];else el.value=SF.Clips.timingKeys.includes(el.id)?t[el.id]:s[el.id];el.disabled=busy;});
    for(const id of ['save','export','prev','play','next','reset','scrub','suggest'])$(id).disabled=busy||!has;
    for(const id of ['import','reopen','demo','zoom','scale-slider'])$(id).disabled=busy;
    $('undo').disabled=busy||!store.canUndo;$('redo').disabled=busy||!store.canRedo;
    $('zoom').value=s.zoomPercent;$('zoom-value').textContent=s.zoomPercent+'%';$('scale-slider').value=SF.Placement.resolve(p,SF.Studio?.clipId||s.clipId).scalePercent;
    $('rangeStart').max=$('rangeEnd').max=Math.max(0,clip().frames.length-1);$('anchorX').max=p.canvas[0];$('anchorY').max=p.canvas[1];
    $('preview-name').textContent=s.displayName;$('clip-label').textContent=has?s.clipId:'No sequence yet';
    $('media-summary').textContent=has?`${p.frames.length} frames · ${p.canvas[0]} × ${p.canvas[1]} px`:'Image sequence';
    $('dirty').textContent=has?(store.dirty?'Unsaved':'Saved project'):'No project';
    $('count').textContent=has?`${t.rangeEnd-t.rangeStart+1} / ${clip().frames.length}`:'—';
    $('rate').textContent=has?T.rate(t).toFixed(2)+' fps':'—';$('display').textContent=has?t.displayFps+' fps':'—';
    const duration=has?T.duration(t):0;$('duration').textContent=has?duration.toFixed(6)+' s':'—';$('duration-label').textContent=has?`Full cycle ${duration.toFixed(6)} s`:'Cycle —';
    $('scrub').max=duration||1;
    $('validation').textContent=has?(p.issues.length?p.issues.join('\n'):'All frames validated. No issues detected.'):'No media imported.';
    $('schedule-report').textContent=has?JSON.stringify(T.schedule(t),null,2):'Import frames first.';
    document.querySelectorAll('[data-fps]').forEach(el=>el.classList.toggle('selected',Number(el.dataset.fps)===t.displayFps));
    SF.Studio?.refresh();render();
  }
  function render(){const has=project().frames.length>0,s=timing(),i=frame();SF.Renderer.draw(project(),i);SF.Studio?.afterRender(i);
    if(has){const d=T.duration(s),clock=SF.Studio?.pose?.()?.elapsed??elapsed,local=s.playbackMode==='once'?Math.min(clock,d):clock%d;
      $('scrub').value=local;$('elapsed').textContent=local.toFixed(3)+' s';$('frame-label').textContent=`${i} / ${clip().frames.length-1}`;
      $('strip').querySelectorAll('.thumb').forEach(el=>el.classList.toggle('current',Number(el.dataset.index)===i));}}
  function thumbs(container,frames,click){container.replaceChildren();frames.forEach((f,i)=>{const el=document.createElement(click?'button':'div');el.className='thumb';el.dataset.index=i;el.title=`Frame ${i} · ${f.name} · ${f.width} × ${f.height}`;
    const img=document.createElement('img');img.src=f.thumbnail;img.alt=`Frame ${i}`;const label=document.createElement('small');label.textContent=`${i} · ${f.name}`;el.append(img,label);if(click)el.onclick=()=>{if(busy)return;pause();manual=i;seek(Math.max(0,i-timing().rangeStart)/T.rate(timing()));render();};container.append(el);});}
  function change(patch){try{const next={...settings(),...patch};if(project().frames.length&&!Object.keys(patch).every(k=>SF.Placement.keys.includes(k)))store.validate({...timing(),...patch},clip().frames.length,SF.Clips.canvas(project(),SF.Studio?.clipId||settings().clipId));
      else{if(['characterId','clipId'].some(k=>!/^[a-z][a-z0-9_]{0,63}$/.test(next[k])))throw Error('Use a lower-case ID beginning with a letter.');}
      if(patch.clipId&&project().extraClips[patch.clipId])throw Error('That clip ID already exists.');
      if(!Object.keys(patch).every(k=>['directionMode','previewDirection','generatedSideWidthPercent','rearDarknessPercent','mirrorDirections'].includes(k)))pause();
      if(Object.keys(patch).every(k=>SF.Placement.keys.includes(k)))store.commitPlacement(SF.Studio?.clipId||settings().clipId,patch);else if(SF.Studio?.editTiming(patch)){}else{const oldId=settings().clipId;store.commit(patch);if(patch.clipId&&patch.clipId!==oldId)for(const key of Object.keys(project().stateClips))if(project().stateClips[key]===oldId)project().stateClips[key]=patch.clipId;}
      if(Object.keys(patch).some(k=>['sourceFps','playbackSpeedPercent','displayFps','playbackMode','rangeStart','rangeEnd'].includes(k))){elapsed=0;manual=null;SF.Studio?.resetPlayback?.();}
      update();status('Updated · unsaved.');}
    catch(e){status(e.message,true);update();}}
  document.querySelectorAll('[data-setting]').forEach(el=>el.onchange=()=>change({[el.id]:el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value}));
  $('zoom').oninput=()=>{settings().zoomPercent=Number($('zoom').value);$('zoom-value').textContent=settings().zoomPercent+'%';render();};
  $('zoom').onchange=()=>{const value=Number($('zoom').value);settings().zoomPercent=zoomStart;store.commit({zoomPercent:value});update();};
  let zoomStart=100;$('zoom').onpointerdown=()=>zoomStart=settings().zoomPercent;$('zoom').onkeydown=()=>zoomStart=settings().zoomPercent;
  for(const [slider,key] of [['scale-slider','scalePercent'],['width-slider','widthPercent'],['height-slider','heightPercent']]){let gesture=null;const start=()=>{pause();gesture={id:SF.Studio?.clipId||settings().clipId,settings:store.clone(settings()),placements:store.clone(project().placements)};};
    $(slider).onpointerdown=start;$(slider).onkeydown=()=>{if(!gesture)start();};
    $(slider).oninput=()=>{if(!gesture)start();SF.Placement.set(project(),gesture.id,{[key]:Number($(slider).value)});const g=SF.Placement.resolve(project(),gesture.id);for(const k of ['scalePercent','widthPercent','heightPercent'])$(k).value=g[k];$('width-slider').value=g.widthPercent;$('height-slider').value=g.heightPercent;render();};
    $(slider).onchange=()=>{if(!gesture)return;const end=Number($(slider).value),id=gesture.id;project().settings=gesture.settings;project().placements=gesture.placements;gesture=null;store.commitPlacement(id,{[key]:end});update();};
  }
  $('presets').onclick=e=>{if(e.target.dataset.fps)change({displayFps:Number(e.target.dataset.fps)});};
  $('undo').onclick=()=>{pause();store.history(false);elapsed=0;manual=null;SF.Studio?.resetPlayback?.();update();};$('redo').onclick=()=>{pause();store.history(true);elapsed=0;manual=null;SF.Studio?.resetPlayback?.();update();};
  $('play').onclick=()=>{if(playing){pause();return;}if(timing().playbackMode==='once'&&(SF.Studio?.pose?.()?.elapsed??elapsed)>=T.duration(timing())&&SF.Studio?.pose?.()?.policy!=='once_return'){if(SF.Studio?.pose?.()?.policy==='restart')SF.Studio.rewind();else elapsed=0;}
    manual=null;playing=true;SF.Audio.resume().catch(e=>status(e.message,true));last=performance.now();$('play').textContent='Pause';};
  const step=delta=>{pause();const s=timing(),i=frame();manual=Math.min(s.rangeEnd,Math.max(s.rangeStart,i+delta));seek((manual-s.rangeStart)/T.rate(s));render();};
  $('prev').onclick=()=>step(-1);$('next').onclick=()=>step(1);$('reset').onclick=()=>{pause();elapsed=0;manual=null;SF.Studio?.rewind?.();update();};
  $('scrub').oninput=()=>{pause();manual=null;seek(Number($('scrub').value));render();};
  $('suggest').onclick=()=>{const bounds=clip().frames.filter(f=>f.bounds).map(f=>f.bounds);change({anchorX:(Math.min(...bounds.map(b=>b[0]))+Math.max(...bounds.map(b=>b[2]))+1)/2,anchorY:Math.max(...bounds.map(b=>b[3]))+1});};
  SF.Renderer.init($('preview'));
  $('preview').onpointerdown=e=>{if(busy||!project().frames.length)return;if(SF.Studio?.mode==='encounter'){SF.Studio.place(e);return;}if(SF.Studio?.beginCorrectionDrag?.(e))return;if(SF.Studio?.mode==='gallery')return;if(settings().previewDirection!=='S'){status('Select front (S) before dragging the root.');return;}pause();if(SF.Renderer.begin(e,settings()))dragStart={id:SF.Studio?.clipId||settings().clipId,settings:store.clone(settings()),placements:store.clone(project().placements)};};
  $('preview').onpointermove=e=>{if(SF.Studio?.moveCorrectionDrag?.(e))return;if(!dragStart)return;const point=SF.Renderer.move(e,project());if(point){SF.Placement.set(project(),dragStart.id,point);$('anchorX').value=point.anchorX.toFixed(1);$('anchorY').value=point.anchorY.toFixed(1);render();}};
  const endDrag=()=>{if(SF.Studio?.endCorrectionDrag?.())return;if(!dragStart)return;const g=SF.Placement.resolve(project(),dragStart.id),end={anchorX:g.anchorX,anchorY:g.anchorY},id=dragStart.id;project().settings=dragStart.settings;project().placements=dragStart.placements;store.commitPlacement(id,end);dragStart=null;SF.Renderer.end();update();status('Clip feet/root set.');};
  $('preview').onpointerup=endDrag;$('preview').onpointercancel=()=>{if(!SF.Studio?.endCorrectionDrag?.(true))endDrag();};
  async function work(fn){if(busy)return;pause();busy=true;signal={cancelled:false};$('cancel').hidden=false;update();
    try{await fn(signal,m=>status(m));}catch(e){status(e.message,true);}finally{busy=false;$('cancel').hidden=true;update();}}
  $('cancel').onclick=()=>{if(signal)signal.cancelled=true;status('Cancelling after the current frame…');};
  function stage(result,acceptCallback=null,nextPanel=null){pending=result;pendingAccept=acceptCallback;pendingTab=nextPanel;$('review-title').textContent=`${result.frames.length} frames, in order`;$('review-info').textContent=`Image canvas ${result.canvas.join(' × ')} px. Check frame order before confirming this import.`;
    $('review-issues').replaceChildren();for(const issue of result.issues){const p=document.createElement('p');p.textContent=issue;$('review-issues').append(p);}
    $('padding-label').hidden=!result.mixed;$('padding').checked=false;thumbs($('review-strip'),result.frames,false);$('accept').disabled=result.mixed;$('import-dialog').showModal();}
  $('padding').onchange=()=>{$('accept').disabled=pending?.mixed&&!$('padding').checked;};
  const discard=()=>{pending?.frames.forEach(f=>f.proxy?.close?.());pending=null;pendingAccept=null;pendingTab=null;$('review-strip').replaceChildren();$('import-dialog').close();};
  $('discard').onclick=discard;$('import-dialog').oncancel=e=>{e.preventDefault();discard();};
  $('accept').onclick=()=>{if(!pending)return;const p=pending;
    try{if(pendingAccept){pendingAccept(p);pendingAccept=null;}else{const old=project();const s={...settings(),rangeStart:0,rangeEnd:p.frames.length-1,anchorX:p.anchor[0],anchorY:p.anchor[1]};
      const next={...old,settings:s,frames:p.frames,canvas:p.canvas,issues:p.issues,directions:{},corrections:store.clone(old.corrections||{})};SF.Corrections.remapAll(next);SF.Playback?.remapMarkers(next);SF.Clips.checkBudget(next);store.replace(next);SF.Clips.rebalance(project());SF.Audio.stop();SF.Studio?.projectChanged();}
      pending=null;$('import-dialog').close();$('review-strip').replaceChildren();elapsed=0;manual=null;thumbs($('strip'),clip().frames,true);update();tab(pendingTab||(SF.Studio?.mode==='encounter'?'states':'animation'));pendingTab=null;status(SF.Corrections.pending(project()).length?'Frames loaded. Unmatched correction keys need review in Animation.':'Frames loaded.');SF.Studio?.refresh();}
    catch(e){status(e.message,true);}}
  const importMedia=files=>work(async(sig,progress)=>stage(await SF.Media.importFiles(files,sig,progress)));
  $('import').onclick=()=>$('files').click();$('files').onchange=()=>{const files=[...$('files').files];$('files').value='';if(files.length)importMedia(files);};
  $('reopen').onclick=()=>$('project-file').click();$('project-file').onchange=()=>{const f=$('project-file').files[0];$('project-file').value='';if(f)work(async(sig,progress)=>{const p=await SF.Pack.reopen(f,sig,progress);SF.Audio.stop();store.replace(p);store.saved();SF.Studio?.projectChanged();elapsed=0;manual=null;thumbs($('strip'),p.frames,true);status('Project reopened. Originals and settings restored.');});};
  $('save').onclick=()=>work(async(sig,progress)=>{await SF.Pack.save(project(),sig,progress);status('Project saved with original media and settings. Check your browser’s downloads.');});
  $('export').onclick=()=>work(async(sig,progress)=>{await SF.Pack.source(project(),sig,progress);status('Source Pack exported. It contains PNGs, WAV audio, manifest and exact timing; FNV assets come later.');});
  const drop=$('dropzone');drop.ondragover=e=>{e.preventDefault();if(!busy)drop.classList.add('drag-over');};drop.ondragleave=()=>drop.classList.remove('drag-over');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag-over');if(busy)return;const fs=[...e.dataTransfer.files];if(fs.length===1&&fs[0].name.toLowerCase().endsWith('.zip')){work(async(sig,progress)=>{const p=await SF.Pack.reopen(fs[0],sig,progress);SF.Audio.stop();store.replace(p);store.saved();SF.Studio?.projectChanged();elapsed=0;manual=null;thumbs($('strip'),p.frames,true);status('Project reopened.');});}else importMedia(fs);};
  async function demoFiles(){const files=[];for(let i=0;i<4;i++){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');
    ctx.fillStyle='#98e98c';ctx.beginPath();ctx.roundRect(70,70-i*8,116,154+i*8,22);ctx.fill();ctx.fillStyle='#ec754f';ctx.fillRect(50,110+i*10,20,35);ctx.fillStyle='#4c8fea';ctx.fillRect(186,110-i*10,20,35);
    ctx.fillStyle='#183128';ctx.font='bold 70px system-ui';ctx.textAlign='center';ctx.fillText(String(i),128,170);
    ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(110,224);ctx.lineTo(146,224);ctx.moveTo(128,208);ctx.lineTo(128,240);ctx.stroke();
    const blob=await new Promise(r=>c.toBlob(r,'image/png'));files.push(new File([blob],`frame_${[1,2,3,10][i]}.png`,{type:'image/png'}));}return files.reverse();}
  $('demo').onclick=()=>work(async(sig,progress)=>stage(await SF.Media.importFiles(await demoFiles(),sig,progress)));
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(playing||SF.Audio.hasPlayback)){pause();status('Preview paused while the tab is hidden.');}});
  document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||$('import-dialog').open||busy||!project().frames.length)return;
    if(SF.Studio?.mode==='encounter'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD'].includes(e.code))return;
    if(e.code==='Space'){e.preventDefault();$('play').click();}if(e.code==='ArrowLeft'){e.preventDefault();step(-1);}if(e.code==='ArrowRight'){e.preventDefault();step(1);}});
  window.addEventListener('beforeunload',e=>{if(store.dirty&&project().frames.length){e.preventDefault();e.returnValue='';}});
  function animate(now){SF.Audio.tick();if(playing){const delta=(now-last)/1000;elapsed+=delta;SF.Studio?.advance(delta);manual=null;if(timing().playbackMode==='once'&&(SF.Studio?.pose?.()?.elapsed??elapsed)>=T.duration(timing())&&SF.Studio?.mode!=='encounter'&&SF.Studio?.pose?.()?.policy!=='once_return'){if(!SF.Studio?.pose?.())elapsed=T.duration(timing());pause();}}
    last=now;render();requestAnimationFrame(animate);}
  SF.App={clearManual(){manual=null;},project,settings,timing,clip,frame,tab,pause,update,render,thumbs,change,work,stage,status,seekSource(index){pause();manual=Math.max(0,Math.min(clip().frames.length-1,index));seek(Math.max(0,manual-timing().rangeStart)/T.rate(timing()));render();},resetTimeline(){elapsed=0;manual=null;},get elapsed(){return elapsed;},get playing(){return playing;},get busy(){return busy;}};
  update();requestAnimationFrame(animate);
})();
