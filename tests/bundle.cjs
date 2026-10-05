const Test=require('./config.cjs');
// Static bundle/package integrity; no browser is opened.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),JSZip=require('../vendor/jszip.min.js');
const read=p=>fs.readFileSync(Test.projectPath(p)),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{const html=read('SpriteForge.html'),text=html.toString(),modules=['timeline','store','banks','media','clips','placement','corrections','directions','audio','simulator','playback','renderer','pack','app','studio','keyer','action-controls'];
for(const module of modules){const source=read('src/'+module+'.js').toString();new vm.Script(source);assert.ok(text.includes(source.replace(/<\/script/gi,'<\\/script')),'bundled source: '+module);}
const scripts=[...text.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,2);for(const m of scripts)new vm.Script(m[1]);assert.ok(!/\/\*(STYLE|VENDOR|APP)\*\//.test(text));assert.ok(!/<(?:script|link)[^>]+(?:src|href)=/i.test(text));assert.match(text,/connect-src 'none'/);assert.match(text,/font-src data:/);
const reference=read('Claude outputs/SpriteForge-0.7-preview.html').toString();
const referenceScripts=[...reference.matchAll(/<script>([\s\S]*?)<\/script>/g)];
assert.equal(scripts[0][1].trim(),referenceScripts[0][1].trim(),'vendored JSZip matches supplied preview');
assert.equal(scripts[1][1].split('/* MODULE:')[0].trim(),referenceScripts[1][1].split('/* MODULE:')[0].trim(),'embedded Sunny reference matches supplied preview');
const shell=s=>s.replace(/\r\n/g,'\n').replace(/<script>[\s\S]*?<\/script>/g,'<script></script>');
assert.equal(shell(text),shell(reference),'built shell, styles and embedded font bytes match supplied 0.7');
const fontFaces=[...text.matchAll(/@font-face\{[^}]*url\(data:font\/[^,]+,([A-Za-z0-9+/=]+)\)[^}]*\}/g)];assert.equal(fontFaces.length,4,'four offline fonts');
assert.ok(!/url\(\s*["']?(?:https?:|\.\.\/assets)/i.test(text),'no remote or unembedded CSS asset URLs');
const ids=[...text.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'unique control IDs');
console.log('PASS 17 source modules and bundle syntax; exact supplied 0.7 shell/styles/fonts, offline asset policy and unique controls');
})().catch(e=>{console.error(e);process.exitCode=1;});
