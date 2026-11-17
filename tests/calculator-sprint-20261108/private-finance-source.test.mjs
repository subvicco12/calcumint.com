import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const ref="e80a691e86b5bb996a0cd0863fc810b432d7303d";
const pins=[
  {
    "path": "src/lib/financial-successor/exact-grid-private.ts",
    "blob": "2baf9129f3df1caca9390c14678475a1c5128d8f",
    "sha256": "e3f66e441620e0fbe351796ed6bcc52493796eb784839045f8c0d46da270cdc1"
  },
  {
    "path": "src/lib/financial-exact-grid.ts",
    "blob": "d7999eb0df46e0194f1a50b6664d140c582578c2",
    "sha256": "e55bc952661b1f08c494aef90789205615e7967bc2c48ffd8625159ca47ba10e"
  },
  {
    "path": "src/calculators/finance/loan-payment.ts",
    "blob": "9153ea4b9ef3f28567f07c06ed93ad65f8e73459",
    "sha256": "c4347c6d8d5cc7ea7d95bc2eda914a3f9eb4faba37f373d4be521f71dd2923f5"
  },
  {
    "path": "src/calculators/finance/compound-interest.ts",
    "blob": "b905832a35146c6233cf4d522c2c1efd36cabf74",
    "sha256": "7c948d1deec2565b9386f9978f1ef6f81c33993354065e9d8a393aeb5cf28b8d"
  },
  {
    "path": "src/calculators/precision.ts",
    "blob": "20224230a5011fdc198dcd04c5cb4f3cdb35f8c4",
    "sha256": "139319afc73ef22c45dd46ef94b56b85f3442ed57b239cd6a0e59f92cd68643a"
  },
  {
    "path": "src/lib/calculation-snapshot.ts",
    "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
    "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
  },
  {
    "path": "src/lib/recorded-json-equality.ts",
    "blob": "7c938f6983eae11a352c2cfb67dc428d0fa635f0",
    "sha256": "59fda934bec9e573c970d5a451b3d3e3ba14292838a9c6544cafbd10e71f0fcc"
  },
  {
    "path": "src/lib/publication-factory-contracts-input.ts",
    "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
    "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
  },
  {
    "path": "package-lock.json",
    "blob": "dd368ceb52d75eb3998241a001b9e533373146c5",
    "sha256": "b564e5ff97f9dad6c934e6a2eb0977871b2ee3f0b36a23325f1715b241114273"
  }
];
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function verify(read=readFileSync,readGit=git){
 assert.equal(readGit(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref,'Exact initial implementation revision');
 for(const pin of pins){
  assert.equal(readGit(['rev-parse',ref+':'+pin.path]).toString().trim(),pin.blob,'Exact dependency object');
  const bytes=readGit(['cat-file','blob',pin.blob]);assert.equal(hash(bytes),pin.sha256,'Exact captured dependency bytes');
  assert(read(pin.path).equals(bytes),'Current private revision dependency changed: '+pin.path);
 }
}
test('private financial revision and all mathematical/transport dependencies match exact Git capture',()=>{
 verify();const p=JSON.parse(readFileSync('docs/calculator-sprint-20261108/financial-successor.json'));
 assert.equal(p.initialImplementationCapture.sourceRef,ref);assert.deepEqual(p.initialImplementationCapture.sourceFiles,pins);
 assert.equal(p.releaseHold,true);assert.equal(p.initialImplementationCapture.revision,p.implementationRevision);
 assert.equal(p.implementationRevision,'private-financial-exact-grid-20261108.1');assert.equal(p.allocatedSuccessorVersion,null);
 for(const flag of ['certificationAuthorized','registered','productionWrites','originalPRsClosed'])assert.equal(p[flag],false);
});
for(const pin of pins)test('immutable private dependency tamper refused: '+pin.path,()=>assert.throws(()=>verify(path=>path===pin.path?Buffer.from('tamper'):readFileSync(path)),/Current private revision dependency changed/));
test('missing exact initial Git revision cannot create a successful source proof',()=>assert.throws(()=>verify(readFileSync,()=>Buffer.from('0'.repeat(40))),/Exact initial implementation revision/));
