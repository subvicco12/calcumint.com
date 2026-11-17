/** Let pending Vitest task-update IPC settle between synchronous evidence cases.
 * This changes scheduling only: test bodies, assertions and deadlines stay intact.
 */
import {beforeEach} from 'vitest';
import {setImmediate} from 'node:timers/promises';
beforeEach(async()=>{await setImmediate();});
