/** Independently reviewed populated runtime verifier bytes, not mutable authority. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const fixed=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "dd0cef005e31d0567b64aafbf498d18fc9a4232a",
    "sha256": "e09764879e8d45646d765a1e066cbbfc6d491117c13d5ed17e149edeb4fa8c9d"
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
    "blob": "8cf3de37a387eb22382bb8f2e86238e0128f070d",
    "sha256": "f958f56d98319a0ba3eef2d38ad71fa579f4ed917678dbf5138597a5533c3f6a"
  },
  {
    "path": "tests/publication-workflows-20261109/business-source-successor.test.mjs",
    "blob": "ef618bc590b1e671e00ba1e899254eae9b446fc5",
    "sha256": "826eace4f196c2e77e0683c3b84795e2f69fca2a91be00ccff0a4850063395c8"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.test.mjs",
    "blob": "33e0c86f0df255853d5bb05d1fa3cc3931bf67dd",
    "sha256": "aed56a74064891892520f0e7f2610796bebdea569f72f469729764b3bc546bd5"
  }
]);
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=b=>createHash('sha256').update(b).digest('hex');
export function verifyFixedRuntimeReader(read=readFileSync,git=sourceGit){
 for(const row of fixed){assert.equal(git(['rev-parse','HEAD:'+row.path]).toString().trim(),row.blob,'Fixed runtime verifier HEAD object differs: '+row.path);const bytes=git(['cat-file','blob',row.blob]);assert.equal(hash(bytes),row.sha256,'Fixed runtime verifier Git bytes differ: '+row.path);assert(read(row.path).equals(bytes),'Fixed runtime verifier target differs: '+row.path);}
 return true;
}
