import { expect, it } from 'vitest';
import { createCalculationSnapshot,serializeCalculationJson } from './calculation-snapshot';
const identity={calculatorSlug:'sip-calculator',calculatorVersion:1};
it('copies and freezes plain nested engine data without mutating or rounding the source',()=>{
 const input={optional:null,zero:0,negative:-0,small:1e-20},output={rows:[{value:123.456789}],context:{version:1}};
 const snapshot=createCalculationSnapshot({...identity,input,output});input.small=99;output.rows[0].value=999;
 expect(snapshot.input.small).toBe(1e-20);expect(Object.is(snapshot.input.negative,-0)).toBe(true);expect(snapshot.output.rows).toEqual([{value:123.456789}]);
 expect(Object.isFrozen(snapshot)).toBe(true);expect(Object.isFrozen(snapshot.output.rows)).toBe(true);
 expect(JSON.parse(serializeCalculationJson(snapshot))).toEqual({...identity,input:{optional:null,zero:0,negative:0,small:1e-20},output:{rows:[{value:123.456789}],context:{version:1}}});
});
it.each([NaN,Infinity,-Infinity,undefined,()=>0,Symbol('value'),1n,new Date(),new Map(),Array(1)])('rejects malformed input and output values %#',value=>{
 for(const data of [{input:{value},output:{value:0}},{input:{value:0},output:{rows:[{value}]}}])expect(()=>createCalculationSnapshot({...identity,...data})).toThrow();
});
it('rejects cycles, accessors, nonenumerable and symbol keys without invoking user code; accepts shared references and absent optional fields',()=>{
 const cycle:Record<string,unknown>={};cycle.self=cycle;expect(()=>createCalculationSnapshot({...identity,input:{},output:cycle})).toThrow();
 let calls=0;const accessor={get value(){calls++;return 1;}};expect(()=>createCalculationSnapshot({...identity,input:{},output:accessor})).toThrow();expect(calls).toBe(0);
 for(const output of [Object.defineProperty({},'hidden',{value:1}),{[Symbol('hidden')]:1},Object.assign([1],{extra:2})])expect(()=>createCalculationSnapshot({...identity,input:{},output:output as Record<string,unknown>})).toThrow();
 const shared={value:1};expect(createCalculationSnapshot({...identity,input:{},output:{first:shared,second:shared}}).output).toEqual({first:{value:1},second:{value:1}});
});
it.each([{calculatorSlug:'',calculatorVersion:1},{calculatorSlug:'sip-calculator',calculatorVersion:0},{calculatorSlug:'sip-calculator',calculatorVersion:1.5}])('requires existing nonempty identity and positive integer version %#',bad=>{
 expect(()=>createCalculationSnapshot({...bad,input:{},output:{value:0}})).toThrow();
});
it('accepts null-prototype data and rejects custom array prototypes',()=>{
 const record=Object.assign(Object.create(null),{value:0});expect(createCalculationSnapshot({...identity,input:record,output:{value:0}}).input).toEqual({value:0});
 class CustomArray extends Array<number>{toJSON(){return [0];}}
 expect(()=>createCalculationSnapshot({...identity,input:{},output:{rows:new CustomArray(1,2)}})).toThrow();
});
it.each(['data',1,true])('rejects primitive root records %#',value=>{
 const root=value as unknown as Record<string,unknown>;
 expect(()=>createCalculationSnapshot({...identity,input:root,output:{value:0}})).toThrow();
 expect(()=>createCalculationSnapshot({...identity,input:{},output:root})).toThrow();
});
it('retains a bounded full schedule without sampling or rounding',()=>{
 const rows=Array.from({length:1200},(_,index)=>({period:index+1,value:(index+1)/7}));const snapshot=createCalculationSnapshot({...identity,input:{},output:{rows}});
 expect(snapshot.output.rows).toEqual(rows);expect(Object.isFrozen((snapshot.output.rows as unknown[])[1199])).toBe(true);
});
