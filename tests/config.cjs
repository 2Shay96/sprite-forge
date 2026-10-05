// Shared test paths. No assumption about the checkout name or invoking directory.
const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const outputRoot=path.resolve(process.env.SPRITE_FORGE_TEST_OUTPUT||path.join(root,'evidence','test-runs',new Date().toISOString().replace(/[:.]/g,'-')+'-'+process.pid));
function projectPath(...parts){return path.join(root,...parts);}
function outputPath(...parts){const target=path.join(outputRoot,...parts);fs.mkdirSync(path.dirname(target),{recursive:true});return target;}
function dependency(name){if(process.env.SPRITE_FORGE_NODE_MODULES)return require(path.join(path.resolve(process.env.SPRITE_FORGE_NODE_MODULES),name));return createRequire(projectPath('package.json'))(name);}
function externalPath(variable){const value=process.env[variable];if(!value)throw Error('BLOCKED: configure '+variable+' for this external-media suite');return path.resolve(value);}
function archivePath(name){return path.join(process.env.SPRITE_FORGE_ARCHIVES?path.resolve(process.env.SPRITE_FORGE_ARCHIVES):projectPath('evidence'),name);}
function browserOptions(){return process.env.SPRITE_FORGE_BROWSER?{executablePath:path.resolve(process.env.SPRITE_FORGE_BROWSER),headless:true}:{channel:process.env.SPRITE_FORGE_BROWSER_CHANNEL||'chrome',headless:true};}
const htmlUrl=pathToFileURL(projectPath('SpriteForge.html')).href;
module.exports={root,outputRoot,projectPath,outputPath,dependency,externalPath,archivePath,browserOptions,htmlUrl};
