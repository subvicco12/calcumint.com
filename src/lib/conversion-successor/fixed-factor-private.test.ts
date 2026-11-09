import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {it,expect,describe} from 'vitest';
import {pressureConverter} from '../../calculators/conversion/catalog-batch-2';
import {areaConverter} from '../../calculators/conversion/catalog-batch-1';
import {densityConverter,torqueConverter} from '../../calculators/conversion/catalog-batch-3';
import {pressureFixedFactorPrivate as pressure,densityFixedFactorPrivate as density,torqueFixedFactorPrivate as torque,
 privateFixedFactorCandidates as engines,createPrivateFixedFactorSnapshot as capture,exportPrivateFixedFactorSnapshot as serialize,
 replayPrivateFixedFactorSnapshot as replay,fixedFactorSourceArchiveSha256,fixedFactorMinimumMagnitude as lower,fixedFactorMaximumMagnitude as upper} from './fixed-factor-private';
type Q={n:bigint;d:bigint};type R={n:string;d:string};
type Witness={sourceArchiveSha256:string;oracleScriptSha256:string;legacySourceSha256:Record<string,string>;
 factors:Record<string,Record<string,R&{nearest:number;bits:string}>>;pairs:{engine:string;fromUnit:string;toUnit:string;ratio:R}[];
 positiveWitnessMagnitudes:number[];signedNonzeroCases:number;gamma4:R;retainedInternationalAcre:R};
const w=JSON.parse(readFileSync('docs/converter-methodology-20261109/converter-successor-witnesses.json','utf8')) as Witness;
const byName:Record<string,typeof pressure>={pressure,density,torque};
const q=(r:R):Q=>({n:BigInt(r.n),d:BigInt(r.d)});
const mul=(a:Q,b:Q):Q=>({n:a.n*b.n,d:a.d*b.d});
const sub=(a:Q,b:Q):Q=>({n:a.n*b.d-b.n*a.d,d:a.d*b.d});
const abs=(a:Q):Q=>({n:a.n<0n?-a.n:a.n,d:a.d});
const le=(a:Q,b:Q)=>a.n*b.d<=b.n*a.d;
function binary(value:number):Q{
 const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,value);
 const bits=view.getBigUint64(0),exponent=Number((bits>>52n)&2047n),tail=bits&((1n<<52n)-1n);
 let n=exponent===0?tail:(1n<<52n)+tail;if(bits>>63n)n=-n;
 const power=exponent===0?-1074:exponent-1023-52;
 return power>=0?{n:n*2n**BigInt(power),d:1n}:{n,d:2n**BigInt(-power)};
}
function bits(value:number){const data=new DataView(new ArrayBuffer(8));data.setFloat64(0,value);return data.getBigUint64(0).toString(16).padStart(16,'0');}
const sha=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
describe('private changed-source factors',()=>{
 it.each([[pressure,'psi','pa',6894.757293168362],[density,'lb_ft3','kg_m3',16.018463373960138],
  [torque,'lbf_ft','n_m',1.3558179483314003],[torque,'lbf_in','n_m',.1129848290276167]] as const)('uses independent nearest source factor',(engine,fromUnit,toUnit,expected)=>{
  expect(engine.calculate({value:1,fromUnit,toUnit}).result).toBe(expected);
 });
 it('pins exact source metadata and independently nearest factor bits',()=>{
  for(const [name,table] of Object.entries(w.factors))for(const [code,expected] of Object.entries(table)){
   const actual=byName[name].factors[code];
   expect(BigInt(actual.numerator)*BigInt(expected.d)).toBe(BigInt(expected.n)*BigInt(actual.denominator));
   expect(bits(actual.nearest)).toBe(expected.bits);if(actual.bits)expect(actual.bits).toBe(expected.bits);
   expect(Object.isFrozen(actual)).toBe(true);
  }
 });
 it.each(w.pairs)('exact rational forward bound $engine $fromUnit->$toUnit',row=>{
  const coefficient=byName[row.engine].calculate({value:1,fromUnit:row.fromUnit,toUnit:row.toUnit}).result;
  expect(coefficient>2**-30&&coefficient<2**30).toBe(true);
  for(const value of [0,-0])expect(Object.is(byName[row.engine].calculate({value,fromUnit:row.fromUnit,toUnit:row.toUnit}).result,0)).toBe(true);
  if(row.fromUnit===row.toUnit)for(const value of [Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE]){
   expect(byName[row.engine].calculate({value,fromUnit:row.fromUnit,toUnit:row.toUnit}).result).toBe(value);
  }
  for(const magnitude of w.positiveWitnessMagnitudes)for(const sign of [-1,1]){
   const value=sign*magnitude,actual=byName[row.engine].calculate({value,fromUnit:row.fromUnit,toUnit:row.toUnit}).result;
   const ideal=mul(binary(value),q(row.ratio));
   expect(Number.isFinite(actual)&&Math.abs(actual)>=2**-1022).toBe(true);
   expect(le(abs(sub(binary(actual),ideal)),mul(abs(ideal),q(w.gamma4)))).toBe(true);
  }
 });
 it('retains source hashes, historical factors and international acre',()=>{
  expect(w.pairs).toHaveLength(68);expect(w.signedNonzeroCases).toBe(1224);
  expect(sha('docs/first-live-closure-20261108/source/ucum-v2.2-native-source.zip')).toBe(fixedFactorSourceArchiveSha256);
  expect(w.sourceArchiveSha256).toBe(fixedFactorSourceArchiveSha256);
  expect(sha('tests/ci425200-recovery-20261109/converter-successor-oracle.py')).toBe(w.oracleScriptSha256);
  for(const [path,hash] of Object.entries(w.legacySourceSha256))expect(sha(path)).toBe(hash);
  expect(areaConverter.calculate({value:1,fromUnit:'acre',toUnit:'m2'},{}).result).toBe(4046.8564224);
  expect(q(w.retainedInternationalAcre)).toEqual({n:316160658n,d:78125n});
  expect(pressureConverter.calculate({value:1,fromUnit:'psi',toUnit:'pa'},{}).result).toBe(6894.757293168);
  expect(densityConverter.calculate({value:1,fromUnit:'lb_ft3',toUnit:'kg_m3'},{}).result).toBe(16.01846337396);
  expect(torqueConverter.calculate({value:1,fromUnit:'lbf_ft',toUnit:'n_m'},{}).result).toBe(1.3558179483314);
 });
 it('preserves twelve-inch geometry',()=>{
  expect(torque.calculate({value:1,fromUnit:'lbf_ft',toUnit:'lbf_in'}).result).toBe(12);
  expect(torque.calculate({value:12,fromUnit:'lbf_in',toUnit:'lbf_ft'}).result).toBe(1);
 });
 it('normalizes zero, preserves finite identity and refuses unsupported domains/unknown fields',()=>{
  for(const engine of engines){
   const [fromUnit,toUnit]=Object.keys(engine.factors),base={value:1,fromUnit,toUnit};
   for(const value of [0,-0])expect(Object.is(engine.calculate({...base,value}).result,0)).toBe(true);
   for(const value of [Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE])expect(engine.calculate({...base,value,toUnit:fromUnit}).result).toBe(value);
   for(const value of [Number.MIN_VALUE,-Number.MIN_VALUE,lower*(1-2**-53),upper*(1+2**-52),Number.MAX_VALUE])expect(()=>engine.calculate({...base,value})).toThrow(/bounded/);
   for(const value of [Infinity,-Infinity,NaN])expect(()=>engine.calculate({...base,value,toUnit:fromUnit})).toThrow();
   for(const extra of [{plan:'premium'},{unknown:1},{value:'1'},{fromUnit:'invalid'},{toUnit:'toString'}])expect(()=>engine.calculate({...base,...extra})).toThrow();
   expect(Object.isFrozen(engine)&&Object.isFrozen(engine.factors)).toBe(true);expect(engine.allocatedSuccessorVersion).toBe(null);
   expect(Object.isFrozen(engine.qualification)&&Object.isFrozen(engine.qualification.limitations)).toBe(true);
   expect(engine.qualification.sourceApplicability).toBe('PENDING');
   expect(engine.qualification.canonicalAdoptionAuthorized).toBe(false);
   for(const plan of ['basic','premium','pro','business'])expect(Reflect.apply(engine.calculate,{plan},[base])).toEqual(engine.calculate(base));
  }
 });
});
describe('private revision-pinned immutable transport',()=>{
 it.each(engines)('replays deterministically $id',engine=>{
  const [fromUnit,toUnit]=Object.keys(engine.factors),input={value:.1,fromUnit,toUnit},artifact=capture(engine.id,input),text=serialize(artifact);
  expect(replay(text)).toEqual(artifact);expect(serialize(replay(text))).toBe(text);input.value=2;expect(artifact.snapshot.input.value).toBe(.1);
  expect(Object.isFrozen(artifact)&&Object.isFrozen(artifact.snapshot)&&Object.isFrozen(artifact.snapshot.input)&&Object.isFrozen(artifact.snapshot.output)).toBe(true);
  expect(artifact).not.toHaveProperty('calculatorVersion');expect(artifact.allocatedSuccessorVersion).toBe(null);
 });
 it('rejects identity/source/output/revision/schema/domain tampering',()=>{
  const good=capture(pressure.id,{value:1,fromUnit:'psi',toUnit:'pa'}),text=serialize(good);
  const changes=[{privateId:density.id},{implementationRevision:'other'},{contract:'other'},{sourceArchiveSha256:'0'.repeat(64)},
   {baselineEngineId:'conversion.density'},{baselineEngineVersion:2},{allocatedSuccessorVersion:2},{transportVersion:2},{extra:true},
   {snapshot:{...good.snapshot,output:{result:0}}},{snapshot:{...good.snapshot,input:{...good.snapshot.input,extra:true}}},
   {snapshot:{...good.snapshot,input:{value:1e308,fromUnit:'psi',toUnit:'pa'}}},{snapshot:{...good.snapshot,extra:1}}];
  for(const change of changes)expect(()=>replay(JSON.stringify({...good,...change}))).toThrow();
  expect(()=>replay(text.replace('"transportVersion": 1','"transportVersion": 1,"transportVersion": 1'))).toThrow();
  expect(()=>replay(text.replace('"transportVersion": 1','"transportVersion": 1,"transport\\u0056ersion": 1'))).toThrow();
  expect(()=>replay(text.replace('"value": 1','"value": 1,"value": 1'))).toThrow();
  expect(()=>replay(text.replace('"value": 1','"value": 9007199254740993'))).toThrow();
  expect(()=>replay(text.replace('"value": 1','"value": 1e-999'))).toThrow();
  expect(()=>serialize({...good,snapshot:{...good.snapshot,output:{result:0}}})).toThrow();
  expect(()=>replay('{')).toThrow();expect(()=>replay(' '.repeat(2_000_001))).toThrow();
  expect(()=>replay(JSON.stringify({implementationRevision:'private-financial-exact-grid-20261108.1'}))).toThrow();
  expect(()=>capture('unknown',{value:1,fromUnit:'pa',toUnit:'pa'})).toThrow();
 });
 it('uses standard JSON zero normalization without changing legacy identity',()=>{
  const artifact=capture(pressure.id,{value:-0,fromUnit:'pa',toUnit:'psi'});
  expect(Object.is(artifact.snapshot.input.value,0)).toBe(true);expect(Object.is(replay(serialize(artifact)).snapshot.output.result,0)).toBe(true);
  expect(Object.is(pressureConverter.calculate({value:-0,fromUnit:'pa',toUnit:'pa'},{}).result,-0)).toBe(true);
 });
});
