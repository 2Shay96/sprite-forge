const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sandbox={SF:{}};vm.runInNewContext(fs.readFileSync('sprite-forge/src/simulator.js','utf8'),sandbox);const S=sandbox.SF.Simulator;
const config={seed:2026,roamRadius:180,moveSpeed:42,pauseMin:2,pauseMax:6,leashDistance:260};
const run=(sim,seconds,keys={},sting=2,release=1.4)=>{for(let i=0;i<Math.round(seconds*60);i++)sim.step(1/60,keys,true,sting,release);};
for(const seed of [0,2026,4294967295]){
 const s=S.create({...config,seed});run(s,6);assert.equal(s.model.state,'hostile_attack');assert.ok(s.model.player.hp<100);
 s.attack();s.attack();s.attack();assert.equal(s.model.state,'defeat_transition');run(s,.3);s.pickup();run(s,4);assert.equal(s.model.state,'stored');assert.equal(s.model.inventory,true);
 s.deploy();run(s,1);assert.equal(s.model.state,'deploying');run(s,.5);assert.equal(s.model.state,'companion_combat');assert.equal(s.model.inventory,false);
 run(s,10);assert.equal(s.model.enemy.hp,0);assert.ok(['neutral_idle','neutral_roam'].includes(s.model.state));
 run(s,20);assert.ok(s.model.events.some(e=>e.message==='Neutral roam'));assert.ok(Math.abs(s.model.actor.x)<=340&&Math.abs(s.model.actor.z)<=210);
 s.spawn();run(s,.02);assert.equal(s.model.state,'companion_combat');s.repack();run(s,.5);assert.equal(s.model.state,'stored');
 s.deploy();run(s,2);s.defeat();run(s,1);assert.equal(s.model.state,'defeat_transition');run(s,1.1);assert.equal(s.model.state,'defeated');s.pickup();assert.equal(s.model.inventory,true);
}
const a=S.create(config),b=S.create(config);for(const s of [a,b]){s.defeat();s.pickup();s.deploy();run(s,50);}assert.deepEqual(a.model,b.model);
assert.throws(()=>S.create({...config,leashDistance:20}));assert.throws(()=>S.create({...config,pauseMin:8}));
console.log('Encounter: three seeds, pursuit/damage, interrupted defeat, release duration, combat, seeded roaming, reacquisition, repack and repeat deployment passed.');
