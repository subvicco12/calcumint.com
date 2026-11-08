import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyCompletionBinding} from './product-completion-lineage.mjs';
import {verifyCallerSuccessor} from './check-calculator-closure-history.mjs';
import {verifyPublication20CallerLineage} from './publication20-caller-lineage.mjs';
const root=process.cwd(),directory='docs/shortest-publication-20';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe']});
export function verifyShortestManifest(bytes,readGit=git){
 const original=readGit(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:docs/shortest-publication-20/implementation-manifest.json']);
 if(!bytes.equals(original))throw Error('Historical shortest-publication manifest differs');
 return JSON.parse(bytes);
}
const manifest=verifyShortestManifest(readFileSync(`${directory}/implementation-manifest.json`));
const ids=[370,371,372,373,374,423,424,425,427,428,429,430,431,432,433,434,437,438,439,440];
if(JSON.stringify([...manifest.selectedIds].sort((a,b)=>a-b))!==JSON.stringify(ids)||manifest.releaseHold!==true||manifest.newCanonicalAccepted!==0||manifest.newPublicationEligible!==0||manifest.newFullScopeAccepted!==0)throw Error('Cohort/authority boundary changed');
export function verifyShortestSourceBinding(file,expected,read=readFileSync,readGit=git){
 const bytes=read(file);
 if(verifyCompletionBinding(file,bytes,expected,readGit))return;
 if(createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('Source binding differs: '+file);
}
for(const [file,expected]of Object.entries(manifest.sourceHashes))verifyShortestSourceBinding(file,expected);
const decisions=JSON.parse(readFileSync(`${directory}/decision-packages.json`));if(decisions.publicationAuthorized!==false||decisions.qaApprovalsCreated!==0)throw Error('Unsigned engineering package cannot authorize publication');
verifyCallerSuccessor(root);const lineage=verifyPublication20CallerLineage(root);
console.log(JSON.stringify({identities:20,callerBindings:lineage.sourceBindings,sourceBindings:Object.keys(manifest.sourceHashes).length,canonicalAccepted:0,publicationEligible:0,releaseHold:true}));
