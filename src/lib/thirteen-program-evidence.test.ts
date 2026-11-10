import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const hash=(b:Buffer|string)=>createHash('sha256').update(b).digest('hex');
const env={...process.env,PYTHONDONTWRITEBYTECODE:'1'};delete env.NODE_TEST_CONTEXT;
it('retains thirteen unsigned exact-version packets, original clause associations and genuine approval gaps',()=>{
 expect(execFileSync('python',['docs/canonical-thirteen-20261110/verify.py'],{encoding:'utf8',env,timeout:30000})).toContain('PASS13exact packets');
 expect(execFileSync('python',['-m','unittest','discover','-s','docs/canonical-thirteen-20261110','-p','test_*.py'],{encoding:'utf8',env,timeout:30000,stdio:['ignore','pipe','pipe']}).length).toBe(0);
});
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
it('requires fresh actual-five caller, plan parity, accessibility and native personal export bytes',()=>{
 const base='docs/next-five-20261110/',r=read(base+'browser.json');expect(r.passed).toBe(true);expect(r.genuineAuthenticatedAcceptance).toBe(false);expect(r.productionAcceptance).toBe(false);expect(r.newScopedEngineeringComplete).toBe(0);
 expect(r.journeys).toHaveLength(15);expect(r.downloads).toHaveLength(15);
 const expected=new Map([[369,256],[375,2000],[380,4.5],[381,1.8],[387,104.8734216268422]]);
 for(const [path,sha]of Object.entries(r.sourceHashes))expect(hash(readFileSync(path))).toBe(sha);
 for(const [id,value]of expected){for(const plan of ['free','pro','business'])expect(r.journeys.filter((j:{id:number;plan:string})=>j.id===id&&j.plan===plan)).toHaveLength(1);
  const downloads=r.downloads.filter((d:{id:number})=>d.id===id);expect(downloads).toHaveLength(3);
  for(const d of downloads){expect(d.file.startsWith('downloads/')).toBe(true);expect(d.file.includes('..')).toBe(false);const b=readFileSync(base+d.file);expect(b.length).toBe(d.bytes);expect(hash(b)).toBe(d.sha256);expect(hash(execFileSync('git',['show','HEAD:'+base+d.file]))).toBe(d.sha256);
   if(d.format==='JSON'){const s=JSON.parse(b.toString());expect(s.calculatorVersion).toBe(1);expect(s.output.value).toBe(value);}
   else if(d.format==='CSV')expect(b.toString()).toContain('"output","value","'+value+'"');
   else{expect(d.format).toBe('PDF');const text=execFileSync('pdftotext',['-layout','-','-'],{input:b,encoding:'utf8',timeout:10000});expect([...text.matchAll(/^\s*output\["value"\]\s*=\s*([^\r\n]+)\s*$/gm)].map(m=>m[1].trim())).toEqual([String(value)]);expect([...text.matchAll(/Engine\s+version:\s*(\d+)\s*$/gm)].map(m=>Number(m[1]))).toEqual([1]);}
  }
 }
},60000);
it('requires fresh inherited-eight caller regression without relabelling prior native authentication receipts',()=>{
 const r=read('docs/next-five-20261110/inherited-eight/browser.json');expect(r.passed).toBe(true);expect(r.syntheticAccountTransport).toBe(true);expect(r.productionAcceptance).toBe(false);expect(r.journeys).toHaveLength(24);expect(r.downloads).toHaveLength(48);
 for(const [path,sha]of Object.entries(r.sourceHashes))expect(hash(readFileSync(path))).toBe(sha);
 for(const d of r.downloads){expect(d.file.includes('..')).toBe(false);const p='docs/next-five-20261110/inherited-eight/'+d.file,b=readFileSync(p);expect(b.length).toBe(d.bytes);expect(hash(b)).toBe(d.sha256);expect(hash(execFileSync('git',['show','HEAD:'+p]))).toBe(d.sha256);}
});
it('keeps the540 canonical rows unchanged and the thirteen-complete engineering overlay separate from five partial advances',()=>{
 const r=read('docs/thirteen-program-20261110/requirements-540.json'),parent=read(r.parentLedger);
 expect(r.rows).toEqual(parent.rows);expect(r.rows).toHaveLength(540);expect(new Set(r.rows.map((x:{masterId:number})=>x.masterId)).size).toBe(540);
 expect(hash(readFileSync(r.parentLedger))).toBe(r.parentSHA256);
 expect(r.counts).toEqual({COMPLETE_AND_CERTIFIED:0,IMPLEMENTED_REVIEW_PENDING:2,IMPLEMENTED_TEST_GAPS:0,PARTIALLY_IMPLEMENTED:495,NOT_IMPLEMENTED:0,IDENTITY_OR_SCOPE_BLOCKED:43});
 expect(r.scopedEngineeringCompleteIds).toEqual([370,371,372,373,374,377,378,379,382,383,384,385,386]);expect(r.newScopedEngineeringCompleteIds).toEqual([]);expect(r.additionalPartialIds).toEqual([369,375,380,381,387]);
 expect(r.engineeringOverlay).toEqual({existingScopedComplete:13,newScopedComplete:0,newPartialAdvanced:5,remainingNotNewlyAssessed:522});
 for(const key of ['newCanonicalAcceptance','newCertification','newPublicationEligibility'])expect(r[key]).toBe(0);expect(r.releaseHold).toBe(true);
});
