SF.Media = (() => {
  const tick = () => new Promise(r => setTimeout(r, 0));
  const numericIndex = name => { const m = name.replace(/\.[^.]+$/, '').match(/(\d+)(?!.*\d)/); return m ? Number(m[1]) : null; };
  const order = files => [...files].sort((a,b) => a.name.localeCompare(b.name, 'en', { numeric:true, sensitivity:'base' }) || a.name.localeCompare(b.name));
  async function hash(blob) {
    if (!globalThis.crypto?.subtle) throw Error('This browser cannot calculate media checksums. Try Chrome, Edge, Firefox or Safari with this local HTML file.');
    const bytes = blob instanceof Blob ? await blob.arrayBuffer() : blob;
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  async function bitmap(blob) {
    if (globalThis.createImageBitmap) {try{return await createImageBitmap(blob);}catch{}}
    const url = URL.createObjectURL(blob), img = new Image();
    try { img.src = url; await img.decode(); return img; } finally { URL.revokeObjectURL(url); }
  }
  const sizeCheck=(w,h,name)=>{if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>8192||h>8192)throw Error(`${name}: each image side must be 1–8192 pixels.`);};
  const png=c=>new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('PNG encoding failed.')),'image/png'));
  function format(data,file){
    const str=(a,n)=>String.fromCharCode(...data.slice(a,a+n)),dv=new DataView(data.buffer,data.byteOffset,data.byteLength);let type='',animated=false,w=null,h=null;
    if(data.length>=24&&str(0,8)==='\x89PNG\r\n\x1a\n'){type='image/png';w=dv.getUint32(16);h=dv.getUint32(20);let o=8;while(o+12<=data.length){const n=dv.getUint32(o);if(o+n+12>data.length)throw Error(`${file.name}: truncated PNG.`);if(str(o+4,4)==='acTL')animated=true;o+=n+12;}}
    else if(/^GIF8[79]a$/.test(str(0,6))){type='image/gif';if(data.length<13)throw Error('Truncated GIF.');w=dv.getUint16(6,true);h=dv.getUint16(8,true);let o=13+(data[10]&128?3*(2**((data[10]&7)+1)):0),count=0;const skip=()=>{while(o<data.length){const n=data[o++];if(!n)return;o+=n;if(o>data.length)throw Error('Truncated GIF.');}throw Error('Truncated GIF.');};while(o<data.length){const b=data[o++];if(b===0x3b)break;if(b===0x21){o++;skip();}else if(b===0x2c){if(o+9>data.length)throw Error('Truncated GIF.');const packed=data[o+8];o+=9+(packed&128?3*(2**((packed&7)+1)):0);o++;skip();count++;}else throw Error('Invalid GIF blocks.');}animated=count>1;}
    else if(data[0]===255&&data[1]===216)type='image/jpeg';
    else if(str(0,4)==='RIFF'&&str(8,4)==='WEBP'){type='image/webp';let o=12;while(o+8<=data.length){const n=dv.getUint32(o+4,true),kind=str(o,4);if(o+8+n>data.length)throw Error('Truncated WebP.');if(kind==='ANIM'||kind==='ANMF')animated=true;o+=8+n+(n%2);}}
    else if(str(0,2)==='BM')type='image/bmp';
    else if(str(4,4)==='ftyp'&&/avif|avis/.test(str(8,32))){type='image/avif';if(/avis/.test(str(8,32)))throw Error('Animated AVIF is not supported yet. Extract a frame sequence.');}
    else if(/<svg[\s>]/i.test(new TextDecoder().decode(data.slice(0,4096)))){type='image/svg+xml';const text=new TextDecoder().decode(data);if(/<!DOCTYPE|<script|<foreignObject|<animate|<set[\s>]|\bon\w+\s*=|@import|url\s*\(\s*[^#]|(?:href|src)\s*=\s*["'](?!#|data:)/i.test(text))throw Error('Use a self-contained static SVG without scripts, animation or external resources.');}
    else if(file.type?.startsWith('image/'))type=file.type;
    else throw Error(`${file.name}: unsupported image. Convert it to PNG, JPEG, GIF, WebP, AVIF, BMP or a self-contained SVG.`);
    if(w!==null)sizeCheck(w,h,file.name);return {type,animated};
  }
  async function inspect(file, signal, proxySide) {
    const data = new Uint8Array(await file.arrayBuffer());
    const info=format(data,file);if(info.animated)throw Error('Animated media must be extracted before frame inspection.');
    const original=file.slice(0,file.size,info.type);
    let img;try{img=await bitmap(original);}catch{throw Error(`${file.name}: this browser cannot decode the image. Convert it to PNG or JPEG.`);}
    try {
      const w=img.width||img.naturalWidth,h=img.height||img.naturalHeight;sizeCheck(w,h,file.name);
      if (signal.cancelled) throw Error('Cancelled.');
      // Scan strips, so 8192² does not allocate a second full-resolution RGBA buffer.
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = Math.min(h,128);
      const ctx = canvas.getContext('2d', { willReadFrequently:true });
      let transparent = false, visible = false, x0=w,y0=h,x1=0,y1=0;
      for(let row=0;row<h;row+=128){if(signal.cancelled)throw Error('Cancelled.');const rows=Math.min(128,h-row);ctx.clearRect(0,0,w,canvas.height);ctx.drawImage(img,0,row,w,rows,0,0,w,rows);const rgba=ctx.getImageData(0,0,w,rows).data;
      for(let y=0;y<rows;y++){let first=-1,last=-1;for(let x=0;x<w;x++){
        const a=rgba[(y*w+x)*4+3];if(a<255)transparent=true;
        if(a>0){if(first<0)first=x;last=x;}}
        if(last>=0){visible=true;x0=Math.min(x0,first);x1=Math.max(x1,last);y0=Math.min(y0,y+row);y1=y+row;}
      }if(h>1024)await tick();}canvas.width=canvas.height=1;
      const ratio = Math.min(1,proxySide/Math.max(w,h));
      const proxyCanvas = document.createElement('canvas'); proxyCanvas.width=Math.max(1,Math.round(w*ratio)); proxyCanvas.height=Math.max(1,Math.round(h*ratio));
      proxyCanvas.getContext('2d').drawImage(img,0,0,proxyCanvas.width,proxyCanvas.height);
      const thumb = document.createElement('canvas'); thumb.width=72;thumb.height=72;
      const fit=68/Math.max(w,h);thumb.getContext('2d').drawImage(img,(72-w*fit)/2,(72-h*fit)/2,w*fit,h*fit);
      return { name:file.name, blob:original, width:w,height:h, transparent, empty:!visible,
        bounds:visible?[x0,y0,x1,y1]:null, sha256:await hash(data.buffer), proxy:proxyCanvas, thumbnail:thumb.toDataURL('image/png'), index:numericIndex(file.name) };
    } finally { img.close?.(); }
  }
  async function extract(file,signal,progress){const bytes=new Uint8Array(await file.arrayBuffer()),info=format(bytes,file);if(!info.animated)return null;
    if(!globalThis.ImageDecoder||!await ImageDecoder.isTypeSupported(info.type))throw Error(`${file.name}: animated extraction is unavailable in this browser. Extract PNG frames first, or use a browser with ImageDecoder support.`);
    const decoder=new ImageDecoder({data:bytes,type:info.type,preferAnimation:true}),origin={blob:file,name:file.name,sha256:await hash(bytes.buffer),type:info.type},files=[];
    try{await decoder.tracks.ready;await decoder.completed;const count=decoder.tracks.selectedTrack?.frameCount;if(!count||count>2000)throw Error('Animated image must contain 1–2,000 frames.');let total=0;
      for(let i=0;i<count;i++){if(signal.cancelled)throw Error('Cancelled.');progress(`Extracting ${file.name}: ${i+1} / ${count}`);const {image}=await decoder.decode({frameIndex:i,completeFramesOnly:true});let c;
        try{sizeCheck(image.displayWidth,image.displayHeight,file.name);c=document.createElement('canvas');c.width=image.displayWidth;c.height=image.displayHeight;c.getContext('2d').drawImage(image,0,0);const blob=await png(c);total+=blob.size;if(total>512*1024*1024)throw Error('Extracted animation exceeds 512 MB.');const f=new File([blob],`${file.name}_frame_${String(i).padStart(4,'0')}.png`,{type:'image/png'});f.origin=origin;f.sourceFrameIndex=i;f.sourceDurationUs=image.duration??0;files.push(f);}finally{image.close();if(c)c.width=c.height=1;}await tick();}
      return files;
    }finally{decoder.close();}
  }
  function validateNames(files,strictNumeric=true) {
    const names=new Set(), indices=new Map(), issues=[];
    for(const f of files) {
      const key=f.name.toLowerCase(); if(names.has(key)) throw Error(`Duplicate or case-only filename: ${f.name}. Rename it before importing.`); names.add(key);
      const i=numericIndex(f.name);
      if(i!==null) { if(strictNumeric&&indices.has(i)) throw Error(`Duplicate frame index ${i}: ${indices.get(i)} and ${f.name}. Rename them to distinct numbers.`); indices.set(i,f.name); }
    }
    const ids=[...indices.keys()].sort((a,b)=>a-b), gaps=[];
    for(let i=1;i<ids.length;i++) if(ids[i]-ids[i-1]>1) gaps.push(`${ids[i-1]} → ${ids[i]}`);
    if(gaps.length) issues.push(`Missing frame numbers (${gaps.slice(0,12).join(', ')}). No blank frames will be inserted.`);
    if(indices.size<files.length) issues.push('Some names have no number; natural filename order is used. Order will be saved explicitly.');
    return issues;
  }
  async function importFiles(input, signal, progress, preserveOrder=false) {
    let files=preserveOrder?[...input]:order(input);
    if(!files.length) throw Error('Select one or more image files.');
    if(files.length>2000) throw Error('This build accepts at most 2,000 frames per clip.');
    if(files.reduce((n,f)=>n+f.size,0)>512*1024*1024) throw Error('This build accepts up to 512 MB of compressed media.');
    const issues=validateNames(files,!preserveOrder), frames=[];
    if(!preserveOrder){const expanded=[];let total=files.reduce((n,f)=>n+f.size,0);for(const file of files){if(signal.cancelled)throw Error('Cancelled.');const sequence=await extract(file,signal,progress);if(sequence){total+=sequence.reduce((n,f)=>n+f.size,0);issues.push(`${file.name}: extracted ${sequence.length} frames with alpha preserved. Original delays are recorded; playback uses your chosen Source FPS (variable delays are not reproduced automatically).`);}expanded.push(...(sequence||[file]));if(expanded.length>2000||total>512*1024*1024)throw Error('Expanded images exceed the 2,000 frame / 512 MB limit.');}files=expanded;}
    // Bound the entire proxy cache to about 16 million pixels (64 MB RGBA).
    const proxySide=Math.min(360,Math.max(64,Math.floor(Math.sqrt(16000000/files.length))));
    try {
      for(let i=0;i<files.length;i++) { if(signal.cancelled) throw Error('Cancelled.');
        progress(`Validating ${i+1} / ${files.length}: ${files[i].name}`);
        const f=await inspect(files[i],signal,proxySide);if(files[i].origin)Object.assign(f,{origin:files[i].origin,sourceFrameIndex:files[i].sourceFrameIndex,sourceDurationUs:files[i].sourceDurationUs});frames.push(f); await tick(); }
      if(frames.every(f=>f.empty)) throw Error('Every frame is fully transparent. Import at least one visible pose.');
      const opaque=frames.filter(f=>!f.transparent); if(opaque.length) issues.push(`${opaque.length} frame(s) have no transparent pixels. Their backgrounds will remain visible.`);
      const empty=frames.filter(f=>f.empty); if(empty.length) issues.push(`${empty.length} fully transparent frame(s) will be preserved as intentional pauses.`);
      const canvas=[Math.max(...frames.map(f=>f.width)),Math.max(...frames.map(f=>f.height))];
      const mixed=frames.some(f=>f.width!==canvas[0]||f.height!==canvas[1]);
      if(mixed) issues.push('Different dimensions: smaller images need transparent padding at the right and bottom. Images are never stretched.');
      const bounds=frames.filter(f=>f.bounds).map(f=>f.bounds);
      const anchor=[(Math.min(...bounds.map(b=>b[0]))+Math.max(...bounds.map(b=>b[2]))+1)/2,Math.max(...bounds.map(b=>b[3]))+1];
      return {frames,canvas,issues,mixed,anchor};
    } catch(error) { frames.forEach(f=>f.proxy?.close?.()); throw error; }
  }
  async function normalized(frame,canvas) {
    if(frame.width===canvas[0]&&frame.height===canvas[1]&&frame.blob.type==='image/png') return frame.blob;
    const c=document.createElement('canvas');[c.width,c.height]=canvas; const img=await bitmap(frame.blob);
    try { c.getContext('2d').drawImage(img,0,0); return await png(c); }
    finally {img.close?.();c.width=c.height=1;}
  }
  return {tick,order,numericIndex,hash,bitmap,importFiles,normalized,format,sizeCheck};
})();
