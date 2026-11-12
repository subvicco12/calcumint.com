import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {expect,it} from 'vitest';
import {conversionCompletionContracts,conversionCompletionUnit,conversionCompletionSource} from './conversion-contracts';
import {getConversionFactoryDefinition,runConversionFactoryCalculation,replayConversionFactoryCalculation} from '../cohorts/conversions';
it('provides source-explicit symbols for every selected offered unit and refuses aliases',()=>{
 expect(conversionCompletionContracts.map(x=>x.catalogId)).toEqual([423,430,431,432,438,440]);
 for(const contract of conversionCompletionContracts){
  const entry=getConversionFactoryDefinition(contract.catalogId)!;
  expect(Object.keys(contract.units)).toEqual(entry.fields[1].options);
  for(const code of entry.fields[1].options!)expect(conversionCompletionUnit(contract.catalogId,code).sourceCode).toBeTruthy();
  expect(()=>conversionCompletionUnit(contract.catalogId,'unknown')).toThrow();
 }
});
// Independent integer arithmetic from UCUM defining relations, never engine factor tables.
type Q=readonly[bigint,bigint];
const q=(n:bigint,d=1n):Q=>[n,d];
const mul=(a:Q,b:Q):Q=>[a[0]*b[0],a[1]*b[1]];
const inch=q(254n,10000n),foot=mul(inch,q(12n)),yard=mul(foot,q(3n));
const pound=q(45359237n,100000000n),gravity=q(980665n,100000n),lbf=mul(pound,gravity);
const sources:Record<number,Record<string,Q>>={
 423:{m:q(1n),km:q(1000n),cm:q(1n,100n),mm:q(1n,1000n),in:inch,ft:foot,yd:yard,mi:mul(foot,q(5280n))},
 430:{j:q(1n),kj:q(1000n),mj:q(1000000n),wh:q(60n*60n),kwh:q(1000n*60n*60n),cal:q(4184n,1000n),kcal:q(4184n)},
 431:{w:q(1n),kw:q(1000n),mw:q(1000000n),hp_mech:mul(q(550n),mul(foot,lbf))},
 432:{s:q(1n),ms:q(1n,1000n),min:q(60n),h:q(60n*60n),day:q(24n*60n*60n),week:q(7n*24n*60n*60n)},
 438:{n:q(1n),kn:q(1000n),dyn:mul(q(1n,1000n),q(1n,100n)),lbf},
 440:{hz:q(1n),khz:q(10n**3n),mhz:q(10n**6n),ghz:q(10n**9n)},
};
it.each(conversionCompletionContracts)('proves all offered directed pairs for $catalogId against independently derived rational coefficients',contract=>{
 const derived=sources[contract.catalogId];
 for(const [from,a] of Object.entries(derived)){
  const [n,d='1']=contract.units[from].exactBase.split('/');
  expect(BigInt(n)*a[1]).toBe(a[0]*BigInt(d));
  for(const [to,b] of Object.entries(derived))for(const value of ['-2.5','0','1','17.125']){
   const exactRatio=Number(a[0]*b[1])/Number(a[1]*b[0]);
   const expected=Number(value)*exactRatio;
   const raw={catalogId:contract.catalogId,version:1,input:{value,fromUnit:from,toUnit:to}};
   const actual=runConversionFactoryCalculation(raw);
   expect(Math.abs((actual.output.result as number)-expected)).toBeLessThanOrEqual(Math.max(Number.MIN_VALUE,Math.abs(expected)*Number.EPSILON*4));
   expect(replayConversionFactoryCalculation(raw,actual.snapshot).snapshot).toEqual(actual.snapshot);
   const entry=getConversionFactoryDefinition(contract.catalogId)!;
   expect(actual.output).toEqual(entry.definition.calculate({value:Number(value),fromUnit:from,toUnit:to}));
  }
 }
});
it('preserves strict refusal and presentation separation',()=>{
 for(const row of conversionCompletionContracts){
  const from=Object.keys(row.units)[0],to=Object.keys(row.units)[1];
  for(const value of ['NaN','Infinity','1junk','0.10000000000000001','1e-999'])expect(()=>runConversionFactoryCalculation({catalogId:row.catalogId,version:1,input:{value,fromUnit:from,toUnit:to}})).toThrow();
  expect(row.applicabilityReview).toBe('COMPETENT_HUMAN_REVIEW_NOT_ESTABLISHED');
 }
 expect(conversionCompletionUnit(431,'mw').symbol).toBe('MW');
 expect(conversionCompletionUnit(430,'mj').symbol).toBe('MJ');
 expect(conversionCompletionUnit(438,'n').symbol).toBe('N');
});

it('pins the retained authoritative capture rather than relying on a live mutable URL',()=>{
 const bytes=readFileSync(conversionCompletionSource.path);
 expect(bytes.length).toBe(147651);
 expect(createHash('sha256').update(bytes).digest('hex')).toBe(conversionCompletionSource.sha256);
});
