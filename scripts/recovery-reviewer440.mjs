/** Offline appointment handoff only: never authenticates, writes SQL or grants acceptance. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const sourceCommit='a7a656f71b04b50192485a49b0b56b3fa6bd86b9';
const paths=[
 'src/calculators/conversion/catalog-batch-3.ts',
 'src/components/publication20-tool.tsx',
 'src/calculators/certification-review-policy.ts',
 'docs/RELEASE-GOVERNANCE.md',
 'docs/MASTER-BLUEPRINT-GOVERNANCE-AMENDMENT-2026-10-26.md',
 'docs/acceptance-continuation-20261108/work-unsigned-packet.json',
 'docs/competent-closure-20261108/440-reviewer-decision.json',
 'docs/competent-closure-20261108/reviewer-appointment-counts.json',
 'docs/competent-closure-20261108/reviewer-appointment-receipt.json',
 'docs/first-live-closure-20261108/reviewer440.json',
 'docs/acceptance-closure-20261108/first-two-auth-receipt.json',
 'docs/acceptance-closure-20261108/first-two-publication-receipt.json',
 'supabase/migrations/024_reviewer_assignment_authority.sql',
 'supabase/migrations/033_atomic_reviewer_assignment_audit.sql'
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const revisionBytes=name=>git(['show',sourceCommit+':'+name]);
export function buildReviewer440Handoff(){
 const evidence=paths.map(name=>{const bytes=revisionBytes(name);return {path:name,sourceCommit,gitBlob:git(['rev-parse',sourceCommit+':'+name]).toString().trim(),sha256:hash(bytes),bytes:bytes.length};});
 const appointment=JSON.parse(revisionBytes(paths[7])).rows.find(row=>row.master_id===440);
 assert.equal(appointment.observed_actor,'postgres');assert.equal(appointment.actor_bypass_rls,true);assert.equal(appointment.exact_candidate_count,0);
 const decision=(question,evidencePaths)=>({status:'PENDING',allowedDecisions:['GO','NO_GO','PENDING'],reviewerIdentityRef:null,decisionEvidenceRef:null,signedAt:null,question,evidencePaths});
 return {kind:'OFFLINE_EXACT_440_APPOINTMENT_HANDOFF_NOT_APPROVAL',schemaVersion:1,sourceCommit,
 identity:{masterId:440,engineId:'conversion.frequency',slug:'frequency-converter',technicalVersion:1},evidence,
 appointment:{status:'NOT_DOCUMENTED_RETAINED_OBSERVATION_ONLY',actualReviewer:null,appointmentAuthorityRef:null,competenceRef:null,authorIdentityRef:null,independenceRef:null,signedAttestationRef:null,
 retainedObservation:appointment,freshHostedObservation:false,currentAssignmentStatus:'UNKNOWN_SINCE_RETAINED_OBSERVATION',
 requiredCompetence:['SI unit definitions and dimensional analysis','Binary64 input quantization, relative bounds, rounding and refusal analysis','Independent numerical and exact-version source/history verification','Applicable security/RLS, accessibility, account/API/embed/scenario/export and performance QA'],
 independence:'Actual reviewer must document independence from implementation author; distinct IDs or an AI label do not establish it.',
 authority:'Owner/admin appoints an active owner/admin/reviewer through audited workflow. Role permission alone proves neither competence nor independence. No blanket human-only or external-specialist mandate established for this bounded SI scope.',
 hostedPrerequisite:'Retained exact tuple absent; separately authorized exact DRAFT creation/adoption precedes hosted assignment. Offline substantive review may proceed before hosted assignment.',
 nextAction:'Authorized accountable owner/admin identifies eligible competent independent reviewer and records actual identity/competence/independence/appointment references; do not manufacture credentials or use a fixture user.'},
 decisions:{source:decision('Accept/reject/defer exact governing BIPM revision, substantive source text/capture and SI factor applicability; parsed capture is not original PDF bytes.',[paths[5],paths[6]]),
 formula:decision('Accept/reject/defer fixed scalar Hz/kHz/MHz/GHz ratio formula for the exact immutable engine; angular frequency excluded.',[paths[0],paths[6]]),
 precision:decision('Accept/reject/defer supplied binary64/input quantization, normal finite envelope, identity/zero/signed-zero, gamma-bound hypotheses, refusal and raw/display/export reconciliation. Do not label finite-precision oracle exact rational.',[paths[0],paths[5],paths[6]]),
 technicalQa:decision('Disposition each applicable canonical clause for account/history/useful batch/A-B/export, API/embed/team, accessibility/performance/editorial/SEO/abuse with exact evidence, justified NA or explicit blocker.',[paths[6],paths[10],paths[11]])},
 submissionRule:'Preserve this unsigned handoff. Record real decisions in a new authenticated authority/process record with exact identity, implementation and evidence bindings, reviewer/author relationship, appointment, rationale, date and attestation. This verifier checks only unchanged pending handoff integrity; cannot authenticate or approve submitted decisions.',
 canonicalAdoption:'PENDING_SEPARATE_ACCOUNTABLE_OWNER_DECISION',engineeringGo:'GO_FOR_AUTHORIZED_OFFLINE_REVIEW_PREPARATION_ONLY',certificationGo:'NO_GO',publicationGo:'NO_GO',productionWrites:false,releaseHold:true};
}
export function verifyReviewer440Handoff(packet,read=readFileSync){
 assert.deepEqual(packet,buildReviewer440Handoff(),'Exact pending handoff differs; no acceptance can be inferred');
 for(const binding of packet.evidence){const bytes=read(binding.path);assert.equal(hash(bytes),binding.sha256,'Current evidence differs: '+binding.path);assert.equal(bytes.length,binding.bytes);}
 return true;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const target='docs/execution-recovery-20261109/reviewer/appointment-handoff.json';
 if(process.argv.includes('--write')){const packet=buildReviewer440Handoff();verifyReviewer440Handoff(packet);writeFileSync(target,JSON.stringify(packet,null,2)+'\n');}
 else {verifyReviewer440Handoff(JSON.parse(readFileSync(target,'utf8')));console.log('Exact unsigned #440 handoff and14 evidence pins verified; certification/publication NO_GO');}
}
