import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
import {verifyCapturedSource} from '../../tests/acceptance-closure-20261108/receipt-source-path.mjs';
const prefix='docs/first-five-20261109/',json=(p:string)=>JSON.parse(readFileSync(p,'utf8')),digest=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
it('retains all540 identities and inherited criteria while recording only five individually scoped engineering deltas',()=>{
 const out=JSON.parse(execFileSync('python3',['tests/first-five-20261109/requirements.py','--check'],{encoding:'utf8'}));expect(out.selected).toEqual([370,371,372,373,386]);
 const current=json(prefix+'requirements-540.json'),parent=json(current.parentLedger),five=json(prefix+'acceptance-5.json');expect(digest(current.parentLedger)).toBe(current.parentLedgerSHA256);expect(current.rows).toHaveLength(540);expect(current.counts).toEqual(parent.counts);expect(five.rows).toHaveLength(5);
 for(let i=0;i<540;i++){const row=current.rows[i],old=parent.rows[i];expect(row.masterId).toBe(old.masterId);expect(row.disposition).toBe(old.disposition);expect(row.newScopedChecks.slice(0,old.newScopedChecks.length)).toEqual(old.newScopedChecks);expect(row.newScopedChecks.length-old.newScopedChecks.length).toBe(out.selected.includes(row.masterId)?1:0);}
 for(const row of five.rows){expect(row.technicalVersion).toBe(1);expect(row.fullEngineeringComplete).toBe(false);expect(row.canonicalAccepted).toBe(false);expect(row.certificationGranted).toBe(false);expect(row.publicationEligible).toBe(false);expect(row.remainingEngineeringCriteria.length).toBeGreaterThan(0);}
});
it('binds all15 actual analytical browser journeys without authenticated or production claims',async()=>{
 const receipt=json(prefix+'analysis-browser.json');expect(receipt.passed).toBe(true);expect(receipt.journeys).toHaveLength(15);expect(receipt.syntheticAccountTransport).toBe(true);expect(receipt.productionAcceptance).toBe(false);
 for(const row of receipt.journeys){expect(row.primarySnapshotUnchanged).toBe(true);expect(row.independentSamples).toBe(true);expect(row.accessibleRegionAndTable).toBe(true);expect(row.viewportNoOverflow).toBe(true);expect(row.keyboardTargetRecovery).toBe(row.plan!=='free');}
 for(const [path,sha256] of Object.entries(receipt.sourceHashes))await expect(verifyCapturedSource({path,sha256:String(sha256)})).resolves.toBe(path);
},60000);
it('runs all nineteen new exact-source and unchanged-verification CI budget checks in mandatory unit discovery',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/first-five-20261109/source-lineage.test.mjs','tests/first-five-20261109/crossed-dependency-source.test.mjs','tests/first-five-20261109/workflow-budget.test.mjs','tests/first-five-20261109/artifact-file.test.mjs','tests/first-five-20261109/lineage-portability.test.mjs','tests/ci-gate-recovery/batch17-budget-successor.test.mjs'],{encoding:'utf8',env,timeout:45000,maxBuffer:2000000});expect(output).toContain('# tests 19');expect(output).toContain('# fail 0');
},60000);

it('binds fifteen genuine authenticated existing-route journeys and independently reads fifty native completed downloads',async()=>{
 const receipt=json(prefix+'authenticated/receipt.json'),verified=json(prefix+'authenticated/verification.json');expect(receipt.passed).toBe(true);expect(receipt.kind).toBe('FIVE_GENUINE_AUTHENTICATED_NATIVE_UI_FINITE_ACCEPTANCE');expect(receipt.journeys).toHaveLength(15);expect(receipt.identities.map((row:{masterId:number})=>row.masterId)).toEqual([386,370,371,372,373]);expect(receipt.plans).toEqual(['free','pro','business']);
 for(const row of receipt.journeys){expect(row.version).toBe(1);expect(row.historyRead).toBe(true);expect(row.exactReplay).toBe(true);expect(row.persistedScenario).toBe(row.plan!=='free');expect(row.crossOwner).toBe(row.plan!=='free');}
 for(const [path,sha256]of Object.entries(receipt.sourceHashes))await expect(verifyCapturedSource({path,sha256:String(sha256)})).resolves.toBe(path);
 for(const [path,sha256]of Object.entries(receipt.copiedSourceHashes))expect(sha256).toBe(receipt.sourceHashes[path]);
 expect(verified.receiptSha256).toBe(digest(prefix+'authenticated/receipt.json'));expect(verified.rawLogSha256).toBe(digest(prefix+'authenticated/raw.log'));expect(verified.verifierSha256).toBe(digest('tests/first-five-20261109/verify-authenticated-artifacts.mjs'));expect(verified.artifactReaderSha256).toBe(digest('tests/first-five-20261109/artifact-file.mjs'));expect(verified.completedDownloads).toBe(50);expect(verified.exactCsvAndPdfIdentityVersionOutput).toBe(true);
 const output=execFileSync(process.execPath,['tests/first-five-20261109/verify-authenticated-artifacts.mjs','--check'],{encoding:'utf8',timeout:20000,maxBuffer:1000000});expect(output).toContain('PASS 15 journeys, 50 native files');
 expect(receipt.limits.join(' ')).toContain('unexpired signed access JWT remains accepted');
},60000);
