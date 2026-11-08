import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {prepareCanonicalContractEvidence} from '../src/lib/canonical-evidence-preparation';
import {validateHistoricalCanonicalEvidence} from '../src/lib/historical-canonical-evidence';
const path='docs/full-product-batch14/contract-evidence.json';
const checking=process.argv.includes('--check');
const report=checking?validateHistoricalCanonicalEvidence(JSON.parse(readFileSync(path,'utf8'))):prepareCanonicalContractEvidence();
const text=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==text)throw Error('Stale contract evidence');}
else{mkdirSync('docs/full-product-batch14',{recursive:true});writeFileSync(path,text);}
console.log(JSON.stringify(report.summary));
