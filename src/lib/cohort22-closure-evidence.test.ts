import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
import {verifyCapturedCurrentCaller} from '../../tests/acceptance-closure-20261108/receipt-source-path.mjs';
const prefix='docs/cohort22-closure-20261109/',read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
it('reconciles the exact existing22 and every inherited requirement without approval promotion',()=>{
 const output=execFileSync('python3',['tests/cohort22-closure-20261109/requirements.py','--check'],{encoding:'utf8'});expect(JSON.parse(output).identities).toBe(22);
 const data=read(prefix+'acceptance-22.json'),ledger=read(prefix+'requirements-540.json'),parent=read(ledger.parentLedger);
 const selected=[368,...Array.from({length:18},(_,i)=>370+i),429,437,439];expect(data.rows.map((r:{masterId:number})=>r.masterId)).toEqual(selected);expect(data.cohortReconciliation.id369Selected).toBe(false);expect(ledger.counts).toEqual(parent.counts);expect(ledger.rows).toHaveLength(540);
 expect(createHash('sha256').update(readFileSync(ledger.parentLedger)).digest('hex')).toBe(ledger.parentLedgerSHA256);
 for(let i=0;i<540;i++){const r=ledger.rows[i],p=parent.rows[i];expect(r.masterId).toBe(p.masterId);expect(r.disposition).toBe(p.disposition);expect(r.newScopedChecks.slice(0,p.newScopedChecks.length)).toEqual(p.newScopedChecks);expect(r.newScopedChecks.length-p.newScopedChecks.length).toBe(selected.includes(r.masterId)?1:0);}
 for(const row of data.rows){expect(row.fullEngineeringComplete).toBe(false);expect(row.canonicalAccepted).toBe(false);expect(row.certificationGranted).toBe(false);expect(row.publicationEligible).toBe(false);expect(row.inheritedCanonicalRequirements.length).toBeGreaterThan(0);expect(row.remainingEngineeringCriteria.length).toBeGreaterThan(0);}
});
it('binds57 actual source browser journeys,30refusals and distinct A/B without authenticated-browser claims',()=>{
 const data=read(prefix+'native-browser.json');expect(data.passed).toBe(true);expect(data.journeys).toHaveLength(57);expect(data.precisionRefusals).toHaveLength(30);expect(data.syntheticAccountTransport).toBe(true);expect(data.canonicalAcceptance).toBe(false);
 for(const row of data.journeys){expect(row.engineExample).toBe(true);expect(row.keyboardRecovery).toBe(true);expect(row.portraitLandscapeDesktopNoOverflow).toBe(true);expect(row.distinctABPreserved).toBe(row.plan!=='free');expect(row.jsonReplayTamper).toBe(row.plan!=='free');}
 for(const [path,hash]of Object.entries(data.sourceHashes)){if(path==='src/components/calculator-interactive.tsx')expect(verifyCapturedCurrentCaller({path,sha256:String(hash)})).toBe(path);else expect(createHash('sha256').update(readFileSync(path)).digest('hex')).toBe(hash);}
});
it('executes current operator negatives including retained SHA-type and successor calendar refusal',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;const out=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/execution-recovery-20261109/cohort22-attestation.test.mjs'],{env,encoding:'utf8',timeout:20000,maxBuffer:1000000});expect(out).toContain('# tests 6');expect(out).toContain('# fail 0');
});

it('independently reads38 retained PDF and CSV export byte records with exact identity/version/value',()=>{
 const data=read(prefix+'native-browser.json'),cases=read('tests/execution-recovery-20261109/technology-cases.json').rows;expect(data.exportChecks).toHaveLength(38);
 for(const record of data.exportChecks){
  expect(['pro','business']).toContain(record.plan);expect(record.pdfIndependentReader).toBe(true);expect(record.pdfExactValue).toBe(true);expect(record.csvExactValue).toBe(true);
  const expected=cases.find((r:{masterId:number})=>r.masterId===record.masterId);expect(expected).toBeDefined();
  const pdf=prefix+'exports/'+record.masterId+'-'+record.plan+'.pdf',csv=prefix+'exports/'+record.masterId+'-'+record.plan+'.csv';
  expect(createHash('sha256').update(readFileSync(pdf)).digest('hex')).toBe(record.pdfSha256);expect(createHash('sha256').update(readFileSync(csv)).digest('hex')).toBe(record.csvSha256);
  const csvLines=readFileSync(csv,'utf8').split(/\r?\n/);expect(csvLines).toContain(`"identity","calculatorVersion","${expected.version}"`);expect(csvLines).toContain(`"identity","calculatorSlug","${expected.slug}"`);expect(csvLines).toContain(`"output","value","${expected.expected}"`);
  const text=execFileSync('pdftotext',['-layout',pdf,'-'],{encoding:'utf8',timeout:10000,maxBuffer:2000000});expect(text.split(/\r?\n/).some(line=>line.trim()===`output["value"] = ${expected.expected}`)).toBe(true);expect(text.replace(/\s+/g,'')).toContain(('Technical calculation revision: '+record.revision).replace(/\s+/g,''));
 }
},20000);
