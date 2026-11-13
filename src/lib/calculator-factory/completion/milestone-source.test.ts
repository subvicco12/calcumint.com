import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
/** Mandatory default-suite coverage, additive to the retained 115-case bridge.
 * It changes no application runtime or existing timeout. Each child source is
 * independently bound in the immutable Stage7 guard capture.
 */
it('qualifies Stage7 actual current objects and literal retained Stage6 with all twenty-two refusal cases',()=>{
 const files=['tests/milestone60-20261113/source-stage7.test.mjs','tests/milestone60-20261113/source-stage7-live.test.mjs','tests/milestone60-20261113/source-stage7-preservation.test.mjs','tests/completion-wave-20261113/source-test-stage6.test.mjs','tests/milestone60-20261113/source-cold-preflight.test.mjs'];
 let output:string;
 try{output=execFileSync(process.execPath,['--test','--test-concurrency=1',...files],{cwd:process.cwd(),encoding:'utf8',timeout:45000,maxBuffer:2*1024*1024});}
 catch(cause){const error=cause as Error&{stdout?:Buffer|string;stderr?:Buffer|string};throw new Error(`${error.message}\n${String(error.stdout??'')}\n${String(error.stderr??'')}`,{cause});}
 expect(output).toMatch(/# tests 22\b/);expect(output).toMatch(/# pass 22\b/);expect(output).toMatch(/# fail 0\b/);expect(output).toMatch(/# skipped 0\b/);expect(output).toMatch(/# cancelled 0\b/);
},50000);
