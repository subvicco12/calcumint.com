import {createHash} from 'node:crypto';
import {verifyFrequencyPresentationBinding} from './frequency-presentation-lineage.mjs';
const predecessor='ee3d0a70cf5a908ce3588bb02b67bbb86576a8a7';
const tool='src/components/publication20-tool.tsx';
const historicalClaim='c3f05dd831f2c53bf01d849de2750cb3094147a824bf14f23468d8e7347a6951';
const predecessorBlob='d905119cbb745eee673b4215bcc59359d9692fe1';
const predecessorSHA256='12cd4be9c1054cbe64d4350b71a62ff52fda2b331cca7c116cff84ab6ea19d51';
export const n1PublicationSupplementalPath='src/lib/n1-publication-methodology.ts';
// Independent pins for the reviewed disclosure-only successor. Never rewrite historical claims.
const bindings={
 [tool]:{blob:'c1a8be2fbd29ec3b5e822fad3b4ca93878e60fa0',sha256:'4c5ad7ad371345c640f420e5fc5492ef4df7b2ada11468f54e74cf31cc07e589'},
 [n1PublicationSupplementalPath]:{blob:'8e05a821decc75f066f4f77d60c89409915b2130',sha256:'45758a400444cb578cef0ea20b1640d1f06b7eb1c18b3ac9f2092cec1da1a9dd'},
};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyN1PublicationBinding(name,bytes,originalClaim,git){
 if(!Object.hasOwn(bindings,name))return false;
 const binding=bindings[name];
 if(git(['rev-parse','--verify',predecessor+'^{commit}']).toString().trim()!==predecessor)throw Error('Exact N1 publication predecessor unavailable');
 if(name===tool){
  if(originalClaim!==historicalClaim)throw Error('Caller source hash historical claim differs: '+name);
  const object=git(['rev-parse',predecessor+':'+tool]).toString().trim();
  const oldBytes=git(['cat-file','blob',object]);
  if(object!==predecessorBlob||hash(oldBytes)!==predecessorSHA256)throw Error('N1 publication predecessor binding differs');
  verifyFrequencyPresentationBinding(tool,oldBytes,originalClaim,git);
 }else if(originalClaim!==undefined)throw Error('Supplemental N1 publication claim differs');
 const successor=git(['cat-file','blob',binding.blob]);
 if(hash(successor)!==binding.sha256||hash(bytes)!==binding.sha256||!bytes.equals(successor))throw Error('Caller source hash N1 publication successor differs: '+name);
 return true;
}
