/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision15.json",
    "blob": "b4b9187199f200afe6f87fe6625ff1b73d63929c",
    "sha256": "8b0ebb174a0b70249f87f6f3aea2ced16cd947ef51a85a29d1870baa71e6688c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "61736e01711c57dc806eb90714c34b8f1227f71e",
    "sha256": "53bd47fc28cce672774a1dc2c2885d411f301a93e0cb3388d59f9f5a5019cb01"
  },
  {
    "path": "tests/parallel-source-20261110/baseline-runtime.mjs",
    "blob": "f1606d1b7e8a9fe1f437477d899c6b3175fbdf2f",
    "sha256": "f8c26450aaa067ff22dda8058c7ecd9bb6a80ca2b2e847835dcb9eeb5ed805c0"
  },
  {
    "path": "tests/parallel-source-20261110/baseline-probe.mjs",
    "blob": "5aa7324b1bef1c902c3b2c2b878a1da5bac58527",
    "sha256": "a172e54eb4ded89123ccaff6123e0621d7314429a9b81ddea1863fd337100479"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "b44c5eb2561a75729b3d414180b5a7441898655a",
    "sha256": "d4f00bb8ed2d4324f59b6d3b574abb514de4377a39d6b3f8074260806ffce05b"
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
    "blob": "41db59bdeee1fca80c3453831b5fb71e17ebf16d",
    "sha256": "ca89c18f4dc77090c2e81cd4591537603ae95e2a40021198e222ee3cb442baca"
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
  },
  {
    "path": "tests/parallel-source-20261110/git-reader.mjs",
    "blob": "bc62dbd797ec12b8c3ed26c101d91844035ce9e4",
    "sha256": "56d003e4b8572da111a96928c58123a72048cc022768a252dd7cef8d960f1377"
  },
  {
    "path": "tests/parallel-source-20261110/retained-vitest.mjs",
    "blob": "251632f94efd25830060d4ed1ebe345d81ce748b",
    "sha256": "e60f19cf4eaea3fd3e145e916f36e2f880d3ca1083c2d674d995ced74fbd927a"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "5146f713d6e4466c550826d12cdfe4426d4203c6",
    "sha256": "e870d8f4d49591cfdf471bed129d9a628b254fa06cdf25de6a03b0fc373d0f8d"
  }
]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
