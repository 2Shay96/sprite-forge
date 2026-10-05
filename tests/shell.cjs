// Step 3: browser-rendered shell/assets, independent of the pending workflow modules.
const Test=require('./config.cjs'),fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process'),{chromium}=Test.dependency('playwright');
const read=file=>fs.readFileSync(Test.projectPath(file),'utf8');
const staticShell=html=>html.replace(/<script>[\s\S]*?<\/script>/g,'');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const baseline=execFileSync('git',['show','cdb4d63498b3a1195c0effcc8bbf73a66f773ef5:src/index.html'],{cwd:Test.root,encoding:'utf8'});
async function contracts(page,html){await page.setContent(staticShell(html));return page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[id]')].map(el=>[el.id,{tag:el.tagName,attributes:Object.fromEntries(['type','min','max','step','accept','multiple','maxlength','data-setting'].filter(a=>el.hasAttribute(a)).map(a=>[a,el.getAttribute(a)])),options:el.tagName==='SELECT'?[...el.options].map(o=>o.value):[]}])));}
(async()=>{const browser=await chromium.launch(Test.browserOptions());try{
 const context=await browser.newContext({offline:true,reducedMotion:'reduce'}),remote=[],errors=[];
 context.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
 const newPage=async()=>{const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));return page;};
 let page=await newPage();const original=await contracts(page,baseline);await page.close();
 page=await newPage();const recovered=await contracts(page,read('SpriteForge.html'));await page.close();
 for(const [id,contract] of Object.entries(original))assert.deepEqual(recovered[id],contract,'preserved control contract '+id);
 const layouts=[];
 for(const viewport of [{width:1440,height:1050},{width:1000,height:900},{width:720,height:1000}]){
  const captures=[];
  for(const [label,file] of [['reference','Claude outputs/SpriteForge-0.7-preview.html'],['rebuilt','SpriteForge.html']]){
   page=await newPage();await page.setViewportSize(viewport);
   await page.setContent(staticShell(read(file)));await page.evaluate(async()=>{await Promise.all([...document.fonts].map(f=>f.load()));await document.fonts.ready;});
   const fonts=await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,weight:f.weight,status:f.status})));
   assert.equal(fonts.length,4);assert.ok(fonts.every(f=>f.status==='loaded'),'embedded fonts load '+label);
   const png=await page.screenshot({path:Test.outputPath(`${viewport.width}-${label}.png`),fullPage:true,animations:'disabled'});captures.push({label,sha256:hash(png),fonts});await page.close();
  }
  assert.equal(captures[0].sha256,captures[1].sha256,'rendered shell pixel equality at '+viewport.width);layouts.push({viewport,captures});
 }
 assert.deepEqual(remote,[]);assert.deepEqual(errors,[]);
 const report={browser:await browser.version(),offline:true,controlCount:Object.keys(original).length,layouts,remoteRequests:remote,errors,scriptsDisabled:true,workflowAcceptance:false,humanListening:false};
 fs.writeFileSync(Test.outputPath('shell-browser.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS preserved control contracts, four offline fonts and exact rendered shell at three widths; '+report.browser);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
