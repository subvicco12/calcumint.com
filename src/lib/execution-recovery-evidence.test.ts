import {it,expect} from 'vitest';import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const directory='docs/execution-recovery-20261109/',json=(p:string)=>JSON.parse(readFileSync(p,'utf8')),sha=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
/** New receipt relocation only. Preserve its original path/hash; never read a parent path. */
function sourcePath(path:string){const capturedCache='../../workspace/work/batch13-deps/node_modules/';const value=path.startsWith(capturedCache)?'node_modules/'+path.slice(capturedCache.length):path;if(value.startsWith('/')||value.includes('\\')||value.includes('\0')||value.split('/').some(p=>!p||p==='.'||p==='..')||!(/^(src|tests|scripts|data|docs|node_modules)\//.test(value)||['package-lock.json','package.json'].includes(value)))throw Error('Unapproved receipt source');return value;}
const verifyHashes=(record:Record<string,string>)=>{for(const [p,expected] of Object.entries(record)){expect(expected).toMatch(/^[a-f0-9]{64}$/);expect(sha(sourcePath(p))).toBe(expected);}};
it('runs the new exact-source, reviewer and operator guard tests through normal mandatory unit discovery',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/recovery-reviewer440/packet.test.mjs','tests/execution-recovery-20261109/operations-preflight.test.mjs','tests/execution-recovery-20261109/source-lineage.test.mjs','tests/execution-recovery-20261109/reader-forwarding.test.mjs'],{env,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 expect(output).toContain('# fail 0');expect(output).toMatch(/# tests \d+/);
},60000);
it('allows only the exact documented dependency-cache relocation and unchanged captured bytes',()=>{
 expect(sourcePath('../../workspace/work/batch13-deps/node_modules/zod/index.js')).toBe('node_modules/zod/index.js');
 for(const p of ['../../arbitrary/file','../../workspace/work/batch13-deps/node_modules/../../secret','node_modules/../secret','/etc/passwd','src/../secret','src\\lib\\unsafe'])expect(()=>sourcePath(p)).toThrow();
});
it('binds actual authenticated nineteen-identity receipts and independently isolated shared plan gating',()=>{
 const auth=json(directory+'technology-auth/receipt.json');expect(auth.passed).toBe(true);expect(auth.productionWrites).toBe(false);expect(auth.journeys).toHaveLength(57);
 const ids=[368,...Array.from({length:18},(_,i)=>370+i)];expect([...new Set(auth.journeys.map((r:{masterId:number})=>r.masterId))]).toEqual(ids);
 for(const id of ids){const rows=auth.journeys.filter((r:{masterId:number})=>r.masterId===id);expect(rows.map((r:{plan:string})=>r.plan)).toEqual(['free','pro','business']);for(const r of rows){expect(r.history).toBe('ATOMIC_IDEMPOTENT_PERSISTED_REPLAY');expect(r.wrongVersionsRejected).toBe(true);expect(r.foreignReadUpdateDenied).toBe(true);}}
 for(const binding of auth.sources)expect(sha(sourcePath(binding.path))).toBe(binding.sha256);
 const plan=json(directory+'technology-auth/plan-isolation-receipt.json');expect(plan.passed).toBe(true);expect(plan.freeScenarioRows).toBe(0);expect(plan.proScenarioRows).toBe(1);expect(plan.sameJwtUserProjectHistoryArgumentsAndRequestId).toBe(true);expect(plan.productionWrites).toBe(false);verifyHashes(plan.sourceHashes);
});
it('binds native UI and actual isolated restore receipts without fabricating human or production acceptance',()=>{
 const mobile=json(directory+'technology-native-browser.json'),desktop=json(directory+'technology-desktop/report.json'),privateUI=json(directory+'converters/native-browser-report.json');
 expect(mobile.passed).toBe(true);expect(mobile.journeys).toHaveLength(57);verifyHashes(mobile.sourceHashes);
 expect(desktop.passed).toBe(true);expect(desktop.journeys).toHaveLength(19);verifyHashes(desktop.sourceHashes);
 expect(privateUI.passed).toBe(true);expect(privateUI.journeys).toHaveLength(9);verifyHashes(privateUI.sourceSha256);expect(sha('tests/execution-recovery-20261109/converter-workspace-browser.mjs')).toBe(privateUI.testSha256);
 expect(privateUI.canonicalAdoptionAuthorized).toBe(false);expect(privateUI.competentApproval).toBe(false);
 const restore=json(directory+'operations/restore-receipt.json');expect(restore.passed).toBe(true);expect(restore.checks).toHaveLength(4);expect(restore.productionRestoreEstablished).toBe(false);expect(restore.dumpPersisted).toBe(false);verifyHashes(restore.sourceHashes);
 const current=json(directory+'reviewer/current-assignment-readonly.json');expect(current.readOnly).toBe(true);expect(current.certificationGranted).toBe(false);for(const row of current.rows){expect(row.actor_bypass_rls).toBe(true);expect(row.read_only).toBe('on');expect(row.assigned_candidate_count).toBe(0);}
});
it('advances only scoped requirements for22identities and preserves all540 classifications',()=>{
 const ledger=json(directory+'requirements-540.json'),before=json(ledger.parentLedger);expect(sha(ledger.parentLedger)).toBe(ledger.parentLedgerSHA256);expect(ledger.rows).toHaveLength(540);expect(ledger.counts).toEqual(before.counts);expect(Object.values(ledger.counts).reduce((a,b)=>Number(a)+Number(b),0)).toBe(540);expect(ledger.identitiesAdvanced).toHaveLength(22);
 for(let i=0;i<540;i++){const row=ledger.rows[i],prior=before.rows[i];expect(row.masterId).toBe(i+1);expect(row.disposition).toBe(prior.disposition);expect(row.canonicalAccepted).toBe(prior.canonicalAccepted);expect(row.certificationGranted).toBe(false);expect(row.publicationEligibleEstablished).toBe(false);expect(row.newScopedChecks.slice(0,prior.newScopedChecks.length)).toEqual(prior.newScopedChecks);}
 for(const key of ['newFullEngineeringComplete','newCanonicalAcceptances','newCertifications','newPublicationEligible','authorityBlockersResolved'])expect(ledger[key]).toBe(0);
});
