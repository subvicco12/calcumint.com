/** Independently reviewed populated runtime verifier bytes, not mutable authority. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const fixed=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "689593a733c1e9db67f127aed4bc670515f6eb2e",
    "sha256": "a7e58306f34707d719c36d0c2cfd6892d5761c48879709fa11ec88a85be1e8aa"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.d.mts",
    "blob": "af83c9b6b3dfe44707cebccd93b5c8178d489909",
    "sha256": "c1300e0c0eaf273fc455dcee6794ef3ed227635f8ddb1ec64a017db177ce0748"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "20658ed565a31a389d3aaac1a21abb68b851e942",
    "sha256": "1efda4fdcfeb758603e9d2c546a243c3f2684a421d4c071a77624c98677c3313"
  },
  {
    "path": "tests/publication-workflows-20261109/business-caller-successor.mjs",
    "blob": "6d64ecd1ce4f244c0d488a0eac5e180d6e6183b1",
    "sha256": "32a75168c713fa0a196cec15419a3ac19fd87bd92946eff0d11a14e080ca68ce"
  },
  {
    "path": "tests/publication-workflows-20261109/business-source-successor.test.mjs",
    "blob": "370b4714116b3cd63d574d34cb0ab752bf8a8df2",
    "sha256": "834021691433f99d292554538682d4e0cce58d1f5bc75810794c6e380ff71aa6"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.test.mjs",
    "blob": "36af9595c81f7b69619e5392b5b7d5dc612149bf",
    "sha256": "6195b73331f1247961200eb39d9ad68278bbd17409b4231d4b0e6170045f5d49"
  }
]);
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
export function verifyFixedRuntimeReader(read=readFileSync,git=sourceGit){
 for(const row of fixed){assert.equal(git(['rev-parse','HEAD:'+row.path]).toString().trim(),row.blob,'Fixed runtime verifier HEAD object differs: '+row.path);const bytes=git(['cat-file','blob',row.blob]);assert.equal(hash(bytes),row.sha256,'Fixed runtime verifier Git bytes differ: '+row.path);assert(read(row.path).equals(bytes),'Fixed runtime verifier target differs: '+row.path);}
 return true;
}
