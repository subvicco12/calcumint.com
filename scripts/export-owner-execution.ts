import {mkdirSync,writeFileSync} from 'node:fs';
import {buildOwnerExecutionManifest} from '../src/calculators/owner-execution-manifest';
const output=process.argv[2];if(!output)throw Error('Explicit offline output directory required');const report=buildOwnerExecutionManifest();mkdirSync(output,{recursive:true});writeFileSync(output+'/manifest.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary,null,2));
