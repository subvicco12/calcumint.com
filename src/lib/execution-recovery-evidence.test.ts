import {verifyRetainedA7Case} from '../../tests/parallel-source-20261110/retained-vitest.mjs';
import {it,expect} from 'vitest';import {execFileSync} from 'node:child_process';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const directory='docs/execution-recovery-20261109/',json=(p:string)=>JSON.parse(readFileSync(p,'utf8')),sha=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
/** New receipt relocation only. Preserve its original path/hash; never read a parent path. */
function sourcePath(path:string){const capturedCache='../../workspace/work/batch13-deps/node_modules/';const value=path.startsWith(capturedCache)?'node_modules/'+path.slice(capturedCache.length):path;if(value.startsWith('/')||value.includes('\\')||value.includes('\0')||value.split('/').some(p=>!p||p==='.'||p==='..')||!(/^(src|tests|scripts|data|docs|node_modules)\//.test(value)||['package-lock.json','package.json'].includes(value)))throw Error('Unapproved receipt source');return value;}
it('RETAINED A7 — runs the new exact-source, reviewer and operator guard tests through normal mandatory unit discovery',()=>{expect(verifyRetainedA7Case('src/lib/execution-recovery-evidence.test.ts','runs the new exact-source, reviewer and operator guard tests through normal mandatory unit discovery')).toBe(true);},150000);
it('runs every current source-lineage guard in its own bounded mandatory unit process',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=execFileSync(process.execPath,['--test','--test-reporter=tap','tests/execution-recovery-20261109/source-lineage.test.mjs'],{env,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 expect(output).toContain('# fail 0');expect(output).toMatch(/# tests \d+/);
},60000);
it('allows only the exact documented dependency-cache relocation and unchanged captured bytes',()=>{
 expect(sourcePath('../../workspace/work/batch13-deps/node_modules/zod/index.js')).toBe('node_modules/zod/index.js');
 for(const p of ['../../arbitrary/file','../../workspace/work/batch13-deps/node_modules/../../secret','node_modules/../secret','/etc/passwd','src/../secret','src\\lib\\unsafe'])expect(()=>sourcePath(p)).toThrow();
});
it('RETAINED A7 — binds actual authenticated nineteen-identity receipts and independently isolated shared plan gating',()=>{expect(verifyRetainedA7Case('src/lib/execution-recovery-evidence.test.ts','binds actual authenticated nineteen-identity receipts and independently isolated shared plan gating')).toBe(true);},150000);
it('RETAINED A7 — binds native UI and actual isolated restore receipts without fabricating human or production acceptance',()=>{expect(verifyRetainedA7Case('src/lib/execution-recovery-evidence.test.ts','binds native UI and actual isolated restore receipts without fabricating human or production acceptance')).toBe(true);},150000);
it('advances only scoped requirements for22identities and preserves all540 classifications',()=>{
 const ledger=json(directory+'requirements-540.json'),before=json(ledger.parentLedger);expect(sha(ledger.parentLedger)).toBe(ledger.parentLedgerSHA256);expect(ledger.rows).toHaveLength(540);expect(ledger.counts).toEqual(before.counts);expect(Object.values(ledger.counts).reduce((a,b)=>Number(a)+Number(b),0)).toBe(540);expect(ledger.identitiesAdvanced).toHaveLength(22);
 for(let i=0;i<540;i++){const row=ledger.rows[i],prior=before.rows[i];expect(row.masterId).toBe(i+1);expect(row.disposition).toBe(prior.disposition);expect(row.canonicalAccepted).toBe(prior.canonicalAccepted);expect(row.certificationGranted).toBe(false);expect(row.publicationEligibleEstablished).toBe(false);expect(row.newScopedChecks.slice(0,prior.newScopedChecks.length)).toEqual(prior.newScopedChecks);}
 for(const key of ['newFullEngineeringComplete','newCanonicalAcceptances','newCertifications','newPublicationEligible','authorityBlockersResolved'])expect(ledger[key]).toBe(0);
});
