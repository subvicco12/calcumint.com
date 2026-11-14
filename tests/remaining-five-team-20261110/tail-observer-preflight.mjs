import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const raw=await readFile('tests/remaining-five-team-20261110/role-tail.mjs','utf8');
const literals=[...raw.matchAll(/browser\.js\((`!!document\.querySelector\([^`]+`)\)/g)].map(match=>match[1]);assert.equal(literals.length,2);const expressions=literals.map(literal=>vm.runInNewContext(literal,{JSON}));for(const expression of expressions){new vm.Script(expression);for(const present of [false,true])assert.equal(vm.runInNewContext(expression,{document:{querySelector(selector){assert.equal(selector,'[aria-label="Saved calculation tools"]');return present?{}:null;}}}),present);}
await writeFile('docs/remaining-five-team-20261110/tail-observer-preflight.json',JSON.stringify({passed:true,scope:'NODE_COMPILE_AND_SELECTOR_UNIT_PROBE_ONLY_NOT_AUTH_ACCEPTANCE',producerSha256:createHash('sha256').update(raw).digest('hex'),expressions,checkedAbsentAndPresent:true},null,2)+'\n');console.log('PASS both exact runtime observer expressions compile and distinguish absent/present private tools');
