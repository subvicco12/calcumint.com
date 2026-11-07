import {createHash} from 'node:crypto';
const predecessor='761b850479ea36b2b4ebf8039664d8400c762555';
// Independent immutable object pins: the historical caller manifest remains unchanged.
const bindings=[
  {
    "path": "src/components/publication20-tool.tsx",
    "predecessorBlob": "2cbf53af8b46d71acdb8a756eadb33d1ecd5e2a8",
    "predecessorSHA256": "c3f05dd831f2c53bf01d849de2750cb3094147a824bf14f23468d8e7347a6951",
    "successorBlob": "d905119cbb745eee673b4215bcc59359d9692fe1",
    "successorSHA256": "12cd4be9c1054cbe64d4350b71a62ff52fda2b331cca7c116cff84ab6ea19d51"
  },
  {
    "path": "src/components/publication20-batch.tsx",
    "predecessorBlob": "5de32691ddefe748679fe4df6c4b20ad4e4746f0",
    "predecessorSHA256": "6288b2ccdc4236c0c2c7b4e37cc7cbb52c94df8eb7b5aa8e1db9ad1f27c35ea9",
    "successorBlob": "1a6bc1208d67a1815ed3f9dc6cda1ebdcaa6deda",
    "successorSHA256": "f0382de47a12962efdb3b744a655343f7282488fe31dfab695341acdfadad661"
  },
  {
    "path": "src/lib/frequency-presentation.ts",
    "predecessorBlob": null,
    "predecessorSHA256": null,
    "successorBlob": "b2be37990725e83dfbedce4ebc3dcef3b874677e",
    "successorSHA256": "b9c0015f7a6ca30426c2963a10384c05cc99b3cd5d08dc1d1782af48ddfabb05"
  }
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyFrequencyPresentationBinding(name,bytes,originalClaim,git){
 const binding=bindings.find(b=>b.path===name);
 if(!binding)return false;
 if(git(['rev-parse','--verify',predecessor+'^{commit}']).toString().trim()!==predecessor)throw Error('Exact frequency presentation predecessor unavailable');
 if(binding.predecessorBlob){
  if(originalClaim!==binding.predecessorSHA256)throw Error('Caller source hash historical claim differs: '+name);
  const object=git(['rev-parse',predecessor+':'+name]).toString().trim();
  if(object!==binding.predecessorBlob||hash(git(['cat-file','blob',object]))!==binding.predecessorSHA256)throw Error('Frequency presentation predecessor binding differs: '+name);
 }else if(originalClaim!==undefined)throw Error('Supplemental frequency presentation claim differs');
 const successor=git(['cat-file','blob',binding.successorBlob]);
 if(hash(successor)!==binding.successorSHA256||hash(bytes)!==binding.successorSHA256||!bytes.equals(successor))throw Error('Caller source hash frequency presentation successor differs: '+name);
 return true;
}
export const frequencyPresentationSupplementalPath='src/lib/frequency-presentation.ts';
