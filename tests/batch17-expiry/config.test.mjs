import test from 'node:test';
import assert from 'node:assert/strict';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
// Invalid configuration must fail before any Docker side effects. This suite
// requires neither a daemon nor credentials and does not launch a fixture.
for(const value of [0,-1,3601,1.5,NaN,Infinity,'15',null,true,{}]) {
 test(`reject invalid lifetime ${String(value)} before Docker`,async()=>{
  await assert.rejects(startGoTrueFixture({jwtExpirySeconds:value}),{name:'AssertionError',message:'jwtExpirySeconds must be an integer from 1 through 3600'});
 });
}
