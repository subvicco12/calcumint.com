import {describe,expect,it} from 'vitest';
import {runCalculator} from './engine';
import {sourceBoundProfiles} from './source-bound-profiles';
import {exportSourceProfile,importSourceProfile} from './source-profile-snapshot';
import {formatRational} from './exact-rational';

const ratio=(numerator:string,denominator='1')=>({numerator,denominator});
const run=(name:string,input:unknown)=>runCalculator(sourceBoundProfiles.find(d=>d.id===`private.profile.${name}`)!,input).output;
const row=(recordId:string,grade:string,units='3',gradingSystem='general')=>({recordId,grade,units,gradingSystem});
const gpa={policySnapshot:'2026-10-28',gradingEra:'autumn-2014-or-later',studentCareer:'undergraduate',transcriptStatus:'registrar-resolved',rows:[row('x','B-'),row('y','A-','4'),row('z','B+')]};
const gst={policySnapshot:'2026-10-28',currency:'NZD',lines:[{id:'a',amount:'100',priceBasis:'exclusive',classification:'standard'}]};
const property={methodSnapshot:'2026-10-28',currency:'USD',assessmentYear:2026,levies:[{id:'town',jurisdiction:'Town A',assessedValue:'175000',grantedExemptions:'25000',ratePerThousand:'50'}]};

describe('source-bound Stanford transcript GPA',()=>{
 it('matches the official 32.8/10=3.28 example exactly with row evidence',()=>{
  const out=run('stanford-transcript-gpa',gpa);
  expect(out).toMatchObject({gpa:ratio('82','25'),gradedUnits:ratio('10'),qualityPoints:ratio('164','5'),includedRows:3,excludedRows:0,temporaryRows:0});
  expect(out.rows).toHaveLength(3);
 });
 it('includes NP units, excludes NC/CR/RP and retains temporary L at2.0',()=>{
  expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a','A','4'),row('b','NP','4')]})).toMatchObject({gpa:ratio('2'),gradedUnits:ratio('8')});
  expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a','A','4'),row('b','NC','4'),row('c','RP','4'),row('d','CR','4')]})).toMatchObject({gpa:ratio('4'),gradedUnits:ratio('4'),excludedRows:3});
  expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a','L','4')]})).toMatchObject({gpa:ratio('2'),temporaryRows:1});
 });
 it('does not invent a GPA from only excluded symbols or zero units',()=>{
  expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a','W')]})).toMatchObject({gpa:null,gradedUnits:ratio('0')});
  expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a','A','0')]})).toMatchObject({gpa:null});
 });
 it('implements the full published grade table and eligible GSB conversions',()=>{
  const grades=[['A+','43','10'],['A','4','1'],['A-','37','10'],['B+','33','10'],['B','3','1'],['B-','27','10'],['C+','23','10'],['C','2','1'],['C-','17','10'],['D+','13','10'],['D','1','1'],['D-','7','10'],['NP','0','1'],['L','2','1']];
  for(const [grade,n,d] of grades)expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a',grade,'1')]}).gpa).toEqual(ratio(n,d));
  for(const [grade,n,d] of [['H','207','50'],['HP','177','50'],['P','81','25'],['LP','147','50'],['U','0','1']])expect(run('stanford-transcript-gpa',{...gpa,studentCareer:'graduate-non-mba-msx',rows:[row('a',grade,'1','gsb')]}).gpa).toEqual(ratio(n,d));
 });
 it.each(['+','CR','*','GNR','RP','N','N-','W','NC','S','I'])('explicitly excludes symbol %s',grade=>expect(run('stanford-transcript-gpa',{...gpa,rows:[row('a',grade)]})).toMatchObject({gpa:null,excludedRows:1}));
 it.each([{studentCareer:'MBA'},{gradingEra:'before-2014'},{transcriptStatus:'unresolved'},{policySnapshot:'2027-01-01'},{rows:[row('a','F')]},{rows:[row('a','H')]},{rows:[row('a','A','-1')]},{rows:[row('a','A','1.001')]},{rows:[row('a','A'),row('a','B')]}])('fails closed for unsupported GPA input %j',change=>expect(()=>run('stanford-transcript-gpa',{...gpa,...change})).toThrow());
 it('uses supplied RP notation without applying an invented repeat selection',()=>{
  expect(run('stanford-transcript-gpa',{...gpa,rows:[row('attempt1','RP','3'),row('attempt2','NP','3'),row('attempt3','A','3')]})).toMatchObject({gpa:ratio('2'),includedRows:2,excludedRows:1});
 });
});

describe('source-bound NZ GST price lines',()=>{
 it('matches official exclusive and inclusive witnesses without binary rounding',()=>{
  expect(run('nz-gst-prices',gst)).toMatchObject({net:ratio('100'),gst:ratio('15'),gross:ratio('115')});
  expect(run('nz-gst-prices',{...gst,lines:[{...gst.lines[0],amount:'115',priceBasis:'inclusive'}]})).toMatchObject({net:ratio('100'),gst:ratio('15'),gross:ratio('115')});
  expect(run('nz-gst-prices',{...gst,lines:[{...gst.lines[0],amount:'100',priceBasis:'inclusive'}]})).toMatchObject({net:ratio('2000','23'),gst:ratio('300','23'),gross:ratio('100')});
 });
 it('keeps zero-rated and exempt bases distinct, never inferring eligibility',()=>{
  const out=run('nz-gst-prices',{...gst,lines:[...gst.lines,{id:'b',amount:'20',priceBasis:'inclusive',classification:'zero-rated'},{id:'c',amount:'30',priceBasis:'exclusive',classification:'exempt'}]});
  expect(out).toMatchObject({net:ratio('150'),gst:ratio('15'),gross:ratio('165'),standardNet:ratio('100'),zeroRatedNet:ratio('20'),exemptNet:ratio('30')});
 });
 it('retains exact fractional cents and reconciles totals before any display rounding',()=>{
  const out=run('nz-gst-prices',{...gst,lines:[{...gst.lines[0],amount:'0.01'},{id:'b',amount:'0.01',priceBasis:'exclusive',classification:'standard'}]});
  expect(out).toMatchObject({net:ratio('1','50'),gst:ratio('3','1000'),gross:ratio('23','1000')});
 });
 it.each([{currency:'USD'},{rate:0.15},{lines:[]},{lines:[{...gst.lines[0],amount:'1e3'}]},{lines:[{...gst.lines[0],amount:'-1'}]},{lines:[{...gst.lines[0],classification:'land-sale'}]},{lines:[gst.lines[0],gst.lines[0]]}])('rejects unsupported GST domain %j',change=>expect(()=>run('nz-gst-prices',{...gst,...change})).toThrow());
});

describe('source-bound granted assessment levy arithmetic',()=>{
 it('implements per-thousand units:150000*50/1000=7500',()=>{
  expect(run('assessment-levies',property)).toMatchObject({totalTax:ratio('7500')});
 });
 it('keeps each jurisdiction exemption and rate separate with exact fractional results',()=>{
  const out=run('assessment-levies',{...property,levies:[property.levies[0],{id:'school',jurisdiction:'School district',assessedValue:'175000',grantedExemptions:'0',ratePerThousand:'12.345678'}]});
  // 175000*12.345678/1000=2160.49365, plus7500.
  expect(out.totalTax).toEqual(ratio('193209873','20000'));
 });
 it('allows zero taxable assessment and zero rate without an invented tax minimum',()=>{
  expect(run('assessment-levies',{...property,levies:[{...property.levies[0],grantedExemptions:'175000'}]})).toMatchObject({totalTax:ratio('0')});
  expect(run('assessment-levies',{...property,levies:[{...property.levies[0],ratePerThousand:'0'}]})).toMatchObject({totalTax:ratio('0')});
 });
 it.each([{levies:[{...property.levies[0],grantedExemptions:'175001'}]},{levies:[{...property.levies[0],ratePerThousand:'1.1234567'}]},{levies:[{...property.levies[0],rate:50}]},{levies:[property.levies[0],property.levies[0]]},{assessmentYear:2026.5}])('rejects unsupported assessment domain %j',change=>expect(()=>run('assessment-levies',{...property,...change})).toThrow());
});

describe('source/version-bound exchange and parity',()=>{
 it.each([['stanford-transcript-gpa',gpa],['nz-gst-prices',gst],['assessment-levies',property]] as const)('has identical math across all plans and immutable replay for %s',(id,input)=>{
  const d=sourceBoundProfiles.find(d=>d.id===`private.profile.${id}`)!;
  const runs=(['free','pro','business'] as const).map(plan=>exportSourceProfile(d.id,input,plan));
  expect(runs[1]).toEqual(runs[0]);expect(runs[2]).toEqual(runs[0]);
  const s=exportSourceProfile(d.id,input);
  expect(Object.isFrozen(s.calculation.input)).toBe(true);expect(Object.isFrozen(s.calculation.output)).toBe(true);
  expect(Object.isFrozen(s.sources)).toBe(true);
  expect(importSourceProfile(JSON.parse(JSON.stringify(s)))).toEqual(s);
 });
 it.each(['source','output','version','identity','extra'])('rejects %s tampering',kind=>{
  const s=JSON.parse(JSON.stringify(exportSourceProfile('private.profile.nz-gst-prices',gst)));
  if(kind==='source')s.sources[0].sha256='0'.repeat(64);
  if(kind==='output')s.calculation.output.gst.numerator='0';
  if(kind==='version')s.calculation.calculatorVersion=2;
  if(kind==='identity')s.profileId='tax.gst';
  if(kind==='extra')s.accepted=true;
  expect(()=>importSourceProfile(s)).toThrow();
 });
 it('formats exact terminating values and retains nonterminating fractions',()=>{
  expect(formatRational(ratio('82','25'))).toBe('3.28');
  expect(formatRational(ratio('300','23'))).toBe('300/23');
  expect(formatRational(ratio('0'))).toBe('0');
 });
 it('bounds row work, decimal length and rejects non-JSON accessor exports',()=>{
  expect(()=>run('nz-gst-prices',{...gst,lines:Array(1001).fill(gst.lines[0])})).toThrow();
  expect(()=>run('nz-gst-prices',{...gst,lines:[{...gst.lines[0],amount:'1'.repeat(1000)}]})).toThrow();
  const getter={get profileId(){throw Error('must not invoke getter')}};
  expect(()=>importSourceProfile(getter)).toThrow('Unsupported calculation field');
 });
});
