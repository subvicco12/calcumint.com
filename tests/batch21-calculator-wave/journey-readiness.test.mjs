import test from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {journeyReadyExpression} from './journey-readiness.mjs';
const url='http://127.0.0.1:5173/?slug=scientific-notation-scale-calculator&plan=pro';
const slug='scientific-notation-scale-calculator';
function ready({href=url,readyState='complete',mountedSlug=slug,plan='pro'}={}) {
 return runInNewContext(journeyReadyExpression(url,slug),{location:{href},document:{readyState,querySelector(selector){return selector==='main'?{dataset:{calculatorSlug:mountedSlug}}:selector==='#plan'?{textContent:plan}:selector==='.calculator-ui'?{}:null}}});
}
test('rejects valid controls from the preceding calculator document',()=>{
 assert.equal(ready({mountedSlug:'scientific-notation-calculator'}),false);
 assert.equal(ready({href:'http://127.0.0.1:5173/?slug=scientific-notation-calculator&plan=pro'}),false);
});
test('requires completed document load and actual Pro hydration for the requested calculator',()=>{
 assert.equal(ready({readyState:'loading'}),false);
 assert.equal(ready({plan:'loading'}),false);
 assert.equal(ready(),true);
});
