SF.Directions = (() => {
  const order=['S','SE','E','NE','N','NW','W','SW'];
  const labels={S:'Front',SE:'Front right',E:'Right',NE:'Rear right',N:'Rear',NW:'Rear left',W:'Left',SW:'Front left'};
  function fromAngle(angle){return order[((Math.round(angle/45)%8)+8)%8];}
  function recipe(s,dir){const i=order.indexOf(dir),side=s.generatedSideWidthPercent/100,width=[1,(1+side)/2,side,(1+side)/2,1,(1+side)/2,side,(1+side)/2][i];
    return {name:'stylised_view_v1',widthFactor:width,mirror:s.mirrorDirections&&i>=5,rearDarknessPercent:i===4?s.rearDarknessPercent:(i===3||i===5?s.rearDarknessPercent*.55:0)};}
  function resolve(p,clipId,dir){const clip=SF.Clips.get(p,clipId),s=p.settings;
    if(s.directionMode==='billboard'||dir==='S')return {frames:clip.frames,kind:'imported',direction:'S',recipe:null};
    if(clip.directions?.[dir]?.kind==='imported')return {...clip.directions[dir],direction:dir,recipe:null};
    if(s.directionMode==='generated')return {frames:clip.frames,kind:'generated',direction:dir,recipe:recipe(s,dir)};
    return {frames:clip.frames,kind:'fallback',direction:'S',recipe:null};}
  // Side-facing sources are mirrored at runtime about their authored feet/root.
  const sourceFacing=(p,id)=>p.clipFacing?.[id]||'views';
  function validateFacing(p){if(!p.clipFacing||typeof p.clipFacing!=='object'||Array.isArray(p.clipFacing))throw Error('Invalid source facing settings.');for(const [id,value] of Object.entries(p.clipFacing))if(!SF.Clips.ids(p).includes(id)||!['views','left','right'].includes(value))throw Error('Invalid clip source facing.');}
  function encounter(p,id,dir,facing,orbit=0){const source=sourceFacing(p,id);if(source==='views')return resolve(p,id,dir);
    const side=Math.sin((facing-orbit)*Math.PI/180),right=Math.abs(side)<1e-8?source==='right':side>0;
    return {frames:SF.Clips.get(p,id).frames,kind:'imported',direction:'S',recipe:{widthFactor:1,mirror:right!==(source==='right'),rearDarknessPercent:0}};
  }
  const darkCache=new WeakMap();
  function draw(ctx,frame,anchor,x,y,factor,recipe=null,source=null,correction=null){let image=source||frame.proxy;if(!image)return;
    if(recipe?.rearDarknessPercent){
      const cache=darkCache.get(frame),dark=recipe.rearDarknessPercent;
      if(!source&&cache?.source===image&&cache.dark===dark)image=cache.image;
      else{const layer=document.createElement('canvas');layer.width=image.width;layer.height=image.height;const paint=layer.getContext('2d');paint.drawImage(image,0,0);paint.globalCompositeOperation='source-atop';paint.fillStyle=`rgba(5,5,7,${dark/100})`;paint.fillRect(0,0,layer.width,layer.height);if(!source)darkCache.set(frame,{source:image,dark,image:layer});image=layer;}
    }
    const factors=typeof factor==='number'?[factor,factor]:factor;ctx.save();ctx.translate(x,y);if(correction?.clip){const b=correction.clip;ctx.beginPath();ctx.rect(b.left,b.top,b.width,b.height);ctx.clip();}ctx.scale(factors[0]*(recipe?.widthFactor??1)*(recipe?.mirror?-1:1),factors[1]);
    if(correction){ctx.translate(-anchor[0],-anchor[1]);ctx.transform(correction.scale,0,0,correction.scale,correction.x,correction.y);ctx.drawImage(image,0,0,frame.width,frame.height);}else ctx.drawImage(image,-anchor[0],-anchor[1],frame.width,frame.height);
    ctx.restore();}
  async function prepared(frame,canvas,anchor,recipe,placement=null,correction=null){if(!recipe&&!placement&&!correction)return SF.Media.normalized(frame,canvas);
    if(!recipe&&(!correction||correction.scale===1&&correction.x===0&&correction.y===0)&&placement&&placement.shape.every(v=>v===1)&&placement.anchor.every((v,i)=>v===anchor[i]))return SF.Media.normalized(frame,canvas);
    const c=document.createElement('canvas');[c.width,c.height]=canvas;const ctx=c.getContext('2d'),bitmap=await SF.Media.bitmap(frame.blob);
    try{draw(ctx,frame,anchor,placement?.anchor[0]??anchor[0],placement?.anchor[1]??anchor[1],placement?.shape??1,recipe,bitmap,correction);return await new Promise((r,j)=>c.toBlob(b=>b?r(b):j(Error('Direction PNG encoding failed.')),'image/png'));}finally{bitmap.close?.();c.width=c.height=1;}}
  function contactSheet(p,clipId,index,original=p.preview?.correctionView==='original'){const c=document.createElement('canvas');c.width=960;c.height=560;const ctx=c.getContext('2d');
    ctx.fillStyle='#1a130d';ctx.fillRect(0,0,c.width,c.height);
    order.forEach((dir,i)=>{const x=i%4*240,y=Math.floor(i/4)*280,view=resolve(p,clipId,dir),f=view.frames[index]||view.frames[0],g=SF.Placement.metrics(p,clipId),unit=190/Math.max(p.settings.referenceCanvasHeightUnits,g.heightUnits,g.widthUnits),m=SF.Placement.metrics(p,clipId,unit);
      ctx.strokeStyle='#4f2b1b';ctx.strokeRect(x+8,y+8,224,264);ctx.fillStyle='#e7bc72';ctx.font='14px monospace';ctx.fillText(`${dir} · ${labels[dir]}`,x+18,y+32);ctx.fillStyle='#b4a092';ctx.font='11px monospace';ctx.fillText(view.kind==='generated'?'Generated approximation':view.kind==='fallback'?'Front fallback':p.settings.directionMode==='billboard'?'Front billboard':'Imported',x+18,y+52);
      if(f)draw(ctx,f,[g.profile.anchorX,g.profile.anchorY],x+120+m.offset[0],y+244+m.offset[1],m.factors,view.recipe,null,SF.Corrections?.render(p,clipId,index,dir,m.factors,original));
    });return c;}
  return {order,labels,fromAngle,recipe,resolve,draw,prepared,contactSheet,sourceFacing,validateFacing,encounter};
})();
