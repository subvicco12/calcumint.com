/** Local/read-only contract and ancestry evidence. Never modifies catalog authority. */
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {privateSuppliedDefinitions,suppliedCaseBindings} from '../src/calculators/private-supplied-contracts';
const directory='docs/windows-sprint';
const sha=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
const start='902f1ef9266fd70bfa2e01abba66971a712f202d';
const prs=JSON.parse(readFileSync(`${directory}/pr-heads.json`,'utf8')) as {number:number;head:string}[];
const ancestry=prs.map(pr=>({...pr,ancestorOfStartingHead:spawnSync('git',['merge-base','--is-ancestor',pr.head,start]).status===0,disposition:pr.number===1471?'KEEP_SEPARATE_PUBLIC_ONLY_PRODUCT_SCOPE':pr.number===1472?'CIDR_RENDERER_ADAPTED_LOCALLY_NO_MERGE':'ALREADY_ANCESTOR'}));
writeFileSync(`${directory}/pr-reconciliation.json`,JSON.stringify({startingSHA:start,prs:ancestry},null,2)+'\n');
const master=readFileSync('data/catalog/master-catalog-2026.csv','utf8');
const titles=new Map([...master.matchAll(/^"(\d+)","[^"]+","([^"]+)"/gm)].map(m=>[Number(m[1]),m[2]]));
const paths=['src/calculators/private-supplied-contracts.ts','src/calculators/private-supplied-contracts.test.ts','src/calculators/source-driven-components.ts','src/calculators/owner-model-support.ts','src/lib/calculation-snapshot.ts'];
writeFileSync(`${directory}/contract-inventory.json`,JSON.stringify({startingSHA:start,releaseHold:true,canonicalCalculatorsAccepted:0,componentSupportCases:suppliedCaseBindings.map(b=>({...b,title:titles.get(b.masterId)})),dependencies:paths.map(path=>({path,sha256:sha(path)})),contracts:privateSuppliedDefinitions.map(d=>({id:d.id,slug:d.slug,version:d.version,reviewStatus:d.reviewStatus,inputSchema:z.toJSONSchema(d.inputSchema),formulas:d.formulas,sources:d.sources,independentExamples:d.examples})),protectedHashes:JSON.parse(readFileSync('data/catalog/source-driven-2026-10-27/engineering-register.json','utf8')).protectedHashes,repositoryHeadAtGeneration:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim()},null,2)+'\n');
console.log(`Recorded ${privateSuppliedDefinitions.length} private contracts, ${suppliedCaseBindings.length} support cases and ${ancestry.length} reconciled PR heads.`);
