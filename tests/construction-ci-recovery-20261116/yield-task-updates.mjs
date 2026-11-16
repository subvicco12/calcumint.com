/** Let pending task-update IPC settle only between the six proven long
 * synchronous recovery cases. No other file registers this scheduling hook.
 */
import {beforeEach,expect} from 'vitest';
import {setImmediate} from 'node:timers/promises';
import {resolve} from 'node:path';
const target=resolve(process.cwd(),'src/lib/execution-recovery-evidence.test.ts');
if(expect.getState().testPath===target)beforeEach(async()=>{await setImmediate();});
