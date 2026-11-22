import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {prepareCanonicalContractEvidence} from '../src/lib/canonical-evidence-preparation';
import {execFileSync} from 'node:child_process';
import {validateNinePathBatch14} from './nine-path-batch14';
import {validateHistoricalCanonicalEvidence} from '../src/lib/historical-canonical-evidence';
const path='docs/full-product-batch14/contract-evidence.json';
const checking=process.argv.includes('--check');
const report=checking?checkHistorical():prepareCanonicalContractEvidence();
function checkHistorical(){
 const actual=execFileSync('git',['rev-parse','HEAD:src'],{encoding:'utf8'}).trim();
 const raw=readFileSync(path);
 if(actual==='5d7d97aca8157847e26875155ed81e163d392ad1')return validateNinePathBatch14(raw);
 return validateHistoricalCanonicalEvidence(JSON.parse(raw.toString()));
}
const text=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==text)throw Error('Stale contract evidence');}
else{mkdirSync('docs/full-product-batch14',{recursive:true});writeFileSync(path,text);}
console.log(JSON.stringify(report.summary));
