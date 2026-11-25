import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {startBrowser} from '../next-runtime/cdp.mjs';

const root=process.cwd();
const app=await build({bundle:true,write:false,outfile:"/tmp/calcu-everyday-app.js",platform:'browser',format:'iife',define:{'process.env.NODE_ENV':'"production"','process.env':'{}'},jsx:'automatic',alias:{'@':path.join(root,'src')},stdin:{
 resolveDir:root,sourcefile:'everyday-fixture.tsx',loader:'tsx',contents:`
 import {createRoot} from 'react-dom/client';
 import {CalculatorInteractive} from './src/components/calculator-interactive';
 createRoot(document.querySelector('main')!).render(<CalculatorInteractive slug={location.pathname.slice(1)}/>);
 `,
}});
const css=(await readFile(path.join(root,'src/app/globals.css'),'utf8')).replace('@import "tailwindcss";','')+app.outputFiles.find(file=>file.path.endsWith('.css')).text;
const server=createServer((req,res)=>{
 if(req.url==='/app.js'){res.setHeader('Content-Type','application/javascript');return res.end(app.outputFiles.find(file=>file.path.endsWith('.js')).contents);}
 if(req.url==='/app.css'){res.setHeader('Content-Type','text/css');return res.end(css);}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calculator test</title><link rel="stylesheet" href="/app.css"><main class="container"></main><script src="/app.js"></script></html>');
});
await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
let browser;
const results=[];
try{
 browser=await startBrowser('http://127.0.0.1:'+server.address().port);
 await browser.send('Emulation.setDeviceMetricsOverride',{width:320,height:780,deviceScaleFactor:1,mobile:true});
 for(const [id,slug,key,value,expected] of [
  [508,'trip-cost-calculator','transportCost','400','1,200'],
  [513,'hotel-cost-split-calculator','totalHotelCost','600','150'],
  [514,'group-expense-split-calculator','totalExpense','600','200'],
  [515,'tip-split-calculator','billAmount','200','60'],
  [519,'household-utility-cost-calculator','electricity','120','260'],
  [520,'moving-cost-calculator','transport','600','1,200'],
  [521,'running-pace-calculator','distanceKm','5','10'],
  [523,'cycling-speed-calculator','distanceKm','48','24'],
  [524,'swimming-pace-calculator','distanceMeters','500','4'],
 ]){
  await browser.visit('/'+slug);
  const field='input[name="'+key+'"]';
  await browser.until('!!document.querySelector('+JSON.stringify(field)+')');
  const entered=value??await browser.js('document.querySelector('+JSON.stringify(field)+').value');
  const selector=JSON.stringify(field);
  const enter=async()=>{await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r'});await browser.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});};
  await browser.field(field,entered);
  await enter();
  await browser.until('!!document.querySelector("[aria-label=\'Calculation result\'] [role=status] strong")');
  const actual=await browser.js('document.querySelector("[aria-label=\'Calculation result\'] [role=status] strong").textContent');
  if(expected!==null)assert(actual.startsWith(expected+' '),actual);
  const layout=await browser.js('({width:innerWidth,scroll:document.documentElement.scrollWidth,targets:[...document.querySelectorAll("form input, form button")].map(e=>e.getBoundingClientRect().height)})');
  assert.equal(layout.width,320);assert(layout.scroll<=layout.width);assert(layout.targets.length>1&&layout.targets.every(h=>h>=44));
  await browser.js('document.querySelector('+selector+').focus()');
  await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'a',code:'KeyA',modifiers:2,windowsVirtualKeyCode:65});
  await browser.send('Input.dispatchKeyEvent',{type:'keyDown',key:'Backspace',code:'Backspace',windowsVirtualKeyCode:8});
  await browser.until('document.querySelector('+selector+').value===""');
  await enter();await browser.until('!!document.querySelector("[role=alert]")');
  assert(await browser.js('document.activeElement===document.querySelector('+selector+')'));
  assert.equal(await browser.js('!!document.querySelector("[aria-label=\'Calculation result\']")'),false);
  results.push({id,slug,entered,actual,layout,keyboardSubmitAndRefusal:true});
 }
 assert.deepEqual(browser.errors,[]);
 await writeFile(process.argv[2],JSON.stringify({scope:'Integrated CalculatorInteractive dispatcher, loopback only, no live routes or account fixture',results},null,2)+'\n');
}catch(error){await writeFile(process.argv[2]+'.failure.json',JSON.stringify({kind:'LOOPBACK_SETUP_OR_DRIVER_FAILURE',message:String(error).slice(0,1200),browserErrors:(browser?.errors??[]).slice(0,8),completedJourneys:results.length},null,2)+'\n');throw error;}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
