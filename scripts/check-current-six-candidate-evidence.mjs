import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyFinancialSafetyBinding} from './financial-safety-lineage.mjs';
import {verifyCompletionBinding} from './product-completion-lineage.mjs';
const directory='docs/publication-candidate-closure';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024});
// These remain historical evidence packets. Current guard/presentation changes
// have separate exact Git provenance and do not rewrite their approval state.
for(const name of ['implementation-manifest.json','financial-review-11.json','successor-adoption.json','authority-facts.json']){
 const path=`${directory}/${name}`;
 if(!readFileSync(path).equals(git(['show',`a955cdad7019a645b7ed2950299d0603ba1784a7:${path}`])))throw Error('Historical candidate packet differs: '+path);
}
export function verifyCurrentCandidateBinding(path,expected,read=readFileSync,readGit=git){
 const bytes=read(path);
 // Known successors must not silently revert just because the old hash matches.
 if(verifyFinancialSafetyBinding(path,bytes,expected,readGit)||verifyCompletionBinding(path,bytes,expected,readGit))return;
 if(createHash('sha256').update(bytes).digest('hex')===expected)return;
 throw Error('Candidate source binding changed: '+path);
}
const manifest=JSON.parse(readFileSync(`${directory}/implementation-manifest.json`,'utf8'));
if(manifest.baseline!=='2c89a0d774c771d10dd0d910c2d0bd4a614d0c39'||manifest.releaseHold!==true||manifest.canonicalAccepted!==0||manifest.publicationEligible!==0||manifest.registeredSuccessorsAllocated!==0)throw Error('Unexpected authority promotion');
for(const [path,expected]of Object.entries(manifest.sourceHashes)){
 verifyCurrentCandidateBinding(path,expected);
}
for(const name of ['financial-review-11.json','successor-adoption.json','authority-facts.json']){
 const input=JSON.parse(readFileSync(`${directory}/${name}`,'utf8'));
 const visit=value=>{if(!value||typeof value!=='object')return;if(value.sourceHashes)for(const [path,expected]of Object.entries(value.sourceHashes))verifyCurrentCandidateBinding(path,expected);for(const child of Object.values(value))visit(child);};visit(input);
}
console.log(JSON.stringify({candidateIds:[235,251,275,276,282,283],exactSourceBindings:Object.keys(manifest.sourceHashes).length,canonicalAccepted:0,publicationEligible:0,releaseHold:true}));
