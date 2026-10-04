SF.Renderer = (() => {
  let canvas, ctx, dragTransform=null, lastTransform=null, referenceGeometry=null,sceneGeometry=null,correctionGeometry=null;
  const palette={checker:'#babdc3',light:'#f4f1e9',dark:'#1a130d',scene:'#b8c5bd',pink:'#ff00e5',yellow:'#ffff00'};
  const sunny=new Image(), referenceHeightUnits=121.6;
  // Visible cutout bounds exclude low-alpha generation noise outside the figure.
  const referenceCrop={x:205,y:68,width:508,height:1500};
  function init(node){canvas=node;ctx=canvas.getContext('2d');sunny.src=SF.Assets.sunny;}
  function draw(project,index) {
    correctionGeometry=null;
    const view=SF.Studio?.visual?.()||{clipId:project.settings.clipId,direction:project.settings.previewDirection||'S',mode:'workbench',state:'hostile',stateAge:0};
    const box=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    if(canvas.width!==Math.round(box.width*dpr)||canvas.height!==Math.round(box.height*dpr)){canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);const w=box.width,h=box.height,s=project.settings;
    ctx.fillStyle=palette[s.background];ctx.fillRect(0,0,w,h);
    if(s.background==='checker'){ctx.fillStyle='#d9dbe0';for(let y=0;y<h;y+=20)for(let x=0;x<w;x+=20)if((x/20+y/20)%2===0)ctx.fillRect(x,y,20,20);}
    const floor=h*.82,pivot=w/2,unit=h*.63/s.referenceCanvasHeightUnits*s.zoomPercent/100;
    ctx.strokeStyle=s.background==='dark'?'#4f2b1b':'#47504733';ctx.lineWidth=1;
    for(let x=pivot%40;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=floor%40;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.strokeStyle=s.background==='dark'?'#e7bc72':'#273f27';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,floor);ctx.lineTo(w,floor);ctx.stroke();
    ctx.font='12px monospace';ctx.fillStyle=s.background==='dark'?'#e7bc72':'#173117';ctx.fillText('GROUND · 0',14,floor+21);
    referenceGeometry=null;
    if(s.showReference&&sunny.complete&&sunny.naturalWidth){
      const rh=referenceHeightUnits*unit,rw=rh*referenceCrop.width/referenceCrop.height,x=34;
      referenceGeometry={x,y:floor-rh,width:rw,height:rh,heightUnits:referenceHeightUnits,unitsToPixels:unit,floor,sourceAspect:referenceCrop.width/referenceCrop.height};
      ctx.drawImage(sunny,referenceCrop.x,referenceCrop.y,referenceCrop.width,referenceCrop.height,x,floor-rh,rw,rh);
      ctx.save();ctx.translate(19,floor-rh/2);ctx.rotate(-Math.PI/2);ctx.textAlign='center';ctx.font='12px monospace';
      ctx.fillText('Height Reference',0,0);ctx.restore();
      ctx.font='10px monospace';ctx.fillText('SUNNY · ≈121.6u',x,floor+39);
    }
    if(!project.frames.length){ctx.textAlign='center';ctx.font='600 22px monospace';ctx.fillText('Import animation images',pivot,h*.44);ctx.font='12px monospace';ctx.fillText('or load the four-frame test',pivot,h*.44+26);ctx.textAlign='left';return;}
    if(view.mode==='encounter'){drawEncounter(project,index,view,w,h);return;}
    const defeated=['defeat_transition','defeated'].includes(view.state),bounce=defeated?Math.abs(Math.sin(view.stateAge*7))*12:0;
    const extraScale=defeated?.2:view.state==='repack'?Math.max(.1,1-view.stateAge*2):1;
    const m=SF.Placement.metrics(project,view.clipId,unit,extraScale),g=m.profile,[fx,fy]=m.factors;
    const transform=dragTransform||{x:pivot+m.offset[0]-g.anchorX*fx,y:floor+m.offset[1]-g.anchorY*fy,fx,fy,factor:fx,pivot,floor,anchor:[g.anchorX,g.anchorY],canvas:g.canvas,clipId:view.clipId};lastTransform=transform;
    const resolved=SF.Directions?.resolve(project,view.clipId,view.direction),f=resolved?.frames[index]||project.frames[index],corr=SF.Studio?.renderCorrection?.(view.clipId,index,view.direction,[transform.fx,transform.fy])||SF.Corrections?.render(project,view.clipId,index,view.direction,[transform.fx,transform.fy],project.preview?.correctionView==='original');
    if(view.mode==='workbench')correctionGeometry={clipId:view.clipId,index,direction:view.direction,factors:[transform.fx,transform.fy],recipe:resolved?.recipe};
    if(view.state==='stored'){ctx.fillStyle='#1a130ddd';ctx.fillRect(pivot-95,floor-170,190,120);ctx.strokeStyle='#e7bc72';ctx.strokeRect(pivot-95,floor-170,190,120);ctx.fillStyle='#e7bc72';ctx.textAlign='center';ctx.font='13px monospace';ctx.fillText('INVENTORY · 1 ITEM',pivot,floor-145);if(f)SF.Directions.draw(ctx,f,[g.anchorX,g.anchorY],pivot,floor-65,m.factors.map(v=>v*.22),resolved?.recipe,null,SF.Corrections?.render(project,view.clipId,index,view.direction,m.factors.map(v=>v*.22),project.preview?.correctionView==='original'));ctx.textAlign='left';return;}
    if(f?.proxy&&SF.Directions){ctx.save();if(defeated){ctx.translate(pivot,floor-bounce);ctx.rotate(Math.sin(view.stateAge*3)*.22);SF.Directions.draw(ctx,f,[g.anchorX,g.anchorY],m.offset[0],m.offset[1],[transform.fx,transform.fy],resolved?.recipe,null,corr);}else SF.Directions.draw(ctx,f,[g.anchorX,g.anchorY],transform.x+g.anchorX*transform.fx,transform.y+g.anchorY*transform.fy,[transform.fx,transform.fy],resolved?.recipe,null,corr);ctx.restore();}
    else if(f?.proxy)ctx.drawImage(f.proxy,transform.x,transform.y,f.width*transform.fx,f.height*transform.fy);
    const ax=transform.x+g.anchorX*transform.fx,ay=transform.y+g.anchorY*transform.fy;
    ctx.strokeStyle='#390c06';ctx.lineWidth=4;ctx.beginPath();ctx.arc(ax,ay,9,0,Math.PI*2);ctx.moveTo(ax-16,ay);ctx.lineTo(ax+16,ay);ctx.moveTo(ax,ay-16);ctx.lineTo(ax,ay+16);ctx.stroke();
    ctx.strokeStyle='#e7bc72';ctx.lineWidth=2;ctx.stroke();
  }
  function drawEncounter(p,index,v,w,h){const model=v.model,s=p.settings,unit=Math.min(w/780,h/520)*s.zoomPercent/100,ox=w*.5,oy=h*.57;sceneGeometry={unit,ox,oy};
    ctx.fillStyle='#211912';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#4f2b1b66';ctx.lineWidth=1;
    const point=a=>({x:ox+a.x*unit,y:oy+a.z*unit*.6});
    for(let x=-340;x<=340;x+=40){const a=point({x,z:-210}),b=point({x,z:210});ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let z=-210;z<=210;z+=40){const a=point({x:-340,z}),b=point({x:340,z});ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    const corner=point({x:-340,z:-210});ctx.strokeStyle='#8c5739';ctx.strokeRect(corner.x,corner.y,680*unit,420*unit*.6);
    ctx.fillStyle='#d6b79f';ctx.font='11px monospace';ctx.fillText('ENCOUNTER · BROWSER PREVIEW',16,24);ctx.fillStyle='#a98a73';ctx.fillText('WASD / ARROWS · MOVE     ATTACK · BUTTON',16,h-18);
    const a=point(model.actor),player=point(model.player),enemy=point(model.enemy);
    ctx.fillStyle='#e7bc72';ctx.beginPath();ctx.arc(player.x,player.y,9*unit,0,Math.PI*2);ctx.fill();ctx.font='10px monospace';ctx.fillText(`PLAYER ${model.player.hp}`,player.x-28,player.y+22);
    if(model.enemy.active){ctx.fillStyle='#8f1b15';ctx.fillRect(enemy.x-20*unit,enemy.y-38*unit,40*unit,38*unit);ctx.strokeStyle='#ef6c58';ctx.strokeRect(enemy.x-20*unit,enemy.y-38*unit,40*unit,38*unit);ctx.fillStyle='#f1a28b';ctx.fillText(`ENEMY ${model.enemy.hp}`,enemy.x-28,enemy.y+17);}
    if(model.state!=='stored'){const r=SF.Directions.encounter(p,v.clipId,v.direction,model.facing,v.cameraOrbit??p.preview?.orbitDegrees??0),f=r.frames[index]||r.frames[0],small=['defeated','defeat_transition'].includes(model.state),scale=small?.2:model.state==='repack'?Math.max(.1,1-model.stateAge*2):1;
      const m=SF.Placement.metrics(p,v.clipId,unit,scale),g=m.profile,bounce=small?Math.abs(Math.sin(model.stateAge*7))*12*unit:0;
      ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(a.x,a.y,22*unit*scale,7*unit*scale,0,0,Math.PI*2);ctx.fill();
      if(f){ctx.save();ctx.translate(a.x,a.y-bounce);if(small)ctx.rotate(Math.sin(model.stateAge*3)*.25);SF.Directions.draw(ctx,f,[g.anchorX,g.anchorY],m.offset[0],m.offset[1],m.factors,r.recipe,null,SF.Studio?.renderCorrection?.(v.clipId,index,r.direction,m.factors)||SF.Corrections?.render(p,v.clipId,index,r.direction,m.factors,p.preview?.correctionView==='original'));ctx.restore();}
      ctx.fillStyle='#dfc1a6';ctx.font='10px monospace';ctx.fillText(SF.Simulator.labels[model.state],a.x-38,a.y+23);
    }else{ctx.fillStyle='#e7bc72';ctx.font='14px monospace';ctx.fillText('INVENTORY · 1 ITEM',w/2-80,h*.32);ctx.fillStyle='#b99d88';ctx.font='11px monospace';ctx.fillText('Click the ground to deploy',w/2-86,h*.32+24);}
    lastTransform=null;
  }
  const point=e=>{const b=canvas.getBoundingClientRect();return {x:e.clientX-b.left,y:e.clientY-b.top};};
  function begin(e,s){if(!lastTransform)return false;const p=point(e),t=lastTransform;
    if(Math.hypot(p.x-(t.x+t.anchor[0]*t.fx),p.y-(t.y+t.anchor[1]*t.fy))>25)return false;
    dragTransform={...t};canvas.setPointerCapture(e.pointerId);return true;}
  function move(e,project){if(!dragTransform)return null;const p=point(e),t=dragTransform;
    return {anchorX:Math.max(0,Math.min(t.canvas[0],(p.x-t.x)/t.fx)),anchorY:Math.max(0,Math.min(t.canvas[1],(p.y-t.y)/t.fy))};}
  function end(){dragTransform=null;}
  return {init,draw,begin,move,end,get transform(){return lastTransform;},get referenceGeometry(){return referenceGeometry;},get sceneGeometry(){return sceneGeometry;},get correctionGeometry(){return correctionGeometry;}};
})();
