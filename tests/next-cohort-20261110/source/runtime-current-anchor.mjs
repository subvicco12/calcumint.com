/** Independently reviewed populated runtime verifier bytes, not mutable authority. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const fixed=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "ae7fcf2a5f34d72e857d19ce0a89d2c2bb58c719",
    "sha256": "aa9ae56751728b3eb86f921081e10b49b5c970fd7fbee728a5f2740c6bce631d"
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
    "blob": "e4d210f944f4a7cf536251fefbf3b63762ab7804",
    "sha256": "0828a5d837eb8c4b3254e153e83d09c811fddac2d63923aeffc9ac43b5c1804c"
  },
  {
    "path": "tests/publication-workflows-20261109/business-source-successor.test.mjs",
    "blob": "df8dc9b033debd3a8158ed201f3b9a51de760eae",
    "sha256": "fdf83c6a8a479cb57cbc497a562a4cd8dda91ce2b414be9eb5b15cf427e61e44"
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
