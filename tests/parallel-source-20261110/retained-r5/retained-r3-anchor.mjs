/** Independent fixed current stage; historical anchors are never retargeted. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const independentGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const fixed=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
    "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
    "blob": "7c69021c8cf584823d96c0cfa26a4b7b7c5c8a3d",
    "sha256": "122ac5c5db0884964a7a319ea8f2e62212019cea6088379464dd04bb5a510721"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
    "blob": "688615271a1d0fc76efe5efa440f290d4c8a4f92",
    "sha256": "91c98790a4b42062698cbf94eb460d3d4cf8c414db686568b2e719e0b41ba277"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
    "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
    "blob": "b2fe64fd1170a947bcd6f9e75b3f2e967898c698",
    "sha256": "95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"
  },
  {
    "path": "tests/publication-workflows-20261109/source-evolution.test.mjs",
    "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
    "blob": "7fd4f8575858836e7bb3eaa3d4fcd68715dba84e",
    "sha256": "405f1536d959a4e3bd2d42ad0db44bc5a87f3d8571cde8b054bdba1e72d3ed6e"
  },
  {
    "path": "tests/first-five-20261109/crossed-dependency-source.test.mjs",
    "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
    "blob": "9ce252f0af27da8700b3990cd8e443548229f114",
    "sha256": "d512b20bd0074d20ac8d525d7766ecbbaf5379fb42184346a90a53b89763ab2e"
  },
  {
    "path": "tests/next-cohort-20261110/source/caller-stage.test.mjs",
    "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
    "blob": "bb31e36f092cb96f377aa622091f9ae1a36de34e",
    "sha256": "8dfd3d137a0ee90d5f490077297ab0b7a2da08ae3eea74570f3214d7dc4a6dde"
  }
]);
const captureSHA256='57e0936a33aca1bd3d1a68cf900f8be21a30627c758faffa9fff57c902094c0a';
const hash=b=>createHash('sha256').update(b).digest('hex');
export function verifyFixedCallerStageAnchor(capture,read=readFileSync,git=independentGit){
 assert.equal(hash(JSON.stringify(capture)),captureSHA256,'Fixed next caller capture differs');
 for(const s of fixed){
  assert.equal(git(['rev-parse','--verify',s.ref+'^{commit}']).toString().trim(),s.ref,'Fixed next caller provenance differs');
  assert.equal(git(['rev-parse',s.ref+':'+s.path]).toString().trim(),s.blob,'Fixed next caller source object differs');
  const bytes=git(['cat-file','blob',s.blob]);assert.equal(hash(bytes),s.sha256,'Fixed next caller Git bytes differ');
  assert(read(s.path).equals(bytes),'Fixed next caller target bytes differ: '+s.path);
 }
 for(const path of ['tests/publication-workflows-20261109/current-source-evolution.mjs','tests/publication-workflows-20261109/accepted-current-source-guard.mjs','tests/first-five-20261109/accepted-evolution-guard.mjs'])assert(read(path).equals(git(['show','1ec63cd11626df15063546c7e5bfedecec33f6ee:'+path])),'Historical fixed source anchor changed: '+path);
 return true;
}
