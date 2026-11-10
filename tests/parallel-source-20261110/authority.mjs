/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision3.json",
    "blob": "46338e43941b2da16cff0b3bc84f232865af2433",
    "sha256": "9b38f5d3ba5a76b270da47625fc3e24c7219e1c0d3355f7d781f034bf46bafd1"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "96f9065ad73b4573bb8ea175c5d7517dc6a6d94c",
    "sha256": "014d049556bdccbd6702ee0924abde46ce7dae6f164b47b0ff26e8a0046bedc1"
  },
  {
    "path": "tests/parallel-source-20261110/baseline-runtime.mjs",
    "blob": "706e1eb6ed287230a4a1f2a3798d6873a5d3d650",
    "sha256": "cc2e776a31149f5ed2cc8f814c5deef9fb99bee603999e9f855a4d07abe09bf2"
  },
  {
    "path": "tests/parallel-source-20261110/baseline-probe.mjs",
    "blob": "38a1cba957f841183a12b488a671552e3f2b11b3",
    "sha256": "792763590592d1fe0f56d199738e4589e62160764b6a38ef146d8ea658e44f7a"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "6a08f589c23b4ddf29de28b14bb0e0c3eb2ab81a",
    "sha256": "4422d4b9b36987213bc243a262f1d1cc3e6afe976ce577d8c37193acaf0518aa"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.mjs",
    "blob": "82d2b9f5d7e2f34e456853fabecf09494daf5767",
    "sha256": "9e2f8d19eefcce788c2303472c0a130f400fac7519cc51bfd506dfdaeff16715"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "cc6bf31d94e95c742cbd557c9a3abbecbbf7e38f",
    "sha256": "a1e7c6becaebdb5085b18dd1be6ff4f62e70d76597579ccb5f14a6b999f3af20"
  },
  {
    "path": "tests/publication-workflows-20261109/business-caller-successor.mjs",
    "blob": "e4d210f944f4a7cf536251fefbf3b63762ab7804",
    "sha256": "0828a5d837eb8c4b3254e153e83d09c811fddac2d63923aeffc9ac43b5c1804c"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "ae7fcf2a5f34d72e857d19ce0a89d2c2bb58c719",
    "sha256": "aa9ae56751728b3eb86f921081e10b49b5c970fd7fbee728a5f2740c6bce631d"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "6d6d419a6fb0e9a2a419528e08df390d7e0588c3",
    "sha256": "b5ce4f162dc42155ae3449f8ae1aff788f963a632e3ab9ac2dbf11959b50dbb0"
  }
]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
