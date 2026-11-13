import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {it,expect} from 'vitest';
const execute=promisify(execFile);
it('recovers only the exact retained NS objects and refuses foreign, absent and substituted history',async()=>{
 const result=await execute(process.execPath,['--test','tests/completion-first-20261112/non-source-availability.test.mjs'],{timeout:15000,maxBuffer:1024*1024});
 expect(result.stdout).toContain('# pass 3');expect(result.stdout).toContain('# fail 0');
},20000);
