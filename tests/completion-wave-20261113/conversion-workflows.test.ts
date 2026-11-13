import {describe,expect,it} from 'vitest';
import Decimal from 'decimal.js';
import {conversionWaveIds,conversionWaveContract,conversionTargetMatrix,swapConversionUnits,compareConversionScenarios,exportConversionScenarios} from '@/lib/completion-wave-20261113/conversion-workflows';
import {runConversionFactoryCalculation,replayConversionFactoryCalculation,getConversionFactoryDefinition} from '@/lib/calculator-factory/cohorts/conversions';
const D=Decimal.clone({precision:80});
const inch=new D(254).div(10000),foot=inch.mul(12),yard=foot.mul(3),mile=foot.mul(5280);
const pow=(x:Decimal,n:number)=>x.pow(n);
// Independently derive coefficients from defining source relationships, not engine tables.
const ratios:Record<number,Record<string,Decimal>>={
 424:{m2:new D(1),km2:pow(new D(1000),2),cm2:pow(new D(1).div(100),2),ft2:pow(foot,2),yd2:pow(yard,2),acre:pow(yard,2).mul(4840),ha:new D(100).mul(100),mi2:pow(mile,2)},
 425:{m3:new D(1),l:new D(1).div(1000),ml:new D(1).div(1000000),cm3:pow(new D(1).div(100),3),ft3:pow(foot,3),in3:pow(inch,3),gal_us:pow(inch,3).mul(231),qt_us:pow(inch,3).mul(231).div(4)},
 428:{m_s:new D(1),km_h:new D(1000).div(3600),mph:mile.div(3600),ft_s:foot,knot:new D(1852).div(3600)},
 // High precision mathematical pi independent of host Math.PI.
 433:{rad:new D(1),deg:new D('3.141592653589793238462643383279502884197169399375105820974944592307816406286').div(180),grad:new D('3.141592653589793238462643383279502884197169399375105820974944592307816406286').div(200),turn:new D('3.141592653589793238462643383279502884197169399375105820974944592307816406286').mul(2)},
 434:{B:new D(1),KB:new D(1000),MB:new D(1000).pow(2),GB:new D(1000).pow(3),TB:new D(1000).pow(4),KiB:new D(1024),MiB:new D(1024).pow(2),GiB:new D(1024).pow(3)},
};
const req=(catalogId:number,value:string,fromUnit:string,toUnit:string)=>({catalogId,version:1 as const,input:{value,fromUnit,toUnit}});
function close(actual:number,expected:Decimal){expect(new D(actual).minus(expected).abs().toNumber()).toBeLessThanOrEqual(Math.max(1e-13,expected.abs().toNumber()*Number.EPSILON*6));}
describe('actual immutable engines with independent source mathematics',()=>{
 it.each([424,425,428,433,434])('checks all directed pairs at zero, negative and decimal inputs: %i',id=>{
  for(const [from,a] of Object.entries(ratios[id]))for(const [to,b] of Object.entries(ratios[id]))for(const value of ['0','-2.5','17.125','1e-200','1e200']){
   const request=req(id,value,from,to),result=runConversionFactoryCalculation(request);
   const expected=new D(value).mul(a).div(b);
   expect(new D(result.output.result as number).minus(expected).abs().toNumber()).toBeLessThanOrEqual(Math.max(Number.MIN_VALUE,expected.abs().toNumber()*Number.EPSILON*6));
   expect(replayConversionFactoryCalculation(request,result.snapshot).snapshot).toEqual(result.snapshot);
  }
 });
 it('checks every temperature pair, real affine zeros and algebraic negative Kelvin',()=>{
  const kelvin=(v:Decimal,u:string)=>u==='k'?v:u==='c'?v.plus('273.15'):v.plus('459.67').mul(5).div(9);
  const target=(k:Decimal,u:string)=>u==='k'?k:u==='c'?k.minus('273.15'):k.mul(9).div(5).minus('459.67');
  for(const from of ['c','f','k'])for(const to of ['c','f','k'])for(const value of ['-500','-459.67','-273.15','0','32','100']){
   close(runConversionFactoryCalculation(req(427,value,from,to)).output.result as number,target(kelvin(new D(value),from),to));
  }
  expect(runConversionFactoryCalculation(req(427,'-1','k','c')).output.result).toBe(-274.15);
 });
});
it('covers every offered unit with explicit source and precision caveats',()=>{
 for(const id of conversionWaveIds){const c=conversionWaveContract(id);expect(Object.keys(c.units)).toEqual(getConversionFactoryDefinition(id)!.fields[1].options);expect(c.source.sha256).toHaveLength(64);}
 expect(conversionWaveContract(424).sourceStatus).toContain('PARTIAL');
 expect(conversionWaveContract(427).scope).toContain('below absolute zero');
});
it('matrix and swapping preserve raw entry and delegate calculation',()=>{
 for(const id of conversionWaveIds){
  const codes=Object.keys(conversionWaveContract(id).units),request=req(id,'1.2500',codes[0],codes[1]);
  const rows=conversionTargetMatrix(request);expect(rows).toHaveLength(codes.length);
  for(const row of rows){expect(row.status).toBe('available');if(row.status==='available')expect(row.calculation.enteredInput.value).toBe('1.2500');}
  const swap=swapConversionUnits(request);expect(swap.enteredInput).toEqual({value:'1.2500',fromUnit:codes[1],toUnit:codes[0]});
 }
});
it('keeps scenario replay/raw bytes and refuses tampered snapshots atomically',()=>{
 const request=req(434,'1.2500','KB','KiB'),rows=compareConversionScenarios([{label:'Decimal to binary',request}]);
 request.input.value='9';expect(rows[0].request.input.value).toBe('1.2500');
 expect(JSON.parse(exportConversionScenarios(rows)).scenarios[0].request.input.value).toBe('1.2500');
 const corrupted=structuredClone(rows);corrupted[0].calculation.snapshot.output.result=999;
 expect(()=>exportConversionScenarios(corrupted)).toThrow();
 expect(()=>compareConversionScenarios([{label:'a',request},{label:'b',request:req(425,'1','l','ml')}])).toThrow();
});
it('refuses malformed/lossy/overflow/subnormal input and exposes per-target failures',()=>{
 for(const id of conversionWaveIds){const codes=Object.keys(conversionWaveContract(id).units);for(const value of ['NaN','Infinity','1junk','0.10000000000000001','1e-999','1e-310'])expect(()=>conversionTargetMatrix(req(id,value,codes[0],codes[1]))).toThrow();}
 const rows=conversionTargetMatrix(req(434,'1e308','TB','TB'));
 expect(rows.some(row=>row.status==='refused')).toBe(true);
 expect(rows.find(row=>row.toUnit==='TB')?.status).toBe('available');
 expect(()=>conversionTargetMatrix(req(434,'1','kb','B'))).toThrow();
});
