// Source-space roots and physical sizing. Preview zoom never enters these recipes.
SF.Placement = (() => {
  const keys=['anchorX','anchorY','scalePercent','referenceCanvasHeightUnits','widthPercent','heightPercent','shapeLinked','offsetXUnits','offsetYUnits'];
  const added={widthPercent:100,heightPercent:100,shapeLinked:true,offsetXUnits:0,offsetYUnits:0};
  function initialize(p){p.placements??={};p.placementVersion=1;for(const [k,v] of Object.entries(added))if(p.settings[k]===undefined)p.settings[k]=v;return p;}
  function resolve(p,id=p.settings.clipId){initialize(p);const canvas=SF.Clips.canvas(p,id),main=p.settings,own=Object.hasOwn(p.placements,id)?p.placements[id]:null;
    if(id!==main.clipId&&own&&!own.inherit)return {...own,canvas:[...canvas],inherited:false};
    const profile=Object.fromEntries(keys.map(k=>[k,main[k]]));
    if(id!==main.clipId){profile.anchorX*=canvas[0]/(p.canvas[0]||1);profile.anchorY*=canvas[1]/(p.canvas[1]||1);}
    return {...profile,canvas:[...canvas],inherited:id!==main.clipId};
  }
  function validateProfile(g,canvas){for(const [k,min,max] of [['anchorX',0,canvas[0]],['anchorY',0,canvas[1]],['scalePercent',1,200],['referenceCanvasHeightUnits',1,4096],['widthPercent',1,400],['heightPercent',1,400],['offsetXUnits',-4096,4096],['offsetYUnits',-4096,4096]])if(!Number.isFinite(g[k])||g[k]<min||g[k]>max)throw Error(`Invalid ${k}: expected ${min}–${max}.`);
    if(typeof g.shapeLinked!=='boolean'||g.shapeLinked&&g.widthPercent!==g.heightPercent)throw Error('Linked width and height must match.');}
  function validate(p){initialize(p);for(const [id,g] of Object.entries(p.placements)){if(!Object.hasOwn(p.extraClips||{},id)||!g||typeof g.inherit!=='boolean')throw Error('Invalid clip placement profile.');if(!g.inherit)validateProfile(g,SF.Clips.canvas(p,id));}
    for(const id of SF.Clips.ids(p)){const c=SF.Clips.canvas(p,id);if(!Array.isArray(c)||c.length!==2||c.some(v=>!Number.isInteger(v)||v<1||v>8192))throw Error('Clip canvas must be 1–8192 px on each axis.');validateProfile(resolve(p,id),c);for(const f of [ ...SF.Clips.get(p,id).frames,...Object.values(SF.Clips.get(p,id).directions||{}).flatMap(v=>v.frames||[])])if(f.width>c[0]||f.height>c[1])throw Error('A frame exceeds its clip canvas.');}return p;}
  function set(p,id,patch){initialize(p);const previous=resolve(p,id),g={...Object.fromEntries(keys.map(k=>[k,previous[k]])),...patch};if(g.shapeLinked){if('widthPercent' in patch)g.heightPercent=g.widthPercent;else if('heightPercent' in patch)g.widthPercent=g.heightPercent;else g.heightPercent=g.widthPercent;}
    if(id===p.settings.clipId){validateProfile(g,p.canvas);Object.assign(p.settings,Object.fromEntries(keys.map(k=>[k,g[k]])));}
    else if(patch.inherit===true)p.placements[id]={inherit:true};else{validateProfile(g,SF.Clips.canvas(p,id));p.placements[id]={...Object.fromEntries(keys.map(k=>[k,g[k]])),inherit:false};}
  }
  function defaults(p,id){const c=SF.Clips.canvas(p,id),bounds=SF.Clips.get(p,id).frames.map(f=>f.bounds).filter(Boolean);return {anchorX:bounds.length?(Math.min(...bounds.map(b=>b[0]))+Math.max(...bounds.map(b=>b[2]))+1)/2:c[0]/2,anchorY:bounds.length?Math.max(...bounds.map(b=>b[3]))+1:c[1],scalePercent:100,referenceCanvasHeightUnits:128,...added};}
  function metrics(p,id,unit=1,multiplier=1){const g=resolve(p,id),u=g.referenceCanvasHeightUnits/g.canvas[1]*g.scalePercent/100;return {profile:g,unitsPerPixel:u,factors:[u*g.widthPercent/100*unit*multiplier,u*g.heightPercent/100*unit*multiplier],offset:[g.offsetXUnits*unit*multiplier,-g.offsetYUnits*unit*multiplier],heightUnits:g.referenceCanvasHeightUnits*g.scalePercent/100*g.heightPercent/100,widthUnits:g.canvas[0]*u*g.widthPercent/100};}
  function output(p,id,recipes=[null],strict=true){const g=resolve(p,id),sx=g.widthPercent/100,sy=g.heightPercent/100;let left=0,right=0,top=-g.anchorY*sy,bottom=(g.canvas[1]-g.anchorY)*sy;
    for(const r of recipes){const fx=sx*(r?.widthFactor??1)*(r?.mirror?-1:1),a=-g.anchorX*fx,b=(g.canvas[0]-g.anchorX)*fx;left=Math.min(left,a,b);right=Math.max(right,a,b);}
    const canvas=[Math.max(1,Math.ceil(right-left)),Math.max(1,Math.ceil(bottom-top))],anchor=[-left,-top];
    if(strict&&canvas.some(n=>n>8192))throw Error(`${id}: transformed output is ${canvas.join(' × ')} px (limit 8192). Reduce shape, center the root, or use fewer directions.`);
    return {canvas,anchor,sourceCanvas:[...g.canvas],sourceAnchor:[g.anchorX,g.anchorY],shape:[sx,sy],unitsPerOutputPixel:metrics(p,id).unitsPerPixel,offsetUnits:[g.offsetXUnits,g.offsetYUnits],scaleBakedIntoPixels:false,shapeBakedIntoPixels:true};}
  return {keys,initialize,resolve,validateProfile,validate,set,defaults,metrics,output};
})();
