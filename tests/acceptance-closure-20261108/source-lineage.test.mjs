import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const ref="b2d72aa66293b752739b7924745a57a51c4b5acb";
const pins=[
  {
    "path": "src/lib/financial-successor/decimal-rounding-private.ts",
    "blob": "911769e9ac5e635589c6d5a2c9ab0fe9d508209c",
    "sha256": "762b120dc672566d71a35e8981084fe4ddf0de59353f63c81e7e70d1dfacaf38"
  },
  {
    "path": "src/lib/financial-successor/decimal-rounding-private.test.ts",
    "blob": "3c86e66180a2b99fba3902ab9b8cbf32872c796e",
    "sha256": "f38d25f3d8b0cd604f21a36d676316df411715a6387e9258a0387f46553a8130"
  },
  {
    "path": "src/calculators/exact-rational.ts",
    "blob": "30bfe208ccf03c8898decd6c81c9ee2e3d365ff8",
    "sha256": "cccb4e1366200c799eb82f3542d4f90ecfc0341d8678db29f93d347f39af806a"
  },
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
    "path": "src/calculators/units.test.ts",
    "blob": "78284f18155420c35dabc9001b86753d0d733b46",
    "sha256": "355dd8431ba99d33912acf61462f8a22ed7f97bd03ef0aa7899ef6ff6da91139"
  },
  {
    "path": "src/lib/calculation-snapshot.ts",
    "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
    "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
  },
  {
    "path": "src/lib/publication-factory-contracts-input.ts",
    "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
    "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
  },
  {
    "path": "src/lib/recorded-json-equality.ts",
    "blob": "7c938f6983eae11a352c2cfb67dc428d0fa635f0",
    "sha256": "59fda934bec9e573c970d5a451b3d3e3ba14292838a9c6544cafbd10e71f0fcc"
  },
  {
    "path": "package-lock.json",
    "blob": "dd368ceb52d75eb3998241a001b9e533373146c5",
    "sha256": "b564e5ff97f9dad6c934e6a2eb0977871b2ee3f0b36a23325f1715b241114273"
  },
  {
    "path": "scripts/acceptance-closure-20261108/financial-witnesses.py",
    "blob": "1f5836dcc85ad84b79688eb85c1a55dd08b3620b",
    "sha256": "35204e798ffe89458511d29782c959cdd049b193ca0687a3a434ff14fee0c73e"
  }
];
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function verify(read=readFileSync,readGit=git){
 assert.equal(readGit(['rev-parse','--verify',ref+'^{commit}']).toString().trim(),ref);
 for(const p of pins){assert.equal(readGit(['rev-parse',ref+':'+p.path]).toString().trim(),p.blob);const actual=readGit(['cat-file','blob',p.blob]);assert.equal(hash(actual),p.sha256);assert(read(p.path).equals(actual),'Private financial dependency changed: '+p.path);}
}
test('proposed financial revision binds every numerical/transport/oracle dependency to exact Git source',()=>{
 verify();const packet=JSON.parse(readFileSync('docs/acceptance-closure-20261108/financial-review-packet.json'));
 assert.equal(packet.competentApproval,false);assert.equal(packet.certified,false);assert.equal(packet.publicationEligible,false);assert.equal(packet.allocatedRegisteredSuccessorVersion,null);
 assert.deepEqual(packet.sourceBindings,pins.map(({path,sha256})=>({path,sha256})));
});
for(const p of pins)test('rejects changed proposed financial dependency: '+p.path,()=>{
 assert.throws(()=>verify(path=>path===p.path?Buffer.from('unauthorized'):readFileSync(path)),/dependency changed/);
});
test('rejects missing exact financial provenance',()=>assert.throws(()=>verify(readFileSync,()=>{throw Error('Missing exact source');}),/Missing exact source/));
for(const name of ['src/components/remaining-engineering-review.tsx','.github/workflows/ci.yml']){
 const predecessor=git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+name]),claim=hash(predecessor);
 test('admits exact current source successor: '+name,()=>assert.equal(verifyCompletionBinding(name,readFileSync(name),claim,git),true));
 test('rejects predecessor reversion: '+name,()=>assert.throws(()=>verifyCompletionBinding(name,predecessor,claim,git),/current successor differs/));
 test('rejects unauthorized source bytes: '+name,()=>assert.throws(()=>verifyCompletionBinding(name,Buffer.from('unauthorized'),claim,git),/current successor differs/));
 test('rejects missing provenance: '+name,()=>assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,()=>{throw Error('Missing immutable source');}),/Missing immutable source/));
}
const timerName='src/components/remaining-engineering-review.lossless.test.tsx';
const timerOriginal=git(['show','b2d72aa66293b752739b7924745a57a51c4b5acb:'+timerName]),timerClaim=hash(timerOriginal);
test('preserves original UI evidence hash while admitting exact timer-safe test successor',()=>{
 const retained=JSON.parse(readFileSync('docs/acceptance-closure-20261108/shared-workflow-evidence.json'));assert.equal(retained.sourceSHA256[timerName],timerClaim);assert.equal(verifyCompletionBinding(timerName,readFileSync(timerName),timerClaim,git),true);
});
test('rejects old timer-unsafe test reversion',()=>assert.throws(()=>verifyCompletionBinding(timerName,timerOriginal,timerClaim,git),/current successor differs/));
test('rejects modified timer-safe source',()=>assert.throws(()=>verifyCompletionBinding(timerName,Buffer.from('unauthorized'),timerClaim,git),/current successor differs/));
test('requires exact timer-safe source revision',()=>assert.throws(()=>verifyCompletionBinding(timerName,readFileSync(timerName),timerClaim,()=>{throw Error('Missing immutable source');}),/Missing immutable source/));
