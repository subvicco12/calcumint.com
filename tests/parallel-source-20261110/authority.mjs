/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision33.json",
    "blob": "59aae79ef9e95da9c924c908e7b3e2b327e23249",
    "sha256": "7f52151efbcd3d6817015ef6b92d2ef85a29b2dddab390dab0be2bfaf1208417"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "b6ed0e2e78209c47e8e0d3f24415179d082f80d8",
    "sha256": "422cef6a8ab50bcca280a077ecaed36a5abb86ccea136acbfb9dcb6b72d7ba66"
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
    "blob": "ba727d1c194c578f85e8fc46bd23b8ad0310cbe7",
    "sha256": "cb04e0b5f7be6a82ffa7d8bd341db5b9fa819082993393001e3f5d5c7f248972"
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
    "blob": "b2672458b8e82e26a167f9334b53425203228916",
    "sha256": "8e1f2324eaa9d5a94e61e5f6f3894945441768400d9f7f6770b839b40cf4014c"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "23c210fceff89fbc219500aa0117d21287954822",
    "sha256": "ceae7fd3912a124767ae815e7151fe42d6070be7dd4f7fa2523341bebf9ec716"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "1bdf498f3c01628929b0a5a71fd85400c86120c7",
    "sha256": "03ae8d10a78d30d3d9707a32ebf1ecaee29783985abe21caedbe536a3353b33d"
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
  },
  {
    "path": "tests/calculator-factory-source-20261112/policy.mjs",
    "blob": "cee3ec8df385d85fc4609bcb4d62a6619decab2b",
    "sha256": "ff0e695186ff80756374d548e26da634014a748c14ad99bb0919c1d258f86cb3"
  },
  {
    "path": "tests/calculator-factory-source-20261112/exact-stage.mjs",
    "blob": "d88636bed1ea8d57ef4a4ffedbf06b6921f4c089",
    "sha256": "32260ba7c6f81b5616ff5a7067e9a72fde065fe127caedb7ada2965565865910"
  },
  {
    "path": "tests/calculator-factory-source-20261112/exact-stage.test.mjs",
    "blob": "c4b349b9a90a66fbc85f37e57d68010f96a406b7",
    "sha256": "1f946cfa9de9ad1b3c8637e09d94fdaa0b0148003c3e7c14b1449c2a775c88d4"
  },
  {
    "path": "tests/calculator-factory-source-20261112/objects.mjs",
    "blob": "1f0c797f93aa6c9671143e7f7d85b559a5e576ac",
    "sha256": "6577f703a4556d4dba055236e50d23891a05e93c5083f2b1e78c2ea9e63e5a23"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112.json",
    "blob": "b7ef922126e2d62ef4d728b22cdfd612b9336b71",
    "sha256": "101889b6b9c1f058976f498c57bdd41951a72f9c7b7b763bc550e658bd11e207"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision2.json",
    "blob": "4120dd284d1d27f0922f23d98d505502366b0c8c",
    "sha256": "3e519facdcfde768083e3fd9d9c0a8d29d475d6b87cf19c59ba33e6709425b5a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision32.json",
    "blob": "e801d200628c8d6dd5955cb915f3c38ad1524d97",
    "sha256": "bd440c60f7f81b5904c5f073a2a9099873991f6a1e9a741cc3fda2140373f6a8"
  }
]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
