/** Pinned adapter; generic proof has no retained Stage6 dependency or import cycle. */
import { proveCurrentStage7AndHistoricalInputs, sourceStage7Records } from './source-stage7.mjs';
import { sourceStage7Policy, sourceStage7CapturePath } from './source-stage7-policy-v6.mjs';
import { ensureSourceStage7Objects } from '../parallel-source-20261110/bootstrap.mjs';
export { sourceStage7Policy, sourceStage7CapturePath };
export const pinnedSourceStage7Records = read => sourceStage7Records({ read, policy: sourceStage7Policy, capturePath: sourceStage7CapturePath });
export function provePinnedSourceStage7(input, retainedProver) {
  ensureSourceStage7Objects();
  return proveCurrentStage7AndHistoricalInputs({ ...input, policy: sourceStage7Policy, capturePath: sourceStage7CapturePath }, retainedProver);
}
