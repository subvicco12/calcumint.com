/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision25.json",
    "blob": "2d7f17af6674f2f685d4eb4cb04b3174c99130bc",
    "sha256": "e82bfb66d0d48748a6d8b5e4eae70c81b325d2f9c1d7c4d7100477868cf0f3f3"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "6e59d2a2a666bc70129b9ac7cbcc5e753044fb9e",
    "sha256": "516cd66d222d537b41cc7f3a2dc9b3e57db68a984de03be4ad787329203fccba"
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
    "blob": "68d746b95cb5977c79e74250867da8b63f9de3d1",
    "sha256": "3cb0a0d251408b936978a75d9969b957cd9f03fd2dee6c517c03f012f92ff579"
  },
  {
    "path": "tests/parallel-source-20261110/historical-tests.mjs",
    "blob": "8583a431639658fbe8068da96e265ce0b39f6ecb",
    "sha256": "2de75d7f3eeba173e1deea9d05de76d58c03653e6d9b80d3960a8887cbec4869"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.mjs",
    "blob": "82d2b9f5d7e2f34e456853fabecf09494daf5767",
    "sha256": "9e2f8d19eefcce788c2303472c0a130f400fac7519cc51bfd506dfdaeff16715"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "edc38cf3e05b309e6cfb2300fb0dbe282d2906a7",
    "sha256": "835f2572b04406471c5af8e5e4017f28a497f898a9986c9dfc3ac267635439d7"
  },
  {
    "path": "tests/publication-workflows-20261109/business-caller-successor.mjs",
    "blob": "cd940dc337c890d08f1df525ec9ef0960df4bcf1",
    "sha256": "6a7492fd97b62762afb61b7d5aff7c8157b1f19c1545698335049bc82631dd27"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "d8c7b397b162216bf81da6a341a3afe632be70a2",
    "sha256": "6d7f076e7832e4c8d65e7a277dbfd8c1497d723d518945da03b23a199a3c3193"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "274c97995977be4bb46a4682cb15894781c75a56",
    "sha256": "cba0c2d13c67d1447c290610298044985e100ab2cbff15df1bab990c9326b1c6"
  },
  {
    "path": "tests/parallel-source-20261110/git-reader.mjs",
    "blob": "bc62dbd797ec12b8c3ed26c101d91844035ce9e4",
    "sha256": "56d003e4b8572da111a96928c58123a72048cc022768a252dd7cef8d960f1377"
  },
  {
    "path": "tests/parallel-source-20261110/retained-vitest.mjs",
    "blob": "922adf4265ae9983f4192affce31f14e61146b1c",
    "sha256": "aef7321e2e25fd914287d7a4b3644b4e8749c7dc9c6674a070cfcabcde57b321"
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
