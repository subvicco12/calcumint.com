import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
it('executes current caller and independent fixed-anchor proofs including coordinated redirection and retained claims',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/next-cohort-20261110/source/caller-stage.test.mjs','tests/next-cohort-20261110/source/current-anchor.test.mjs','tests/next-cohort-20261110/source/retained-stage1.test.mjs'],{encoding:'utf8',env,timeout:60000,maxBuffer:3000000});
 expect(output).toContain('# tests 40');expect(output).toContain('# fail 0');
},65000);
