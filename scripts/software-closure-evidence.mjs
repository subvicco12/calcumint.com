import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const baseline='b96b1ac89971cb8418d2389fbd7c9571a57491f1';
const directory='docs/software-closure';
const check=process.argv.includes('--check');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const original=path=>execFileSync('git',['show',`${baseline}:${path}`],{maxBuffer:32*1024*1024});
const ledgerPath='docs/full-product-batch14/requirements-540.json';
const bytes=await readFile(ledgerPath);
if(!bytes.equals(original(ledgerPath)))throw Error('Historical 540-ID ledger changed');
const ledger=JSON.parse(bytes);
if(ledger.rows.length!==540||ledger.rows.some((r,i)=>r.masterId!==i+1||r.canonicalAccepted))throw Error('Identity/acceptance preservation failed');
const protectedFiles=new Set(['docs/audits/final-acceptance-p0-2026-10-21/acceptance-ledger.csv','docs/blueprint-reconciliation/input/master-blueprint.docx']);
for(const path of ['docs/validation-scale/v1-source-files.json','docs/validation-scale/v2-source-files.json']){
 const manifest=JSON.parse(await readFile(path,'utf8'));
 for(const file of Array.isArray(manifest)?manifest:Object.keys(manifest.files??manifest))protectedFiles.add(typeof file==='string'?file:file.path);
}
// Capture the complete unchanged historical corpus; compare bytes, never rebaseline it.
for(const file of execFileSync('git',['ls-tree','-r','--name-only',baseline,'src/calculators','docs/full-product-batch14','docs/canonical-calculus'],{encoding:'utf8'}).trim().split('\n'))if(file)protectedFiles.add(file);
const preserved=[];
for(const path of [...protectedFiles].sort()){
 if(!path)throw Error('Unknown preservation manifest format');
 const current=await readFile(path);
 if(!current.equals(original(path)))throw Error(`Protected source changed: ${path}`);
 preserved.push({path,sha256:hash(current)});
}
const related=new Set([246,247,248]);
const recovery=new Set([1,2,26,50,51,52,207,388,426]);
const rows=ledger.rows.map((row,i)=>({masterId:row.masterId,title:row.title,implementationClass:row.implementationClass,canonicalAccepted:false,canonicalDisposition:row.implementationClass==='CONTRACT_BLOCKED'?'AUTHORITY_BLOCKED':'FULL_CONTRACT_REVIEW_REQUIRED',inheritedRequirements:{path:`${ledgerPath}#/rows/${i}`,sha256:hash(JSON.stringify(row))},softwareChanges:[...(related.has(row.masterId)?['private-calculus-recovery-presentation']:[]),...(recovery.has(row.masterId)?['scenario-import-lifecycle']:[])],scope:'Engineering associations only; original canonical requirements and applicability restrictions remain in the byte-preserved inherited ledger.'}));
const classes=Object.fromEntries(['REGISTERED_IMPLEMENTED','PRIVATE_COMPLETE','CONTRACT_BLOCKED'].map(k=>[k,rows.filter(r=>r.implementationClass===k).length]));
if(classes.CONTRACT_BLOCKED!==43)throw Error('Authority blocker preservation failed');
const products={
 'requirements-540.json':{schemaVersion:1,baselineSHA:baseline,releaseHold:true,baselineLedgerSHA256:hash(bytes),summary:{identities:540,implementationClasses:classes,newCanonicalAcceptances:0},rows},
 'preservation.json':{schemaVersion:1,baselineSHA:baseline,releaseHold:true,files:preserved},
};
await mkdir(directory,{recursive:true});
for(const [name,value]of Object.entries(products)){
 const path=`${directory}/${name}`,text=JSON.stringify(value,null,2)+'\n';
 if(check){if(await readFile(path,'utf8')!==text)throw Error(`Stale sprint evidence: ${name}`);}else await writeFile(path,text);
}
console.log(JSON.stringify({identities:rows.length,classes,protectedFiles:preserved.length,canonicalPromotions:0}));
