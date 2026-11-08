import test from 'node:test';
import assert from 'node:assert/strict';
import {createJourneyLifecycle} from './journey-lifecycle.mjs';

test('fixed session boundaries preserve the exact cohort once and all prior network counts',async()=>{
 const expected=Array.from({length:45},(_,i)=>({slug:'calculator-'+i,width:i<23?360:1440}));
 const observed=[],sessions=[],verified=[];let network=0;
 const lifecycle=createJourneyLifecycle({maxJourneys:20,async create(){const browser={id:sessions.length,network:[],async close(){this.closed=true}};sessions.push(browser);return browser},async verify(browser){assert.equal(browser.closed,undefined);verified.push(browser.id);network+=browser.network.length}});
 for(const journey of expected)await lifecycle.run(journey,async browser=>{observed.push(journey);browser.network.push(journey)});
 await lifecycle.close();
 assert.deepEqual(observed,expected);assert.deepEqual(sessions.map(b=>b.network.length),[20,20,5]);assert.deepEqual(verified,[0,1]);assert.equal(network+sessions.at(-1).network.length,45);assert(sessions.every(b=>b.closed));
});

test('a failed journey aborts the sequence and is never replayed',async()=>{
 const original=new Error('renderer timeout'),attempts=[];let created=0;
 const lifecycle=createJourneyLifecycle({async create(){created++;return{async close(){}}},async verify(){}});
 await assert.rejects(async()=>{for(let i=0;i<45;i++)await lifecycle.run(i,async()=>{attempts.push(i);if(i===23)throw original})},error=>error===original);
 await assert.rejects(lifecycle.run(23,async()=>assert.fail('No replay')),/already failed/);
 await lifecycle.close();assert.equal(created,2);assert.deepEqual(attempts,Array.from({length:24},(_,i)=>i));
});

test('errors from retiring sessions prevent the next session and remain primary',async()=>{
 const original=new Error('prior session unauthorized network request');let created=0,calls=0;
 const lifecycle=createJourneyLifecycle({maxJourneys:2,async create(){created++;return{async close(){}}},async verify(){throw original}});
 await assert.rejects(async()=>{for(let i=0;i<3;i++)await lifecycle.run(i,async()=>{calls++})},error=>error===original);
 await lifecycle.close();assert.equal(created,1);assert.equal(calls,2);
});
