import assert from 'node:assert/strict';
import test from 'node:test';
import {evaluateFrame} from './frame-world.mjs';
test('reacquires a document context invalidated during iframe navigation',async()=>{
 let worlds=0,evaluations=0;const browser={async send(method,args){if(method==='Page.getFrameTree')return {frameTree:{childFrames:[{frame:{id:'current',url:'http://local/embed'}}]}};if(method==='Page.createIsolatedWorld')return {executionContextId:++worlds};if(method==='Runtime.evaluate'){evaluations++;if(args.contextId===1)throw Error('Cannot find context with specified id');return {result:{value:42}};}throw Error(method);}};
 assert.equal(await evaluateFrame(browser,'http://local/embed','40+2'),42);assert.equal(evaluations,2);assert.equal(worlds,2);
});
test('propagates application exceptions instead of retrying them',async()=>{
 let calls=0;const browser={async send(method){if(method==='Page.getFrameTree')return {frameTree:{childFrames:[{frame:{id:'current',url:'http://local/embed'}}]}};if(method==='Page.createIsolatedWorld')return {executionContextId:1};calls++;return {exceptionDetails:{text:'Actual application failure'}};}};
 await assert.rejects(evaluateFrame(browser,'http://local/embed','throw Error()'),/Actual application failure/);assert.equal(calls,1);
});
