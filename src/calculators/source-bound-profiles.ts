import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import sourceManifest from '../../data/catalog/cloud-batch03-2026-10-28/manifest.json';
import {add,decimal,divide,multiply,rational,subtract,zero} from './exact-rational';

// New private profiles, never registration or acceptance authorities. Decimal
// strings bound parsing/work and retain exact source arithmetic without rounding.
const label=z.string().trim().min(1).max(160);
const money=z.string().regex(/^(0|[1-9]\d{0,11})(\.\d{1,2})?$/);
const units=z.string().regex(/^(0|[1-9]\d{0,3})(\.\d{1,2})?$/);
const levyRate=z.string().regex(/^(0|[1-9]\d{0,5})(\.\d{1,6})?$/);
const points=Object.freeze({'A+':'4.3',A:'4','A-':'3.7','B+':'3.3',B:'3','B-':'2.7','C+':'2.3',C:'2','C-':'1.7','D+':'1.3',D:'1','D-':'0.7',NP:'0',L:'2'});
const gsbPoints=Object.freeze({H:'4.14',HP:'3.54',P:'3.24',LP:'2.94',U:'0'});
const exclusions=['+','CR','*','GNR','RP','N','N-','W','NC','S','I'] as const;
const generalGrades=['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','NP','L',...exclusions] as const;
const transcriptRow=z.discriminatedUnion('gradingSystem',[
 z.object({recordId:label,units,gradingSystem:z.literal('general'),grade:z.enum(generalGrades)}).strict(),
 z.object({recordId:label,units,gradingSystem:z.literal('gsb'),grade:z.enum(['H','HP','P','LP','U'])}).strict(),
]);
const gpaSchema=z.object({policySnapshot:z.literal('2026-10-28'),gradingEra:z.literal('autumn-2014-or-later'),studentCareer:z.enum(['undergraduate','graduate-non-mba-msx']),transcriptStatus:z.literal('registrar-resolved'),rows:z.array(transcriptRow).min(1).max(1000)}).strict();
const gstSchema=z.object({policySnapshot:z.literal('2026-10-28'),currency:z.literal('NZD'),lines:z.array(z.object({id:label,amount:money,priceBasis:z.enum(['exclusive','inclusive']),classification:z.enum(['standard','zero-rated','exempt'])}).strict()).min(1).max(1000)}).strict();
const propertySchema=z.object({methodSnapshot:z.literal('2026-10-28'),currency:z.literal('USD'),assessmentYear:z.number().int().min(1900).max(9999),levies:z.array(z.object({id:label,jurisdiction:label,assessedValue:money,grantedExemptions:money,ratePerThousand:levyRate}).strict()).min(1).max(1000)}).strict();
function unique(ids:string[]){if(new Set(ids).size!==ids.length)throw Error('Duplicate record identity');}
function calculateGpa(raw:unknown):Record<string,unknown>{
 const p=gpaSchema.parse(raw);unique(p.rows.map(r=>r.recordId));
 let gradedUnits=zero,qualityPoints=zero,includedRows=0,temporaryRows=0;
 const rows=p.rows.map(row=>{
  const mapping:Readonly<Record<string,string>>=row.gradingSystem==='general'?points:gsbPoints;
  const included=Object.hasOwn(mapping,row.grade),temporary=row.gradingSystem==='general'&&row.grade==='L';
  const unitValue=decimal(row.units),gradePoint=included?decimal(mapping[row.grade]):null;
  const quality=gradePoint===null?zero:multiply(gradePoint,unitValue);
  if(included){includedRows++;gradedUnits=add(gradedUnits,unitValue);qualityPoints=add(qualityPoints,quality);}
  if(temporary)temporaryRows++;
  return {recordId:row.recordId,grade:row.grade,gradingSystem:row.gradingSystem,units:unitValue,gradePoint,qualityPoints:quality,included,temporary};
 });
 return {gpa:gradedUnits.numerator==='0'?null:divide(qualityPoints,gradedUnits),gradedUnits,qualityPoints,includedRows,excludedRows:rows.length-includedRows,temporaryRows,rows};
}
function calculateGst(raw:unknown):Record<string,unknown>{
 const p=gstSchema.parse(raw);unique(p.lines.map(r=>r.id));
 let net=zero,gst=zero,gross=zero,standardNet=zero,zeroRatedNet=zero,exemptNet=zero;
 const lines=p.lines.map(line=>{
  const amount=decimal(line.amount),standard=line.classification==='standard';
  const base=standard&&line.priceBasis==='inclusive'?multiply(amount,rational(20n,23n)):amount;
  const tax=standard?multiply(base,rational(3n,20n)):zero;
  const total=add(base,tax);net=add(net,base);gst=add(gst,tax);gross=add(gross,total);
  if(standard)standardNet=add(standardNet,base);
  else if(line.classification==='zero-rated')zeroRatedNet=add(zeroRatedNet,base);
  else exemptNet=add(exemptNet,base);
  return {id:line.id,classification:line.classification,priceBasis:line.priceBasis,net:base,gst:tax,gross:total};
 });
 return {currency:p.currency,net,gst,gross,standardNet,zeroRatedNet,exemptNet,lines};
}
function calculateProperty(raw:unknown):Record<string,unknown>{
 const p=propertySchema.parse(raw);unique(p.levies.map(r=>r.id));let totalTax=zero;
 const levies=p.levies.map(levy=>{
  const taxableAssessment=subtract(decimal(levy.assessedValue),decimal(levy.grantedExemptions));
  if(BigInt(taxableAssessment.numerator)<0n)throw Error('Granted exemptions exceed this levy assessment');
  const tax=divide(multiply(taxableAssessment,decimal(levy.ratePerThousand)),rational(1000n));
  totalTax=add(totalTax,tax);
  return {id:levy.id,jurisdiction:levy.jurisdiction,taxableAssessment,ratePerThousand:decimal(levy.ratePerThousand),tax};
 });
 return {currency:p.currency,assessmentYear:p.assessmentYear,totalTax,levies};
}
type Definition=CalculatorDefinition<unknown,Record<string,unknown>>;
const specs=[
 {name:'stanford-transcript-gpa',title:'Stanford transcript GPA — source snapshot',schema:gpaSchema,calculate:calculateGpa,masterId:516,sources:['stanford-gpa','stanford-grading','stanford-repeats'],expression:'sum(mapped grade points * graded units) / sum(graded units)',limits:'Registrar-resolved transcript only; no automatic repeat/grade replacement, I/N conversion, eligibility or historic pre-Autumn2014 rules. Includes NP and temporary L; excluded notation contributes neither points nor denominator. GSB conversions only for undergraduate/non-MBA/non-MSx careers; other school grading systems unsupported. Exact output, no institutional display rounding inferred.'},
 {name:'nz-gst-prices',title:'NZ GST price lines — source snapshot',schema:gstSchema,calculate:calculateGst,masterId:126,sources:['ird-gst-calculating','ird-gst-charging'],expression:'standard exclusive: tax=base*3/20; standard inclusive: tax=gross*3/23; zero-rated/exempt: tax=0 with distinct bases',limits:'Caller supplies supply classification. Source snapshot only, not a current or historic effective-period determination. No land/special supplies, credit entitlement, return/accounting basis, input credits, cash or invoice rounding. Exact dollar fractions retained; zero-rated and exempt are not interchangeable classifications.'},
 {name:'assessment-levies',title:'Granted assessment levy calculation — source snapshot',schema:propertySchema,calculate:calculateProperty,masterId:133,sources:['ny-property-tax'],expression:'sum((assessedValue - grantedExemptions) * ratePerThousand / 1000) separately per levy',limits:'Caller supplies granted exemptions and exact jurisdiction/year-specific rate for each levy. Method page last updated2020-04-03; no current rate lookup, eligibility, levy allocation, assessment valuation, equalization, caps or abatement rules. No shared-exemption inference between jurisdictions. Exact output; invoice rounding unsupported.'},
] as const;
export const sourceBoundProfiles:readonly Definition[]=Object.freeze(specs.map(s=>Object.freeze({
 id:`private.profile.${s.name}`,slug:`private-profile-${s.name}`,title:s.title,category:'private-source-bound-profiles',version:1,riskClass:s.masterId===516?'standard':'tax',reviewStatus:'draft',inputSchema:s.schema,calculate:s.calculate,
 formulas:Object.freeze([{id:s.name,expression:s.expression,description:s.limits}]),
 sources:Object.freeze(s.sources.map(id=>{const source=sourceManifest.sources.find(s=>s.id===id)!;return Object.freeze({label:id,url:source.url,note:`Extracted text SHA256 ${source.extractedTextSHA256}. Not publisher response bytes. Normative version and canonical applicability unaccepted. RELEASE HOLD.`});})),examples:Object.freeze([]),
})));
export const profileSourceBindings:Readonly<Record<string,readonly Readonly<{id:string;sha256:string}>[]>>=Object.freeze(Object.fromEntries(specs.map(s=>[`private.profile.${s.name}`,Object.freeze(s.sources.map(id=>Object.freeze({id,sha256:sourceManifest.sources.find(s=>s.id===id)!.extractedTextSHA256})))])));
