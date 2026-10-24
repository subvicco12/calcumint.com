import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

// Exercise the harness helper directly without launching its top-level browser.
const source=await readFile(new URL('../../scripts/test-final-reference-browser.mjs',import.meta.url),'utf8');
const helper=source.match(/ async function downloaded\(extension,prior\)\{[^\n]+\}/)[0];
test('does not read an existing download until its matching CDP completion',async()=>{
 const events=[{method:'Browser.downloadWillBegin',params:{guid:'current',suggestedFilename:'report.pdf'}},{method:'Browser.downloadProgress',params:{guid:'other',state:'completed'}}];
 let reads=0,clock=0;
 const context=vm.createContext({events,downloadEventStart:0,journeyDownloads:'/downloads',Date:{now:()=>clock},path:{join:(...parts)=>parts.join('/')},readdir:async()=>['report.pdf'],readFile:async()=>{assert(events.some(event=>event.params.guid==='current'&&event.params.state==='completed'),'must await matching completion');reads++;return '%PDF-1.7 complete';},setTimeout:resolve=>{assert.equal(reads,0,'partial file must not be read');clock+=40;events.push({method:'Browser.downloadProgress',params:{guid:'current',state:'completed'}});resolve();}});
 const downloaded=vm.runInContext(`(${helper})`,context);
 const result=await downloaded('.pdf',[]);
 assert.equal(result.content,'%PDF-1.7 complete');assert.equal(reads,1);
});
test('retains the ten-second deadline without a matching completion',async()=>{
 let clock=0;
 const events=[{method:'Browser.downloadWillBegin',params:{guid:'old',suggestedFilename:'report.pdf'}},{method:'Browser.downloadProgress',params:{guid:'old',state:'completed'}}];
 const context=vm.createContext({events,downloadEventStart:events.length,journeyDownloads:'/downloads',Date:{now:()=>clock},path:{join:()=>''},readdir:async()=>['report.pdf'],readFile:async()=>{throw Error('must not read stale completed download');},setTimeout:resolve=>{clock+=40;resolve();}});
 await assert.rejects(vm.runInContext(`(${helper})`,context)('.pdf',[]),/Missing actual download/);
 assert.equal(clock,10000);
});
