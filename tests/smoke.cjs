const Test=require('./config.cjs'),assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=Test.dependency('playwright');
(async()=>{const browser=await chromium.launch(Test.browserOptions());try{
 const context=await browser.newContext({offline:true,viewport:{width:1440,height:1050}}),page=await context.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));context.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 await page.goto(Test.htmlUrl);if(await page.locator('#kits-menu').count())await page.click('#kits-menu > summary');await page.click('#demo');await page.waitForSelector('#import-dialog[open]');await page.click('#accept');
 assert.ok(await page.evaluate(()=>SF.Store.project.frames.length>0),'demo imports frames');
 await page.screenshot({path:Test.outputPath('demo-initial.png'),fullPage:true});
 await page.click('#play');await page.waitForTimeout(150);await page.click('#play');
 assert.ok(await page.evaluate(()=>SF.App.frame()>=0&&SF.App.frame()<SF.Store.project.frames.length),'transport stays inside frame range');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 const report={browser:await browser.version(),offline:true,errors,remoteRequests:requests,checks:['startup','demo import review/accept','transport','no page errors or remote requests'],fullAcceptance:false,humanListening:false};
 fs.writeFileSync(Test.outputPath('browser-smoke.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS offline browser smoke '+report.browser);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
