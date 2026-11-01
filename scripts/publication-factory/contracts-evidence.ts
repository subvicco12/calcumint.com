import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {publicationFactoryContracts} from '../../src/lib/publication-factory-contracts';
import {parsePublicationFactoryInput} from '../../src/lib/publication-factory-contracts-input';
import {allContractVectors,getScaledAdapter,exportScaledContract,importScaledContract} from '../../src/calculators/scaled-contract-adapters';
import {assertGolden,sameContractData} from '../../src/calculators/canonical-contract-validation';
import {assertScaledGolden} from '../../src/calculators/scaled-contract-validation';
const hash=(text:string)=>createHash('sha256').update(text).digest('hex');
const paths=['docs/full-product-batch16/contract-groups.json','docs/full-product-batch16/requirements-540.json','docs/calculator-first/publication-readiness-540.json','src/lib/publication-factory-contracts.ts','src/lib/publication-factory-contracts-input.ts','src/calculators/canonical-contract-vectors.ts','src/calculators/scaled-contract-vectors.ts','src/calculators/component-contracts.ts','src/calculators/remaining-contracts.ts','src/calculators/canonical-contract-adapters.ts','src/calculators/scaled-contract-adapters.ts'];
const rows=publicationFactoryContracts.map(binding=>{
 const adapter=getScaledAdapter(binding.adapterKey),vectors=allContractVectors.find(v=>v.id===binding.masterId);
 if(!vectors||adapter.version!==binding.engineVersion||adapter.catalogId!==binding.masterId)throw Error('Exact runtime binding mismatch');
 const witnesses=vectors.witnesses.map(w=>{
  const input=parsePublicationFactoryInput(JSON.stringify(w.input)),free=exportScaledContract(adapter.key,input,'free');
  adapter.output.parse(adapter.getOutput(free.artifact));if('absoluteTolerance' in w)assertScaledGolden(adapter.getOutput(free.artifact),w.expected,w.absoluteTolerance as number);else assertGolden(adapter.getOutput(free.artifact),w.expected);
  const plans=['pro','business'] as const;
  for(const plan of plans)if(!sameContractData(free,exportScaledContract(adapter.key,input,plan)))throw Error('Mathematical plan parity failed');
  const serialized=JSON.stringify(free);
  if(!sameContractData(importScaledContract(JSON.parse(serialized)),free))throw Error('Historical artifact replay failed');
  return {name:w.name,inputSHA256:hash(JSON.stringify(input)),artifactSHA256:hash(serialized),goldenPassed:true,mathematicalArtifactPlanParity:true,originalArtifactReplay:true};
 });
 return {...binding,witnesses,canonicalAccepted:false,publicationAuthorized:false,releaseHold:true};
});
const report={schemaVersion:1,meaning:'Offline exact private candidate checks using existing independent per-ID witnesses. Shared software protocol only; no family evidence transfer or full-product acceptance.',sourceHashes:Object.fromEntries(paths.map(path=>[path,hash(readFileSync(path,'utf8'))])),summary:{identities:rows.length,witnesses:rows.reduce((sum,row)=>sum+row.witnesses.length,0),canonicalAccepted:0,publicationAuthorized:0},rows,releaseHold:true};
const path='docs/publication-factory/contracts-evidence.json',text=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==text)throw Error('Stale contracts evidence');}else{mkdirSync('docs/publication-factory',{recursive:true});writeFileSync(path,text);}
console.log(JSON.stringify(report.summary));
