from pathlib import Path
import argparse
parser=argparse.ArgumentParser(description='Generate an observation-only frozen invitation diagnostic; does not modify source.')
parser.add_argument('source_root',type=Path)
parser.add_argument('output',type=Path)
parser.add_argument('--light',action='store_true')
args=parser.parse_args()
root=str(args.source_root.resolve())
# Evidence must not silently run against changed application or harness code.
import subprocess
protected=['src','public','tests/next-runtime','scripts/test-next-runtime-browser.mjs','package.json','package-lock.json','tsconfig.json','next.config.ts','postcss.config.mjs']
check=subprocess.run(['git','-C',root,'diff','--quiet','b85e845ecd11856f963c9f32af9634b8e4738293','--',*protected])
if check.returncode: parser.error('Source does not match the frozen candidate code')
extra=subprocess.check_output(['git','-C',root,'ls-files','--others','--exclude-standard','--',*protected],text=True)
if extra.strip(): parser.error('Untracked source files would invalidate frozen-source provenance')
s=(Path(root)/'scripts/test-next-runtime-browser.mjs').read_text()
s=s.replace("import {mkdir,writeFile} from 'node:fs/promises';", "import {mkdir,writeFile as rawWriteFile,readFile} from 'node:fs/promises';\nimport os from 'node:os';\nimport {performance} from 'node:perf_hooks';")
s=s.replace("from '../tests/next-runtime/", "from '"+root+"/tests/next-runtime/")
s=s.replace("const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');", "const root="+repr(root)+";")
a=s.index(' let secret,key;');b=s.index(' report.network=browser.network;',a);s=s[:a]+s[b:]
s=s.replace("const progress=message=>", """const sanitize=value=>String(value).replace(/\\/business\\/invite\\/[A-Za-z0-9_-]+/g,'/business/invite/[redacted]').replace(/([?&]invite=)[^&\\s\"'<>]+/g,'$1[redacted]').replace(/cm_test_[A-Za-z0-9_-]+/g,'[redacted-api-key]').replace(/base64-[A-Za-z0-9_-]{30,}/g,'[redacted-cookie]').replace(/eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+/g,'[redacted-jwt]');
const writeFile=(file,value,...args)=>rawWriteFile(file,typeof value==='string'?sanitize(value):value,...args);
const progress=message=>""")
s=s.replace("const report={runtime:", "const report={frozenSha:'b85e845ecd11856f963c9f32af9634b8e4738293',stressRate:Number(process.env.STRESS_RATE||4),scope:'Original frozen journey sequence through invitation; observation-only injection, no forced cookie gaps',runtime:")
s=s.replace("let db,auth,app,browser;", """let db,auth,app,browser,sampler;const events=[],resources=[];let currentJourney='setup';
const stamp=()=>Math.round(performance.now());
const record=(type,details={})=>{events.push({type,nodeMs:stamp(),journey:currentJourney,...details});if(events.length>5000)events.shift()};
const safePath=value=>{try{const u=new URL(value);return {path:sanitize(u.pathname),queryKeys:[...u.searchParams.keys()].filter(k=>k==='invite')}}catch{return {path:'non-http'}}};
const NativeWebSocket=globalThis.WebSocket;
globalThis.WebSocket=class extends NativeWebSocket{
 constructor(...args){super(...args);this.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.bindingCalled'&&m.params.name==='__stressEmit'){try{record('browser',JSON.parse(m.params.payload))}catch{}}else if(m.method==='Page.frameNavigated')record('frame-navigation',safePath(m.params.frame.url));else if(m.method==='Page.lifecycleEvent')record('lifecycle',{name:m.params.name,timestamp:m.params.timestamp});else if(m.method==='Network.responseReceived'&&m.params.type==='Document')record('document-response',{...safePath(m.params.response.url),status:m.params.response.status})})}
 send(data){const m=JSON.parse(String(data));if(['Network.clearBrowserCookies','Network.setCookie','Input.insertText','Input.dispatchMouseEvent'].includes(m.method))record('cdp-command',{method:m.method,...(m.method==='Input.insertText'?{textLength:m.params.text.length}:{})});return super.send(data)}
};
const probe=()=>{
 const emit=(event,more={})=>{try{globalThis.__stressEmit(JSON.stringify({event,browserMs:Math.round(performance.now()),timeOrigin:performance.timeOrigin,...more}))}catch{}};
 const state=()=>{const e=document.querySelector('input[name=email]');return {emailExists:!!e,emailLength:e?.value.length??null,emailValid:e?e.validity.valid:null,emailDisabled:e?.matches(':disabled')??null,emailHiddenOrInert:!!e?.closest('[hidden],[inert]'),emailFocused:!!e&&document.activeElement===e,documentFocused:document.hasFocus(),visibility:document.visibilityState,checking:!!document.querySelector('[aria-busy=true]'),unavailable:document.body?.innerText.includes('We could not verify your account')??false,sessionChanged:document.body?.innerText.includes('Account session changed')??false,hydrated:!!e&&Object.keys(e).some(k=>k.startsWith('__reactProps$'))}};
 globalThis.__stressState=state;
 let last='';const change=()=>{const current=JSON.stringify(state());if(current!==last){last=current;emit('state',JSON.parse(current))}};
 for(const type of ['pageshow','pagehide','focus','blur'])window.addEventListener(type,()=>{emit(type,state());change()});
 document.addEventListener('visibilitychange',()=>emit('visibilitychange',state()));
 for(const type of ['focusin','input','change','invalid','click','submit'])document.addEventListener(type,event=>{const e=event.target;const form=e?.closest?.('form');if(e?.matches?.('input[name=email]')||form?.querySelector('input[name=email]'))emit(type,{trusted:event.isTrusted,defaultPrevented:event.defaultPrevented,...state()})},true);
 document.addEventListener('DOMContentLoaded',()=>{new MutationObserver(change).observe(document.documentElement,{attributes:true,childList:true,subtree:true,attributeFilter:['hidden','inert','aria-busy']});change();const n=performance.getEntriesByType('navigation')[0];emit('navigation-timing',n?{requestStart:n.requestStart,responseStart:n.responseStart,responseEnd:n.responseEnd,domInteractive:n.domInteractive,domContentLoaded:n.domContentLoadedEventStart}:{});});
 try{new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.duration>=100)emit('long-task',{duration:Math.round(e.duration),start:Math.round(e.startTime)})}).observe({type:'longtask',buffered:true})}catch{}
};
async function snapshot(label){record('checkpoint',{label,state:await browser.js('globalThis.__stressState?.()||null'),authRequests:auth.requests.filter(r=>r.path==='/auth/v1/user').length})}
""")
s=s.replace("browser=await startBrowser(app.url,[auth.url]);", """browser=await startBrowser(app.url,[auth.url]);
 report.startupTrace=browser.startupTrace;report.capability={node:process.version,cpu:os.availableParallelism(),memory:os.totalmem(),platform:os.platform(),release:os.release()};
 await browser.send('Runtime.addBinding',{name:'__stressEmit'});await browser.send('Page.addScriptToEvaluateOnNewDocument',{source:'('+probe.toString()+')()'});await browser.send('Page.setLifecycleEventsEnabled',{enabled:true});await browser.send('Emulation.setCPUThrottlingRate',{rate:report.stressRate});
 const pid=browser.startupTrace.events.find(e=>e.phase==='spawn')?.pid;
 const sample=async()=>{const paths=['/sys/fs/cgroup/cpu.stat','/sys/fs/cgroup/cpu.max','/sys/fs/cgroup/memory.current','/sys/fs/cgroup/memory.max','/proc/pressure/cpu','/proc/pressure/io',`/proc/${pid}/stat`,`/proc/${pid}/wchan`];resources.push({nodeMs:stamp(),journey:currentJourney,freeMemory:os.freemem(),load:os.loadavg(),files:Object.fromEntries(await Promise.all(paths.map(async p=>[p,await readFile(p,{encoding:'utf8',signal:AbortSignal.timeout(100)}).catch(()=>null)])))});if(resources.length>500)resources.shift()};await sample();sampler=setInterval(()=>void sample(),1000);sampler.unref();
""")
s=s.replace("async function journey(name,run){try{await run();", "async function journey(name,run){currentJourney=name;record('journey-start');try{await run();await snapshot('journey-end');")
s=s.replace("catch(e){report.journeys.push", "catch(e){await snapshot('failure').catch(()=>{});report.journeys.push")
s=s.replace("await field('[name=email]',db.users.member.email);await click('Create invitation');", "await snapshot('before-email-edit');await field('[name=email]',db.users.member.email);await snapshot('after-email-edit');await click('Create invitation');await snapshot('after-invitation-click');")
s=s.replace(" report.network=browser.network;", " report.events=events;report.resources=resources;report.network=browser.network;")
s=s.replace(" report.cleanup=[];", " clearInterval(sampler);report.events=events;report.resources=resources;report.cleanup=[];")
s=s.replace(" progress('Cleanup complete');", " if(app){try{const p=path.join(artifacts,'next-server.log');await rawWriteFile(p,sanitize(await readFile(p,'utf8')))}catch{}}\n progress('Cleanup complete');")
if args.light:
 s=s.replace('document.body?.innerText','document.body?.textContent')
 for tag in ['before-email-edit','after-email-edit','after-invitation-click','journey-end']:
  s=s.replace("await snapshot('"+tag+"');",'')
 s=s.replace("else if(m.method==='Page.lifecycleEvent')","else if(m.method==='Page.navigatedWithinDocument')record('same-document-navigation',safePath(m.params.url));else if(m.method==='Network.requestWillBeSent'&&m.params.request.url.includes('/business'))record('request',{...safePath(m.params.request.url),method:m.params.request.method,requestId:m.params.requestId});else if(m.method==='Network.responseReceived'&&m.params.response.url.includes('/business'))record('response',{...safePath(m.params.response.url),status:m.params.response.status,mimeType:m.params.response.mimeType,requestId:m.params.requestId});else if(m.method==='Page.lifecycleEvent')")
 s=s.replace("report.startupTrace=browser.startupTrace;","report.startupTrace=browser.startupTrace;const version=await browser.send('Browser.getVersion');report.browserIdentity={product:version.product,protocolVersion:version.protocolVersion};")
args.output.write_text(s)

