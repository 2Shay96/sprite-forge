import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),require=createRequire(import.meta.url),JSZip=require('./vendor/jszip.min.js');
const folder=path.join(root,'SpriteForge-Trial'),zip=new JSZip();
const entries=[['SpriteForge.html','SpriteForge.html'],['TRIAL-README.txt','README.txt'],['FEATURE-GUIDE.md','FEATURE-GUIDE.md'],['ALPHA-HANDOFF.md','ALPHA-HANDOFF.md'],['vendor/JSZip-LICENSE.md','JSZip-LICENSE.md'],['fixtures/stereo-tone-48k.wav','stereo-tone-48k.wav'],...[1,2,3,10].map(i=>[`fixtures/numbered/frame_${i}.png`,`numbered-fixture/frame_${i}.png`])];
for(const [source,target]of entries){const bytes=fs.readFileSync(path.join(root,source)),out=path.join(folder,target);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,bytes);zip.file('SpriteForge-Trial/'+target,bytes);}
const bytes=await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE',compressionOptions:{level:6}});fs.writeFileSync(path.join(root,'SpriteForge-Trial.zip'),bytes);console.log(`Packaged offline Trial ZIP: ${bytes.length.toLocaleString()} bytes; ${entries.length} files.`);
