const Test=require('./config.cjs');
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
// Record the actual drawImage geometry at the renderer boundary without a browser.
const calls=[];const ctx=new Proxy({drawImage:(...args)=>calls.push(args)}, {get:(o,key)=>o[key]||(()=>{})});
const canvas={width:0,height:0,getContext:()=>ctx,getBoundingClientRect:()=>({width:880,height:520,left:0,top:0})};
const sandbox={SF:{Assets:{sunny:'data:image/png;base64,test'}},Image:class{complete=true;naturalWidth=938;},window:{devicePixelRatio:1}};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(Test.projectPath('src/renderer.js'),'utf8'),sandbox);const renderer=sandbox.SF.Renderer;renderer.init(canvas);
const project={settings:{referenceCanvasHeightUnits:128,zoomPercent:100,scalePercent:100,showReference:true,background:'pink',anchorX:128,anchorY:224},frames:[],canvas:[256,256]};
let baseline;
for(const zoom of [25,50,100,150,200,300]){
 project.settings.zoomPercent=zoom;renderer.draw(project,0);const g=renderer.referenceGeometry;
 assert.ok(Math.abs(g.width/g.height-508/1500)<1e-12);assert.equal(g.heightUnits,121.6);assert.ok(Math.abs(g.y+g.height-g.floor)<1e-12);
 assert.ok(Math.abs(g.height/g.unitsToPixels-121.6)<1e-12);
 const call=calls.at(-1);assert.equal(call.length,9);assert.equal(call[7],g.width);assert.equal(call[8],g.height);
 if(zoom===100)baseline=g;
 if(zoom===200){assert.equal(g.width,baseline.width*2);assert.equal(g.height,baseline.height*2);}
}
project.settings.referenceCanvasHeightUnits=256;project.settings.zoomPercent=100;renderer.draw(project,0);
assert.ok(Math.abs(renderer.referenceGeometry.height-baseline.height/2)<1e-12);
project.settings.showReference=false;renderer.draw(project,0);assert.equal(renderer.referenceGeometry,null);
project.settings.clipId='dance';project.settings.referenceCanvasHeightUnits=128;project.settings.showReference=true;project.frames=[{proxy:{},width:256,height:256}];project.extraClips={wide:{canvas:[256,1024],frames:project.frames,directions:{}}};vm.runInContext(fs.readFileSync(Test.projectPath('src/clips.js'),'utf8'),sandbox);vm.runInContext(fs.readFileSync(Test.projectPath('src/placement.js'),'utf8'),sandbox);sandbox.SF.Clips.initialize(project);sandbox.SF.Placement.set(project,'wide',{anchorX:128,anchorY:800,scalePercent:200,referenceCanvasHeightUnits:512,widthPercent:400,heightPercent:150,shapeLinked:false});sandbox.SF.Studio={visual:()=>({clipId:'wide',mode:'workbench',state:'hostile',stateAge:0,direction:'S'})};renderer.draw(project,0);assert.equal(renderer.referenceGeometry.width,baseline.width);assert.equal(renderer.referenceGeometry.height,baseline.height);
console.log('Sunny reference: uniform X/Y zoom at six zoom levels, fixed 121.6-unit height, ground registration, calibration independence and unchanged proportions under per-clip distortion passed.');
