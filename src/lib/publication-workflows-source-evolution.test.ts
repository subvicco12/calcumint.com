import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
it('runs independent exact current source, retained receipt, reversion and tamper checks in mandatory discovery',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/publication-workflows-20261109/source-evolution.test.mjs'],{encoding:'utf8',env,timeout:45000,maxBuffer:2000000});
 expect(output).toContain('# tests 11');expect(output).toContain('# fail 0');
},60000);
