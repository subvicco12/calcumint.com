/** Independent current anchor. Original f41 fixed anchor remains unchanged. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const fixed=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
    "ref": "d416617b5c0533fe5d4d8a3f9fa5b15b9b539cbb",
    "blob": "dcca9ed780ea0c67c3182698620107369143ac5c",
    "sha256": "e22d64ddbaf8adb492dd1a9957d5fcc3c9f1a0b6a02291989de6e47d70442807"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "47c1297eee9ff8e61620c29957f4d55a014614e0",
    "blob": "aa4fe52e54d9e128746d57b9b9c67dd559efe701",
    "sha256": "4687e8dd24f12ae54df04722559d215b40cc44b9111b3e7fa5b46a54f9ae5413"
  },
  {
    "path": "tests/publication-workflows-20261109/current-source-evolution.mjs",
    "ref": "d416617b5c0533fe5d4d8a3f9fa5b15b9b539cbb",
    "blob": "1dced0218259ad5d0f91727d32725b9840a30e5f",
    "sha256": "0be9b9b964b987c559afac3ab58702d9d2b11dc8e7aa34a35b0def8e068142ce"
  }
]);
const captureSHA256='3bb206c3f8f546275ab277d53880be34cfe29084001505f076604264481e97f2';
const hash=value=>createHash('sha256').update(value).digest('hex');
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function assertAcceptedCurrentSourceGuard(capture,read=readFileSync,git=sourceGit){
 assert.equal(hash(JSON.stringify(capture)),captureSHA256,'Independent current capture differs');
 for(const source of fixed){
  assert.equal(git(['rev-parse','--verify',source.ref+'^{commit}']).toString().trim(),source.ref,'Independent current source provenance differs');
  assert.equal(git(['rev-parse',source.ref+':'+source.path]).toString().trim(),source.blob,'Independent current source object differs');
  const bytes=git(['cat-file','blob',source.blob]);assert.equal(hash(bytes),source.sha256,'Independent current Git bytes differ');
  assert(read(source.path).equals(bytes),'Independent current target bytes differ: '+source.path);
 }
 // Keep the predecessor independent trust root itself byte-identical.
 const old='tests/first-five-20261109/accepted-evolution-guard.mjs';
 assert(read(old).equals(git(['show','9fe66f65cd7da2536f9f2f21d32fbc771bee0892:'+old])),'Original fixed anchor changed');
 return true;
}
