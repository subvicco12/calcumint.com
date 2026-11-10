/** Independent fixed current stage; historical anchors are never retargeted. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const independentGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const fixed=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
    "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
    "blob": "7c69021c8cf584823d96c0cfa26a4b7b7c5c8a3d",
    "sha256": "122ac5c5db0884964a7a319ea8f2e62212019cea6088379464dd04bb5a510721"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
    "blob": "4e1d47d7f762de30c2bff1994cda40becaff6cd1",
    "sha256": "02c2a9cafb9401f5ad8449344dd59bb7e86081cd9d43c55acdf62014acb5da35"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
    "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
    "blob": "0edef7e0182b25b094a5396292fba8e1ecab3117",
    "sha256": "043e5dd66a1650695ccee8353389eb30730c5f99fc993515cc5630fabae1abaa"
  },
  {
    "path": "tests/publication-workflows-20261109/source-evolution.test.mjs",
    "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
    "blob": "7fd4f8575858836e7bb3eaa3d4fcd68715dba84e",
    "sha256": "405f1536d959a4e3bd2d42ad0db44bc5a87f3d8571cde8b054bdba1e72d3ed6e"
  },
  {
    "path": "tests/first-five-20261109/crossed-dependency-source.test.mjs",
    "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
    "blob": "9ce252f0af27da8700b3990cd8e443548229f114",
    "sha256": "d512b20bd0074d20ac8d525d7766ecbbaf5379fb42184346a90a53b89763ab2e"
  },
  {
    "path": "tests/next-cohort-20261110/source/caller-stage.test.mjs",
    "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
    "blob": "e47a127a511bbdaab9f61eeabfa00fe782c89df7",
    "sha256": "cc18149e7d7d27871b0244a25d5e0b341e484580ae5d1d085c0eac03cb622ae0"
  }
]);
const captureSHA256='ac4c5551dd3d9029a998672d6f7a1d6f7034d504518285610f2b72a0aba963a8';
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
