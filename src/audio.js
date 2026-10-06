SF.Audio = (() => {
  const slots=SF.Banks.slots;
  let context=null,master=null,volume=.7,nodes=new Map(),runners=new Map(),owner='',lastState='',auditionToken=0,downStarted=false,neutralStarted=false,projectRef=null,voiceId=0;
  function ctx(){if(!context){const Klass=window.AudioContext||window.webkitAudioContext;if(!Klass)throw Error('Web Audio is unavailable in this browser.');context=new Klass();master=context.createGain();master.gain.value=volume;master.connect(context.destination);}return context;}
  const loops=slot=>SF.Banks.beds.includes(slot);
  function validate(a){const e=a.edits,d=a.buffer.duration;
    for(const key of ['trimStart','trimEnd','loopStart','loopEnd','gainDb'])if(!Number.isFinite(e[key]))throw Error(`Invalid audio ${key}.`);
    if(e.trimStart<0||e.trimEnd>d+1e-6||e.trimEnd<=e.trimStart)throw Error('Trim must stay inside the audio with a positive duration.');
    if(e.loopStart<e.trimStart||e.loopEnd>e.trimEnd+1e-6||e.loopEnd<=e.loopStart)throw Error('Loop points must stay inside the trim with a positive duration.');
    if(e.gainDb < -48||e.gainDb>12||typeof e.loop!=='boolean'||typeof e.muted!=='boolean')throw Error('Gain must be −48 to +12 dB.');
  }
  async function load(file,edits=null){if(file.size>40*1024*1024)throw Error('Audio files are limited to 40 MB each.');
    const buffer=await ctx().decodeAudioData(await file.arrayBuffer());
    if(!buffer.length||buffer.duration>300||buffer.numberOfChannels>8)throw Error('Audio must be no longer than five minutes with at most eight channels.');
    const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));let peak=0;
    for(let i=0;i<buffer.length;i++){let value=0;for(const ch of channels)value+=ch[i]/channels.length;peak=Math.max(peak,Math.abs(value));if(i&&i%1000000===0)await SF.Media.tick();}
    const audio={blob:file,name:file.name,sha256:await SF.Media.hash(file),buffer,peak,edits:edits||{trimStart:0,trimEnd:buffer.duration,loopStart:0,loopEnd:buffer.duration,gainDb:0,loop:true,muted:false}};
    validate(audio);return audio;
  }
  const now=()=>context?.currentTime||0;
  function stopKey(key){const node=nodes.get(key);if(node){nodes.delete(key);node.active=false;try{node.source.stop();}catch{}node.source.disconnect();node.gain.disconnect();node.panner?.disconnect();}}
  function stop(){for(const r of runners.values())r.stop();runners.clear();for(const key of [...nodes.keys()])stopKey(key);owner='';lastState='';downStarted=false;neutralStarted=false;projectRef=null;auditionToken++;}
  async function pause(){if(context?.state==='running')await context.suspend();}
  async function resume(){await ctx().resume();}
  function setVolume(value){volume=Math.max(0,Math.min(1,value));if(master)master.gain.value=volume;}
  function playTake(a,slot,key,loop=false){if(!a||a.edits.muted)return null;validate(a);if(nodes.size>=64)return null;
    const c=ctx(),e=a.edits,source=c.createBufferSource(),gain=c.createGain();source.buffer=a.buffer;gain.gain.value=10**(e.gainDb/20);source.connect(gain);const panner=key.startsWith('world_')?c.createStereoPanner():null;if(panner){gain.connect(panner);panner.connect(master);}else gain.connect(master);
    source.loop=loop;source.loopStart=e.loopStart;source.loopEnd=e.loopEnd;
    const expectedEnd=loop?Infinity:now()+trimDuration(a),node={source,gain,slot,takeId:a.id,takeLabel:a.label||a.name,panner,baseGain:gain.gain.value,active:true,endedAt:null,stop:()=>stopKey(key)};nodes.set(key,node);
    source.onended=()=>{if(nodes.get(key)===node){node.active=false;node.endedAt=Math.min(now(),expectedEnd);source.disconnect();gain.disconnect();panner?.disconnect();nodes.delete(key);}};
    if(loop)source.start(0,e.trimStart);else source.start(0,e.trimStart,trimDuration(a));return node;
  }
  function begin(p,slot,key,autostart=true){const b=SF.Banks.resolve(p,slot);if(!SF.Banks.usable(b))return null;end(key);const r=SF.BankScheduler.create(b,(a,loop)=>playTake(a,slot,key+'_'+(++voiceId),loop),slot);runners.set(key,r);if(autostart)r.start(now());return r;}
  function end(key){const r=runners.get(key);runners.delete(key);r?.stop();}
  function start(p,slot,key=slot,forceLoop=null){SF.Banks.initialize(p);if(forceLoop===null)return begin(p,slot,key);const b=SF.Banks.resolve(p,slot);if(!b)return;const take=b.takes.find(a=>!a.edits.muted);return playTake(take,slot,key,forceLoop);}
  function tick(){if(!context||context.state!=='running')return;const t=now();for(const r of runners.values())r.tick(t);
    if(owner==='down'&&!downStarted){const sting=runners.get('world_sting');if(!sting||sting.finished){begin(projectRef,'defeated_loop','world_down');downStarted=true;}}
    if(owner==='neutral'&&!neutralStarted){const entry=runners.get('world_neutral_entry');if(!entry||entry.finished){begin(projectRef,'neutral_quips','world_quips');neutralStarted=true;}}
  }
  function sync(p,state,time,playing=true){if(!playing)return;SF.Banks.initialize(p);projectRef=p;
    const family=['hostile','hostile_attack','companion_combat'].includes(state)?'active':['neutral_idle','neutral_roam'].includes(state)?'neutral':['defeat_transition','defeated'].includes(state)?'down':state;
    const priorState=lastState;
    if(owner!==family){stop();projectRef=p;owner=family;
      if(family==='active'){begin(p,'music_loop','world_music');begin(p,state==='companion_combat'?'companion_entry':'hostile_entry','world_entry');if(['neutral_idle','neutral_roam'].includes(priorState))begin(p,'alert','world_alert');}
      if(family==='deploying')begin(p,'release','world_release');
      if(family==='down'){if(state==='defeat_transition')begin(p,'defeat_sting','world_sting');if(!runners.has('world_sting')){begin(p,'defeated_loop','world_down');downStarted=true;}}
      if(family==='neutral'){begin(p,'idle_entry','world_neutral_entry');if(!runners.has('world_neutral_entry')){begin(p,'neutral_quips','world_quips');neutralStarted=true;}}
      if(family==='stored'){begin(p,'inventory','world_inventory');if(priorState!=='repack')begin(p,'pickup','world_pickup');}
      if(family==='repack')begin(p,'repack','world_repack');
    }
    if(family==='neutral'&&lastState!==state){const slot=state==='neutral_roam'?'roam_loop':'idle_loop',b=SF.Banks.resolve(p,slot),old=SF.Banks.resolve(p,lastState==='neutral_roam'?'roam_loop':'idle_loop');if(!runners.has('world_neutral_bed')||b!==old){end('world_neutral_bed');begin(p,slot,'world_neutral_bed');}}
    lastState=state;tick();
  }
  function event(p,slot){if(!slots.includes(slot)||['down','stored','repack','deploying'].includes(owner))return false;const key='world_event_'+slot;let r=runners.get(key);if(!r)r=begin(p,slot,key,false);return r?r.trigger(now()):false;}
  async function auditionBank(p,slot){stop();const token=auditionToken;await resume();if(token!==auditionToken)return;projectRef=p;begin(p,slot,'audition_bank');}
  function cueDuration(p,slot){const b=SF.Banks.resolve(p,slot),duration=SF.Banks.duration(b);return duration?duration+b.settings.firstDelay:0;}
  function position(actor,listener,orbit=0){const angle=orbit*Math.PI/180,dx=actor.x-listener.x,dz=actor.z-listener.z,pan=Math.max(-1,Math.min(1,(dx*Math.cos(angle)+dz*Math.sin(angle))/350)),attenuation=1/(1+Math.hypot(dx,dz)/300);for(const node of nodes.values())if(node.panner){node.panner.pan.value=pan;node.gain.gain.value=node.baseGain*attenuation;}}
  async function audition(p,slot,takeId=null){stop();const token=auditionToken;await resume();if(token!==auditionToken)return;const b=SF.Banks.resolve(p,slot),a=b?.takes.find(a=>a.id===takeId)||b?.takes[0];if(a)playTake(a,slot,'audition',b.settings.mode==='loop');}
  const trimDuration=a=>a.edits.trimEnd-a.edits.trimStart;
  function writeWav(samples,seed=2026){const array=new ArrayBuffer(44+samples.length*2),view=new DataView(array);const text=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};
    text(0,'RIFF');view.setUint32(4,array.byteLength-8,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,44100,true);view.setUint32(28,88200,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,samples.length*2,true);
    let state=seed>>>0;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
    for(let i=0;i<samples.length;i++){const value=samples[i]*32768+random()-random();view.setInt16(44+i*2,Math.max(-32768,Math.min(32767,Math.round(value))),true);}return array;
  }
  function inspectWav(array){const v=new DataView(array),str=(a,b)=>String.fromCharCode(...new Uint8Array(array,a,b));
    if(str(0,4)!=='RIFF'||str(8,4)!=='WAVE'||str(12,4)!=='fmt '||v.getUint32(4,true)!==array.byteLength-8||v.getUint32(16,true)!==16||v.getUint32(28,true)!==88200||v.getUint16(32,true)!==2||v.getUint16(20,true)!==1||v.getUint16(22,true)!==1||v.getUint32(24,true)!==44100||v.getUint16(34,true)!==16||str(36,4)!=='data'||v.getUint32(40,true)!==array.byteLength-44)throw Error('Invalid converted PCM WAV.');
    return {sampleRate:44100,channels:1,bitDepth:16,sampleCount:(array.byteLength-44)/2,durationSeconds:(array.byteLength-44)/88200};
  }
  async function convert(a,signal={cancelled:false}){validate(a);if(signal.cancelled)throw Error('Cancelled.');
    const source=a.buffer,e=a.edits,length=Math.max(1,Math.round(trimDuration(a)*44100)),Klass=window.OfflineAudioContext||window.webkitOfflineAudioContext;
    if(!Klass)throw Error('Offline audio conversion is unavailable in this browser.');
    const offline=new Klass(1,length,44100),mono=offline.createBuffer(1,source.length,source.sampleRate),values=mono.getChannelData(0),channels=Array.from({length:source.numberOfChannels},(_,i)=>source.getChannelData(i));
    for(let i=0;i<values.length;i++){let n=0;for(const ch of channels)n+=ch[i]/channels.length;values[i]=n;if(i&&i%1000000===0){if(signal.cancelled)throw Error('Cancelled.');await SF.Media.tick();}}
    const src=offline.createBufferSource();src.buffer=mono;src.connect(offline.destination);src.start(0,e.trimStart,trimDuration(a));const rendered=await offline.startRendering();if(signal.cancelled)throw Error('Cancelled.');
    const output=rendered.getChannelData(0),gain=10**(e.gainDb/20);let peak=0;
    for(let i=0;i<output.length;i++){output[i]*=gain;peak=Math.max(peak,Math.abs(output[i]));}
    if(peak>1+1e-6)throw Error(`Audio clips at ${ (20*Math.log10(peak)).toFixed(1) } dB above full scale. Reduce exported gain.`);
    const array=writeWav(output),metadata={...inspectWav(array),gainDbBaked:e.gainDb,loop:e.loop,
      loopStartSample:Math.max(0,Math.round((e.loopStart-e.trimStart)*44100)),loopEndSampleExclusive:Math.min(length,Math.round((e.loopEnd-e.trimStart)*44100)),peakAmplitude:peak,dither:'TPDF_1LSB',downmix:'channel_average',sourceSha256:a.sha256};
    if(metadata.loopEndSampleExclusive<=metadata.loopStartSample)throw Error('Converted loop is shorter than one sample.');
    return {blob:new Blob([array],{type:'audio/wav'}),metadata};
  }
  async function auditionConverted(a,signal){stop();const token=auditionToken;const converted=await convert(a,signal);if(token!==auditionToken||signal.cancelled)return converted;
    const buffer=await ctx().decodeAudioData(await converted.blob.arrayBuffer());if(token!==auditionToken)return converted;await resume();if(token!==auditionToken)return converted;const source=ctx().createBufferSource(),gain=ctx().createGain();source.buffer=buffer;source.connect(gain);gain.connect(master);source.loop=a.edits.loop;source.loopStart=converted.metadata.loopStartSample/44100;source.loopEnd=converted.metadata.loopEndSampleExclusive/44100;nodes.set('audition',{source,gain,slot:'converted',active:true,stop:()=>stopKey('audition')});source.onended=()=>{if(nodes.get('audition')?.source===source){source.disconnect();gain.disconnect();nodes.delete('audition');}};source.start();return converted;
  }
  function waveform(canvas,a){const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.fillStyle='#1a130d';c.fillRect(0,0,w,h);if(!a)return;const values=a.buffer.getChannelData(0),stride=Math.max(1,Math.floor(values.length/w));c.strokeStyle='#e7bc72';c.beginPath();
    for(let x=0;x<w;x++){let low=1,high=-1;for(let i=x*stride;i<Math.min(values.length,(x+1)*stride);i++){low=Math.min(low,values[i]);high=Math.max(high,values[i]);}c.moveTo(x,h/2-high*h*.44);c.lineTo(x,h/2-low*h*.44);}c.stroke();
    c.fillStyle='#0009';c.fillRect(0,0,w*a.edits.trimStart/a.buffer.duration,h);c.fillRect(w*a.edits.trimEnd/a.buffer.duration,0,w,h);c.strokeStyle='#e35e59';for(const t of [a.edits.loopStart,a.edits.loopEnd]){const x=t/a.buffer.duration*w;c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}}
  return {slots,loops,load,validate,start,sync,tick,event,cueDuration,position,stop,pause,resume,setVolume,audition,auditionBank,convert,auditionConverted,waveform,trimDuration,writeWav,inspectWav,
    get auditionActive(){return nodes.has('audition');},get activeVoices(){return [...nodes.values()].map(n=>({slot:n.slot,takeId:n.takeId,takeLabel:n.takeLabel,playbackRate:n.source.playbackRate.value,loop:n.source.loop,pan:n.panner?.pan.value??0,gain:n.gain.gain.value}));},get bankStatus(){return Object.fromEntries([...runners].map(([key,r])=>[key,r.status]));},get previewActive(){return runners.has('audition_bank')&&!runners.get('audition_bank').finished;},get hasPlayback(){return nodes.size>0||[...runners.values()].some(r=>!r.finished);},get clock(){return now();},get activeSlots(){return [...nodes.values()].map(n=>n.slot);},get contextState(){return context?.state||'not_created';}};
})();
