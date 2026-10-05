import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
// Source CSS uses local font files; the distributed HTML embeds their exact bytes.
const fonts=read('src/fonts.css').replace(/url\(\.\.\/(assets\/fonts\/[^()]+)\)/g,(_,file)=>{
  const type=file.endsWith('.ttf')?'ttf':'woff';
  return `url(data:font/${type};base64,${fs.readFileSync(path.join(root,file)).toString('base64')})`;
});
const modules=['timeline','store','banks','media','clips','placement','corrections','directions','audio','simulator','playback','renderer','pack','app','studio','keyer','action-controls'];
const app=modules.map(name=>`\n/* MODULE: ${name} */\n${read('src/'+name+'.js')}`).join('\n');
const referenceAsset=fs.readFileSync(path.join(root,'assets/sunny-smiles-reference.png')).toString('base64');
const assets=`globalThis.SF=globalThis.SF||{};SF.Assets={sunny:'data:image/png;base64,${referenceAsset}'};`;
const escapeScript=s=>s.replace(/<\/script/gi,'<\\/script');
const html=read('src/index.html').replace('/*STYLE*/',()=>fonts+read('src/style.css')+'\n'+read('src/theme.css')).replace('/*VENDOR*/',()=>escapeScript(read('vendor/jszip.min.js'))).replace('/*APP*/',()=>escapeScript(assets+'\n'+app));
fs.writeFileSync(path.join(root,'SpriteForge.html'),html);
console.log(`Built SpriteForge.html: ${Buffer.byteLength(html).toLocaleString()} bytes; ${modules.length} source modules; no runtime imports.`);
