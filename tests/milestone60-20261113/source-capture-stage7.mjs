/** Producer only: emits review candidates; generated hashes are not independent authority. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export function captureStage7({ root, predecessorRef, codeRef, capturePath, policyPath }) {
  const git = args => execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 });
  const sha = bytes => createHash('sha256').update(bytes).digest('hex');
  const oid = /^[0-9a-f]{40}$/;
  assert.match(predecessorRef, oid); assert.match(codeRef, oid);
  assert.equal(git(['rev-parse', '--verify', codeRef + '^{commit}']).toString().trim(), codeRef, 'Capture a literal committed APP ref only');
  assert.equal(git(['diff', '--name-only', '-z', codeRef, 'HEAD', '--', 'src']).length, 0, 'Current HEAD must retain exact committed APP SRC');
  assert.equal(git(['status', '--porcelain', '--untracked-files=all', '--', 'src']).length, 0, 'Commit all SRC before capture');
  const ancestry = [codeRef];
  while (ancestry.at(-1) !== predecessorRef) {
    assert(ancestry.length < 64, 'Finite first-parent ancestry required');
    const parents = git(['cat-file', 'commit', ancestry.at(-1)]).toString().split('\n\n', 1)[0].split('\n').filter(line => line.startsWith('parent '));
    assert(parents.length > 0, 'Predecessor not reached');
    ancestry.push(parents[0].slice(7));
  }
  assert(ancestry.length >= 2);
  const paths = git(['diff', '--name-only', '-z', predecessorRef, codeRef, '--', 'src']).toString().split('\0').filter(Boolean);
  assert(paths.length > 0); assert(paths.every(path => !path.startsWith('src/calculators/')), 'Mathematical engine change requires separate authority');
  const prior = new Set(git(['ls-tree', '-rz', '--name-only', predecessorRef, '--', 'src']).toString().split('\0').filter(Boolean));
  const record = (ref, path) => {
    const blob = git(['rev-parse', ref + ':' + path]).toString().trim(), bytes = git(['cat-file', 'blob', blob]);
    return { path, ref, blob, bytes: bytes.length, sha256: sha(bytes) };
  };
  const capture = { kind: 'EXACT_FACTORY_SOURCE_SUCCESSOR', predecessorRef, codeRef, ancestry, rows: paths.map(path => ({ path, predecessor: prior.has(path) ? record(predecessorRef, path) : null, current: record(codeRef, path) })) };
  const bytes = Buffer.from(JSON.stringify(capture, null, 2) + '\n');
  const policy = { captureSHA256: sha(bytes), predecessorRef, codeRef, paths, ancestry };
  writeFileSync(resolve(root, capturePath), bytes);
  writeFileSync(resolve(root, policyPath), '// Generated candidate: requires independent review before admission.\nexport const sourceStage7CapturePath = ' + JSON.stringify(capturePath) + ';\nexport const sourceStage7Policy = Object.freeze(' + JSON.stringify(policy, null, 2) + ');\nObject.freeze(sourceStage7Policy.paths);\nObject.freeze(sourceStage7Policy.ancestry);\n');
  return policy;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [root, predecessorRef, codeRef, capturePath, policyPath] = process.argv.slice(2);
  assert(root && predecessorRef && codeRef && capturePath && policyPath, 'Arguments: root predecessorRef codeRef capturePath policyPath');
  const policy = captureStage7({ root, predecessorRef, codeRef, capturePath, policyPath });
  console.log(JSON.stringify({ captureSHA256: policy.captureSHA256, codeRef, paths: policy.paths }, null, 2));
}
