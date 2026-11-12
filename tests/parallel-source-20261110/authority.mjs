/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision38.json",
    "blob": "e45bbc88c408a34dc491d78c24fdd45fee1c54a2",
    "sha256": "395d6f61fcfed993fc4b63d42baafa1f5cca168c1e7712eee2b37c4bea4d7564"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "a15e980d85dd72ea32ab65be095ef7cb0209efac",
    "sha256": "9cdd18a0b000fae7cf9a8780c01ddbf18b86c760c2f88d729af3de9e505bc015"
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
    "blob": "38e285cec2d701f4efdcc0fb17dc7ef62eadd0d6",
    "sha256": "9636b444fd6a5cca87dea02abc2bdd0a3bd22af7bd1eddc79eb1b2bf0ebafcd9"
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
    "blob": "06d7c18e8869dc183414a57c16af3ab5954f2445",
    "sha256": "61183cb81cdde79a7d9cbd5c6e48614be33b060553e9c1b3e427c835026dd671"
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
    "blob": "98738e205b69d63563e37f09c0c224f8d2608342",
    "sha256": "36d88f72076804a5c8cb91b62586f34bc3cbffd358a270d335b5d855f6ad4288"
  },
  {
    "path": "tests/calculator-factory-source-20261112/exact-stage.mjs",
    "blob": "0fa53e03c0e06d1ec800c3b37ca66b6ab390faab",
    "sha256": "427dcad7727bd28d26ecfe40df5b780b79c94a7b2a35930b40417e07d5ac347a"
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
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision3.json",
    "blob": "1459df53cf78768e03cb8958a9fa5518db4e9277",
    "sha256": "39daa9dbed96c489ff8503ed2b5451c6e9a5afb1bc0e86cb9557b300e8a5263a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision33.json",
    "blob": "d0fb682725afb5a3adcc0332963ac3dcb4ef2828",
    "sha256": "9237758bae472bdc0cd7bb2ba63054e422dfb2797e803d9130920f95ddfc7bf3"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision4.json",
    "blob": "9be741daf821fef814710fb9870ad7e5ab2fe83b",
    "sha256": "0076baf5662eae521306b71053e4603b8469986980a031d9f484ad1b6adc42cb"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision34.json",
    "blob": "ff14c45f7feeb63e28ee96dc176f850ec6252e94",
    "sha256": "0f4fb4a682b01c5ab5042d6d0378206b2ca211e69dbe9aff6918648318607ed5"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision5.json",
    "blob": "198b9458cfb588de4b8903c60e4f43b79ada63d1",
    "sha256": "f58877dd162faf6c3ab7430d937436f67194d781058398deb7cc7631d2828da6"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision35.json",
    "blob": "027465966b828104142b39ac484be76d67fd5798",
    "sha256": "2c8b2f38ced90f0eaf257c057b9655d92df9ade4035c8c6831c9730772117791"
  },
  {
    "path": "tests/calculator-factory-source-20261112/policy.d.mts",
    "blob": "17197468e0421056026b3b3fb01fb1b72ebd78a6",
    "sha256": "80387c926c5a29f0f26fc5608057e9fefc0bbcf725261282764ad0c1b085634c"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision6.json",
    "blob": "fc797da9378b47703c481410723c8593d90a95ea",
    "sha256": "54c5f2799cec646d160a3a67793d9bd30ce49d75a39c7b513f1b1337140d62d9"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision36.json",
    "blob": "eebcc669f22971233daf41df1f9783436ad97a59",
    "sha256": "4c8cb211b31fd3c3d17f735c20c1681cc6083e20a7d5227df392d37a94639dfa"
  },
  {
    "path": "vitest.config.ts",
    "blob": "ab88ef354102d823c7e0ee474a0b9672297f5a3b",
    "sha256": "2009fa342160d4539d41811a0dc09eab07ec1ae0f3a31ce8efcd58b64a94aa6e"
  },
  {
    "path": "docs/calculator-factory/unit-scheduler-successor.json",
    "blob": "b6c075bfc60bc19c43be8133e1cf66457f3c6823",
    "sha256": "4f647ea5bd51db95df01f94f332205cce134b0ebe8e2f4b3cfc5857adefa87ea"
  },
  {
    "path": "tests/completion-first-20261112/current-stage.test.mjs",
    "blob": "e620a2fdc89b7537f4688e2c41f05721863633ee",
    "sha256": "7dbcfa55c80b3627b60d361527b3fada78a8eaacec6be225fe583de17f9d086b"
  },
  {
    "path": "tests/completion-first-20261112/stage.mjs",
    "blob": "8b1c0df1c7c4eb72f809fc4122257d9bc80d2129",
    "sha256": "906c856e2173ccab88f8cb30fa437ac1eb4298897722662ac6bdd2e4b703fbb3"
  },
  {
    "path": "tests/completion-first-20261112/policy.mjs",
    "blob": "99c56632d05ac953a9570c6bb564c82d9ef49f45",
    "sha256": "1788f4a736b6f4d59cb83b4ac579bac43b4b214c068c39c6f4e96c66593eb5be"
  },
  {
    "path": "docs/completion-first-20261112/source-stage.json",
    "blob": "6ad4627205a4affccb7890226cdfd5f7abcb9b55",
    "sha256": "7d49ee77a3f03ba94c043807ee9f3656a8e0f56191b2cd7cbaace0f778f75037"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision37.json",
    "blob": "f124b9617cdef72c8ea161378653ad901ef63d9f",
    "sha256": "b6dd6494b2a1d03963adcb57314d1650f0c96f3fb2fe8c36d5ede076a0d69119"
  }
]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
