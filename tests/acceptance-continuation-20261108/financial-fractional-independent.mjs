/**
 * Finite independent oracle for the private financial proposal; not approval.
 * Run from any cwd:
 *   node tests/acceptance-continuation-20261108/financial-fractional-independent.mjs
 * Cheap oracle-only validation:
 *   node tests/acceptance-continuation-20261108/financial-fractional-independent.mjs --oracle-only
 * Expected outputs use only integer arithmetic and supplied square identities.
 * Production imports are used solely to obtain actual outputs.
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptPath=fileURLToPath(import.meta.url);
const root=resolve(dirname(scriptPath),'../..');
const sourcePath=resolve(root,'src/lib/financial-successor/decimal-rounding-private.ts');
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const oracleOnly=process.argv.includes('--oracle-only');
assert(process.argv.slice(2).every(arg=>arg==='--oracle-only'),'Unknown argument');

// For n=1, t=1/2, growth=sqrt(1+APR/100)=a/b exactly.
// APRs and square identities are independently checked before loading production.
const identities=[[44,6,5],[69,13,10],[125,3,2],[300,2,1],[525,5,2],[800,3,1]];
const records=[];
let ties=0;
for(const [apr,a,b] of identities){
 assert.equal(BigInt(100+apr)*BigInt(b)**2n,100n*BigInt(a)**2n);
 for(let principalCents=1;principalCents<=299;principalCents++){
  const numerator=BigInt(principalCents)*BigInt(a),denominator=BigInt(b);
  // Positive half-away rounding of the exact future amount expressed in cents.
  const cents=(2n*numerator+denominator)/(2n*denominator);
  if(2n*(numerator%denominator)===denominator)ties++;
  records.push({
   input:{principal:principalCents/100,annualRatePercent:apr,years:0.5,compoundsPerYear:1},
   expected:{futureValue:Number(cents)/100,totalInterest:Number(cents-BigInt(principalCents))/100}
  });
 }
}
assert.equal(records.length,1794);
assert(ties>0);

let checked=0;
if(!oracleOnly){
 const require=createRequire(import.meta.url);
 const ts=require('typescript');
 // Adapter only: preserve source imports/calculation and erase TypeScript syntax.
 const previous=require.extensions['.ts'];
 require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(readFileSync(filename,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}
 }).outputText,filename);
 try{
  const {compoundInterestDecimalSuccessor}=require(sourcePath);
  for(const {input,expected} of records){
   assert.deepEqual(compoundInterestDecimalSuccessor.calculate(input),expected,JSON.stringify(input));
   checked++;
  }
 }finally{
  if(previous)require.extensions['.ts']=previous;
  else delete require.extensions['.ts'];
 }
}

console.log(JSON.stringify({
 kind:'FINITE_INDEPENDENT_RATIONAL_FRACTIONAL_COMPOUND_CHECK',
 mode:oracleOnly?'oracle-only':'production-comparison',
 source:'src/lib/financial-successor/decimal-rounding-private.ts',
 sourceSha256:sha256(readFileSync(sourcePath)),
 scriptSha256:sha256(readFileSync(scriptPath)),
 generatedCases:records.length,actualCasesChecked:checked,exactHalfCentCases:ties,
 casesSha256:sha256(JSON.stringify(records)),
 scope:'Six exact rational square-root growth identities; principal cents 1..299; years .5; compoundsPerYear 1; future value and total interest.',
 expectedOracle:'Independent BigInt rational square identities and quotient half-away rounding; no production arithmetic used for expectations.',
 financialSpecialistApproval:false,canonicalAdoptionAuthorized:false,
 limitation:'Finite cases only; not whole-domain proof or financial policy approval.'
},null,2));
