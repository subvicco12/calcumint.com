/** Independent finite witnesses and exact coefficient audit for unchanged time@1. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const script=fileURLToPath(import.meta.url),root=resolve(dirname(script),'../..');
const relativeSource='src/calculators/conversion/catalog-batch-2.ts',source=resolve(root,relativeSource);
const sha=b=>createHash('sha256').update(b).digest('hex');
const gcd=(a,b)=>{a=a<0n?-a:a;while(b){[a,b]=[b,a%b];}return a;};
const f=(n,d=1n)=>{assert(d>0n);const g=gcd(n,d);return {n:n/g,d:d/g};};
const add=(a,b)=>f(a.n*b.d+b.n*a.d,a.d*b.d);
const mul=(a,b)=>f(a.n*b.n,a.d*b.d);
const div=(a,b)=>{assert(b.n>0n);return f(a.n*b.d,a.d*b.n);};
const neg=a=>f(-a.n,a.d),sub=(a,b)=>add(a,neg(b));
const abs=a=>f(a.n<0n?-a.n:a.n,a.d);
const le=(a,b)=>a.n*b.d<=b.n*a.d;
const text=a=>`${a.n}/${a.d}`;
const one=f(1n),u=f(1n,2n**53n);
function binary(value){
 assert(Number.isFinite(value));
 const bytes=new DataView(new ArrayBuffer(8));bytes.setFloat64(0,value);
 const bits=bytes.getBigUint64(0),negative=(bits>>63n)!==0n;
 const exponent=Number((bits>>52n)&2047n),tail=bits&((1n<<52n)-1n);
 const significand=exponent===0?tail:(1n<<52n)+tail;
 const power=exponent===0?-1074:exponent-1023-52;
 const n=negative?-significand:significand;
 return power>=0?f(n*2n**BigInt(power)):f(n,2n**BigInt(-power));
}
const ms=binary(.001),msExact=f(1n,1000n),epsilon=sub(div(ms,msExact),one);
assert.equal(text(ms),'1152921504606847/1152921504606846976');
assert.equal(text(epsilon),'3/144115188075855872');
const bound=sub(mul(add(one,epsilon),mul(add(one,u),add(one,u))),one);
assert(le(bound,mul(f(3n),u)));
const decimalParsingBound=sub(mul(add(one,bound),add(one,u)),one);
assert(le(decimalParsingBound,mul(f(4n),u)));
const units=[['s',f(1n)],['ms',msExact],['min',f(60n)],['h',f(3600n)],['day',f(86400n)],['week',f(604800n)]];

const require=createRequire(import.meta.url),ts=require('typescript');
const previous=require.extensions['.ts'];
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(readFileSync(filename,'utf8'),{
 compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}
}).outputText,filename);
const {timeConverter}=require(source);
if(previous)require.extensions['.ts']=previous;else delete require.extensions['.ts'];
assert.equal(timeConverter.id,'conversion.time');assert.equal(timeConverter.version,1);
const lower=2**-970,upper=2**990;
const samples=[lower,lower*(1+2**-52),2**-500,.1,1,Math.PI,2**500,upper*(1-2**-53),upper];
const pairs=[];let actualChecks=0,zeroChecks=0,identityChecks=0;
for(const [fromUnit,fromFactor] of units)for(const [toUnit,toFactor] of units){
 const exactRatio=div(fromFactor,toFactor);
 const observed=timeConverter.calculate({value:1,fromUnit,toUnit}).result;
 const observedRatio=binary(observed),rho=abs(sub(div(observedRatio,exactRatio),one));
 const coefficientBound=add(rho,mul(u,add(one,rho)));
 // Static ratios have a wide normal margin: 2^-30 < ratio < 2^30.
 assert(observed>2**-30&&observed<2**30);
 assert(le(coefficientBound,bound));
 for(const magnitude of samples)for(const sign of [-1,1]){
  const value=magnitude*sign,result=timeConverter.calculate({value,fromUnit,toUnit}).result;
  assert(Number.isFinite(result)&&Math.abs(result)>=2**-1022);
  const ideal=mul(binary(value),exactRatio),error=abs(sub(binary(result),ideal));
  assert(le(error,mul(abs(ideal),coefficientBound)),JSON.stringify({value,fromUnit,toUnit,result}));
  actualChecks++;
 }
 for(const value of [0,-0]){
  assert(Object.is(timeConverter.calculate({value,fromUnit,toUnit}).result,value));zeroChecks++;
 }
 if(fromUnit===toUnit)for(const value of [Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE]){
  assert.equal(timeConverter.calculate({value,fromUnit,toUnit}).result,value);identityChecks++;
 }
 pairs.push({fromUnit,toUnit,exactRatio:text(exactRatio),observedRatio:text(observedRatio),relativeRatioError:text(rho),relativeOutputBound:text(coefficientBound)});
}
const excludedUnderflow=timeConverter.calculate({value:Number.MIN_VALUE,fromUnit:'s',toUnit:'week'}).result;
assert.equal(excludedUnderflow,0);
assert.throws(()=>timeConverter.calculate({value:Number.MAX_VALUE,fromUnit:'week',toUnit:'ms'}),/finite range/);
console.log(JSON.stringify({
 kind:'TIME_V1_FIXED_FACTOR_BINARY64_SCOPED_PRECISION',source:relativeSource,sourceSha256:sha(readFileSync(source)),
 scriptSha256:sha(readFileSync(script)),engineId:timeConverter.id,engineVersion:timeConverter.version,
 operationOrder:'Same-unit identity first; otherwise ratio=fl(sourceFactor/targetFactor), result=fl(suppliedNumber*ratio).',
 exactSuppliedNumberScope:'For every nonzero finite binary64 x with 2^-970 <= abs(x) <= 2^990 and all 36 unit pairs, relative forward error against x times the exact fixed-unit factor ratio is <= the reported global bound. Zero is exact; identity returns every finite x exactly.',
 normalFiniteArgument:'Every stored ratio is strictly between 2^-30 and 2^30. Thus exact multiplication magnitude for scoped x is strictly between 2^-1000 and 2^1020, safely normal and finite; the rounded product remains normal and finite. All factors and ratio divisions are normal and finite.',
 factors:{s:'1',ms:'1/1000',min:'60',h:'3600',day:'86400',week:'604800'},
 storedMillisecondFactor:text(ms),millisecondRelativeRepresentationError:text(epsilon),unitRoundoff:text(u),
 globalRelativeBound:text(bound),globalRelativeBoundFormula:'(1 + 3/2^57)*(1 + 2^-53)^2 - 1 < 3*2^-53',
 rawDecimalInput:'The bound above starts from the supplied Number, not an exact decimal text. If decimal text parsing is separately correctly rounded to a normal finite Number within scope with relative error <=2^-53, the bound against the exact decimal input is (1+epsilon)*(1+u)^3-1 <4u. Decimal underflow, overflow, parsing policy and arbitrary decimal accuracy are not covered.',
 conditionalRawDecimalRelativeBound:text(decimalParsingBound),
 coefficientPairsAudited:pairs.length,actualEngineNonzeroWitnesses:actualChecks,zeroChecks,extremeIdentityChecks:identityChecks,
 excludedBoundaryObservations:{nonzeroUnderflow:{input:Number.MIN_VALUE,fromUnit:'s',toUnit:'week',result:excludedUnderflow,note:'Engine returns zero; callers must apply the existing nonzero-to-zero refusal. Outside this relative-error contract.'},overflow:{input:Number.MAX_VALUE,fromUnit:'week',toUnit:'ms',result:'throws outside supported finite range'}},
 witnessMagnitudes:samples.map(value=>value.toString()),pairs,
 method:'Expected factors and every binary64 value decoded independently to exact BigInt rational quantities. Ratio coefficient audit and forward-error comparisons use exact integer cross products, no production arithmetic for expected quantities and no tolerance epsilon.',
 limitations:'Scoped numerical derivation plus finite engine witnesses, not full-schema acceptance, source applicability review, competent reviewer approval, canonical adoption, certification or publication authority. Subnormal nonidentity outputs and overflow are outside the relative contract.',
 competentApproval:false,canonicalAdoptionAuthorized:false
},null,2));
