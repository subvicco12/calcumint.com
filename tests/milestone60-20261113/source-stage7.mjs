/** Additive exact source proof. Callers supply independently reviewed immutable policy. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { verifyExactStage } from '../calculator-factory-source-20261112/exact-stage.mjs';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
export function sourceStage7Records({ read, policy, capturePath }) {
  const bytes = read(capturePath);
  assert.equal(sha(bytes), policy.captureSHA256, 'Independent Stage7 capture digest differs');
  const capture = JSON.parse(bytes);
  assert.deepEqual(capture.ancestry, policy.ancestry);
  assert.deepEqual(capture.rows.map(row => row.path), policy.paths);
  return new Map(capture.rows.map(row => [row.path, row]));
}
export function proveSourceStage7AndHistoricalInputs({ read, git, root, policy, capturePath }) {
  const rows = sourceStage7Records({ read, policy, capturePath });
  if (typeof git.preloadCommits === 'function') git.preloadCommits(policy.ancestry);
  // No historical projection or source override is exposed until all actual SRC passes.
  const live = verifyExactStage({ read, git, root, policy, captureBytes: read(capturePath) });
  const historicalRead = path => {
    if (!rows.has(path)) return read(path);
    const predecessor = rows.get(path).predecessor;
    assert(predecessor, 'Added Stage7 source has no historical bytes: ' + path);
    return git(['cat-file', 'blob', predecessor.blob]);
  };
  const historicalGit = (args, options) => {
    if (args[0] === 'rev-parse' && args[1] === '--verify' && args[2] === 'HEAD^{commit}') return Buffer.from(policy.predecessorRef + '\n');
    if (args[0] === 'status' && args.at(-1) === 'src') return Buffer.alloc(0);
    return git(args, options);
  };
  // Retained stages own immutable object preloading; preserve the original capability.
  if (typeof git.preloadCommits === 'function') historicalGit.preloadCommits = refs => git.preloadCommits(refs);
  return { live, historicalInput: { read: historicalRead, git: historicalGit, root } };
}
export function proveCurrentStage7AndHistoricalInputs(input, retainedProver) {
  const outer = proveSourceStage7AndHistoricalInputs(input);
  assert.equal(typeof retainedProver, 'function', 'Explicit retained Stage6 prover callback required');
  const retained = retainedProver(outer.historicalInput);
  assert.equal(retained.actualCurrent.size, 20, 'Literal historical Stage6 must retain its exact 20 rows');
  return {
    ...retained,
    stage7: outer.live,
    historicalStage6: retained.actualCurrent,
    actualCurrent: new Map([...retained.actualCurrent, ...outer.live]),
  };
}
