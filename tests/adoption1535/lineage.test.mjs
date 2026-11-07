import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,mkdtempSync,mkdirSync,copyFileSync,symlinkSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {verifyN1PublicationBinding,n1PublicationSupplementalPath} from '../../scripts/n1-publication-lineage.mjs';
import {verifyPublication20CallerLineage} from '../../scripts/publication20-caller-lineage.mjs';
const tool='src/components/publication20-tool.tsx',claim='c3f05dd831f2c53bf01d849de2750cb3094147a824bf14f23468d8e7347a6951';
const git=args=>execFileSync('git',args);
const bytes=readFileSync(tool);
test('N1 disclosure successor preserves original membership and adds only supplemental helper',()=>{
 const receipt=verifyPublication20CallerLineage(process.cwd());
 assert.equal(receipt.sourceBindings,20);assert.equal(receipt.supplementalSourceBindings,2);
 assert.equal(JSON.parse(readFileSync('docs/shortest-publication-20/caller-lineage.json')).sourceHashes[tool],claim);
});
test('rejects overwritten historical claim',()=>assert.throws(()=>verifyN1PublicationBinding(tool,bytes,'0'.repeat(64),git),/historical claim/));
test('rejects substituted predecessor path object',()=>assert.throws(()=>verifyN1PublicationBinding(tool,bytes,claim,args=>args[0]==='rev-parse'&&args[1].startsWith('ee3d0a70')&&args[1].includes(':')?Buffer.from('2cbf53af8b46d71acdb8a756eadb33d1ecd5e2a8'):git(args)),/predecessor binding|Not a valid object/));
test('rejects substituted predecessor bytes',()=>assert.throws(()=>verifyN1PublicationBinding(tool,bytes,claim,args=>args[0]==='cat-file'&&args[2]==='d905119cbb745eee673b4215bcc59359d9692fe1'?Buffer.from('changed predecessor'):git(args)),/predecessor binding/));
test('verifies historical frequency binding on predecessor bytes',()=>assert.throws(()=>verifyN1PublicationBinding(tool,bytes,claim,args=>args[0]==='cat-file'&&args[2]==='2cbf53af8b46d71acdb8a756eadb33d1ecd5e2a8'?Buffer.from('changed historical frequency object'):git(args)),/predecessor binding/));
test('rejects substituted successor object bytes',()=>assert.throws(()=>verifyN1PublicationBinding(tool,bytes,claim,args=>args[0]==='cat-file'&&args[2]===git(['hash-object',tool]).toString().trim()?Buffer.from('changed successor'):git(args)),/source hash/));
for(const name of [tool,n1PublicationSupplementalPath]){
 test('rejects drifted current source '+name,()=>assert.throws(()=>verifyN1PublicationBinding(name,Buffer.from('drift'),name===tool?claim:undefined,git),/source hash/));
 test('rejects symlinked source '+name,()=>{
  const dir=mkdtempSync(path.join(os.tmpdir(),'n1-lineage-'));
  try{
   const m='docs/shortest-publication-20/caller-lineage.json';
   for(const p of [m,'docs/calculator-first-20261105/execution-manifest.json','src/lib/frequency-presentation.ts',n1PublicationSupplementalPath,...Object.keys(JSON.parse(readFileSync(m)).sourceHashes)]){
    const dest=path.join(dir,p);mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(p,dest);
   }
   symlinkSync(git(['rev-parse','--absolute-git-dir']).toString().trim(),path.join(dir,'.git'),'dir');
   rmSync(path.join(dir,name));symlinkSync(path.resolve(name),path.join(dir,name));
   assert.throws(()=>verifyPublication20CallerLineage(dir),/symlink/);
  }finally{rmSync(dir,{recursive:true,force:true});}
 });
}
test('supplemental helper cannot impersonate an original source claim',()=>assert.throws(()=>verifyN1PublicationBinding(n1PublicationSupplementalPath,readFileSync(n1PublicationSupplementalPath),claim,git),/Supplemental/));
