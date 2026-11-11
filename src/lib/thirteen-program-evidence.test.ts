import {assertNamedApplicationSuccessor} from '../../tests/parallel-source-20261110/core.mjs';
import {verifyRetainedA7Case} from '../../tests/parallel-source-20261110/retained-vitest.mjs';
import {beforeAll,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const hash=(b:Buffer|string)=>createHash('sha256').update(b).digest('hex');
const env:NodeJS.ProcessEnv={...process.env,PYTHONDONTWRITEBYTECODE:'1'};delete env.NODE_TEST_CONTEXT;
beforeAll(()=>{
 const result=JSON.parse(execFileSync(process.execPath,['tests/thirteen-program-20261110/source-bootstrap.mjs'],{encoding:'utf8',env,timeout:130000,maxBuffer:1000000}));
 expect(result.sourceCommits).toEqual(['40d3c8e03125b9075a273805b6760066ad828b8f','531d677e0cca42d7259d4a2440057ccc74daea86']);expect(result.sourceRevisions).toBe(2);expect(result.productionWrites).toBe(false);
},140000);
it('runs all eight finite documentary source bootstrap negative checks',()=>{
 const output=execFileSync(process.execPath,['tests/thirteen-program-20261110/source-bootstrap.test.mjs'],{encoding:'utf8',env,timeout:30000,maxBuffer:1000000}).replace(/\u001b\[[0-9;]*m/g,'');
 expect(output).toMatch(/(?:#|ℹ) tests\s+8/);expect(output).toMatch(/(?:#|ℹ) pass\s+8/);expect(output).toMatch(/(?:#|ℹ) fail\s+0/);
});
it('RETAINED A7 — retains thirteen unsigned exact-version packets, original clause associations and genuine approval gaps',()=>{expect(verifyRetainedA7Case('src/lib/thirteen-program-evidence.test.ts','retains thirteen unsigned exact-version packets, original clause associations and genuine approval gaps')).toBe(true);},150000);

it('retains exact-six invoker boundaries and new genuine isolated authority/retry checks without SQL activation',()=>{
 expect(execFileSync(process.execPath,['tests/publication-rpc-six-20261110/verify.mjs'],{encoding:'utf8',env,timeout:30000})).toContain('PASS exact six');
 const q=read('docs/publication-rpc-six-20261110/qualification.json');expect(q.exactSix).toHaveLength(6);expect(q.newChecks).toHaveLength(7);expect(q.activationAuthorized).toBe(false);
 const raw=read('docs/publication-rpc-six-20261110/hosted-tool-receipt.json');expect(raw.isError).toBe(false);
 const result=JSON.parse(raw.content[0].text).result;
 expect(result).toContain('"read_only":"on"');expect(result).toContain('"matching_public_overloads":0');
 expect(readFileSync('docs/publication-rpc-six-20261110/hosted-readonly.sql','utf8')).toMatch(/^BEGIN TRANSACTION READ ONLY;/);
});
it('keeps actual operator identities, attestations and release authority unassigned',()=>{
 const r=read('docs/operational-thirteen-20261110/operator-checklist.json');
 for(const flag of ['executionReady','activationAuthorized','productionWrites','certificationGranted','publicationEligible'])expect(r[flag]).toBe(false);
 expect(r.releaseHold).toBe(true);expect(r.controls).toHaveLength(10);
 for(const key of ['ownerIdentity','operatorIdentity','observerIdentity','recoveryIdentity','signature','signedAt'])expect(r[key]).toBeNull();
 for(const c of r.controls){expect(c.status).toBe('BLOCKED_PENDING_GENUINE_EVIDENCE_OR_AUTHORITY');expect(c.actualIdentity).toBeNull();expect(c.signature).toBeNull();}
 const m=read('docs/operational-thirteen-20261110/evidence-manifest.json');for(const row of m.evidence){const bytes=readFileSync(row.path);expect(bytes.length).toBe(row.bytes);expect(hash(bytes)).toBe(row.sha256);expect(hash(execFileSync('git',['show',row.sourceCommit+':'+row.path],{maxBuffer:4000000}))).toBe(row.sha256);}
});
it('retains actual-five execution and separately proves current caller, plan parity and export provenance',()=>{
 const base='docs/next-five-current-20261110/',r=read(base+'browser.json');expect(r.passed).toBe(true);expect(r.genuineAuthenticatedAcceptance).toBe(false);expect(r.productionAcceptance).toBe(false);expect(r.newScopedEngineeringComplete).toBe(0);
 expect(r.journeys).toHaveLength(15);expect(r.downloads).toHaveLength(15);
 const expected=new Map([[369,256],[375,2000],[380,4.5],[381,1.8],[387,104.8734216268422]]);
 for(const [path,sha]of Object.entries(r.sourceHashes)){const current=readFileSync(path);if(hash(current)===sha)expect(hash(current)).toBe(sha);else expect(assertNamedApplicationSuccessor(path,sha as string,current)).toMatchObject({historicalEvidenceOnly:true});}
 for(const [id,value]of expected){for(const plan of ['free','pro','business'])expect(r.journeys.filter((j:{id:number;plan:string})=>j.id===id&&j.plan===plan)).toHaveLength(1);
  const downloads=r.downloads.filter((d:{id:number})=>d.id===id);expect(downloads).toHaveLength(3);
  for(const d of downloads){expect(d.file.startsWith('downloads/')).toBe(true);expect(d.file.includes('..')).toBe(false);const b=readFileSync(base+d.file);expect(b.length).toBe(d.bytes);expect(hash(b)).toBe(d.sha256);expect(hash(execFileSync('git',['show','HEAD:'+base+d.file]))).toBe(d.sha256);
   if(d.format==='JSON'){const s=JSON.parse(b.toString());expect(s.calculatorVersion).toBe(1);expect(s.output.value).toBe(value);}
   else if(d.format==='CSV')expect(b.toString()).toContain('"output","value","'+value+'"');
   else{expect(d.format).toBe('PDF');const text=execFileSync('pdftotext',['-layout','-','-'],{input:b,encoding:'utf8',timeout:10000});expect([...text.matchAll(/^\s*output\["value"\]\s*=\s*([^\r\n]+)\s*$/gm)].map(m=>m[1].trim())).toEqual([String(value)]);expect([...text.matchAll(/Engine\s+version:\s*(\d+)\s*$/gm)].map(m=>Number(m[1]))).toEqual([1]);}
  }
 }
},60000);
it('retains inherited-eight execution and proves current succession without relabelling authentication receipts',()=>{
 const r=read('docs/next-five-current-20261110/inherited-eight/browser.json');expect(r.passed).toBe(true);expect(r.syntheticAccountTransport).toBe(true);expect(r.productionAcceptance).toBe(false);expect(r.journeys).toHaveLength(24);expect(r.downloads).toHaveLength(48);
 for(const [path,sha]of Object.entries(r.sourceHashes)){const current=readFileSync(path);if(hash(current)===sha)expect(hash(current)).toBe(sha);else expect(assertNamedApplicationSuccessor(path,sha as string,current)).toMatchObject({historicalEvidenceOnly:true});}
 for(const d of r.downloads){expect(d.file.includes('..')).toBe(false);const p='docs/next-five-current-20261110/inherited-eight/'+d.file,b=readFileSync(p);expect(b.length).toBe(d.bytes);expect(hash(b)).toBe(d.sha256);expect(hash(execFileSync('git',['show','HEAD:'+p]))).toBe(d.sha256);}
});
it('preserves the earlier R4 UI evidence as historical exact Git evidence, never as proof of the corrected caller',()=>{
 const ref='531d677e0cca42d7259d4a2440057ccc74daea86';
 for(const base of ['docs/next-five-20261110/','docs/next-five-20261110/inherited-eight/']){
  const path=base+'browser.json',raw=readFileSync(path),r=JSON.parse(raw.toString());expect(raw.equals(execFileSync('git',['show',ref+':'+path]))).toBe(true);expect(r.passed).toBe(true);
  for(const [path,sha]of Object.entries(r.sourceHashes))expect(hash(execFileSync('git',['show',ref+':'+path]))).toBe(sha);
  for(const d of r.downloads){const path=base+d.file;expect(hash(readFileSync(path))).toBe(d.sha256);expect(hash(execFileSync('git',['show',ref+':'+path]))).toBe(d.sha256);}
 }
});
it('keeps the540 canonical fields unchanged and the thirteen-complete engineering overlay separate from five partial advances',()=>{
 const r=read('docs/thirteen-program-20261110/requirements-540.json'),parent=read(r.parentLedger);
 expect(r.rows).toHaveLength(540);expect(new Set(r.rows.map((x:{masterId:number})=>x.masterId)).size).toBe(540);
 for(let i=0;i<540;i++){
  const row=r.rows[i],prior=parent.rows[i];
  if([369,375,380,381,387].includes(row.masterId)){
   const {inheritedEngineeringAssessment,currentEngineeringEvidence,currentEngineeringBlockers,...retained}=row;
   expect(inheritedEngineeringAssessment).toBe(prior.engineeringAssessment);expect(row.engineeringAssessment).toBe('BOUNDED_PARTIAL_ADVANCED_NOT_FULL_ENGINEERING_COMPLETE');expect(currentEngineeringEvidence).toMatch(/^docs\/next-five-20261110\/acceptance-five.json#\/rows\/[0-4]$/);expect(currentEngineeringBlockers).toHaveLength(4);
   expect({...retained,engineeringAssessment:inheritedEngineeringAssessment}).toEqual(prior);
  }else expect(row).toEqual(prior);
 }
 expect(hash(readFileSync(r.parentLedger))).toBe(r.parentSHA256);
 expect(r.counts).toEqual({COMPLETE_AND_CERTIFIED:0,IMPLEMENTED_REVIEW_PENDING:2,IMPLEMENTED_TEST_GAPS:0,PARTIALLY_IMPLEMENTED:495,NOT_IMPLEMENTED:0,IDENTITY_OR_SCOPE_BLOCKED:43});
 expect(r.scopedEngineeringCompleteIds).toEqual([370,371,372,373,374,377,378,379,382,383,384,385,386]);expect(r.newScopedEngineeringCompleteIds).toEqual([]);expect(r.additionalPartialIds).toEqual([369,375,380,381,387]);
 expect(r.engineeringOverlay).toEqual({existingScopedComplete:13,newScopedComplete:0,newPartialAdvanced:5,remainingNotNewlyAssessed:522});
 for(const key of ['newCanonicalAcceptance','newCertification','newPublicationEligibility'])expect(r[key]).toBe(0);expect(r.releaseHold).toBe(true);
});
