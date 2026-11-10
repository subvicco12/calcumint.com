/** Independent fixed current stage; historical anchors are never retargeted. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const independentGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const fixed=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
    "ref": "fc4fee0877e43c2c86f8689f5c626d2ba5e10378",
    "blob": "7c69021c8cf584823d96c0cfa26a4b7b7c5c8a3d",
    "sha256": "122ac5c5db0884964a7a319ea8f2e62212019cea6088379464dd04bb5a510721"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "fc4fee0877e43c2c86f8689f5c626d2ba5e10378",
    "blob": "2bfc56c5025f131bf1c0b0002b192ec3f2d9b771",
    "sha256": "c83edf26f67fa5462021257e416ece81a91733f6aa899c030ea517b940d7e58a"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
    "ref": "fc4fee0877e43c2c86f8689f5c626d2ba5e10378",
    "blob": "b2fe64fd1170a947bcd6f9e75b3f2e967898c698",
    "sha256": "95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"
  },
  {
    "path": "tests/publication-workflows-20261109/source-evolution.test.mjs",
    "ref": "fc4fee0877e43c2c86f8689f5c626d2ba5e10378",
    "blob": "7fd4f8575858836e7bb3eaa3d4fcd68715dba84e",
    "sha256": "405f1536d959a4e3bd2d42ad0db44bc5a87f3d8571cde8b054bdba1e72d3ed6e"
  },
  {
    "path": "tests/first-five-20261109/crossed-dependency-source.test.mjs",
    "ref": "fc4fee0877e43c2c86f8689f5c626d2ba5e10378",
    "blob": "9ce252f0af27da8700b3990cd8e443548229f114",
    "sha256": "d512b20bd0074d20ac8d525d7766ecbbaf5379fb42184346a90a53b89763ab2e"
  },
  {
    "path": "tests/next-cohort-20261110/source/caller-stage.test.mjs",
    "ref": "fc4fee0877e43c2c86f8689f5c626d2ba5e10378",
    "blob": "78335516fd62adc39679c0deab640d0dec1c5bec",
    "sha256": "2a91f1c74ec42f72ce534b941c08a88273e77040ad91f1281cc2b777d74c5fb2"
  }
]);
const captureSHA256='629b3700d61fddf01c7c70bf1453a0d0d59643e74f2cf1042311dec33922cf6a';
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
