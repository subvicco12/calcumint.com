/** Exact guard-only source lineage; no mathematical acceptance or release approval. */
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const predecessor='a955cdad7019a645b7ed2950299d0603ba1784a7';
const successor='af92e4f4fc2a024d50fb2c71271b09e221b2c6fe';
// Immutable source-object pins. Historical manifests and frozen captures stay unchanged.
const bindings=[
  {
    "path": "src/calculators/finance/compound-interest.ts",
    "predecessorBlob": "b4352d54ce34f8342e731a08cbb95f7205d9ad3d",
    "predecessorSHA256": "758f8ef3e2ac43fb91e22b6b3e6f67734548fae3b38653e3ae3bcd29ca4a4c60",
    "successorBlob": "b905832a35146c6233cf4d522c2c1efd36cabf74",
    "successorSHA256": "7c948d1deec2565b9386f9978f1ef6f81c33993354065e9d8a393aeb5cf28b8d"
  },
  {
    "path": "src/calculators/finance/loan-payment.ts",
    "predecessorBlob": "e19da610c943819370a8626a83765cf757587885",
    "predecessorSHA256": "4393094b6ed6141e9498fb824bd2ba469142c5fe8d54f2d145997fb4d391b160",
    "successorBlob": "9153ea4b9ef3f28567f07c06ed93ad65f8e73459",
    "successorSHA256": "c4347c6d8d5cc7ea7d95bc2eda914a3f9eb4faba37f373d4be521f71dd2923f5"
  },
  {
    "path": "src/calculators/precision.ts",
    "predecessorBlob": "2bed08d0b3d69aed036bc6b401d5c28c97154d35",
    "predecessorSHA256": "859d54c9e77a132991117376672af4a8c61630c5cff398272abdca8919cba563",
    "successorBlob": "20224230a5011fdc198dcd04c5cb4f3cdb35f8c4",
    "successorSHA256": "139319afc73ef22c45dd46ef94b56b85f3442ed57b239cd6a0e59f92cd68643a"
  }
];
export const financialHistoricalWitnessRefs=Object.freeze(['7eff39b23a52953c028852d50d5571211a3f8a44','2f088187dd395fd26262c32195b427258f44fa44']);
export const financialSafetySourceRefs=Object.freeze([predecessor,successor,...financialHistoricalWitnessRefs]);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyFinancialSafetyBinding(name,bytes,originalClaim,git){
 const binding=bindings.find(b=>b.path===name);
 if(!binding)return false;
 if(originalClaim!==binding.predecessorSHA256)throw Error('Financial safety historical claim differs: '+name);
 for(const [label,ref] of [['predecessor',predecessor],['successor',successor]]){
  if(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim()!==ref)throw Error('Exact financial safety '+label+' unavailable');
  const object=git(['rev-parse',ref+':'+name]).toString().trim();
  if(object!==binding[label+'Blob'])throw Error('Financial safety '+label+' object differs: '+name);
  const source=git(['cat-file','blob',object]);
  if(hash(source)!==binding[label+'SHA256'])throw Error('Financial safety '+label+' source differs: '+name);
  if(label==='successor'&&(!bytes.equals(source)||hash(bytes)!==binding.successorSHA256))throw Error('Financial safety current successor differs: '+name);
 }
 return true;
}
// Small bridge for the two existing Python frozen-membership checks.
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [flag,name,claim]=process.argv.slice(2);
 if(flag!=='--verify'||!name||!claim||process.argv.length!==5)throw Error('Usage: --verify path historicalSHA256');
 const repository=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 const git=args=>execFileSync('git',args,{cwd:repository,stdio:['ignore','pipe','pipe']});
 if(!bindings.some(b=>b.path===name))throw Error('Unknown financial safety path');
 if(!verifyFinancialSafetyBinding(name,readFileSync(path.join(repository,name)),claim,git))throw Error('Financial safety binding unavailable');
}
