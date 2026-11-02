import {it,expect} from 'vitest';
import {computeStatisticsArtifact,snapshotStatistics,replayStatistics} from './statistics-workflow';
import {createFullSixSnapshot,serializeFullSixSnapshot} from '@/lib/full-six-snapshot';
const input={mode:'sample' as const,encoding:'frequency' as const,unit:'m',rows:[{value:'0.10000000000000001',frequency:'2'},{value:'0.2',frequency:'1'}]};
it('binds paired actual-engine artifacts to exact independent identity, contract and original/squared units',()=>{
 const sd=computeStatisticsArtifact(282,input),variance=computeStatisticsArtifact(283,input);
 expect(sd.contractSHA256).not.toBe(variance.contractSHA256);
 if(sd.outcome.status!=='finite'||variance.outcome.status!=='finite')throw Error('Expected finite result');
 expect(sd.outcome.values.primary).toMatchObject({raw:sd.outcome.values.standardDeviation.raw,unit:'m'});
 expect(variance.outcome.values.primary).toMatchObject({raw:variance.outcome.values.variance.raw,unit:'m^2'});
 expect(sd.inputs['0']).toContain('0.10000000000000001');
 expect(sd.outcome.values.effectiveN.raw).toBe('3');expect(sd.outcome.values.denominator.raw).toBe('2');
});
it('preserves actual mathematical artifact parity across plan contexts without a plan compute switch',async()=>{
 const artifacts=await Promise.all(['free','pro','business'].map(()=>snapshotStatistics(283,input)));
 expect(new Set(artifacts.map(x=>x.sha256)).size).toBe(1);
});
it.each([282,283] as const)('exports/replays #%s exact artifact and rejects modified/rehashed output and cross-ID replay',async id=>{
 const snapshot=await snapshotStatistics(id,input),text=serializeFullSixSnapshot(snapshot);
 expect(await replayStatistics(text,id)).toEqual(snapshot);
 await expect(replayStatistics(text,id===282?283:282)).rejects.toThrow('binding');
 const changed=structuredClone(snapshot.artifact);
 if(changed.outcome.status!=='finite')throw Error('Expected finite');
 changed.outcome.values.primary.raw='123';
 const forged=await createFullSixSnapshot(changed);
 await expect(replayStatistics(serializeFullSixSnapshot(forged),id)).rejects.toThrow('Recomputation');
 expect(snapshot.artifact.outcome).not.toEqual(changed.outcome);
});
it('refuses saving domain errors instead of substituting zero or an artifact',async()=>{
 const artifact=computeStatisticsArtifact(283,{...input,rows:[{value:'1',frequency:'1'}]});
 expect(artifact.outcome.status).toBe('domain-error');
 await expect(snapshotStatistics(283,{...input,rows:[{value:'NaN',frequency:'2'}]})).rejects.toThrow('Cannot save');
});
