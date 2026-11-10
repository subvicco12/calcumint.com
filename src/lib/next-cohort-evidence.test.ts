import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import cases from '../../tests/next-cohort-ui-20261110/cases.json';
import {replayTechnologyNextBatch,technologyNextBatchCsv} from './technology-next-batch';
const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
it('retains exact-eight actual UI journeys and independently literal-valued native batch artifacts',()=>{
 const r=JSON.parse(readFileSync('docs/next-cohort-ui-20261110/browser.json','utf8'));expect(r.passed).toBe(true);expect(r.syntheticAccountTransport).toBe(true);expect(r.productionAcceptance).toBe(false);expect(r.journeys).toHaveLength(24);expect(r.downloads).toHaveLength(48);
 for(const [path,sha]of Object.entries(r.sourceHashes))expect(hash(readFileSync(path))).toBe(sha);
 for(const c of cases)for(const plan of ['free','pro','business']){
  const js=r.journeys.filter((j:{id:number;plan:string})=>j.id===c.id&&j.plan===plan);expect(js).toHaveLength(1);expect(js[0].independentSamples).toBe(true);expect(js[0].blankRecovery).toBe(true);expect(js[0].viewportNoOverflow).toBe(true);
  const ds=r.downloads.filter((d:{id:number;plan:string})=>d.id===c.id&&d.plan===plan);expect(ds).toHaveLength(2);let json='',csv='';for(const d of ds){const bytes=readFileSync('docs/next-cohort-ui-20261110/'+d.file);expect(bytes.length).toBe(d.bytes);expect(hash(bytes)).toBe(d.sha256);if(d.format==='JSON')json=bytes.toString();else csv=bytes.toString();}
  const b=replayTechnologyNextBatch(json);expect(b.engineId).toBe(c.engine);expect(b.version).toBe(c.version);expect(b.rows.map(x=>x.snapshot?.output.value)).toEqual(c.batchValues);expect(b.rows.map(x=>x.raw).join('\n')).toBe(c.batch);for(const row of b.rows){expect(row.snapshot?.calculatorSlug).toBe(c.slug);expect(row.snapshot?.calculatorVersion).toBe(c.version);}expect(technologyNextBatchCsv(b)).toBe(csv);expect(csv).toContain('"'+c.unit+'"');
 }
});
it('preserves five unsigned canonical packets and every retained original clause without approval',()=>{
 const original=JSON.parse(readFileSync('docs/five-full-contract-20261109/acceptance-5.json','utf8'));expect(original.rows).toHaveLength(5);
 for(const row of original.rows){const p=JSON.parse(readFileSync(`docs/canonical-five-20261110/${row.masterId}-v1-review-packet.json`,'utf8'));expect(p.checkpoint.sourceCommit).toBe('1ec63cd11626df15063546c7e5bfedecec33f6ee');expect(p.clauseAssociations).toEqual(row.criteria);expect(p.clauseAssociations).toHaveLength(34);for(const flag of ['canonicalAccepted','certificationGranted','publicationEligible'])expect(p[flag]).toBe(false);expect(p.authority.actualAppointedReviewer).toBeNull();for(const d of p.requiredDecisions){expect(d.status).toBe('UNAPPROVED');expect(d.reviewer).toBeNull();expect(d.decision).toBeNull();}}
});
it('binds finite bounded local batch measurements without promoting production performance',()=>{const r=JSON.parse(readFileSync('docs/next-cohort-20261110/performance/receipt.json','utf8'));expect(r.passed).toBe(true);expect(r.productionQualified).toBe(false);expect(r.planDependentMath).toBe(false);expect(r.measurements).toHaveLength(8);for(const c of cases){const ms=r.measurements.filter((m:{catalogId:number})=>m.catalogId===c.id);expect(ms).toHaveLength(1);expect(ms[0].rows).toBe(100);expect(ms[0].version).toBe(c.version);expect(ms[0].expected).toBe(c.batchValues[0]);expect(ms[0].allIndependentLiteralValuesMatched).toBe(true);expect(ms[0].milliseconds).toHaveLength(3);for(const n of ms[0].milliseconds)expect(Number.isFinite(n)&&n>=0).toBe(true);}for(const [path,sha]of Object.entries(r.sourceHashes))expect(hash(readFileSync(path))).toBe(sha);});
