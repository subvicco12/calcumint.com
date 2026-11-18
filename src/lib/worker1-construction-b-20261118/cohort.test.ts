import {expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {constructionContracts,constructionWorkflows,verifyConstructionSnapshot,prepareConstructionRecovery} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const expected=[12, 4, 3, 3, 3, 3, 24, 24, 3*Math.PI];
const inputs=[
 {buildingLengthFeet:'30',buildingWidthFeet:'40',pitchRisePer12:'0',wastePercent:'0'},
 {totalRiseCm:'60',targetRiserHeightCm:'15'},
 {fenceLengthMeters:'5',panelWidthMeters:'2',wastePercent:'0'},
 {deckAreaSquareMeters:'5',boardWidthMeters:'1',boardLengthMeters:'2',wastePercent:'0'},
 {wallAreaSquareMeters:'5',rollCoverageSquareMeters:'2',wastePercent:'0'},
 {areaSquareMeters:'5',packCoverageSquareMeters:'2',wastePercent:'0'},
 {lengthMeters:'4',widthMeters:'3',averageDepthMeters:'2'},
 {lengthMeters:'4',widthMeters:'3',heightMeters:'2'},
 {lengthMeters:'3',internalDiameterMeters:'2'},
] satisfies Record<string,string>[];
it.each(constructionContracts)('verifies bounded workflows and catalog identity for #$catalogId',c=>{
 const index=constructionContracts.indexOf(c),raw=inputs[index] as Record<string,string>,flow=constructionWorkflows(c.catalogId),p=flow.execute(raw);
 expect(readFileSync('data/catalog/master-catalog-2026.csv','utf8')).toContain(`"${c.catalogId}","Engineering & Construction","${c.title}"`);
 expect(c.version).toBe(1);
 expect(p.snapshot.output.value).toBeCloseTo(expected[index],13);
 expect(verifyConstructionSnapshot(p.snapshot).snapshot).toEqual(p.snapshot);
 expect(()=>verifyConstructionSnapshot({...p.snapshot,output:{...p.snapshot.output,value:999}})).toThrow();
 expect(()=>flow.exportPacket(p,'json','free')).toThrow();
 for(const plan of ['pro','business'] as const){
  expect(flow.replay(flow.exportPacket(p,'json',plan))).toEqual(p);
  expect(flow.exportPacket(p,'csv',plan)).toContain(c.unit);
  expect(factoryDownload(flow,p,'pdf',plan,c.title).bytes.length).toBeGreaterThan(100);
  expect(flow.scenario([], 'A',p,'',plan)).toHaveLength(1);
 }
 expect(flow.batch([raw,{...raw,[c.fields[0].key]:''}]).map(row=>!!row.packet)).toEqual([true,false]);
});
it.each([351,352,353,357,358])('refuses rounded-down new counts but preserves historical v1 for #%s',id=>{
 const c=constructionContracts.find(row=>row.catalogId===id)!;
 const input=Object.fromEntries(c.fields.map(f=>[f.key,1]));
 input[c.fields[0].key]=1.0000000000000002;
 if(id!==351)input.wastePercent=0;
 const output=c.engine.calculate(input,{});
 expect(output.value).toBe(1);
 const raw=Object.fromEntries(Object.entries(input).map(([k,v])=>[k,String(v)]));
 expect(()=>constructionWorkflows(id).execute(raw)).toThrow(/ceiling/);
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output};
 expect(prepareConstructionRecovery(snapshot)).toMatchObject({snapshot,currentCaptureAvailable:false});
});
