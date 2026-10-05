const Test=require('./config.cjs');
// Native Canvas/ZIP and renderer geometry checks. No browser is navigated or controlled.
const assert=require('node:assert/strict'),fs=require('node:fs'),{sandbox,load}=require('./audio-test-runtime.cjs');
const {createCanvas,loadImage,Image}=Test.dependency('@napi-rs/canvas'),JSZip=require('../vendor/jszip.min.js');
function canvas(){const c=createCanvas(1,1);c.toBlob=(cb,type='image/png')=>cb(new Blob([c.toBuffer(type)],{type}));return c;}
const s=sandbox({JSZip,Image,document:{createElement:tag=>tag==='canvas'?canvas():{click(){}}},createImageBitmap:async b=>loadImage(Buffer.from(await b.arrayBuffer()))});s.window.devicePixelRatio=1;s.SF.Assets={sunny:'data:image/png;base64,'+fs.readFileSync(Test.projectPath('assets/sunny-smiles-reference.png')).toString('base64')};
const {Placement:G,Clips:C,Store:S,Media:M,Pack:P,Directions:D,Renderer:R}=load(s,['timeline','store','banks','media','clips','placement','corrections','directions','audio','simulator','playback','renderer','pack']),sig={cancelled:false},progress=()=>{},checks=[],ok=t=>checks.push(t),near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,`${a} differs from ${b}`);
(async()=>{
 for(const old of ['legacy-v1','fixture','salvatore_front']){const blob=new Blob([fs.readFileSync(Test.archivePath(`${old}.spriteforge.zip`))]);const oldP=await P.reopen(blob,sig,progress);assert.equal(oldP.settings.directionMode,'billboard');if(old==='salvatore_front'){assert.equal(oldP.frames.length,70);assert.deepEqual(Array.from(oldP.canvas),[1080,1080]);assert.ok(oldP.frames.every(f=>f.transparent&&f.bounds[3]<1080));}}ok('Legacy schema 1/2 projects and actual 70-frame Salvatore front reopen with alpha intact');
const existing=await P.reopen(new Blob([fs.readFileSync(Test.archivePath('a4-project.spriteforge.zip'))]),sig,progress);assert.equal(existing.audio.neutral_quips.takes.length,2);assert.equal(G.resolve(existing,existing.settings.clipId).widthPercent,100);ok('Existing A4 audio project reopens with identity shape and intact sound banks');
console.log(checks.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1;});
