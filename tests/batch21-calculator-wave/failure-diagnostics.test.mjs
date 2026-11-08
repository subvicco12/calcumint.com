import test from 'node:test';
import assert from 'node:assert/strict';
import {captureFailureScreenshot} from './failure-diagnostics.mjs';

test('failed diagnostic screenshot does not replace the original acceptance failure',async()=>{
 const original=new Error('Chromium CDP command timed out: Input.dispatchKeyEvent');
 const report={error:original.stack};
 const browser={async send(){throw new Error('Internal error')}};
 const acceptance=async()=>{try{throw original}catch(error){await captureFailureScreenshot(browser,()=>assert.fail('No screenshot is available'),report);throw error}};
 await assert.rejects(acceptance(),error=>error===original);
 assert.match(report.screenshotError,/Internal error/);
 assert.equal(report.error,original.stack);
});

test('successful diagnostic screenshot retains the actual bytes',async()=>{
 const report={};let captured;
 await captureFailureScreenshot({async send(method,params){assert.equal(method,'Page.captureScreenshot');assert.equal(params.captureBeyondViewport,true);return{data:Buffer.from('png').toString('base64')}}},async bytes=>{captured=bytes},report);
 assert.equal(captured.toString(),'png');assert.equal(report.screenshotError,undefined);
});

test('protocol errors identify the calculator, viewport and operation without retrying',async()=>{
 const {instrumentBrowser}=await import('./failure-diagnostics.mjs');
 const original=new Error('Internal error');let calls=0;
 const failures=[];
 const browser=instrumentBrowser({async send(){calls++;throw original}},()=>({slug:'scientific-notation-calculator',width:360}),failures);
 await assert.rejects(browser.send('Input.dispatchKeyEvent',{type:'keyDown'}),error=>error.cause===original&&/scientific-notation-calculator width=360 send\("Input.dispatchKeyEvent"\)/.test(error.message));
 assert.equal(calls,1);assert.equal(failures.length,1);assert.equal(failures[0].argument,'Input.dispatchKeyEvent');
});

test('receipt records screenshot file errors as secondary failures',async()=>{
 const report={error:'primary acceptance failure'};
 await captureFailureScreenshot({async send(){return{data:'cG5n'}}},async()=>{throw new Error('disk unavailable')},report);
 assert.match(report.screenshotError,/disk unavailable/);assert.equal(report.error,'primary acceptance failure');
});
