// Manual infrastructure experiment. Never include in CI or run alongside browser campaigns.
// Usage: node tests/full-product-batch13/network-change-repro.mjs --allow-network-mutation
import assert from 'node:assert/strict';
import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {startBrowser} from '../next-runtime/cdp.mjs';
if(process.argv[2]!=='--allow-network-mutation')throw Error('Manual experiment requires --allow-network-mutation and exclusive host network access. Pause other browser campaigns first.');
const run=promisify(execFile),networks=[],results=[];let browser;
const server=http.createServer((req,res)=>{
 res.setHeader('Cache-Control','no-store');
 if(req.url.startsWith('/module')){setTimeout(()=>{res.setHeader('Content-Type','text/javascript');res.end('export default 1;')},100)}
 else{res.setHeader('Content-Type','text/html');res.end('<div id="root"></div><script type="module">'+Array.from({length:80},(_,i)=>`import x${i} from "/module${i}.js?navigation=${req.url}";`).join('')+'document.getElementById("root").innerHTML="<main>mounted</main>"</script>')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
try{
 browser=await startBrowser(base);
 for(const [index,treatment] of [false,true,false,true].entries()){
  const before=browser.networkFailures.length;
  await browser.send('Page.navigate',{url:base+'/'+index});await new Promise(resolve=>setTimeout(resolve,300));
  if(treatment){const name=`calcumint-network-repro-${process.pid}-${index}`;networks.push(name);await run('docker',['network','create','--internal',name])}
  await new Promise(resolve=>setTimeout(resolve,2500));
  results.push({index,treatment,mounted:await browser.js('!!document.querySelector("main")'),networkFailures:browser.networkFailures.slice(before)});
  if(treatment){await run('docker',['network','rm',networks.at(-1)]);networks.pop();await new Promise(resolve=>setTimeout(resolve,500))}
 }
 console.log(JSON.stringify({scope:'Private controlled infrastructure experiment; no application correction or historical cause claim.',results},null,2));
 for(const r of results){assert.equal(r.mounted,!r.treatment);if(r.treatment)assert(r.networkFailures.some(f=>f.type==='Script'&&f.errorText==='net::ERR_NETWORK_CHANGED'&&f.canceled===false));else assert.deepEqual(r.networkFailures,[])}
}finally{
 for(const name of networks)await run('docker',['network','rm',name]).catch(()=>{});
 await browser?.close();await new Promise(resolve=>server.close(resolve));
}
