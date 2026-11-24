import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('captures the immutable finite surface samples and refuses reversed bounds',()=>{
 const workflow=mobilityWorkflows(252);
 const raw={expression:'x^2+y^2',minX:'-2',maxX:'2',minY:'-2',maxY:'2'};
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output).toMatchObject({minimum:0,maximum:8,gridSize:17});
 expect(packet.snapshot.output.points).toHaveLength(289);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
 expect(()=>workflow.execute({...raw,maxX:'-3'})).toThrow();
});

it.each([
 [{odds:'3',probability:''},{odds:3,probability:0.75,direction:'odds-to-probability'}],
 [{odds:'',probability:'0.75'},{odds:3,probability:0.75,direction:'probability-to-odds'}],
])('captures and restores the exact selected odds direction', (raw,output)=>{
 const workflow=mobilityWorkflows(301);
 const packet=workflow.execute(raw);
 expect(packet.snapshot.output).toMatchObject(output);
 expect(prepareMobilityRecovery(packet.snapshot).currentCaptureAvailable).toBe(true);
 expect(workflow.replay(workflow.exportPacket(packet,'json','pro')).snapshot).toEqual(packet.snapshot);
});

it('refuses ambiguous, missing, out-of-domain and unknown fields',()=>{
 const workflow=mobilityWorkflows(301);
 const invalid:Record<string,string>[]=[{odds:'1',probability:'0.5'},{odds:'',probability:''},{probability:'1'},{odds:'-1'},{odds:'1',extra:'2'}];
 for(const raw of invalid){
  expect(()=>workflow.execute(raw)).toThrow();
 }
});

it.each([{odds:'3'},{probability:'0.75'}] as Record<string,string>[])('exports PDF with only the verified directional input',raw=>{
 const workflow=mobilityWorkflows(301);
 const packet=workflow.execute(raw);
 expect(factoryDownload(workflow,packet,'pdf','pro','Odds Calculator').bytes.length).toBeGreaterThan(0);
});
