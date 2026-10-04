const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const deps=process.env.SPRITE_FORGE_NODE_MODULES||'/Users/seamuswulff/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(path.join(deps,'playwright')),JSZip=require(path.join(deps,'jszip'));
const root=path.resolve('sprite-forge'),url='file://'+path.join(root,'SpriteForge.html'),ev=path.join(root,'evidence');
const source=path.resolve('work/source/Salvatore gon_ getcha (main asset source folder for GECK modding)');
const config=JSON.parse(fs.readFileSync('work/geck-bridge/projects/salvatore_mod.json'));
function filesAt(dir){if(!fs.existsSync(dir))return[];return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')?[]:e.isDirectory()?filesAt(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const protectedFiles=[...filesAt(source),path.join(config.game_root,'Data','SalvatoreGonGetcha.esp'),
  ...['meshes/salvatore','textures/salvatore','sound/fx/salvatore'].flatMap(p=>filesAt(path.join(config.game_root,'Data',p))),
  path.join(config.game_root,'Data/meshes/creatures/mistergutsy/salvatorebody.nif'),path.join(config.game_root,'Data/textures/Interface/Icons/PipboyImages/Weapons/salvatore.dds')].filter(p=>fs.existsSync(p));
const hashes=()=>Object.fromEntries(protectedFiles.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
const before=hashes(),checks=[];const pass=(name,detail)=>{checks.push({name,detail,passed:true});console.log('PASS',name,detail||'');};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.SPRITE_FORGE_CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1050},acceptDownloads:true,offline:true});const page=await context.newPage();
 const errors=[],remote=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
 await page.goto(url);pass('Offline local-file startup',await browser.version());
 const setting=async(id,value)=>{await page.locator('#'+id).fill(String(value));await page.locator('#'+id).press('Tab');};
 const select=async(id,value)=>page.selectOption('#'+id,value);
 const waitReady=async()=>{await page.waitForFunction(()=>document.querySelector('#cancel').hidden,{timeout:120000});};
 const importFrames=async(list,accept=true)=>{await page.setInputFiles('#files',list);await page.waitForSelector('#import-dialog[open]',{timeout:120000});if(accept)await page.click('#accept');};
 const fixture=[10,3,2,1].map(i=>path.join(root,'fixtures/numbered',`frame_${i}.png`));
 await importFrames(fixture,false);
 assert.deepEqual(await page.evaluate(()=>Array.from(document.querySelectorAll('#review-strip .thumb')).map(n=>n.title.split(' · ')[1])),['frame_1.png','frame_2.png','frame_3.png','frame_10.png']);
 assert.match(await page.locator('#review-issues').textContent(),/Missing frame numbers/);await page.click('#accept');pass('Numeric import review','Unpadded shuffled filenames ordered 1,2,3,10; gaps reported.');
 await setting('sourceFps',4);await setting('displayFps',4);await select('playbackMode','ping_pong');assert.equal(await page.locator('#duration').textContent(),'1.500000 s');
 const scrub=async(time)=>{await page.locator('#scrub').evaluate((el,t)=>{el.value=String(t);el.dispatchEvent(new Event('input',{bubbles:true}));},time);};
 for(let i=0;i<6;i++){await scrub(i*.25+.01);assert.match(await page.locator('#frame-label').textContent(),new RegExp('^'+[0,1,2,3,2,1][i]+' /'));}
 pass('Ping-pong browser scrubbing','0,1,2,3,2,1; no repeated turning endpoints.');
 await setting('displayFps',1);assert.equal(await page.locator('#duration').textContent(),'1.500000 s');await scrub(.9);assert.match(await page.locator('#frame-label').textContent(),/^0 /);await scrub(1.1);assert.match(await page.locator('#frame-label').textContent(),/^2 /);pass('Display FPS independence','1 fps holds fewer poses while retaining the 1.5 s cycle.');
 await page.click('#next');assert.match(await page.locator('#frame-label').textContent(),/^3 /);await page.click('#prev');assert.match(await page.locator('#frame-label').textContent(),/^2 /);pass('Source frame stepping','Explicit source steps bypass the display sampler.');
 await setting('rangeStart',1);await setting('rangeEnd',2);await setting('displayFps',4);assert.equal(await page.locator('#duration').textContent(),'0.500000 s');await scrub(.26);assert.match(await page.locator('#frame-label').textContent(),/^2 /);
 await setting('rangeEnd',1);assert.equal(await page.locator('#duration').textContent(),'0.250000 s');await scrub(.2);assert.match(await page.locator('#frame-label').textContent(),/^1 /);pass('Selected range and one/two-frame ping-pong');
 await setting('rangeStart',0);await setting('rangeEnd',3);await select('playbackMode','once');await setting('sourceFps',24);await setting('displayFps',1);await page.click('#play');await page.waitForTimeout(400);assert.equal(await page.locator('#play').textContent(),'Play');assert.match(await page.locator('#frame-label').textContent(),/^3 /);pass('Play once actual elapsed-time playback','Holds final source pose even when display FPS skips it.');
 await select('playbackMode','ping_pong');await setting('sourceFps',4);await setting('displayFps',4);
 await page.clock.install();await page.clock.pauseAt(new Date());await page.click('#play');
 await page.clock.runFor(300);assert.match(await page.locator('#frame-label').textContent(),/^1 /);await page.clock.runFor(500);assert.match(await page.locator('#frame-label').textContent(),/^3 /);await page.clock.runFor(500);assert.match(await page.locator('#frame-label').textContent(),/^1 /);await page.clock.runFor(300);assert.match(await page.locator('#frame-label').textContent(),/^0 /);
 await page.click('#play');const frozen=await page.locator('#elapsed').textContent();await page.clock.runFor(500);assert.equal(await page.locator('#elapsed').textContent(),frozen);pass('Actual timed ping-pong and pause','Browser clock advances a full cycle through both endpoints; pause freezes time.');
 await page.clock.resume();await page.click('[data-tab="ground"]');await setting('anchorX',128);await setting('anchorY',224);
 let t=await page.evaluate(()=>SF.Renderer.transform);const bounds=await page.locator('#preview').boundingBox();
 await page.mouse.move(bounds.x+t.pivot,bounds.y+t.floor);await page.mouse.down();await page.mouse.move(bounds.x+t.pivot+12*t.factor,bounds.y+t.floor-10*t.factor,{steps:5});await page.mouse.up();
 const dragged=await page.evaluate(()=>[SF.Store.project.settings.anchorX,SF.Store.project.settings.anchorY]);assert.ok(Math.abs(dragged[0]-140)<1);assert.ok(Math.abs(dragged[1]-214)<1);pass('Draggable feet anchor',dragged.map(x=>x.toFixed(2)).join(', '));
 await page.click('#undo');assert.deepEqual(await page.evaluate(()=>[SF.Store.project.settings.anchorX,SF.Store.project.settings.anchorY]),[128,224]);await page.click('#redo');
 for(const scale of [1,100,200]){await setting('scalePercent',scale);await page.waitForTimeout(50);const geometry=await page.evaluate(()=>{const s=SF.Store.project.settings,t=SF.Renderer.transform;return{feet:[t.x+s.anchorX*t.factor,t.y+s.anchorY*t.factor],pivot:[t.pivot,t.floor],factor:t.factor};});assert.ok(geometry.feet.every((v,i)=>Math.abs(v-geometry.pivot[i])<1e-8));}
 pass('Grounding at 1%, 100%, 200%','Anchor maps exactly to floor origin at each size; undo/redo restores placement.');
 await setting('scalePercent',100);await page.locator('#zoom').evaluate(el=>{el.dispatchEvent(new PointerEvent('pointerdown'));el.value='150';el.dispatchEvent(new Event('input'));el.dispatchEvent(new Event('change'));});assert.equal(await page.evaluate(()=>SF.Store.project.settings.scalePercent),100);
 await select('background','dark');await page.screenshot({path:path.join(ev,'demo-ground.png'),fullPage:true});pass('Separate preview zoom and alpha backgrounds');
 for(const [name,rgb] of [['pink',[255,0,229]],['yellow',[255,255,0]]]){
   await select('background',name);await page.waitForTimeout(50);
   assert.deepEqual(await page.evaluate(()=>Array.from(document.querySelector('#preview').getContext('2d').getImageData(5,5,1,1).data).slice(0,3)),rgb);
   await page.screenshot({path:path.join(ev,'demo-'+name+'.png'),fullPage:true});
 }
 pass('Pink and yellow test backgrounds','Exact bright test colours rendered; both are valid project settings.');
 const zoomTo=async value=>{await page.locator('#zoom').evaluate((el,v)=>{el.dispatchEvent(new PointerEvent('pointerdown'));el.value=String(v);el.dispatchEvent(new Event('input'));el.dispatchEvent(new Event('change'));},value);await page.waitForTimeout(30);};
 await zoomTo(100);const reference100=await page.evaluate(()=>SF.Renderer.referenceGeometry);assert.ok(reference100);assert.equal(reference100.heightUnits,121.6);
 await zoomTo(200);const reference200=await page.evaluate(()=>SF.Renderer.referenceGeometry);assert.ok(Math.abs(reference200.width-reference100.width*2)<1e-8);assert.ok(Math.abs(reference200.height-reference100.height*2)<1e-8);assert.ok(Math.abs(reference200.y+reference200.height-reference200.floor)<1e-8);
 await zoomTo(100);pass('Sunny reference browser rendering','Embedded transparent PNG renders offline, fixed at approximately 121.6 units; width and height both double at 200% zoom.');
 await select('background','pink');
 await page.click('[data-tab="import"]');await setting('displayName','Fixture Dancer');await setting('characterId','fixture_dancer');
 await page.click('[data-tab="animation"]');await setting('playbackSpeedPercent',50);await setting('displayFps',8);
 const expected=await page.evaluate(()=>SF.Store.clone(SF.Store.project.settings));
 let dl=page.waitForEvent('download');await page.click('#save');let download=await dl;const saved=path.join(ev,'fixture.spriteforge.zip');await download.saveAs(saved);await waitReady();
 const projectZip=await JSZip.loadAsync(fs.readFileSync(saved),{checkCRC32:true});const pj=JSON.parse(await projectZip.file('project.json').async('string'));assert.deepEqual(pj.settings,expected);assert.equal(pj.frames.length,4);
 const reopened=await context.newPage();await reopened.goto(url);await reopened.setInputFiles('#project-file',saved);await reopened.waitForFunction(()=>document.querySelector('#dirty').textContent==='Saved project',{timeout:120000});assert.deepEqual(await reopened.evaluate(()=>SF.Store.project.settings),expected);assert.deepEqual(await reopened.evaluate(()=>SF.Store.project.frames.map(f=>f.sha256)),pj.frames.map(f=>f.sha256));
 pass('Fresh-page project round trip','ZIP includes originals; every setting and SHA-256 restored.');
 dl=reopened.waitForEvent('download');await reopened.click('#export');download=await dl;const packFile=path.join(ev,'fixture_source_pack_v1.zip');await download.saveAs(packFile);await reopened.waitForFunction(()=>document.querySelector('#cancel').hidden);
 const zip=await JSZip.loadAsync(fs.readFileSync(packFile),{checkCRC32:true}),prefix='Modding_Ready_Sprite_Files/fixture_dancer/';const manifest=JSON.parse(await zip.file(prefix+'manifest.json').async('string')),clip=manifest.clips.dance;
 assert.equal(manifest.exportKind,'source_pack');assert.equal(manifest.capabilities.fnvAssets,false);assert.ok(!JSON.stringify(manifest).includes('zoom'));assert.equal(manifest.visual.scalePercent,100);
 const schedule=JSON.parse(await zip.file(prefix+clip.schedule).async('string'));assert.deepEqual(schedule,await reopened.evaluate(()=>SF.Timeline.schedule(SF.Store.project.settings)));
 for(const f of clip.directions.S.frames){const b=await zip.file(prefix+f.file).async('nodebuffer');assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256);}
 pass('Source Pack contents and schedule','Organized PNGs, source/output hashes, selected range, exact merged holds; no preview zoom or FNV payload.');
 await reopened.close();
 // Corrupt archive media and prove the active project survives failed open.
 const corrupt=await JSZip.loadAsync(fs.readFileSync(saved));corrupt.file(pj.frames[0].path,Buffer.from('changed'));const corruptPath=path.join(ev,'corrupt-test.spriteforge.zip');fs.writeFileSync(corruptPath,await corrupt.generateAsync({type:'nodebuffer'}));
 await page.setInputFiles('#project-file',corruptPath);await waitReady();assert.match(await page.locator('#status').textContent(),/Checksum mismatch/);assert.equal(await page.evaluate(()=>SF.Store.project.frames.length),4);
 const unsafe=new JSZip();unsafe.file('../escape.txt','no');unsafe.file('project.json','{}');const unsafePath=path.join(ev,'unsafe-test.zip');fs.writeFileSync(unsafePath,await unsafe.generateAsync({type:'nodebuffer'}));await page.setInputFiles('#project-file',unsafePath);await waitReady();assert.match(await page.locator('#status').textContent(),/Unsafe archive path/);pass('Corrupt media and unsafe ZIP rejection','Failed reopen preserves active project.');
 await page.setInputFiles('#files',[{name:'frame_1.png',mimeType:'image/png',buffer:fs.readFileSync(fixture[3])},{name:'other_1.png',mimeType:'image/png',buffer:fs.readFileSync(fixture[2])}]);await waitReady();assert.match(await page.locator('#status').textContent(),/Duplicate frame index/);
 await page.setInputFiles('#files',path.join(root,'fixtures/validation/broken_6.png'));await waitReady();assert.match(await page.locator('#status').textContent(),/not a valid PNG/);
 await page.setInputFiles('#files',path.join(root,'fixtures/validation/empty_4.png'));await waitReady();assert.match(await page.locator('#status').textContent(),/Every frame is fully transparent/);pass('Duplicate indices, unreadable PNG and empty animation validation');
 await importFrames([fixture[3],path.join(root,'fixtures/validation/empty_4.png'),path.join(root,'fixtures/validation/opaque_5.png')],false);assert.equal(await page.locator('#accept').isDisabled(),true);assert.match(await page.locator('#review-issues').textContent(),/intentional pauses/);assert.match(await page.locator('#review-issues').textContent(),/no transparent pixels/);await page.check('#padding');await page.click('#accept');
 dl=page.waitForEvent('download');await page.click('#export');download=await dl;const paddedPath=path.join(ev,'padded_source_pack.zip');await download.saveAs(paddedPath);await waitReady();const paddedZip=await JSZip.loadAsync(fs.readFileSync(paddedPath));const paddedPNG=await paddedZip.file('Modding_Ready_Sprite_Files/fixture_dancer/source-pack/animations/dance/S/0001.png').async('nodebuffer');assert.equal(paddedPNG.readUInt32BE(16),256);assert.equal(paddedPNG.readUInt32BE(20),256);pass('Mixed canvas explicit padding','Empty pause preserved; normalized export is 256×256 with no stretching.');
 // Full Salvatore front sequence regression.
 const salvatore=filesAt(path.join(source,'assets/salvatore_angle_sprites/S')).filter(f=>/\.png$/i.test(f)).reverse();assert.equal(salvatore.length,70);
 await page.setInputFiles('#files',salvatore);await page.waitForSelector('#import-dialog[open]',{timeout:120000});await page.click('#accept');await page.click('[data-tab="import"]');await setting('displayName','Salvatore · Front');await setting('characterId','salvatore_front');await page.click('[data-tab="animation"]');await setting('sourceFps',24);await setting('playbackSpeedPercent',100);await setting('displayFps',8);await select('playbackMode','forward_loop');assert.equal(await page.locator('#duration').textContent(),'2.916667 s');
 await setting('playbackSpeedPercent',50);assert.equal(await page.locator('#duration').textContent(),'5.833333 s');await setting('playbackSpeedPercent',100);await select('playbackMode','ping_pong');assert.equal(await page.locator('#duration').textContent(),'5.750000 s');
 await page.click('[data-tab="ground"]');await setting('anchorX',540);await setting('anchorY',1030);await select('background','scene');await page.locator('#zoom').evaluate(el=>{el.dispatchEvent(new PointerEvent('pointerdown'));el.value='100';el.dispatchEvent(new Event('input'));el.dispatchEvent(new Event('change'));});await scrub(2.85);await page.screenshot({path:path.join(ev,'salvatore-front.png'),fullPage:true});
 dl=page.waitForEvent('download');await page.click('#save');download=await dl;const salSave=path.join(ev,'salvatore_front.spriteforge.zip');await download.saveAs(salSave);await waitReady();const salExpected=await page.evaluate(()=>SF.Store.project.settings);
 await page.setInputFiles('#project-file',salSave);await page.waitForFunction(()=>document.querySelector('#dirty').textContent==='Saved project',{timeout:120000});await waitReady();assert.deepEqual(await page.evaluate(()=>SF.Store.project.settings),salExpected);assert.equal(await page.evaluate(()=>SF.Store.project.frames.length),70);
 dl=page.waitForEvent('download');await page.click('#export');download=await dl;const salPack=path.join(ev,'salvatore_front_source_pack_v1.zip');await download.saveAs(salPack);await waitReady();const salZip=await JSZip.loadAsync(fs.readFileSync(salPack),{checkCRC32:true});const salManifest=JSON.parse(await salZip.file('Modding_Ready_Sprite_Files/salvatore_front/manifest.json').async('string'));assert.equal(salManifest.clips.dance.durationSeconds,5.75);assert.equal(salManifest.clips.dance.directions.S.frames.length,70);
 const salSchedule=JSON.parse(await salZip.file('Modding_Ready_Sprite_Files/salvatore_front/source-pack/schedules/dance.json').async('string'));assert.deepEqual(salSchedule,await page.evaluate(()=>SF.Timeline.schedule(SF.Store.project.settings)));
 pass('Salvatore 70-frame import / save / reopen / Source Pack','1080×1080 originals; 2.916667 s forward, 5.833333 s at half speed, 5.750000 s ping-pong at 8 display FPS.');
 // Cancellation before the full sequence is accepted keeps the prior state.
 await page.setInputFiles('#files',salvatore);await page.click('#cancel');await waitReady();assert.match(await page.locator('#status').textContent(),/Cancelled/);assert.equal(await page.evaluate(()=>SF.Store.project.frames.length),70);pass('Cancel import preserves active media');
 assert.equal(errors.length,0,errors.join('\n'));assert.equal(remote.length,0);assert.deepEqual(hashes(),before);pass('No remote requests or browser exceptions');pass('Existing Godot source and installed Salvatore files preserved',`${protectedFiles.length} files have unchanged SHA-256.`);
 await page.setViewportSize({width:720,height:1000});await page.screenshot({path:path.join(ev,'narrow-layout.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);pass('Narrow layout','No horizontal overflow at 720px.');
 fs.writeFileSync(path.join(ev,'browser-results.json'),JSON.stringify({browser:await browser.version(),platform:process.platform,offline:true,url:'file://SpriteForge.html',checks,errors,remoteRequests:remote.length,protectedFileCount:protectedFiles.length},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);fs.writeFileSync(path.join(ev,'browser-failure.json'),JSON.stringify({checks,error:String(e.stack)},null,2));process.exit(1)});
