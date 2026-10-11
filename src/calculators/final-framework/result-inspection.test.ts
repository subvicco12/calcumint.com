import { expect,it } from 'vitest';
import { inspectStructuredResult } from './result-inspection';
const core={primaryResult:{id:'value',label:'Value',value:1}};
it.each([0,-1,1e-20,'Exact label'])('preserves valid core %s without mutating its source',value=>{
 const source={...core,primaryResult:{...core.primaryResult,value}};const before=structuredClone(source);
 const result=inspectStructuredResult(source);expect(result.coreValid).toBe(true);expect(result.renderable?.primaryResult.value).toBe(value);expect(source).toEqual(before);
});
it.each([NaN,Infinity,-Infinity])('rejects invalid core and metric %s',value=>{
 expect(inspectStructuredResult({...core,primaryResult:{...core.primaryResult,value}}).coreValid).toBe(false);
 expect(inspectStructuredResult({...core,metrics:[{id:'m',label:'Metric',value}]}).coreValid).toBe(false);
});
it.each(['composition','ranges','series','schedule','sources','warnings'])('contains malformed %s arrays',field=>{
 const source={...core,[field]:{}};const inspected=inspectStructuredResult(source);expect(inspected.coreValid).toBe(true);expect(inspected.invalidSurfaces).toHaveLength(1);expect(source[field as keyof typeof source]).toEqual({});
});
it('rejects nonfinite optional coordinates, row values and bounds without applying financial ordering rules',()=>{
 const invalid={...core,series:[{id:'s',label:'S',points:[{x:Infinity,y:0}]}],schedule:[{id:'r',period:1,values:{value:NaN}}],ranges:[{id:'r',label:'R',min:-Infinity}]};
 expect(inspectStructuredResult(invalid).invalidSurfaces).toEqual(['ranges','series','schedule']);
 expect(inspectStructuredResult({...core,ranges:[{id:'r',label:'R',min:10,max:-10}],schedule:[{id:'r',period:'Date',values:{zero:0,negative:-2,tiny:1e-20}}]}).invalidSurfaces).toEqual([]);
});
it('rejects sparse points and malformed metadata before schedule traversal',()=>{
 expect(inspectStructuredResult({...core,series:[{id:'s',label:'S',points:Array(1)}]}).invalidSurfaces).toEqual(['series']);
 expect(inspectStructuredResult({...core,scheduleMetadata:{caption:'Schedule',columns:[]}}).invalidSurfaces).toEqual(['schedule']);
});
it('isolates malformed trust and warning fields',()=>{
 const inspected=inspectStructuredResult({...core,methodology:1,sources:[null],warnings:[1]});expect(inspected.invalidSurfaces).toEqual(['trust','warnings']);expect(inspected.renderable?.primaryResult).toEqual(core.primaryResult);
});
