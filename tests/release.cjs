const Test=require('./config.cjs');
// Packaging is separate from mandatory source/bundle checks and never rebuilds artifacts.
require('./bundle.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),JSZip=require('../vendor/jszip.min.js');
(async()=>{const html=fs.readFileSync(Test.projectPath('SpriteForge.html')),trial=fs.readFileSync(Test.projectPath('SpriteForge-Trial.zip')),zip=await JSZip.loadAsync(trial,{checkCRC32:true});
assert.deepEqual(await zip.file('SpriteForge-Trial/SpriteForge.html').async('nodebuffer'),html,'ZIP HTML differs from maintained bundle');
assert.deepEqual(fs.readFileSync(Test.projectPath('SpriteForge-Trial/SpriteForge.html')),html,'loose Trial HTML differs from maintained bundle');
for(const [source,target] of [['TRIAL-README.txt','README.txt'],['FEATURE-GUIDE.md','FEATURE-GUIDE.md'],['ALPHA-HANDOFF.md','ALPHA-HANDOFF.md'],['LICENSE','LICENSE'],['vendor/JSZip-LICENSE.md','JSZip-LICENSE.md'],...['README.md','OFL.txt','ShareTechMono-OFL.txt'].map(name=>['assets/fonts/'+name,'fonts/'+name])]){
 const bytes=fs.readFileSync(Test.projectPath(source));assert.deepEqual(await zip.file('SpriteForge-Trial/'+target).async('nodebuffer'),bytes,'packaged document/license differs: '+source);
 assert.deepEqual(fs.readFileSync(Test.projectPath('SpriteForge-Trial',target)),bytes,'loose packaged document/license differs: '+source);
}
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');fs.writeFileSync(Test.outputPath('release-integrity.json'),JSON.stringify({method:'static bundle and package only',htmlSha256:hash(html),trialZipSha256:hash(trial),packagedHtmlMatches:true,packagedDocsMatch:true,fontLicensesMatch:true,browserAcceptance:false,humanListening:false},null,2)+'\n');console.log('PASS packaged HTML, current documentation and font licenses match');
})().catch(e=>{console.error(e);process.exitCode=1;});
