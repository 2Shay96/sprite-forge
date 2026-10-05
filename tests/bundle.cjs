const Test=require('./config.cjs');
// Static bundle/package integrity; no browser is opened.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),JSZip=require('../vendor/jszip.min.js');
const read=p=>fs.readFileSync(Test.projectPath(p)),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{const html=read('SpriteForge.html'),text=html.toString(),modules=['timeline','store','banks','media','clips','placement','corrections','directions','audio','simulator','playback','renderer','pack','app','studio','keyer','action-controls'];
for(const module of modules){const source=read('src/'+module+'.js').toString();new vm.Script(source);assert.ok(text.includes(source.replace(/<\/script/gi,'<\\/script')),'bundled source: '+module);}
const scripts=[...text.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,2);for(const m of scripts)new vm.Script(m[1]);assert.ok(!/\/\*(STYLE|VENDOR|APP)\*\//.test(text));assert.ok(!/<(?:script|link)[^>]+(?:src|href)=/i.test(text));assert.match(text,/connect-src 'none'/);assert.match(text,/font-src 'none'/);
const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'unique control IDs');
console.log('PASS 17 source modules and bundle syntax, embedded source/asset policy and unique controls');
})().catch(e=>{console.error(e);process.exitCode=1;});
