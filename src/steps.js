// Workflow shell: five steps, Next buttons, animation chips, segmented controls, menus and FX.
// It only drives existing controls (value + change/click events) and never edits project data itself.
SF.Steps = (() => {
  const $=id=>document.getElementById(id),app=SF.App,p=()=>SF.Store.project;
  const stepOf={import:'animations',ground:'tune',directions:'tune',animation:'tune',fixes:'tune',audio:'sound',states:'test',pack:'export'};
  const tuneTabs=['ground','directions','animation','fixes'],visited={};
  let current='',chipSignature='',pendingRoute=null,flickerTimer=0;
  const fire=(el,type='change')=>el.dispatchEvent(new Event(type,{bubbles:true}));
  const go=name=>document.querySelector(`[data-tab="${name}"]`)?.click();
  const activeTab=()=>document.querySelector('[data-panel]:not([hidden])')?.dataset.panel||'import';
  const clipIds=()=>[...$('active-clip').options].map(o=>o.value);
  const mainId=()=>p().settings.clipId;
  function selectClip(id){const select=$('active-clip');if(!id||select.value===id||!clipIds().includes(id))return;select.value=id;fire(select);}
  function nextClip(){const ids=clipIds(),i=ids.indexOf($('active-clip').value);return i>=0&&i<ids.length-1?ids[i+1]:null;}
  function markVisited(){const tab=activeTab();if(!tuneTabs.includes(tab)||SF.Studio?.mode!=='workbench')return;const id=$('active-clip').value;if(id)(visited[id]??=new Set()).add(tab);}

  // Active step follows whichever panel app.tab() shows, including programmatic jumps.
  function syncTab(){const tab=activeTab();if(tab===current)return;current=tab;document.body.dataset.tab=tab;document.body.dataset.step=stepOf[tab]||'animations';
    const panel=document.querySelector('.settings');if(panel){panel.scrollTop=0;panel.classList.remove('flick');void panel.offsetWidth;panel.classList.add('flick');clearTimeout(flickerTimer);flickerTimer=setTimeout(()=>panel.classList.remove('flick'),400);}
    markVisited();chipSignature='';refresh();}
  const observer=new MutationObserver(syncTab);document.querySelectorAll('[data-panel]').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['hidden']}));

  document.querySelectorAll('[data-go]').forEach(button=>button.addEventListener('click',()=>{const target=tuneTabs.includes(current)?current:button.dataset.go;go(target);}));
  document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>{const next=button.dataset.next;
    if(next==='tune'){selectClip(mainId());go('ground');return;}
    if(next==='next-clip'){const id=nextClip();if(id){selectClip(id);go('ground');app.status(`Tuning ${id}. Start with its size & ground.`);}else go('audio');return;}
    go(next);}));

  // Animation chips mirror the existing #active-clip select.
  function renderChips(){const select=$('active-clip'),ids=clipIds(),has=p().frames.length>0,mode=SF.Studio?.mode||'workbench',live=mode!=='workbench',tab=activeTab();
    const signature=JSON.stringify([ids,select.value,mainId(),has,live,select.disabled,tab,ids.map(id=>[...(visited[id]||[])])]);if(signature===chipSignature)return;chipSignature=signature;
    const box=$('clip-chips');box.replaceChildren();$('chips-label').textContent=live?'Now playing':'Animation';
    if(!has){const hint=document.createElement('span');hint.className='chip-hint';hint.textContent='Import your main animation in step 01';box.append(hint);return;}
    for(const id of ids){const chip=document.createElement('button'),name=document.createElement('span');chip.type='button';chip.className='chip';chip.dataset.clip=id;name.textContent=id;chip.append(name);
      if(id===mainId()){const tag=document.createElement('em');tag.textContent='main';chip.append(tag);}
      if(stepOf[tab]==='tune'){const pips=document.createElement('span');pips.className='pips';for(const t of tuneTabs){const pip=document.createElement('i');if(visited[id]?.has(t))pip.className='on';pips.append(pip);}chip.append(pips);chip.title='Tuned: '+(tuneTabs.filter(t=>visited[id]?.has(t)).join(', ')||'not yet');}
      const on=id===select.value;chip.classList.toggle('selected',on);chip.setAttribute('aria-pressed',String(on));chip.disabled=select.disabled||(live&&!on);if(live)chip.classList.add('live');
      chip.onclick=()=>{if(!live)selectClip(id);};box.append(chip);}
  }

  // Segmented buttons and option cards set their hidden native select and fire its change handler.
  document.querySelectorAll('[data-for]').forEach(group=>{const select=$(group.dataset.for);group.querySelectorAll('button[data-value]').forEach(button=>{button.type='button';button.addEventListener('click',()=>{if(select.disabled||select.value===button.dataset.value)return;select.value=button.dataset.value;fire(select);});});});
  function syncSegments(){document.querySelectorAll('[data-for]').forEach(group=>{const select=$(group.dataset.for);group.querySelectorAll('button[data-value]').forEach(button=>{const on=button.dataset.value===select.value;button.classList.toggle('selected',on);button.setAttribute('aria-pressed',String(on));button.disabled=select.disabled;});});}

  // Directions: picking an angle on the compass also targets that angle for uploads.
  $('direction-picker').addEventListener('click',event=>{const dir=event.target.closest('button[data-direction]')?.dataset.direction;if(dir&&dir!=='S'&&[...$('direction-import').options].some(o=>o.value===dir)){$('direction-import').value=dir;uploadLabel();}});
  $('direction-import').addEventListener('change',uploadLabel);
  function uploadLabel(){const dir=$('direction-import').value;if(dir)$('import-direction').textContent=`Upload ${dir} · ${SF.Directions.labels[dir]} frames`;}

  // Drawers, menus and proxies.
  $('sheet-drawer').addEventListener('toggle',()=>app.update());
  const kits=$('kits-menu');kits.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;kits.open=false;pendingRoute=button.id==='correction-demo'?'fixes':button.id==='demo'?'import':null;});
  document.addEventListener('click',event=>{for(const menu of document.querySelectorAll('details.menu[open],details.viewpop[open]'))if(!menu.contains(event.target))menu.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')for(const menu of document.querySelectorAll('details.menu[open],details.viewpop[open]'))menu.open=false;});
  $('pack-save').addEventListener('click',()=>$('save').click());$('pack-export').addEventListener('click',()=>$('export').click());

  // Import dialog: route after a successful accept; roster imports stay on step 01.
  $('accept').addEventListener('click',()=>{if($('import-dialog').open)return;const route=SF.Roster?.accepted?.()||pendingRoute;pendingRoute=null;if(route&&route!==activeTab())go(route);});
  $('import-dialog').addEventListener('close',()=>setTimeout(()=>{pendingRoute=null;SF.Roster?.settled?.();},0));

  // FX: grain, scanlines and flicker. A per-viewer preference only; never part of the project.
  const fxKey='spriteforge.fx';function setFx(on){document.body.classList.toggle('fx-off',!on);$('fx-toggle').setAttribute('aria-pressed',String(on));$('fx-toggle').title=on?'Effects on: grain, scanlines, flicker. The sprite preview is never covered.':'Effects off';try{localStorage.setItem(fxKey,on?'on':'off');}catch{}}
  let fxOn=true;try{fxOn=localStorage.getItem(fxKey)!=='off';}catch{}setFx(fxOn);$('fx-toggle').addEventListener('click',()=>setFx(document.body.classList.contains('fx-off')));

  function refresh(){syncTab();const has=p().frames.length>0;document.body.dataset.has=has?'yes':'no';document.body.dataset.mode=SF.Studio?.mode||'workbench';
    renderChips();syncSegments();markVisited();
    const next=nextClip(),fixesNext=document.querySelector('[data-panel="fixes"] [data-next]');if(fixesNext)fixesNext.textContent=next?`Next animation: ${next}`:'Next: sound';
    $('pack-save').disabled=$('save').disabled;$('pack-export').disabled=$('export').disabled;
    if(!$('import-direction').textContent.startsWith('Upload'))uploadLabel();
  }
  syncTab();
  return {refresh,go,selectClip,get tab(){return activeTab();}};
})();
