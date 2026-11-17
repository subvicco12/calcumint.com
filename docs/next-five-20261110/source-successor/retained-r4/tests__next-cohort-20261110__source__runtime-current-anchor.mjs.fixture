/** Independently reviewed populated runtime verifier bytes, not mutable authority. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const fixed=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "4b488298de35c71ed419be2be3b2e30f6e747075",
    "sha256": "fca71854793c8f3b20b78353235e189b60fb126c2612b36db99237600608e5d2"
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
    "blob": "3d736175a89005d6aa8335eba0bded7ffd35f157",
    "sha256": "380491a4aa852e55ef55af81e48c961b6ec4cb99e79d5a97d561c10ca89860c3"
  },
  {
    "path": "tests/publication-workflows-20261109/business-source-successor.test.mjs",
    "blob": "67a22430a96d2ab5c3e7c2be3e001d2d9448f6b3",
    "sha256": "05643023df5023cb75569b53ee22808567059c9b48381641e41e16bf2e44d369"
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
