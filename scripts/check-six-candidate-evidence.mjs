import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const directory='docs/publication-candidate-closure';
const manifest=JSON.parse(readFileSync(`${directory}/implementation-manifest.json`,'utf8'));
if(manifest.baseline!=='2c89a0d774c771d10dd0d910c2d0bd4a614d0c39'||manifest.releaseHold!==true||manifest.canonicalAccepted!==0||manifest.publicationEligible!==0||manifest.registeredSuccessorsAllocated!==0)throw Error('Unexpected authority promotion');
for(const [path,expected]of Object.entries(manifest.sourceHashes)){
 if(createHash('sha256').update(readFileSync(path)).digest('hex')!==expected)throw Error('Candidate source binding changed: '+path);
}
for(const name of ['financial-review-11.json','successor-adoption.json','authority-facts.json']){
 const input=JSON.parse(readFileSync(`${directory}/${name}`,'utf8'));
 const visit=value=>{if(!value||typeof value!=='object')return;if(value.sourceHashes)for(const [path,expected]of Object.entries(value.sourceHashes))if(createHash('sha256').update(readFileSync(path)).digest('hex')!==expected)throw Error('Decision source hash mismatch: '+path);for(const child of Object.values(value))visit(child);};visit(input);
}
console.log(JSON.stringify({candidateIds:[235,251,275,276,282,283],exactSourceBindings:Object.keys(manifest.sourceHashes).length,canonicalAccepted:0,publicationEligible:0,releaseHold:true}));
