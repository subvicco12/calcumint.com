/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision5.json",
    "blob": "b1feaf819706bd9185648e41498e882fe97df3b0",
    "sha256": "c8d6fde33ce1271ab2983c69356462a8afb2fd54ca28029b5ca385c1db92efae"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "3de2629de4e1fc11ffddaf1d0acdc16bc4999232",
    "sha256": "9d84dd2c4c7e3eca73ac989d71baf9ebace07b4f49b7898bde8a9ec091901c5a"
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
    "blob": "e7c71533a09aa601b140c3988a0cbc7798d85415",
    "sha256": "47a04f53ace5bbce0ce5f3be303cc5cb0583a8409d78a0f8b7488a5337268de5"
  },
  {
    "path": "tests/parallel-source-20261110/historical-tests.mjs",
    "blob": "40593dd730b36bb0db486bc4c5a08dbc03f73247",
    "sha256": "8c07fcb0fc898ead7a17628fd7e8859e0526d38f22e458beea2359ab79d3936a"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.mjs",
    "blob": "82d2b9f5d7e2f34e456853fabecf09494daf5767",
    "sha256": "9e2f8d19eefcce788c2303472c0a130f400fac7519cc51bfd506dfdaeff16715"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "eef4f17e2a9eb93517b991ceccb0134669eb6e34",
    "sha256": "5bb5dd7146195ef2d46967feedec644d6068e23ece61f040c9b048c543db9cff"
  },
  {
    "path": "tests/publication-workflows-20261109/business-caller-successor.mjs",
    "blob": "cd940dc337c890d08f1df525ec9ef0960df4bcf1",
    "sha256": "6a7492fd97b62762afb61b7d5aff7c8157b1f19c1545698335049bc82631dd27"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "0a4afcd15c2b35971e7c560e03d3283d4b182469",
    "sha256": "48da06ba8f766a5e3bab2f622283c01ca145028031bf51f8959ba544c5df862a"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "ba39b2aa5a9dee6b460d5cc56be8a1f283c094fd",
    "sha256": "60c357deba6b555f2250f6cf9e3241b6acbfcb8cc0a08e3debc0c7540e30a7c4"
  }
]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
