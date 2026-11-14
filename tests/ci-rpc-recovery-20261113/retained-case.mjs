/** Fixed child entry point: all original retained assertions and current proof remain unchanged. */
import assert from 'node:assert/strict';
import {verifyRetainedA7Case} from '../parallel-source-20261110/retained-vitest.mjs';
const [entry,name,...extra]=process.argv.slice(2);
assert.equal(extra.length,0);assert.equal(typeof entry,'string');assert.equal(typeof name,'string');
assert.equal(verifyRetainedA7Case(entry,name),true);
process.stdout.write('CALCUMINT_RETAINED_A7_CASE_PASS\n');
