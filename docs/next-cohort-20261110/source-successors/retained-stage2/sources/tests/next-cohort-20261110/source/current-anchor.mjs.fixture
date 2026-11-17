/** Independent fixed current stage; historical anchors are never retargeted. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const independentGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const fixed=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
    "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
    "blob": "7c69021c8cf584823d96c0cfa26a4b7b7c5c8a3d",
    "sha256": "122ac5c5db0884964a7a319ea8f2e62212019cea6088379464dd04bb5a510721"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
    "blob": "2bfc56c5025f131bf1c0b0002b192ec3f2d9b771",
    "sha256": "c83edf26f67fa5462021257e416ece81a91733f6aa899c030ea517b940d7e58a"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
    "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
    "blob": "cbd01f8d2fea6a6c5971a3665b43b218d958d15e",
    "sha256": "99fbaef2af372be6588a4e77a62160970723981bf1c458d060a5cd535b247f3d"
  },
  {
    "path": "tests/publication-workflows-20261109/source-evolution.test.mjs",
    "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
    "blob": "7fd4f8575858836e7bb3eaa3d4fcd68715dba84e",
    "sha256": "405f1536d959a4e3bd2d42ad0db44bc5a87f3d8571cde8b054bdba1e72d3ed6e"
  },
  {
    "path": "tests/first-five-20261109/crossed-dependency-source.test.mjs",
    "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
    "blob": "9ce252f0af27da8700b3990cd8e443548229f114",
    "sha256": "d512b20bd0074d20ac8d525d7766ecbbaf5379fb42184346a90a53b89763ab2e"
  },
  {
    "path": "tests/next-cohort-20261110/source/caller-stage.test.mjs",
    "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
    "blob": "bf6c597ec9d5c56a6dadc92370bc784f4fe46953",
    "sha256": "e62b3e1098c69cb23753ed834706edd4c3d908841f843f613329260f645241f0"
  }
]);
const captureSHA256='0433050bb117e6a6bb622b71965d1e98f8f4f0d47706131147825e6ceaa99102';
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
