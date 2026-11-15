/** Explicit opt-in immutable transport setup only; opening and closing current proofs remain inside every batch. */
import {primeRuntimeEvidenceBatchObjects} from './retained-runtime.mjs';
primeRuntimeEvidenceBatchObjects();
export {withRuntimeEvidenceBatch} from './retained-runtime.mjs';
