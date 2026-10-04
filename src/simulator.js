SF.Simulator = (() => {
  const states=['hostile','hostile_attack','defeat_transition','defeated','stored','deploying','companion_combat','neutral_idle','neutral_roam','repack'];
  const labels={hostile:'Approach player · hostile',hostile_attack:'Attack player · hostile',defeat_transition:'Defeat transition',defeated:'Defeated item',stored:'Inventory',deploying:'Deployment',companion_combat:'Attack enemy · companion',neutral_idle:'Neutral idle',neutral_roam:'Neutral roam',repack:'Repack'};
  function validate(c){for(const k of ['seed','roamRadius','moveSpeed','pauseMin','pauseMax','leashDistance'])if(!Number.isFinite(c[k]))throw Error('Invalid encounter setting.');
    if(!Number.isInteger(c.seed)||c.seed<0||c.seed>4294967295||c.roamRadius<10||c.roamRadius>240||c.moveSpeed<5||c.moveSpeed>160||c.pauseMin<.1||c.pauseMax<c.pauseMin||c.pauseMax>30||c.leashDistance<c.roamRadius||c.leashDistance>400)throw Error('Encounter settings are out of range.');}
  function create(config){validate(config);let randomSeed=config.seed>>>0,time=0,age=0,state='hostile',cooldown=0,nextPause=2,target=null,facing=0,events=[],eventId=0,entryId=0;
    let player={x:-160,z:45,hp:100},actor={x:100,z:0,hp:100},enemy={x:170,z:-90,hp:80,active:true},inventory=false;
    const random=()=>{randomSeed=(Math.imul(randomSeed,1664525)+1013904223)>>>0;return randomSeed/4294967296;};
    const record=(message,type=null)=>{events.push({id:++eventId,timeSeconds:time,message,type,state,entryId});if(events.length>35)events.shift();};
    const enter=next=>{if(!states.includes(next))throw Error('Unknown encounter state.');state=next;entryId++;age=0;cooldown=0;record(labels[next]);if(next==='neutral_idle')nextPause=config.pauseMin+random()*(config.pauseMax-config.pauseMin);if(next==='stored')inventory=true;else if(next==='deploying')inventory=false;};
    const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
    function face(b){const dx=b.x-actor.x,dz=b.z-actor.z;if(Math.hypot(dx,dz)>.001)facing=Math.atan2(dx,-dz)*180/Math.PI;}
    function move(a,b,speed,dt){const d=distance(a,b);if(d<.001)return;const step=Math.min(d,speed*dt),dx=(b.x-a.x)/d,dz=(b.z-a.z)/d;a.x+=dx*step;a.z+=dz*step;if(a===actor)facing=Math.atan2(dx,-dz)*180/Math.PI;}
    const clamp=a=>{a.x=Math.max(-340,Math.min(340,a.x));a.z=Math.max(-210,Math.min(210,a.z));};
    function step(dt,keys={},world=true,stingDuration=.8,releaseDuration=0){time+=dt;age+=dt;if(!world)return;cooldown=Math.max(0,cooldown-dt);
      let dx=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0),dz=(keys.s||keys.ArrowDown?1:0)-(keys.w||keys.ArrowUp?1:0);const length=Math.hypot(dx,dz);if(length){player.x+=dx/length*95*dt;player.z+=dz/length*95*dt;clamp(player);}
      if(['hostile','hostile_attack'].includes(state)&&player.hp>0){face(player);if(distance(actor,player)>32){move(actor,player,config.moveSpeed*1.25,dt);if(state==='hostile_attack')enter('hostile');}else{if(state==='hostile')enter('hostile_attack');if(!cooldown){player.hp=Math.max(0,player.hp-10);cooldown=1.2;record('Player hit −10','attack');}}}
      if(state==='defeat_transition'&&age>=Math.max(.7,stingDuration))enter('defeated');
      if(state==='deploying'&&age>=Math.max(.7,releaseDuration))enter(enemy.active&&enemy.hp>0?'companion_combat':'neutral_idle');
      if(state==='companion_combat'){if(enemy.active&&enemy.hp>0)face(enemy);if(!enemy.active||enemy.hp<=0)enter('neutral_idle');else if(distance(actor,enemy)>34)move(actor,enemy,config.moveSpeed*1.4,dt);else if(!cooldown){enemy.hp=Math.max(0,enemy.hp-20);cooldown=.55;record('Enemy hit −20','attack');if(enemy.hp===0){enemy.active=false;record('Enemy defeated','victory');enter('neutral_idle');}}}
      if(['neutral_idle','neutral_roam'].includes(state)&&enemy.active&&enemy.hp>0)enter('companion_combat');
      if(state==='neutral_idle'&&age>=nextPause){const angle=random()*Math.PI*2,radius=Math.sqrt(random())*config.roamRadius;target={x:player.x+Math.cos(angle)*radius,z:player.z+Math.sin(angle)*radius};clamp(target);enter('neutral_roam');}
      if(state==='neutral_roam'){if(distance(actor,player)>config.leashDistance)target={x:player.x,z:player.z};if(target){move(actor,target,config.moveSpeed,dt);if(distance(actor,target)<3)enter('neutral_idle');}}
      if(state==='repack'&&age>.35)enter('stored');clamp(actor);
    }
    function attack(){if(['hostile','hostile_attack','companion_combat'].includes(state)){actor.hp=Math.max(0,actor.hp-35);record('Sprite hit −35','hit');if(actor.hp===0)enter('defeat_transition');}}
    function defeat(){actor.hp=0;enter('defeat_transition');}
    function pickup(){if(!['defeat_transition','defeated'].includes(state))return;enter('stored');}
    function deploy(point=null){if(state!=='stored')return;actor.x=point?.x??enemy.x-90;actor.z=point?.z??enemy.z+45;clamp(actor);actor.hp=100;enter('deploying');}
    function repack(){if(['deploying','companion_combat','neutral_idle','neutral_roam'].includes(state))enter('repack');}
    function spawn(){enemy={x:Math.min(300,player.x+240),z:Math.max(-180,player.z-90),hp:80,active:true};record('Enemy spawned');}
    function gallery(next){enter(next);inventory=next==='stored';if(next==='companion_combat')enemy.active=true;}
    record('Encounter reset');
    return {step,attack,defeat,pickup,deploy,repack,spawn,gallery,get model(){return{state,entryId,stateAge:age,timeSeconds:time,player,actor,enemy,inventory,facing,events};}};
  }
  return {states,labels,validate,create};
})();
