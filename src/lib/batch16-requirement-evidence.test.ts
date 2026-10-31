import {describe,expect,it} from 'vitest';
import {collectBatch16RequirementEvidence,validateBatch16RequirementEvidence} from './batch16-requirement-evidence';

describe('exact requirement evidence without canonical promotion',()=>{
 it('processes all identities but limits independent witness coverage to the exact 79 bindings',()=>{
  const report=collectBatch16RequirementEvidence();
  expect(report.rows).toHaveLength(540);
  expect(report.summary).toMatchObject({reviewRequired:497,authorityBlocked:43,exactLiveAdapters:79,existingWitnessChecks:1106,canonicalAccepted:0});
  expect(report.rows.filter(r=>r.liveAdapter!==null)).toHaveLength(79);
  expect(report.rows.every(r=>!r.canonicalAccepted&&r.releaseHold)).toBe(true);
  for(const row of report.rows){
   expect(row.requirements.find(r=>r.requirementId==='canonical-product-acceptance')?.status).toBe('BLOCKED');
   for(const id of ['charts','accessibility','performance','browser-interaction'])expect(row.requirements.find(r=>r.requirementId===id)?.status).toBe(row.implementationClass==='CONTRACT_BLOCKED'?'BLOCKED':'UNKNOWN');
   if(!row.liveAdapter)expect(row.requirements.filter(r=>r.scope==='BOUNDED_ENGINE_WITNESSES').every(r=>r.status!=='VERIFIED')).toBe(true);
  }
 });
 it('uses exact master-bound witnesses rather than family or component associations',()=>{
  const report=collectBatch16RequirementEvidence();
  const row=report.rows.find(r=>r.masterId===3)!;
  expect(row.liveAdapter?.adapterKey).toBe('private.component.3');
  const golden=row.requirements.find(r=>r.requirementId==='goldens-and-rounding')!;
  expect(golden.status).toBe('VERIFIED');expect(golden.evidence).toHaveLength(2);
  expect(golden.evidence.every(e=>e.path.includes('/rows/2/engineeringEvaluation/checks/'))).toBe(true);
  expect(report.rows.find(r=>r.masterId===1)!.requirements.find(r=>r.requirementId==='goldens-and-rounding')?.status).toBe('UNKNOWN');
  expect(report.rows.find(r=>r.masterId===1)!.requirements.find(r=>r.requirementId==='scenario-workflows')?.status).toBe('PARTIAL');
  expect(report.rows.find(r=>r.masterId===37)!.requirements.find(r=>r.requirementId==='scenario-workflows')?.status).toBe('PARTIAL');
  expect(report.rows.find(r=>r.masterId===207)!.requirements.find(r=>r.requirementId==='scenario-workflows')?.status).toBe('UNKNOWN');
 });
 it('rejects promoted statuses, substituted identity, stale hashes and changed exact evidence pointers',()=>{
  const report=collectBatch16RequirementEvidence();
  for(const mutate of [
   (r:typeof report)=>{r.rows[0].masterId=3;},
   (r:typeof report)=>{r.sourceHashes['docs/software-closure/requirements-540.json']='stale';},
   (r:typeof report)=>{r.rows[0].requirements.find(x=>x.requirementId==='charts')!.status='VERIFIED';},
   (r:typeof report)=>{r.rows[2].liveAdapter!.engineVersion++;},
   (r:typeof report)=>{r.rows[2].requirements.find(x=>x.requirementId==='goldens-and-rounding')!.evidence[0].path='family/3';},
  ]){const changed=structuredClone(report);mutate(changed);expect(()=>validateBatch16RequirementEvidence(changed)).toThrow();}
 },15000);
});
