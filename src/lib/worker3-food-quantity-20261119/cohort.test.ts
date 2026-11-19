import {expect,it} from 'vitest';
import {foodContracts,foodWorkflows,verifyFoodSnapshot,prepareFoodRecovery,foodRoundedQuantityKeys} from './cohort';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
const ids=[496,497,499,500,501,503,504,505];
const inputs:Record<string,string>[]=[
 {originalServings:'4',targetServings:'10',originalQuantity:'250'},{totalQuantity:'1200',servings:'6'},
 {ingredientWeightGrams:'700',flourWeightGrams:'1000'},{waterWeightGrams:'700',flourWeightGrams:'1000'},
 {originalPanArea:'64',targetPanArea:'100',originalIngredientQuantity:'200'},
 {nutrientAmountPerServing:'12',servings:'2.5'},{waterGrams:'600',waterToCoffeeRatio:'16'},{riceAmount:'2',waterPerRiceUnit:'1.5'}
];const values=[625,200,70,70,312.5,30,37.5,3];
it.each(ids)('independent literal witness,unit export,replay and batch #%s',id=>{
 const index=ids.indexOf(id),flow=foodWorkflows(id),p=flow.execute(inputs[index]);expect(p.snapshot.output.value).toBe(values[index]);expect(verifyFoodSnapshot(p.snapshot).snapshot).toEqual(p.snapshot);
 expect(flow.replay(flow.exportPacket(p,'json','pro'))).toEqual(p);expect(flow.exportPacket(p,'csv','business')).toContain(foodContracts[index].unit);expect(factoryDownload(flow,p,'pdf','pro',foodContracts[index].title).bytes.length).toBeGreaterThan(100);
 expect(()=>flow.exportPacket(p,'json','free')).toThrow();expect(flow.scenario([],'A',p,'','pro')).toHaveLength(1);
 expect(flow.batch([inputs[index],{...inputs[index],[foodContracts[index].fields[0].key]:''}]).map(r=>!!r.packet)).toEqual([true,false]);
 const changed={...p,identity:{...p.identity,sourceVersion:p.identity.sourceVersion+'tamper'}};expect(()=>flow.replay(JSON.stringify(changed))).toThrow();expect(()=>verifyFoodSnapshot({...p.snapshot,calculatorVersion:2})).toThrow();
});
it.each(ids)('strict refusal and tampered output #%s',id=>{
 const index=ids.indexOf(id),flow=foodWorkflows(id),raw=inputs[index],first=foodContracts[index].fields[0].key;
 for(const value of ['', 'NaN','Infinity','1x','1e-323','9007199254740993','-1'])expect(()=>flow.execute({...raw,[first]:value})).toThrow();expect(()=>flow.execute({...raw,extra:'2'})).toThrow();
 const p=flow.execute(raw),changed={...p,snapshot:{...p.snapshot,output:{...p.snapshot.output,value:999}}};expect(()=>flow.replay(JSON.stringify(changed))).toThrow();
});
it.each(ids)('new positive rounded-zero capture refused; immutable historical zero preserved #%s',id=>{
 const c=foodContracts.find(c=>c.catalogId===id)!,input=Object.fromEntries(c.fields.map(f=>[f.key,1]));input[foodRoundedQuantityKeys[id]]=1e-12;
 const snapshot={calculatorSlug:c.slug,calculatorVersion:1,input,output:c.engine.calculate(input,{})};expect(snapshot.output.value).toBe(0);expect(()=>foodWorkflows(id).execute(Object.fromEntries(Object.entries(input).map(([k,v])=>[k,String(v)])))).toThrow(/rounds to zero/);
 expect(prepareFoodRecovery(snapshot)).toMatchObject({snapshot,currentCaptureAvailable:false});expect(verifyFoodSnapshot(snapshot).snapshot).toEqual(snapshot);
});
it('preserves original six-decimal rounding rather than substituting an exact arithmetic result',()=>{expect(foodWorkflows(497).execute({totalQuantity:'1',servings:'3'}).snapshot.output.value).toBe(0.333333);expect(foodWorkflows(499).execute({ingredientWeightGrams:'1',flourWeightGrams:'3'}).snapshot.output.value).toBe(33.333333);});
it('retains legitimate zero quantity and fractional serving scopes',()=>{expect(foodWorkflows(503).execute({nutrientAmountPerServing:'0',servings:'2.5'}).snapshot.output.value).toBe(0);expect(foodWorkflows(503).execute({nutrientAmountPerServing:'12',servings:'2.5'}).snapshot.output.value).toBe(30);});
