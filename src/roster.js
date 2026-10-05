// Step 01 animation checklist and state coverage, plus the Field test state board, Sound cue list,
// Export pre-flight and rail summaries. Imports go through the existing #import / #import-clip
// controls; state links use the same store.commitPlayback path as the action test.
// Checklist ticks, chosen names and which links were auto-filled live in project.preview.roster
// (the existing free-form preview bag), so the project archive format is unchanged.
SF.Roster = (() => {
  const $=id=>document.getElementById(id),app=SF.App,store=SF.Store,P=SF.Playback,p=()=>store.project;
  const states=SF.Simulator.states,stateLabels=SF.Simulator.labels,cueLabels=SF.Banks.labels;
  const shortState={hostile:'Approach player',hostile_attack:'Attack player',companion_combat:'Attack enemy',neutral_idle:'Neutral idle',neutral_roam:'Neutral roam',defeat_transition:'Defeat',defeated:'Defeated item',stored:'Inventory',deploying:'Deployment',repack:'Repack'};
  const stateGroups=[['Combat',['hostile','hostile_attack','companion_combat']],['Neutral',['neutral_idle','neutral_roam']],['Defeat',['defeat_transition','defeated']],['Companion',['stored','deploying','repack']]];
  const slots=[
    {key:'idle',label:'Idle',id:'idle',note:'Standing or breathing loop.',states:['neutral_idle'],common:true,match:/idle|stand|rest|breath/},
    {key:'attack',label:'Attack',id:'attack',note:'Strike, swing or shot. Attacking the player and attacking enemies stay separate links.',states:['hostile_attack','companion_combat'],common:true,action:true,match:/attack|strike|swing|punch|shoot|fight/},
    {key:'walk',label:'Walk / roam',id:'walk',note:'Moving: wandering, or approaching the player.',states:['neutral_roam','hostile'],match:/walk|roam|run|move|wander/},
    {key:'defeat',label:'Defeat',id:'defeat',note:'Knocked down, then lying as an item.',states:['defeat_transition','defeated'],match:/defeat|death|die|dead|fall|ko/},
    {key:'deploy',label:'Deploy',id:'deploy',note:'Summoned near an enemy.',states:['deploying'],match:/deploy|summon|spawn|release/},
    {key:'repack',label:'Repack',id:'repack',note:'Returning to the inventory.',states:['repack'],match:/repack|dismiss|despawn/}];
  // Auto-fill preferences: moving states prefer walk, still states prefer idle, then the main animation.
  const prefer={hostile:['walk'],hostile_attack:['attack'],companion_combat:['attack'],neutral_idle:['idle'],neutral_roam:['walk'],defeat_transition:['defeat','idle'],defeated:['defeat','idle'],stored:['idle'],deploying:['deploy','idle'],repack:['repack','idle']};
  const cueGroups=[['Music & ambience',['music_loop','idle_loop','roam_loop','defeated_loop']],['Voice & reactions',['neutral_quips','idle_entry','hostile_entry','companion_entry','alert','victory']],['Combat',['attack','hit']],['Lifecycle',['defeat_sting','release','pickup','inventory','repack']]];
  const valid=id=>/^[a-z][a-z0-9_]{0,63}$/.test(id);
  const fire=(el,type='change')=>el.dispatchEvent(new Event(type,{bubbles:true}));
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  let pending=null,signatures={};

  function data(){const preview=p().preview??={},r=preview.roster??={};r.ticked??={};r.slots??={};r.names??={};r.chips??={};r.once??={};r.auto??={};r.customs??=[];return r;}
  const extras=()=>Object.keys(p().extraClips||{});
  const allSlots=()=>[...slots,...data().customs.map((key,i)=>({key,label:'Custom '+(i+1),id:'',note:'Pick the states it plays in.',states:[],custom:true,match:null}))];
  // Which extra animation fills which slot: saved choice, then current state links, then the name.
  function attribution(){const r=data(),ids=extras(),claimed=new Set(),out={};
    for(const s of allSlots()){const id=r.slots[s.key];if(id&&ids.includes(id)&&!claimed.has(id)){out[s.key]=id;claimed.add(id);}}
    for(const s of allSlots()){if(out[s.key]||s.custom)continue;const id=s.states.map(st=>p().stateClips[st]).find(x=>x&&ids.includes(x)&&!claimed.has(x));if(id){out[s.key]=id;claimed.add(id);}}
    for(const s of allSlots()){if(out[s.key]||!s.match)continue;const id=ids.find(x=>s.match.test(x)&&!claimed.has(x));if(id){out[s.key]=id;claimed.add(id);}}
    return out;}
  const suggestion=(state,attr)=>prefer[state].map(role=>attr[role]).find(Boolean)||p().settings.clipId;
  const assigned=state=>p().stateClips[state]||p().settings.clipId;
  const isAuto=state=>{const id=p().stateClips[state];return !!id&&data().auto[state]===id;};
  function statesFor(id){return states.filter(s=>assigned(s)===id);}

  // One undoable edit: explicit links (user choices) plus auto-fill for unlinked or auto-linked states.
  function link(explicit={},{once=[],fill=true,force=false}={}){const r=data(),attr=attribution(),plan={...explicit},autoNow={};
    if(fill)for(const s of states){if(Object.hasOwn(plan,s))continue;const cur=p().stateClips[s];if(cur&&!isAuto(s)&&!force)continue;const want=suggestion(s,attr);if(cur!==want)plan[s]=want;autoNow[s]=want;}
    const changes=Object.entries(plan).filter(([s,id])=>p().stateClips[s]!==id||once.includes(s));
    if(changes.length){app.pause();try{store.commitPlayback(()=>{for(const [s,id] of changes){p().stateClips[s]=id;const b=p().statePlayback[s];if(once.includes(s))p().statePlayback[s]={...P.binding(p(),s),policy:'once_return',returnClip:null,retrigger:'restart',marker:null};else if(b?.marker&&b.marker.clipId!==id)b.marker=null;}});}catch(e){app.status(e.message,true);return 0;}app.resetTimeline();SF.Studio.resetPlayback();}
    for(const s of Object.keys(explicit))delete r.auto[s];Object.assign(r.auto,autoNow);store.touch();return changes.length;}

  // ----- Step 01 checklist -----
  function chosenStates(slot){const r=data();return r.chips[slot.key]??[...slot.states];}
  function nameFor(slot){const r=data();if(r.names[slot.key])return r.names[slot.key];const taken=new Set(SF.Clips.ids(p()));let id=slot.id||slot.key,n=2;while(taken.has(id))id=(slot.id||slot.key)+'_'+n++;return id;}
  function importRow(slot){const id=nameFor(slot),chips=chosenStates(slot);
    if(!valid(id)){app.status('Use a name with lower-case letters, digits and underscores, starting with a letter.',true);return;}
    if(SF.Clips.ids(p()).includes(id)){app.status(`An animation called ${id} already exists. Choose another name.`,true);return;}
    if(!p().frames.length){app.status('Import the MAIN animation first.',true);return;}
    pending={kind:'extra',slot:slot.key,id,states:chips,once:slot.action&&data().once[slot.key]!==false?chips.filter(s=>P.attackStates.includes(s)):[],before:SF.Clips.ids(p())};
    $('review-context').textContent=`Importing as ${id.toUpperCase()}`+(chips.length?` · plays in ${chips.map(s=>shortState[s]).join(', ')}`:' · not linked to a state yet');
    $('new-clip-id').value=id;$('import-clip').click();}
  $('import').addEventListener('click',()=>{pending={kind:'main',id:p().settings.clipId,before:p().frames.map(f=>f.sha256).join()};$('review-context').textContent=`Importing as MAIN (${p().settings.clipId}) · plays in every state without its own animation`;});
  for(const input of ['files','clip-files'])$(input).addEventListener('cancel',()=>{pending=null;$('review-context').textContent='';});

  function accepted(){if(!pending)return null;const job=pending,r=data();pending=null;$('review-context').textContent='';
    if(job.kind==='extra'){if(job.before.includes(job.id)||!SF.Clips.ids(p()).includes(job.id))return null;r.slots[job.slot]=job.id;r.ticked[job.slot]=true;
      const n=link(Object.fromEntries(job.states.map(s=>[s,job.id])),{once:job.once});app.update();app.status(`${job.id} imported${job.states.length?' and linked to '+job.states.map(s=>shortState[s]).join(', '):''}. ${n?'State coverage updated.':''} Import the next animation, or press Next.`);return 'import';}
    if(job.kind==='main'){if(!p().frames.length)return null;r.ticked.main=true;link({});app.update();app.status(`Main animation (${p().settings.clipId}) imported. Tick and import your other animations, or press Next.`);return 'import';}
    return null;}
  function settled(){if(!$('import-dialog').open&&!app.busy){pending=null;$('review-context').textContent='';}}

  function rowFor(slot,attr,has){const r=data(),id=attr[slot.key],clip=id?SF.Clips.get(p(),id):null,ticked=!!(id||r.ticked[slot.key]);
    const row=el('div','roster-row'+(id?' is-done':ticked?' is-open':'')),head=el('div','row-head'),tick=el('label','tick-label'),box=el('input');
    box.type='checkbox';box.checked=ticked;box.disabled=!!id;box.onchange=()=>{r.ticked[slot.key]=box.checked;store.touch();signatures.roster='';refresh();};
    tick.append(box,el('b',null,slot.label));head.append(tick,el('span','row-state',id?`${id} · ${clip.frames.length} frames`:ticked?'Not imported':''));row.append(head);
    if(!ticked){row.append(el('p','row-note',slot.note));return row;}
    if(id){const plays=statesFor(id),done=el('div','row-done');done.append(el('span','plays',plays.length?'Plays in: '+plays.map(s=>shortState[s]+(isAuto(s)?' (auto)':'')).join(', '):'Not linked to a state'));
      const actions=el('div','row-actions'),tune=el('button',null,'Tune'),remove=el('button','danger','Remove');tune.type=remove.type='button';
      tune.onclick=()=>{SF.Steps?.selectClip(id);SF.Steps?.go('ground');};
      remove.onclick=()=>{if(!remove.classList.contains('armed')){remove.classList.add('armed');remove.textContent='Confirm remove';setTimeout(()=>{remove.classList.remove('armed');remove.textContent='Remove';},3500);return;}
        SF.Steps?.selectClip(id);$('remove-clip').click();delete r.slots[slot.key];link({});app.update();app.status(`${id} removed. States that used it now use the closest match.`);};
      actions.append(tune,remove);done.append(actions);row.append(done);return row;}
    const body=el('div','row-body'),label=el('label',null,'Name '),hint=el('span',null,'export folder'),name=el('input');name.type='text';name.maxLength=64;name.value=nameFor(slot);name.spellcheck=false;
    name.oninput=()=>{r.names[slot.key]=name.value.trim();};name.onchange=()=>{r.names[slot.key]=name.value.trim();store.touch();};label.append(hint,name);body.append(el('p','row-note',slot.note),label);
    const chips=el('div','state-chips'),chosen=new Set(chosenStates(slot));chips.append(el('span','eyebrow','Plays in'));
    for(const s of slot.custom?states:slot.states){const c=el('button','chip-toggle'+(chosen.has(s)?' on':''),shortState[s]);c.type='button';c.setAttribute('aria-pressed',String(chosen.has(s)));c.onclick=()=>{chosen.has(s)?chosen.delete(s):chosen.add(s);r.chips[slot.key]=states.filter(x=>chosen.has(x));c.classList.toggle('on',chosen.has(s));c.setAttribute('aria-pressed',String(chosen.has(s)));};chips.append(c);}
    body.append(chips);
    if(slot.action){const once=el('label','check'),cb=el('input');cb.type='checkbox';cb.checked=r.once[slot.key]!==false;cb.onchange=()=>{r.once[slot.key]=cb.checked;};once.append(cb,document.createTextNode(' Play once per attack, then return to main'));body.append(once);}
    const go=el('button','primary wide',has?`Import ${slot.label.toLowerCase()} frames`:'Import MAIN first');go.type='button';go.disabled=!has||app.busy;go.onclick=()=>{r.names[slot.key]=name.value.trim();importRow(slot);};body.append(go);
    if(slot.custom){const drop=el('button','link','Remove this slot');drop.type='button';drop.onclick=()=>{r.customs=r.customs.filter(k=>k!==slot.key);delete r.ticked[slot.key];store.touch();signatures.roster='';refresh();};body.append(drop);}
    row.append(body);return row;}

  function renderRoster(){const r=data(),attr=attribution(),has=p().frames.length>0,main=p().settings.clipId;
    const signature=JSON.stringify([attr,r.ticked,r.customs,has,app.busy,main,SF.Clips.ids(p()).map(id=>[id,SF.Clips.get(p(),id).frames.length]),states.map(s=>[assigned(s),isAuto(s)])]);
    $('roster-main-status').textContent=has?`${p().frames.length} frames · ${p().canvas.join(' × ')} px`:'Not imported';$('roster-main').classList.toggle('is-done',has);
    $('import').textContent=has?'Replace main frames':'Import main animation';
    if(signatures.roster===signature)return;signatures.roster=signature;const box=$('roster-rows');box.replaceChildren();
    const extraSlots=allSlots().filter(s=>!s.common);
    for(const s of allSlots().filter(s=>s.common))box.append(rowFor(s,attr,has));
    const more=el('details','roster-more'),sum=el('summary',null,'More animation slots'),moreBody=el('div','roster-more-body');more.append(sum,moreBody);
    more.open=extraSlots.some(s=>attr[s.key]||r.ticked[s.key]);for(const s of extraSlots)moreBody.append(rowFor(s,attr,has));
    const add=el('button','link','+ Add a custom slot');add.type='button';add.onclick=()=>{r.customs.push('custom_'+Date.now().toString(36));r.ticked[r.customs.at(-1)]=true;store.touch();signatures.roster='';refresh();};moreBody.append(add);box.append(more);
    const claimed=new Set(Object.values(attr)),others=extras().filter(id=>!claimed.has(id));
    if(others.length){const wrap=el('div','roster-others');wrap.append(el('div','eyebrow','Other animations'));for(const id of others){const row=el('div','roster-row is-done other'),head=el('div','row-head'),plays=statesFor(id);head.append(el('b',null,id),el('span','row-state',`${SF.Clips.get(p(),id).frames.length} frames`));
      const done=el('div','row-done'),actions=el('div','row-actions'),tune=el('button',null,'Tune');tune.type='button';tune.onclick=()=>{SF.Steps?.selectClip(id);SF.Steps?.go('ground');};actions.append(tune);done.append(el('span','plays',plays.length?'Plays in: '+plays.map(s=>shortState[s]).join(', '):'Not linked to a state'),actions);row.append(head,done);wrap.append(row);}box.append(wrap);}
  }

  function renderCoverage(){const has=p().frames.length>0,ids=SF.Clips.ids(p()),main=p().settings.clipId,signature=JSON.stringify([has,ids,main,states.map(s=>[p().stateClips[s]||'',isAuto(s)]),app.busy]);
    $('coverage-group').classList.toggle('is-empty',!has);$('coverage-fill').disabled=!has||app.busy;if(signatures.coverage===signature)return;signatures.coverage=signature;const box=$('coverage');box.replaceChildren();
    if(!has){box.append(el('p','hint','Import the main animation to link states.'));return;}
    for(const [group,list] of stateGroups){const g=el('div','cov-group');g.append(el('div','eyebrow',group));
      for(const s of list){const row=el('label','cov-row'),name=el('span','cov-state',shortState[s]),select=el('select'),explicit=p().stateClips[s];name.title=stateLabels[s];
        for(const id of ids){const o=el('option',null,id===main?`${id} · main`:id);o.value=id;select.append(o);}select.value=assigned(s);select.disabled=app.busy;
        select.onchange=()=>{link({[s]:select.value},{fill:false});app.update();app.status(`${shortState[s]} now plays ${select.value}.`);};
        const tag=el('span','cov-tag '+(!explicit?'fallback':isAuto(s)?'auto':'set'),!explicit?'main':isAuto(s)?'auto':'set');tag.title=!explicit?'Not linked: falls back to the main animation':isAuto(s)?'Filled automatically; changes when you add a better match':'Chosen by you';
        row.append(name,select,tag);g.append(row);}
      box.append(g);}
  }
  $('coverage-fill').addEventListener('click',()=>{const n=link({});app.update();app.status(n?`Auto-fill linked ${n} state${n===1?'':'s'}. Your own choices were kept.`:'Every state already has its best match. Your own choices were kept.');});

  // ----- Field test board -----
  function renderBoard(){const has=p().frames.length>0,current=SF.Studio.bindingState,mode=SF.Studio.mode,signature=JSON.stringify([has,current,mode,states.map(s=>[assigned(s),P.binding(p(),s).policy])]);
    $('state-title').textContent=stateLabels[current]||'Selected state';if(signatures.board===signature)return;signatures.board=signature;const box=$('state-board');box.replaceChildren();
    for(const [group,list] of stateGroups){box.append(el('div','eyebrow board-group',group));for(const s of list){const b=P.binding(p(),s),row=el('button','board-row'+(s===current&&mode!=='workbench'?' current':''));row.type='button';row.disabled=!has||mode==='encounter';
      row.append(el('span','b-state',shortState[s]),el('span','b-clip',assigned(s)),el('span','b-rule',b.policy==='once_return'?'once ↩':b.policy==='restart'?'restart':'keep'));
      row.onclick=()=>{$('gallery-state').value=s;fire($('gallery-state'));};box.append(row);}}
  }
  $('state-clip').addEventListener('change',()=>{delete data().auto[SF.Studio.bindingState];});

  // ----- Sound cue list -----
  function renderCues(){const slot=$('audio-slot').value,signature=JSON.stringify([slot,Object.entries(p().audio||{}).map(([k,b])=>[k,b.takes.length,b.settings?.enabled]),p().audioLinks||{},app.busy]);
    $('cue-title').textContent=cueLabels[slot]||'Cue';if(signatures.cues===signature)return;signatures.cues=signature;const box=$('cue-list');box.replaceChildren();
    for(const [group,list] of cueGroups){box.append(el('div','eyebrow cue-group',group));const wrap=el('div','cue-items');
      for(const key of list){const bank=p().audio?.[key],linked=p().audioLinks?.[key],count=bank?.takes.length||0,item=el('button','cue'+(key===slot?' selected':'')+(count||linked?' has':'')+(bank&&bank.settings?.enabled===false?' off':''));item.type='button';item.disabled=app.busy;
        item.append(el('span','cue-name',cueLabels[key]),el('span','cue-count',linked?'↪ '+(cueLabels[linked]||linked):count?String(count):'—'));item.title=linked?`Reuses ${cueLabels[linked]}`:count?`${count} take${count===1?'':'s'}`:'Silent';
        item.onclick=()=>{$('audio-slot').value=key;fire($('audio-slot'));signatures.cues='';renderCues();};wrap.append(item);}
      box.append(wrap);}
  }

  // ----- Export pre-flight -----
  function renderPreflight(){const has=p().frames.length>0,ids=SF.Clips.ids(p()),explicit=states.filter(s=>p().stateClips[s]).length,cues=Object.values(p().audio||{}).filter(b=>b.takes.length).length+Object.keys(p().audioLinks||{}).length,s=p().settings;
    const items=[[has?'ok':'err',has?`Main animation: ${s.clipId} · ${p().frames.length} frames`:'No main animation imported yet','import'],
      [has?'ok':'off',`Animations: ${ids.join(', ')}`,'import'],
      [explicit===states.length?'ok':'warn',explicit===states.length?'All 10 game states are linked':`${states.length-explicit} state${states.length-explicit===1?'':'s'} fall back to main · use Auto-fill in step 01`,'import'],
      ['ok',`Directions: ${{billboard:'same image at every angle',generated:'auto-generated angles',imported:'your own angles'}[s.directionMode]||s.directionMode}`,'directions'],
      [cues?'ok':'off',cues?`Sound: ${cues} cue${cues===1?'':'s'} with takes`:'Sound: none yet (optional)','audio']];
    for(const id of has?ids:[])try{SF.Corrections.layout(p(),id);}catch(e){items.push(['err',`${id}: ${e.message}`,'ground']);}
    items.push([store.dirty?'warn':'ok',store.dirty?'Unsaved changes · save the project before you export':'Project saved','pack']);
    const signature=JSON.stringify(items);if(signatures.preflight===signature)return;signatures.preflight=signature;const box=$('preflight');box.replaceChildren();
    for(const [state,text,tab] of items){const li=el('li','pf '+state),mark=el('i','pf-mark'),go=el('button','link',['warn','err'].includes(state)&&tab!=='pack'?'Fix':'');li.append(mark,el('span',null,text));if(go.textContent){go.type='button';go.onclick=()=>SF.Steps?.go(tab);li.append(go);}box.append(li);}
  }

  function summaries(){const r=data(),attr=attribution(),has=p().frames.length>0,ticked=allSlots().filter(s=>attr[s.key]||r.ticked[s.key]),imported=ticked.filter(s=>attr[s.key]).length+(has?1:0);
    $('sum-animations').textContent=has?`${imported} of ${ticked.length+1} imported`:'Name & import';
    $('sum-tune').textContent=has?SF.Clips.ids(p()).join(' · '):'Each animation';
    const cues=Object.values(p().audio||{}).filter(b=>b.takes.length).length;$('sum-sound').textContent=cues?`${cues} cue${cues===1?'':'s'} with takes`:'Optional';
    const linked=states.filter(s=>p().stateClips[s]).length;$('sum-test').textContent=has?`${linked} of 10 states linked`:'States & encounter';
    $('sum-export').textContent=!has?'Source Pack':store.dirty?'Unsaved changes':'Saved';}

  function refresh(){renderRoster();renderCoverage();renderBoard();renderCues();renderPreflight();summaries();}
  return {refresh,accepted,settled,link,attribution,get pending(){return pending;}};
})();
