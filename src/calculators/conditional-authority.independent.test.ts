import {describe,it,expect} from 'vitest';
import {conditionalExamples,conditionalProfiles,exportConditional,importConditional} from './conditional-authority';
const out=(id:number,patch:Record<string,unknown>={})=>exportConditional({...conditionalExamples[id],...patch}).calculation.output;
describe('independently derived conditional-authority arithmetic',()=>{
 it.each([['111111.11','11111111/2460'],['12345.67','1234567/2460'],['0.02','1/1230'],['24.6','1']])('95 preserves the exact quotient for %s',(balanceUSD,exactRmdUSD)=>expect(out(95,{balanceUSD})).toMatchObject({exactRmdUSD,ordinaryDeadline:'2026-12-31'}));
 it.each([['6987.65','6987.65'],['7000.01','7000'],['0.01','0.01']])('97 uses compensation and the2025 cap for %s',(taxableCompensationUSD,contributionMaximumUSD)=>expect(out(97,{taxableCompensationUSD,magiUSD:'149999.99'})).toEqual({contributionMaximumUSD}));
 it.each([
  ['80234.56','6140','860'],
  ['88014.28','700','6300'],
  ['88014.29','690','6310'],
  ['88700','210','6790'],
  ['88900','200','6800'],
 ])('98 follows the next-ten-dollar ceiling at MAGI %s',(magiUSD,deductionMaximumUSD,nondeductibleWorksheetUSD)=>expect(out(98,{magiUSD})).toEqual({deductionMaximumUSD,nondeductibleWorksheetUSD}));
 it('98 minimum200 phase cap is capped again by actual contribution',()=>expect(out(98,{magiUSD:'88999.99',contributionUSD:'123.45'})).toEqual({deductionMaximumUSD:'123.45',nondeductibleWorksheetUSD:'0'}));
 it('98 faithfully uses min(worksheet compensation,contribution) for line8',()=>{
  expect(out(98,{magiUSD:'89000',adjustedCompensationUSD:'325.10',contributionUSD:'500'})).toEqual({deductionMaximumUSD:'0',nondeductibleWorksheetUSD:'325.1'});
  expect(out(98,{magiUSD:'85000',adjustedCompensationUSD:'1000',contributionUSD:'3500'})).toEqual({deductionMaximumUSD:'1000',nondeductibleWorksheetUSD:'0'});
 });
 it('98 rejects adjusted compensation outside the deliberately narrowed bound',()=>expect(()=>out(98,{taxableCompensationUSD:'1000',adjustedCompensationUSD:'1000.01',contributionUSD:'500'})).toThrow());
 it.each([['0.01','0.0019'],['123456.78','28966.0467'],['49999.99','9499.9981'],['249999.99','62499.99735'],['999999999999.99','249999999999.9975']])('132 preserves exact computational tax for %s',(profits,computationalTaxGBP)=>expect(out(132,{profitsNGBP:profits,augmentedProfitsAGBP:profits})).toEqual({computationalTaxGBP}));
 it('132 accepts equal decimal values without relying on string equality',()=>expect(out(132,{profitsNGBP:'50000.0',augmentedProfitsAGBP:'50000.00'})).toEqual({computationalTaxGBP:'9500'}));
 it('rejects unsupported year,spouse,distribution,SocialSecurity and company facts',()=>{
  for(const [id,patch] of [
   [95,{spouseSoleBeneficiaryMoreThanTenYearsYounger:true}],[95,{firstRmdYear:true}],
   [97,{taxYear:2026}],[97,{magiUSD:'150000'}],[97,{distributionUSD:'100'}],
   [98,{receivedSocialSecurityBenefits2025:true}],[98,{receivedSocialSecurityBenefits2025:null}],
   [98,{otherIraContributions:true}],[98,{taxableCompensationUSD:'1000',contributionUSD:'1000.01',adjustedCompensationUSD:'1000'}],
   [132,{profitsNGBP:'100000',augmentedProfitsAGBP:'100000.01'}],[132,{associates:1}],[132,{periodStart:'2026-04-02'}],
  ] as const)expect(()=>out(id,patch)).toThrow();
 });
 it.each([95,97,98,132])('%i exports detached source-bound output with exact plan parity',id=>{
  const raw={...conditionalExamples[id]};const s=exportConditional(raw);
  raw.evidenceReference='changed later';expect(s.calculation.input.evidenceReference).not.toBe('changed later');
  expect(Object.isFrozen(s.source.files[0])).toBe(true);expect(Object.isFrozen(s.methodology)).toBe(true);expect(Object.isFrozen(s.governance)).toBe(true);
  expect(exportConditional(conditionalExamples[id],'pro')).toEqual(s);expect(exportConditional(conditionalExamples[id],'business')).toEqual(s);
  expect(importConditional(JSON.parse(JSON.stringify(s)))).toEqual(s);
  expect(s.governance).toMatchObject({relatedCatalogId:id,canonicalImplementationClass:'CONTRACT_BLOCKED',canonicalAccepted:false,qualifiedApplicability:'UNRESOLVED',certificationAuthorized:false,publicationAuthorized:false});
 });
 it('binds a valid same-family payload to its exact selected profile and governance',()=>{
  const s=JSON.parse(JSON.stringify(exportConditional(conditionalExamples[97])));
  s.calculation=JSON.parse(JSON.stringify(exportConditional(conditionalExamples[98]).calculation));
  expect(()=>importConditional(s)).toThrow();
  const forged=JSON.parse(JSON.stringify(exportConditional(conditionalExamples[95])));forged.governance.qualifiedApplicability='VERIFIED';expect(()=>importConditional(forged)).toThrow();
 });
 it('exposes exactly the four source-supported private profiles,keeping the other six out',()=>expect(conditionalProfiles.map(p=>p.id)).toEqual([95,97,98,132]));
});

import {spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
it('offline source verifier rejects a binding that silently drops all six authenticated sources',()=>{
 const directory=mkdtempSync(path.join(tmpdir(),'conditional-source-review-'));
 try{
  const root=path.join(directory,'docs/conditional-ten');mkdirSync(root,{recursive:true});
  cpSync('docs/conditional-ten/source',path.join(root,'source'),{recursive:true});
  const archiveDirectory=path.join(directory,'docs/partial16-ci-recovery/input');mkdirSync(archiveDirectory,{recursive:true});
  cpSync('docs/partial16-ci-recovery/input/source-resolution-16.zip',path.join(archiveDirectory,'source-resolution-16.zip'));
  const binding=JSON.parse(readFileSync('docs/conditional-ten/source-binding.json','utf8'));binding.files=[];
  writeFileSync(path.join(root,'source-binding.json'),JSON.stringify(binding));
  const result=spawnSync('python3',[path.resolve('scripts/verify-conditional-source.py')],{cwd:directory,encoding:'utf8'});
  expect(result.error).toBeUndefined();expect(result.status).not.toBe(0);
 }finally{rmSync(directory,{recursive:true,force:true});}
});
