import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readFileSync as requireBytes} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const packetPath='docs/calculator-sprint-20261108/first-two-packet.json';
const packetBytes=await readFile(packetPath),packet=JSON.parse(packetBytes);
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const tool='src/components/publication20-tool.tsx';
function verify(binding,bytes,readGit=git,read){
 if(binding.path===tool){
  const historical=readGit(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+tool]);
  assert.equal(digest(historical),binding.sha256,'Historical caller claim');
  assert.equal(historical.length,binding.bytes,'Historical caller byte count');
  assert.equal(verifyCompletionBinding(tool,bytes,binding.sha256,readGit,read),true,'Exact captured Final successor required');
 }else{assert.equal(digest(bytes),binding.sha256,binding.path);assert.equal(bytes.length,binding.bytes,binding.path);}
}

test('packet selects the two exact review pending rows without granting acceptance',async()=>{
 const inventory=JSON.parse(await readFile(packet.inventory.path,'utf8'));
 assert.deepEqual(inventory.rows.filter(r=>r.classification==='IMPLEMENTED_REVIEW_PENDING').map(r=>r.masterId),[432,440]);
 assert.deepEqual(packet.rows.map(r=>[r.masterId,r.engineId,r.slug,r.version]),[[432,'conversion.time','time-converter',1],[440,'conversion.frequency','frequency-converter',1]]);
 for(const row of packet.rows){assert.equal(row.retainedExactEngineSHA256Matches,true);assert.equal(row.decisions.competentDecision.status,'PENDING');assert.equal(row.decisions.competentDecision.reviewerName,null);assert.equal(row.decisions.fullyAccepted,false);assert.equal(row.decisions.publicationEligible,false);assert.equal(row.historicalBrowserJourneys.length,3);assert.equal(row.historicalAuthenticatedArtifacts.length,3);}
 assert.equal(packet.productionWrites,false);assert.equal(packet.newApproval,false);
});
test('every current source and retained evidence byte binding still matches',async()=>{
 for(const binding of [packet.inventory,...packet.rows.map(r=>r.engineBinding),...packet.sharedCurrentBindings,...packet.retainedEvidenceBindings]){
 const bytes=await readFile(binding.path);verify(binding,bytes);
 }
});

test('retained packet bytes are immutable at the failed exact head',()=>{
 assert(packetBytes.equals(git(['show','4573902dde62f607ba33acd24e16837805559e02:'+packetPath])));
});
const caller=packet.sharedCurrentBindings.find(binding=>binding.path===tool),awaitBytes=await readFile(tool);
test('rejects valid historical caller reversion after Final migration',()=>assert.throws(()=>verify(caller,git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+tool])),/current successor differs/));
test('rejects unreviewed current caller bytes',()=>assert.throws(()=>verify(caller,Buffer.from('tamper')),/current successor differs/));
test('rejects missing exact Git successor provenance',async()=>assert.throws(()=>verify(caller,awaitBytes,()=>{throw Error('Missing immutable provenance');}),/Missing immutable provenance/));
test('rejects changed current renderer dependency',()=>assert.throws(()=>verify(caller,awaitBytes,git,name=>name==='src/components/final-calculator-renderer.tsx'?Buffer.from('changed renderer'):requireBytes(name)),/supplemental source bytes differ/));
