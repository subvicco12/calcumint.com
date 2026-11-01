import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import contract from '../../../docs/p0-decision-contracts/calculus.json';
import {runCanonicalCalculus as run} from '../../../src/calculators/canonical-calculus';
import {exportCanonicalCalculation as make,importCanonicalCalculation as replay,compareCanonicalScenarioSet as compare} from '../../../src/calculators/canonical-calculus-workflow';
import {exportPrivateCalculus} from '../../../src/calculators/private-calculus-successor';
import {appendCanonicalHistory,readCanonicalHistory,CANONICAL_HISTORY_KEY} from '../../../src/lib/canonical-calculus-history';
// Independent integer/rational oracle: no engine parser, coefficient builder or rational helper.
const gcd=(a:bigint,b:bigint):bigint=>b?gcd(b,a%b):a<0n?-a:a;
const q=(n:bigint,d=1n)=>{const g=gcd(n,d);return {numerator:String(n/g*(d<0n?-1n:1n)),denominator:String(d/g*(d<0n?-1n:1n))};};
const wf=(calculation:unknown)=>({calculation,plot:{enabled:true,radius:'1',samples:9}});
const storage=()=>{let bytes:string|null=null;return {getItem:()=>bytes,setItem:(_key:string,value:string)=>{bytes=value;}};};
describe('owner approved bounded calculus engineering targets',()=>{
 it('binds all three exact review identities and freezes all historical source closure bytes',()=>{
  expect(Object.keys(contract.currentSourceClosure.files)).toHaveLength(194);
  for(const [path,hash] of Object.entries(contract.currentSourceClosure.files))expect(createHash('sha256').update(readFileSync(path)).digest('hex'),path).toBe(hash);
  for(const [operation,id] of [['derivative',246],['integral',247],['limit',248]] as const){
   const calculation=operation==='integral'?{operation,expression:'x',lower:'0',upper:'1'}:{operation,expression:'x',x:'1'};
   const s=make(wf(calculation));expect(s.contractId).toBe('private.canonical-calculus.'+id);
   expect(s.governance).toMatchObject({engineId:'private.canonical-calculus',technicalRevision:3,presentationRevision:1,canonicalAccepted:false,canonicalMappingApproved:false,releaseHold:true});
   expect(s.calculation.calculatorVersion).toBe(3);expect(s.calculation.calculatorSlug).toBe('private-canonical-calculus-'+operation);
  }
 });
 it('independently checks 180 quotient derivatives with signed rational coefficients and nested divisors',()=>{
  for(let a=-4;a<=4;a++)for(let b=1;b<=4;b++)for(let x=-2;x<=2;x++){
   // f=(a*x^2+b)/(x+4); f'=(a*x^2+8*a*x-b)/(x+4)^2.
   const expression=`((${a})*x^2+${b})/(x+4)`;
   expect(run({operation:'derivative',expression,x:String(x)}).exact).toEqual(q(BigInt(a*x*x+8*a*x-b),BigInt((x+4)**2)));
  }
  expect(run({operation:'derivative',expression:'1/(1/(x+2))',x:'0'}).exact).toEqual(q(1n));
 });
 it('independently checks 64 decimal-rational polynomial antiderivatives and oriented endpoints',()=>{
  for(let n=0;n<=15;n++)for(const [lo,hi] of [[0,1],[-1,1],[2,-1],[2,2]]){
   const output=run({operation:'integral',expression:`0.125*x^${n}`,lower:String(lo),upper:String(hi)});
   expect(output.exact).toEqual(q(BigInt(hi)**BigInt(n+1)-BigInt(lo)**BigInt(n+1),8n*BigInt(n+1)));
  }
 });
 it('classifies independent signed odd/even poles at shifted centers and removable zeros',()=>{
  for(const center of [-2,0,3])for(const power of [1,2,3,4])for(const sign of [-1,1])for(const direction of ['left','right','both']){
   const result=run({operation:'limit',expression:`${sign}/(x-(${center}))^${power}`,x:String(center),direction});
   const side=direction==='left'&&power%2?-sign:sign;
   expect(result.classification).toBe(direction==='both'&&power%2?'does-not-exist':side>0?'positive-infinity':'negative-infinity');
  }
  for(let n=1;n<=12;n++)expect(run({operation:'limit',expression:`(x^${n}-1)/(x-1)`,x:'1',direction:'both'}).exact).toEqual(q(BigInt(n)));
 });
 it('rejects original holes, undefined neighborhoods, oscillations, unsupported quadrature and resource overflow',()=>{
  const inputs=[
   ...['(x/x)^0','0/(1/x)','1/(1/x)'].map(expression=>({operation:'derivative',expression,x:'0'})),
   ...['1/(x-x)','sin(1/x)','cos(1/x)','sqrt(x)','ln(x)','sin(x)/x'].map(expression=>({operation:'limit',expression,x:'0',direction:'both'})),
   ...['abs(x)','sin(x)','x/x','x^-1','1/(x-x)'].map(expression=>({operation:'integral',expression,lower:'0',upper:'0'})),
   ...['x^33','x^-33','1e257*x','1e-257*x'].map(expression=>({operation:'derivative',expression,x:'1'}))];
  for(const input of inputs)expect(()=>run(input),JSON.stringify(input)).toThrow();
 });
 it('keeps actual analytic fallback classification and all plan outputs equal for every operation',()=>{
  for(const calculation of [{operation:'derivative',expression:'exp(x)',x:'0'},{operation:'limit',expression:'cos(x)',x:'0',direction:'left'},{operation:'integral',expression:'0.125*x^3',lower:'-2',upper:'3'}]){
   const free=make(wf(calculation),'free');expect(make(wf(calculation),'pro')).toEqual(free);expect(make(wf(calculation),'business')).toEqual(free);
   if(calculation.operation!=='integral'){expect(free.calculation.output.core.arithmetic).toBe('binary64-analytic');expect(free.calculation.output.core.exact).toBeNull();}
   for(const row of free.calculation.output.rows)if(row.output)expect(row.output).toEqual(run(row.input));
  }
 });
 it('checks analytic chain-rule landmarks and precision/domain failure without exactness claims',()=>{
  for(const [expression,x,value] of [['sin(ln(x))','1','1'],['exp(sin(x))','0','1'],['ln(1+x^2)','1','1'],['sqrt(4+x^2)','0','0'],['tan(2*x)','0','2'],['x^x','1','1']]){
   const output=run({operation:'derivative',expression,x});expect(output.value).toBe(value);expect(output.exact).toBeNull();expect(output.arithmetic).toBe('binary64-analytic');
  }
  for(const expression of ['exp(1000*x)','exp(-1000)*x','tan(pi/2)','ln(-x)','sqrt(-x)','(-x)^x'])expect(()=>run({operation:'derivative',expression,x:'1'})).toThrow();
  expect(()=>run({operation:'derivative',expression:'sin(x)',x:'0.100000000000000001'})).toThrow();
 });
 it('preserves mixed v2/v3 bytes and rejects every replay lineage/surface tamper before history writes',()=>{
  const old=exportPrivateCalculus({operation:'limit',expression:'cos(x)',x:0});const fresh=make(wf({operation:'integral',expression:'x^3',lower:'0',upper:'1'}));
  const store=storage();appendCanonicalHistory(store,old,'business');appendCanonicalHistory(store,fresh,'business');
  expect(readCanonicalHistory(store).records[1]).toEqual(old);expect(readCanonicalHistory(store).records.map(r=>r.calculation.calculatorVersion)).toEqual([3,2]);
  const mutations=[(s:typeof fresh)=>{s.contractId='private.canonical-calculus.246';},(s:typeof fresh)=>{s.calculation.output.core.exact!.numerator='9';},(s:typeof fresh)=>{s.calculation.input.calculation.expression='x^2';},(s:typeof fresh)=>{s.calculation.output.rows[0].coordinate='99';},(s:typeof fresh)=>{s.calculation.output.structured.primaryResult.value='999';},(s:typeof fresh)=>{s.source.nativeBlueprintSHA256='0'.repeat(64);},(s:typeof fresh)=>{s.governance.presentationRevision=2 as 1;},(s:typeof fresh)=>{s.governance.publicationAuthorized=true as false;}];
  for(const mutate of mutations){const forged=structuredClone(fresh);mutate(forged);expect(()=>replay(forged)).toThrow();const before=store.getItem();expect(()=>appendCanonicalHistory(store,forged,'business')).toThrow();expect(store.getItem()).toBe(before);}
  store.setItem(CANONICAL_HISTORY_KEY,JSON.stringify([{calculation:{calculatorVersion:1}}]));const original=store.getItem();expect(readCanonicalHistory(store).writable).toBe(false);expect(()=>appendCanonicalHistory(store,fresh,'free')).toThrow();expect(store.getItem()).toBe(original);
 });
 it('preserves exact scenario deltas and refuses inference for analytic or nonfinite pairs',()=>{
  const snap=(expression:string)=>make(wf({operation:'limit',expression,x:'0',direction:'both'}));
  expect(compare([snap('1/3'),snap('2/3'),snap('-1/3')]).comparisons.map(c=>c.exactDelta)).toEqual(['1/3','-2/3']);
  expect(compare([snap('sin(x)'),snap('cos(x)')]).comparisons[0].exactDelta).toBeNull();
  expect(compare([snap('1/x^2'),snap('-1/x^2')]).comparisons[0].exactDelta).toBeNull();
  expect(()=>compare([snap('x')])).toThrow();
 });
});
