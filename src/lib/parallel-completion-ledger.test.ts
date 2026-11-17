import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
it('preserves every canonical row and limits new engineering claims to five conditional exact-version candidates',()=>{
 const before=read('docs/thirteen-program-20261110/requirements-540.json'),after=read('docs/parallel-completion-20261110/requirements-540.json'),matrix=read('docs/parallel-completion-20261110/engineering-five.json');
 expect(after.rows).toHaveLength(540);expect(new Set(after.rows.map((r:{masterId:number})=>r.masterId)).size).toBe(540);expect(after.counts).toEqual(before.counts);
 const ids=[369,375,380,381,387];expect(matrix.rows.map((r:{masterId:number})=>r.masterId)).toEqual(ids);expect(matrix.newConfirmedBeforeCI).toBe(0);
 for(let i=0;i<540;i++){
  const current={...after.rows[i]},previous={...before.rows[i]};
  if(ids.includes(current.masterId)){
   expect(current.priorEngineeringAssessmentAtA7).toBe(previous.engineeringAssessment);
   expect(current.engineeringAssessment).toBe('SCOPED_ENGINEERING_COMPLETE_CANDIDATE_PENDING_FINAL_EXACT_HEAD_CI');
   for(const key of ['priorEngineeringAssessmentAtA7','engineeringAssessment','currentEngineeringEvidence','currentEngineeringBlockers'])delete current[key];
   for(const key of ['engineeringAssessment','currentEngineeringEvidence','currentEngineeringBlockers'])delete previous[key];
  }
  expect(current).toEqual(previous);
 }
 for(const row of matrix.rows){expect(row.technicalVersion).toBe(1);expect(row.canonicalAccepted).toBe(false);expect(row.certificationGranted).toBe(false);expect(row.publicationEligible).toBe(false);expect(row.remainingExternal).toHaveLength(4);}
 expect(read('docs/parallel-five-20261110/authenticated/receipt.json').priorFailedRunPromoted).toBe(false);
 expect(after.releaseHold).toBe(true);
});
