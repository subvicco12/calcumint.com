import {expect,it} from 'vitest';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it.each([[471,10],[517,86]])('captures and restores structured #%i without changing the snapshot',(id,value)=>{
 const contract=mobilityContract(id),workflow=mobilityWorkflows(id);
 const raw=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue)]));
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output[contract.primaryKey]).toBe(value);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 const objectField=id===471?'new':'scale';
 expect(()=>workflow.execute({...raw,[objectField]:'[]'})).toThrow();
 expect(()=>workflow.execute({...raw,[objectField]:'{"unknown":1}'})).toThrow();
});

it('honours supplied grade weighting, irregular scores and policy',()=>{
 const workflow=mobilityWorkflows(517);
 const raw={assessments:'[{"score":80},{"score":null},{"score":90}]',mode:'unweighted',missingPolicy:'exclude',scale:'{"minScore":0,"maxScore":100,"bands":[{"minScore":0,"label":"Lower"},{"minScore":85,"label":"Upper"}]}'};
 expect(workflow.execute(raw).snapshot.output).toMatchObject({average:85,label:'Upper',excludedCount:1});
 expect(()=>workflow.execute({...raw,missingPolicy:'reject'})).toThrow();
 expect(()=>workflow.execute({...raw,mode:'weighted'})).toThrow();
});
