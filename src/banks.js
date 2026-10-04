SF.Banks = (() => {
  const labels={music_loop:'Combat music',idle_loop:'Idle background',roam_loop:'Roaming background',neutral_quips:'Idle / roaming quips',idle_entry:'Entering idle / roaming',hostile_entry:'Becoming hostile',companion_entry:'Entering companion combat',defeat_sting:'On defeat',defeated_loop:'Defeated sound',release:'Summon / deployment',attack:'Attack',hit:'Hurt / hit',pickup:'Pickup',inventory:'Inventory',repack:'Repack / dismiss',alert:'Enemy alert',victory:'Victory'};
  const slots=Object.keys(labels),beds=['music_loop','idle_loop','roam_loop','defeated_loop'];
  const defaults=slot=>({enabled:true,mode:beds.includes(slot)?'loop':slot==='neutral_quips'?'periodic':'once',selection:'random',avoidLast:true,playOnEntry:true,firstDelay:0,gapMin:5,gapMax:12,maxPlays:0,seed:2026,cooldown:.25,retrigger:'ignore',maxVoices:2});
  const empty=slot=>({takes:[],settings:defaults(slot),nextTake:1});
  function initialize(p){p.audio??={};p.audioLinks??={};let legacy=false;
    for(const [slot,a] of Object.entries(p.audio)){if(a?.buffer&&!a.takes){legacy=true;const b=empty(slot);b.settings.mode=a.edits.loop?'loop':'once';b.takes=[{...a,id:'take_1',label:a.name.slice(0,120),weight:1}];b.nextTake=2;p.audio[slot]=b;}}
    if(legacy&&!p.audio.idle_loop&&!p.audioLinks.idle_loop)p.audioLinks.idle_loop='music_loop';
    if(legacy&&!p.audio.roam_loop&&!p.audioLinks.roam_loop)p.audioLinks.roam_loop='idle_loop';
    p.audioBankVersion=1;return p;
  }
  function resolve(p,slot){initialize(p);const visited=new Set();let key=slot;while(p.audioLinks[key]){if(visited.has(key))throw Error('Sound cue references form a cycle.');visited.add(key);key=p.audioLinks[key];}return p.audio[key]||null;}
  const allTakes=p=>Object.values(p.audio||{}).flatMap(b=>b.takes||[b]);
  function validateSettings(s){if(!s||typeof s.enabled!=='boolean'||typeof s.avoidLast!=='boolean'||typeof s.playOnEntry!=='boolean'||!['once','loop','repeat','periodic'].includes(s.mode)||!['random','sequence'].includes(s.selection)||!['ignore','restart','overlap'].includes(s.retrigger))throw Error('Invalid sound-bank playback settings.');
    for(const [k,min,max] of [['firstDelay',0,300],['gapMin',0,300],['gapMax',0,300],['maxPlays',0,10000],['seed',0,4294967295],['cooldown',0,300],['maxVoices',1,4]])if(!Number.isFinite(s[k])||s[k]<min||s[k]>max)throw Error(`Invalid sound-bank ${k}.`);
    for(const k of ['maxPlays','seed','maxVoices'])if(!Number.isInteger(s[k]))throw Error(`${k} must be a whole number.`);
    if(s.gapMax<s.gapMin)throw Error('Maximum pause must be at least the minimum pause.');
    if(s.retrigger==='overlap'&&s.mode!=='once')throw Error('Overlap is available for Play once cues.');
  }
  function validate(p){initialize(p);let count=0;for(const [slot,b] of Object.entries(p.audio)){if(!slots.includes(slot)||!Array.isArray(b.takes)||b.takes.length>16||!Number.isInteger(b.nextTake)||b.nextTake<1||b.nextTake>1000000)throw Error('A cue accepts up to 16 takes.');validateSettings(b.settings);const ids=new Set();for(const a of b.takes){if(!/^take_[1-9][0-9]*$/.test(a.id)||ids.has(a.id)||typeof a.label!=='string'||!a.label.trim()||a.label.length>120||!Number.isFinite(a.weight)||a.weight<=0||a.weight>100)throw Error('Invalid sound take ID, label or weight.');ids.add(a.id);if(Number(a.id.slice(5))>=b.nextTake)throw Error('Invalid next sound take ID.');SF.Audio?.validate(a);count++;}}
    if(count>64)throw Error('The project accepts up to 64 sound takes.');for(const [slot,target] of Object.entries(p.audioLinks)){if(!slots.includes(slot)||!slots.includes(target)||slot===target)throw Error('Invalid sound cue reference.');resolve(p,slot);}return p;
  }
  function usable(b){return !!b?.settings.enabled&&b.takes.some(a=>!a.edits.muted);}
  const duration=b=>usable(b)?Math.max(...b.takes.filter(a=>!a.edits.muted).map(a=>a.edits.trimEnd-a.edits.trimStart)):0;
  const effective=(a,b)=>({...a,edits:{...a.edits,loop:b.settings.mode==='loop'}});
  return {labels,slots,beds,defaults,empty,initialize,resolve,allTakes,validateSettings,validate,usable,duration,effective};
})();

// Pure scheduling: the caller supplies an audio clock and voice handles.
SF.BankScheduler = (() => {
  function create(bank,player,key='cue'){
    SF.Banks.validateSettings(bank.settings);const s=bank.settings;let randomState=(s.seed^hash(key))>>>0,last=null,cursor=0,count=0,pending=null,queue=[],running=false,lastTrigger=-Infinity,voices=[],lastEnd=null,log=[];
    const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
    const gap=()=>s.gapMin+random()*(s.gapMax-s.gapMin),record=(now,message)=>{log.push({time:now,message});if(log.length>12)log.shift();};
    function select(){let takes=bank.takes.filter(a=>!a.edits.muted);if(!takes.length)return null;if(s.selection==='sequence'){const a=takes[cursor++%takes.length];last=a.id;return a;}if(s.avoidLast&&takes.length>1)takes=takes.filter(a=>a.id!==last);let n=random()*takes.reduce((v,a)=>v+a.weight,0);const a=takes.find(a=>(n-=a.weight)<0)||takes.at(-1);last=a.id;return a;}
    function cleanup(now){const ended=voices.filter(v=>!v.active);voices=voices.filter(v=>v.active);if(ended.length){lastEnd=Math.max(...ended.map(v=>v.endedAt??now));if(running&&!voices.length){if(['repeat','periodic'].includes(s.mode)&&(s.maxPlays===0||count<s.maxPlays)){pending=lastEnd+gap();record(lastEnd,`Pause until ${pending.toFixed(2)}s`);}else if(!queue.length&&pending===null)running=false;}}}
    function fire(now){const take=select();if(!take){running=false;pending=null;return;}const voice=player(take,s.mode==='loop');if(!voice){running=false;pending=null;return;}voices.push(voice);count++;pending=null;record(now,`Playing ${take.label||take.name}`);}
    function start(now){stop();count=0;running=SF.Banks.usable(bank);pending=running?now+s.firstDelay+(['repeat','periodic'].includes(s.mode)&&!s.playOnEntry?gap():0):null;lastTrigger=now;tick(now);}
    function tick(now){cleanup(now);if(running&&pending!==null&&now+1e-9>=pending&&!voices.length)fire(now);while(running&&queue.length&&now+1e-9>=queue[0]){queue.shift();fire(now);}}
    function stop(){running=false;pending=null;queue=[];for(const v of voices)v.stop();voices=[];}
    function trigger(now){cleanup(now);if(now-lastTrigger<s.cooldown)return false;if(running&&(voices.length||pending!==null||queue.length)){if(s.retrigger==='ignore')return false;if(s.retrigger==='overlap'){if(voices.length+queue.length+(pending!==null?1:0)>=s.maxVoices)return false;lastTrigger=now;queue.push(now+s.firstDelay);tick(now);return true;}stop();}lastTrigger=now;count=0;running=SF.Banks.usable(bank);pending=running?now+s.firstDelay:null;tick(now);return running;}
    return {start,tick,stop,trigger,get finished(){return !running&&!voices.length&&pending===null&&!queue.length;},get status(){return {running,playing:voices.length,count,lastTake:last,nextAt:pending===null?(queue[0]??null):Math.min(pending,queue[0]??Infinity),lastEnd,log:[...log]};}};
  }
  function hash(text){let n=2166136261;for(const ch of text)n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0;}
  return {create};
})();
