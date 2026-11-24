import {expect,it} from 'vitest';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import {mobilityContract,mobilityWorkflows,prepareMobilityRecovery} from './cohort';

it('preserves all four equally likely single-locus outcomes',()=>{
 const w=mobilityWorkflows(418),raw={parent1:'Aa',parent2:'Aa'};
 const p=w.execute(raw);
 expect(p.snapshot.output.offspring).toEqual(['AA','Aa','Aa','aa']);
 expect(p.snapshot.output.genotypeProbabilities).toEqual({AA:.25,Aa:.5,aa:.25});
 expect(()=>w.execute({...raw,parent2:'Bb'})).toThrow();
 expect(prepareMobilityRecovery(p.snapshot)).toMatchObject({catalogId:418,currentCaptureAvailable:true});
 expect(w.scenario([],'A',p,'','pro')[0].packet).toEqual(p);
 expect(w.batch([raw,{...raw,parent1:'A'}]).map(r=>!!r.packet)).toEqual([true,false]);
 const report=factoryDownload(w,p,'json','pro',mobilityContract(418).title);
 expect(w.replay(new TextDecoder().decode(report.bytes))).toEqual(p);
});
