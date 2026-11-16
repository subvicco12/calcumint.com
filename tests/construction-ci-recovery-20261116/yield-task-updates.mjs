/** Let pending task-update IPC settle only between the six proven long
 * synchronous recovery cases. No other file registers this scheduling hook.
 */
import {beforeEach,expect} from 'vitest';
import {setImmediate} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
const target=fileURLToPath(new URL('../../src/lib/execution-recovery-evidence.test.ts',import.meta.url));
if(expect.getState().testPath===target)beforeEach(async()=>{await setImmediate();});
