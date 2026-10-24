import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {startNextRuntime} from '../next-runtime/server.mjs';
import {startBrowser} from '../next-runtime/cdp.mjs';
export async function runPublicOnlyBrowser(){
 const root=process.cwd(),artifacts=process.env.PUBLIC_ONLY_ARTIFACTS||'/tmp/calcumint-public-only';await mkdir(artifacts,{recursive:true});
 const identities=[{calculator_key:'core.percentage-of-value',slug:'percentage-of-value-calculator',version:1},{calculator_key:'core.unit-conversion',slug:'unit-conversion-calculator',version:1}];
 let manifest=identities,unavailable=false;const requests=[],report={runtime:'Actual Next dev webpack; loopback manifest only; no database',checks:[],limitations:['No production publication or provider evidence','Development runtime; deployed HTTPS/performance and physical devices unverified']};
 const fixture=createServer((req,res)=>{requests.push({method:req.method,path:req.url});if(req.method!=='POST'||req.url!=='/rest/v1/rpc/list_published_calculator_manifest'){res.writeHead(500);res.end('Unexpected provider operation');return;}res.writeHead(unavailable?503:200,{'content-type':'application/json'});res.end(JSON.stringify(unavailable?{message:'unavailable'}:manifest));});
 await new Promise(resolve=>fixture.listen(0,'127.0.0.1',resolve));const auth={url:`http://127.0.0.1:${fixture.address().port}`};
 let app,browser;
 const check=async(name,run)=>{await run();report.checks.push(name);console.log('PASS '+name);};
 try{
  for(const mode of ['public-only','invalid']){
   app=await startNextRuntime({root,auth,db:{anonKey:'synthetic-anonymous',serviceKey:'synthetic-unused'},artifacts,productMode:mode});
   browser=await startBrowser(app.url);
   await browser.identity({name:'sb-127-auth-token',value:'synthetic-stale-session'});
   for(const width of [320,1280]){
    await browser.send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width===320});
    await check(`${mode} anonymous discovery ${width}`,async()=>{await browser.visit('/');assert(!(await browser.js('document.documentElement.scrollWidth>innerWidth+1')));assert.equal(await browser.js(`[...document.querySelectorAll('a')].some(a=>['/login','/pricing','/ai','/business'].some(prefix=>(a.getAttribute('href')||'').startsWith(prefix)))`),false);});
    if(mode==='public-only')for(const [category,slug,expected]of [['math',identities[0].slug,'50'],['unit-conversions',identities[1].slug,'1.61 km']])await check(`${slug} keyboard and hydration ${width}`,async()=>{
     await browser.visit(`/calculators/${category}/${slug}`);await browser.until(`!!document.querySelector('.calculator-ui [role=status] strong')`);
     assert.equal(await browser.js(`document.querySelector('.calculator-ui [role=status] strong').textContent`),expected);
     assert.equal(await browser.js(`[...document.querySelectorAll('button,a')].some(e=>/Export (CSV|JSON|PDF)|Save calculation|Explain this result with AI|Upgrade to Pro/.test(e.textContent))`),false);
     await browser.field('.calculator-ui input','1.79e308');await browser.until(`!!document.querySelector('.calculator-ui [role=alert]')`);
     await browser.field('.calculator-ui input','2');await browser.until(`document.querySelector('.calculator-ui [role=status] strong').textContent===${JSON.stringify(category==='math'?'5':'3.22 km')}`);
     await browser.js(`document.querySelector('.calculator-ui input').focus()`);await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});assert(await browser.js(`document.activeElement.tagName!=='BODY'`));
     assert(!(await browser.js('document.documentElement.scrollWidth>innerWidth+1')));
    });
   }
   await check(`${mode} excluded pages and APIs`,async()=>{
    for(const url of ['/login','/login/forgot','/login/reset','/account','/business','/admin','/pricing','/ai','/embed/known','/share/known']){const r=await fetch(app.url+url);const html=await r.text();assert.equal(r.status,200,url);assert(html.includes('Feature unavailable in this release'),url);assert(/noindex/.test(html),url);}
    for(const url of ['/api/billing/checkout','/api/billing/webhook','/api/ai/explain','/api/v1/batch','/api/embed/known/leads','/api/internal/webhooks/process','/api/internal/admin/publish']){const r=await fetch(app.url+url,{method:'POST',headers:{authorization:'Bearer synthetic'},body:'invalid-json'});assert.equal(r.status,503,url);}
    for(const url of ['/auth/callback?code=synthetic','/api/internal/readiness'])assert.equal((await fetch(app.url+url)).status,503,url);
    assert.equal((await fetch(app.url+'/calculators/finance/loan-emi-calculator')).status,404);
   });
   if(mode==='public-only'){
    await check('manifest identity mismatch, corruption, empty and unavailable fail closed',async()=>{
     for(const value of [[],[{...identities[0],version:2}], [...identities,null]]){manifest=value;assert.equal((await fetch(app.url+'/calculators/math/'+identities[0].slug)).status,404);}
     unavailable=true;const html=await(await fetch(app.url+'/calculators')).text();assert(html.includes('Calculator availability is temporarily unavailable'));assert.equal((await fetch(app.url+'/calculators/math/'+identities[0].slug)).status,404);unavailable=false;manifest=identities;
    });
    await check('sitemap includes only exact two calculator identities',async()=>{const xml=await(await fetch(app.url+'/sitemap.xml')).text();assert(xml.includes(identities[0].slug)&&xml.includes(identities[1].slug));assert(!xml.includes('/pricing')&&!xml.includes('/business-platform')&&!xml.includes('loan-emi'));});
    // Read the compiled action registry and send the actual native action protocol.
    await check('native Server Action request remains denied',async()=>{
     const manifests=(await readdir(path.join(app.dir,'.next'),{recursive:true})).filter(file=>file.endsWith('/server-reference-manifest.json'));
     assert(manifests.length,'compiled action registry must exist');
     const registry=JSON.parse(await readFile(path.join(app.dir,'.next',manifests[0]),'utf8'));
     const entries=Object.entries(registry.node||{});const action=entries.find(([,entry])=>Object.keys(entry.workers||{}).some(key=>key.includes('login')));
     assert(action,'login action must be compiled');const r=await fetch(app.url+'/login',{method:'POST',headers:{'Next-Action':action[0],'Content-Type':'text/plain;charset=UTF-8',Origin:app.url},body:'[null,null]'});assert(r.status>=400);assert(!(await r.text()).includes('Unexpected provider operation'));
    });
   }else assert.equal((await fetch(app.url+'/calculators/math/'+identities[0].slug)).status,404);
   assert.equal(browser.network.filter(r=>!r.allowed).length,0);assert.equal(browser.errors.length,0,JSON.stringify(browser.errors));
   await browser.close();browser=null;await app.close();app=null;
  }
  assert(requests.length>0);assert(requests.every(r=>r.method==='POST'&&r.path==='/rest/v1/rpc/list_published_calculator_manifest'),JSON.stringify(requests));
  report.requests=requests.length;report.passed=true;
 }catch(error){report.passed=false;report.error=error.stack;throw error;}
 finally{await browser?.close();await app?.close();await new Promise(resolve=>fixture.close(resolve));await writeFile(path.join(artifacts,'summary.json'),JSON.stringify(report,null,2));}
 return report;
}
