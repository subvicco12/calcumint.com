import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {buildImplementationReconciliation} from './implementation-reconciliation';
import {parseMasterCatalogCsv} from './catalog-csv-ingestion';
const m=buildImplementationReconciliation();
describe('independent complete inventory evidence checks',()=>{
 it('retains each authoritative identity exactly once and separates implementation from authority',()=>{
  expect(m.rows.map(({masterId,domain,title})=>({masterId,domain,title}))).toEqual(parseMasterCatalogCsv(readFileSync('data/catalog/master-catalog-2026.csv','utf8')));
  expect(m.rows).toHaveLength(540);
  for(const r of m.rows){
   expect(r.canonicalMappingApproved).toBe(false);
   expect(r.lifecycle).toMatchObject({currentPublicPublication:'UNKNOWN',protectedCertification:'UNKNOWN',releaseHold:true,certificationAuthorized:false,publicationAuthorized:false});
   expect(r.currentAbsenceProven).toBe(false);
   if(r.implementationClass==='REGISTERED_IMPLEMENTED')expect(r.registeredEvidence.some(e=>e.exactCurrentBinding&&['RECORDED_CANDIDATE_NOT_CANONICAL_MAPPING','ENGINE_CONTRACT_MATCH'].includes(e.basis))).toBe(true);
  }
 });
 it('hashes every listed current calculator source and evidence file accurately',()=>{
  const hash=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
  for(const f of [...m.implementationSnapshot.files,...m.evidenceBindings])expect(f.sha256,f.path).toBe(hash(f.path));
  expect(m.implementationSnapshot.sourceTreeSHA256).toBe(createHash('sha256').update(JSON.stringify(m.implementationSnapshot.files)).digest('hex'));
 });
 it('pins the historical identity source and owner scope approval consumed by classification',()=>{
  const paths=m.evidenceBindings.map(f=>f.path);
  expect(paths).toContain('data/catalog/reconciliation-2026-10-25/manifest.json');
  expect(paths).toContain('data/catalog/scope-policy-decisions-2026-10-25/owner-selections-2026-10-26.json');
 });
});
