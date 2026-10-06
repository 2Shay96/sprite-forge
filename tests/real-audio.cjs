// Native offline browser decode/conversion and real AudioContext scheduling.
// Audibility and actual hidden-tab behavior require the human checklist.
const Test=require('./config.cjs'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto'),JSZip=require('../vendor/jszip.min.js');
const {chromium}=Test.dependency('playwright'),source=Test.externalPath('SPRITE_FORGE_SALVATORE');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const inputs=[['music_loop','salvatoremusic_16bit_48k.wav'],['defeated_loop','salvatore_dead_loop.mp3'],['release','res_sound_effect.mp3'],['defeat_sting','defeated_sound_effect.mp3']];
const original=Object.fromEntries(inputs.map(([,name])=>[name,hash(fs.readFileSync(path.join(source,'assets','sounds',name)))]));
(async()=>{const browser=await chromium.launch(Test.browserOptions());try{
 const context=await browser.newContext({offline:true,acceptDownloads:true,viewport:{width:1440,height:1050}}),p=await context.newPage(),errors=[],requests=[],checks=[];
 p.on('pageerror',e=>errors.push(e.message));context.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 const settle=()=>p.waitForFunction(()=>!SF.App.busy),field=async(id,value)=>{const el=p.locator('#'+id),details=el.locator('xpath=ancestor::details[not(@open)]');if(await details.count())await details.locator('summary').first().click();await el.fill(String(value));await el.press('Tab');};
 await p.goto(Test.htmlUrl);
 const frameRoot=path.join(source,'assets','salvatore_angle_sprites','S'),names=fs.readdirSync(frameRoot).filter(n=>/\.png$/i.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));
 await p.setInputFiles('#files',[names[0],names[35],names[69]].map(n=>path.join(frameRoot,n)));await p.waitForSelector('#import-dialog[open]');await p.click('#accept');await settle();
 await p.click('[data-tab=audio]');
 for(const [slot,name]of inputs){const label=await p.evaluate(s=>SF.Banks.labels[s],slot);await p.locator('#cue-list .cue').filter({has:p.getByText(label,{exact:true})}).click();
  const [chooser]=await Promise.all([p.waitForEvent('filechooser'),p.click('#import-audio')]);await chooser.setFiles(path.join(source,'assets','sounds',name));await settle();
  assert.equal(await p.evaluate(s=>SF.Store.project.audio[s].takes[0].sha256,slot),original[name]);
 }
 checks.push('Four original MP3/WAV files decoded natively; source SHA-256 retained');
 const decoded=await p.evaluate(()=>Object.fromEntries(Object.entries(SF.Store.project.audio).map(([slot,b])=>{const a=b.takes[0];return [slot,{duration:a.buffer.duration,sampleRate:a.buffer.sampleRate,channels:a.buffer.numberOfChannels,sha256:a.sha256}];})));
 // Standalone transport must not inherit the hidden encounter's listener position.
 await p.click('#play');await p.waitForFunction(()=>SF.Audio.activeVoices.some(v=>v.slot==='music_loop'));await p.waitForTimeout(100);
 assert.equal(await p.evaluate(()=>SF.Audio.activeVoices.find(v=>v.slot==='music_loop').pan),0);
 await p.click('#play');await p.click('[data-tab=states]');await p.click('#play');await p.waitForFunction(()=>SF.Audio.activeVoices.some(v=>v.slot==='music_loop'));assert.equal(await p.evaluate(()=>SF.Audio.activeVoices.find(v=>v.slot==='music_loop').pan),0);
 await p.click('#encounter-mode');await p.waitForFunction(()=>SF.Audio.activeVoices.some(v=>v.slot==='music_loop'&&Math.abs(v.pan)>.1));
 await p.click('#play');await p.click('[data-tab=audio]');await p.click('#audio-stop');
 checks.push('Standalone and gallery music use centered native StereoPanner; encounter retains actual positional panning');
 // Each Listen control pauses/resumes its own audition without restarting or reconverting.
 await p.locator('#cue-list .cue').filter({has:p.getByText('Combat music',{exact:true})}).click();
 for(const kind of ['source','converted']){const button=p.locator('#audio-'+kind),label=kind==='source'?'original':'exported WAV';await button.click();await settle();await p.waitForFunction(()=>SF.Audio.auditionActive&&SF.Audio.contextState==='running');assert.equal(await button.textContent(),'Pause: '+label);assert.equal(await button.getAttribute('aria-pressed'),'true');await button.click();await p.waitForFunction(()=>SF.Audio.contextState==='suspended');assert.equal(await button.textContent(),'Resume: '+label);const clock=await p.evaluate(()=>SF.Audio.clock);await p.waitForTimeout(200);assert.ok(Math.abs((await p.evaluate(()=>SF.Audio.clock))-clock)<.02);await button.click();await p.waitForFunction(()=>SF.Audio.contextState==='running');assert.equal(await button.textContent(),'Pause: '+label);assert.equal(await p.evaluate(()=>SF.Audio.activeVoices.length),1);await p.click('#audio-stop');await p.waitForFunction(()=>!SF.Audio.auditionActive);assert.equal(await button.textContent(),'Listen: '+label);}
 checks.push('Both Listen buttons show Pause/Resume, freeze real audio clock on second click, resume one voice and reset after Stop');
 // Author a short periodic bank using the original release take, with no fabricated clock.
 await p.locator('#cue-list .cue').filter({has:p.getByText('Summon / deployment',{exact:true})}).click();
 await field('audio-trimEnd',.25);await field('audio-loopEnd',.25);
 await p.click('[data-for=bank-mode] [data-value=periodic]');await field('bank-gapMin',.4);await field('bank-gapMax',.4);await field('bank-maxPlays',2);
 await p.click('#audio-bank-test');await p.waitForFunction(()=>SF.Audio.activeVoices.length===1);
 assert.equal(await p.evaluate(()=>SF.Audio.activeVoices[0].playbackRate),1);
 await p.click('#audio-bank-pause');await p.waitForFunction(()=>SF.Audio.contextState==='suspended');
 const frozen=await p.evaluate(()=>SF.Audio.clock);await p.waitForTimeout(300);assert.ok(Math.abs((await p.evaluate(()=>SF.Audio.clock))-frozen)<.02);
 await p.click('#audio-bank-pause');await p.waitForFunction(()=>SF.Audio.contextState==='running');
 await p.waitForFunction(()=>SF.Audio.bankStatus.audition_bank?.count===2);await p.waitForFunction(()=>!SF.Audio.previewActive);
 checks.push('Real AudioContext pauses/resumes without clock advance; periodic bank plays twice and terminates; native playback rate 1');
 // A pending delayed cue is cancelled before it starts and never resurrects.
 await field('bank-firstDelay',.4);await p.click('#audio-bank-test');await p.click('#audio-stop');await p.waitForTimeout(700);assert.equal(await p.evaluate(()=>SF.Audio.hasPlayback),false);
 checks.push('Stopping a delayed cue cancels both pending scheduler and native voices');
 // Restore original release recording and default once policy for the listening project.
 await field('audio-trimEnd',decoded.release.duration);await field('audio-loopEnd',decoded.release.duration);await field('bank-firstDelay',0);await field('bank-maxPlays',0);await p.click('[data-for=bank-mode] [data-value=once]');
 await p.click('#audio-converted');await settle();assert.ok(await p.evaluate(()=>SF.Audio.activeSlots.includes('converted')));await p.click('#audio-stop');
 const converted=await p.evaluate(async()=>{const results={};for(const [slot,b]of Object.entries(SF.Store.project.audio)){const a=SF.Banks.effective(b.takes[0],b),out=await SF.Audio.convert(a,{cancelled:false});results[slot]=out.metadata;}return results;});
 for(const m of Object.values(converted)){assert.equal(m.sampleRate,44100);assert.equal(m.channels,1);assert.equal(m.bitDepth,16);assert.ok(m.peakAmplitude>0&&m.peakAmplitude<=1.000001);}
 checks.push('Native OfflineAudioContext renders four non-silent, unclipped mono 44.1 kHz PCM16 WAVs');
 const [saved]=await Promise.all([p.waitForEvent('download'),p.click('#save')]);const projectFile=Test.outputPath('salvatore-listening.spriteforge.zip');await saved.saveAs(projectFile);await settle();
 const zip=await JSZip.loadAsync(fs.readFileSync(projectFile),{checkCRC32:true});
 for(const [slot,name]of inputs){const bytes=fs.readFileSync(path.join(source,'assets','sounds',name));let found=false;for(const f of Object.values(zip.files).filter(f=>!f.dir&&f.name.startsWith('media/audio/'))){if(hash(await f.async('nodebuffer'))===hash(bytes))found=true;}assert.ok(found,'Original recording preserved: '+slot);}
 await p.setInputFiles('#project-file',projectFile);await p.waitForFunction(()=>!SF.App.busy&&!SF.Store.dirty&&document.querySelector('#status').textContent.includes('reopened'));
 for(const [slot,name]of inputs)assert.equal(await p.evaluate(s=>SF.Store.project.audio[s].takes[0].sha256,slot),original[name]);
 const [exported]=await Promise.all([p.waitForEvent('download'),p.click('#export')]);const packFile=Test.outputPath('salvatore-listening-source-pack.zip');await exported.saveAs(packFile);await settle();
 const pack=await JSZip.loadAsync(fs.readFileSync(packFile),{checkCRC32:true}),wavs=Object.values(pack.files).filter(f=>!f.dir&&/\.wav$/i.test(f.name));assert.equal(wavs.length,4);
 for(const f of wavs){const bytes=await f.async('nodebuffer');assert.equal(bytes.readUInt32LE(24),44100);assert.equal(bytes.readUInt16LE(22),1);assert.equal(bytes.readUInt16LE(34),16);}
 checks.push('CRC-valid save/reopen preserves all original recordings; Source Pack contains four PCM16 mono 44.1 kHz WAVs');
 for(const [,name]of inputs)assert.equal(hash(fs.readFileSync(path.join(source,'assets','sounds',name))),original[name]);assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 fs.writeFileSync(Test.outputPath('real-audio-results.json'),JSON.stringify({browser:await browser.version(),htmlSha256:hash(fs.readFileSync(Test.projectPath('SpriteForge.html'))),offline:true,humanListening:false,hiddenTabAcceptance:false,checks,decoded,converted,originalsUnchanged:true,projectFile,projectSha256:hash(fs.readFileSync(projectFile)),packFile,packSha256:hash(fs.readFileSync(packFile)),errors,requests},null,2));
 console.log('PASS '+checks.join('\nPASS '));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
