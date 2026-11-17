/** Let pending task-update IPC settle only between the six proven long
 * synchronous recovery cases. No other file registers this scheduling hook.
 */
import {beforeAll,beforeEach,expect} from 'vitest';
import {setImmediate} from 'node:timers/promises';
import {resolve} from 'node:path';
const target=resolve(process.cwd(),'src/lib/execution-recovery-evidence.test.ts');
if(expect.getState().testPath===target)beforeEach(async()=>{await setImmediate();});

// Prepare only immutable objects before this exact suite. Its test bodies still
// run every fresh current-source/authority/HEAD/status check under their deadlines.
const fixtureTarget=resolve(process.cwd(),'src/lib/five-full-contract-evidence.test.ts');
if(expect.getState().testPath===fixtureTarget)beforeAll(async()=>{
 const {primeRuntimeImmutableFixtures}=await import('../next-cohort-20261110/source/retained-runtime.mjs');
 primeRuntimeImmutableFixtures();
});
