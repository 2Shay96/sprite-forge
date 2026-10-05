const Test=require('./config.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const sandbox={};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(Test.projectPath('src/timeline.js'),'utf8'),sandbox);const T=sandbox.SF.Timeline;
const s={rangeStart:0,rangeEnd:3,sourceFps:4,displayFps:4,playbackSpeedPercent:100,playbackMode:'ping_pong'};
assert.equal(T.duration(s),1.5);assert.deepEqual(Array.from(T.schedule(s).entries,x=>x.frame),[0,1,2,3,2,1]);
for(let cycle=0;cycle<3;cycle++)for(let i=0;i<6;i++)assert.equal(T.at(s,cycle*1.5+i*.25+.001),[0,1,2,3,2,1][i]);
for(const [start,end,expected] of [[0,0,[0]],[0,1,[0,1]],[1,3,[1,2,3,2]]]){
  const input={...s,rangeStart:start,rangeEnd:end};assert.deepEqual(Array.from(T.schedule(input).entries,x=>x.frame),expected);}
for(const mode of ['forward_loop','ping_pong','once'])for(const speed of [10,50,100,300])for(const fps of [1,4,8,12,16,20,24,59.94,120]){
  const input={...s,rangeEnd:69,sourceFps:24,displayFps:fps,playbackMode:mode,playbackSpeedPercent:speed};
  const schedule=T.schedule(input),expected=(mode==='ping_pong'?138:70)/(24*speed/100);assert.ok(Math.abs(schedule.durationSeconds-expected)<1e-12);
  assert.ok(Math.abs(schedule.entries.reduce((n,e)=>n+e.holdSeconds,0)-expected)<1e-10);
  assert.equal(schedule.entries[0].startSeconds,0);assert.equal(schedule.entries.at(-1).endSeconds,expected);
  schedule.entries.forEach((entry,i)=>{assert.ok(entry.holdSeconds>0);assert.ok(entry.frame>=0&&entry.frame<=69);assert.equal(T.at(input,entry.startSeconds+Math.min(entry.holdSeconds/2,1e-5)),entry.frame);if(i)assert.equal(entry.startSeconds,schedule.entries[i-1].endSeconds);});
}
const forward={...s,rangeEnd:69,sourceFps:24,displayFps:8,playbackMode:'forward_loop'};
assert.equal(T.duration(forward),70/24);assert.equal(T.schedule(forward).sampleCount,24);assert.ok(Math.abs(T.schedule(forward).entries.at(-1).holdSeconds-1/24)<1e-12);
assert.equal(T.at({...s,playbackMode:'once',displayFps:1},1.001),3);
console.log('Timeline: 108 timing combinations + exact ping-pong endpoints, selected ranges, one/two-frame clips, final fractional hold and once final pose passed.');
