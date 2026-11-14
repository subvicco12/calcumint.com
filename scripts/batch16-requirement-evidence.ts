import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {collectBatch16RequirementEvidence} from '../src/lib/batch16-requirement-evidence';
import {validateHistoricalBatch16Report} from '../src/lib/historical-canonical-evidence';
const current=collectBatch16RequirementEvidence();
const report=process.argv.includes('--check')?validateHistoricalBatch16Report(current):current;
const text=JSON.stringify(report,null,2)+'\n';
const directory='docs/full-product-batch16';
const artifacts={
 [`${directory}/requirements-540.json`]:text,
 [`${directory}/requirement-evidence-metadata.json`]:JSON.stringify({schemaVersion:1,requirementsSHA256:createHash('sha256').update(text).digest('hex'),sourceHashes:report.sourceHashes,summary:report.summary,baseline:'1f1f32797b99f0760aeb55b5ff112ad6a8c50383',baselineHostedCI:'41232409178 FAILED; repair path, not a green baseline',meaning:'Exact per-requirement classification and live rerun of existing witnesses; zero new canonical acceptance or independent witnesses.',releaseHold:true},null,2)+'\n',
};
for(const [path,data] of Object.entries(artifacts)){
 if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==data)throw Error('Stale requirement evidence: '+path);}
 else{mkdirSync(directory,{recursive:true});writeFileSync(path,data);}
}
console.log(JSON.stringify(report.summary));
