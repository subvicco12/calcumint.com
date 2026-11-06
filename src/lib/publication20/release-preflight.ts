/** Read-only captured-evidence checks. This module cannot grant or execute publication. */
import {createHash} from 'node:crypto';
import {z} from 'zod';
import {requiredQaChecks,publishingGate,canTransition,roleCanTransition,type PublishingRecord,type QaCheckType} from '@/lib/admin/publishing';
export const publication20ReleaseIds=Object.freeze([432,440,434,374,423,424,425,428,370,371,372,373,437,438,439,429,430,431,433,427] as const);
const text=z.string().trim().min(1).max(2000),hash=z.string().regex(/^[a-f0-9]{64}$/),date=z.string().datetime({offset:true});
const binding=z.object({catalogId:z.number().int(),engineId:text,slug:text,version:z.number().int().positive(),contractSHA256:hash,implementationSHA256:hash}).strict();
const decision=z.object({recordId:text,status:z.enum(['approved','pending','rejected']),reviewerId:text,reviewedAt:date,validUntil:date.nullable()}).strict();
const reviewer=z.object({id:text,active:z.boolean(),role:z.enum(['owner','admin','reviewer','editor']),competenceEvidenceId:text}).strict();
const waiver=z.object({recordId:text,reason:text,authorityId:text,approvedAt:date,validUntil:date.nullable()}).strict();
const qa=z.object({recordId:text,binding,type:z.string(),status:z.enum(['passed','waived','pending','failed']),reviewerId:text,reviewedAt:date,validUntil:date.nullable(),evidenceSHA256:hash,waiver:waiver.optional()}).strict();
const source=z.object({recordId:text,binding,publisher:text,revision:text,sourceSHA256:hash,applicability:text,review:decision}).strict();
const tables=['calculator_catalog_admin','calculator_qa_checks','calculator_source_evidence','platform_admins'] as const;
const publicUrl=z.string().url().refine(value=>{const url=new URL(value);return url.origin==='https://calcumint.com'&&url.pathname.startsWith('/calculators/')&&!url.username&&!url.password&&!url.search&&!url.hash;},'Exact public calculator origin/path required');
const smoke=z.object({recordId:text,status:z.enum(['passed','failed','pending']),sourceSHA256:hash,observedAt:date}).strict();
const captureSchema=z.object({
 protocol:z.literal('publication20-read-only-capture-1'),captureKind:z.enum(['SYNTHETIC_TEST','AUTHENTICATED_READ_ONLY_CAPTURE']),projectRef:z.literal('zpwpstsvztyshcnwdfye'),capturedAt:date,
 schemaSHA256:hash,publicationDefinitionsSHA256:hash,binding,riskClass:z.literal('standard'),rulePackRequired:z.boolean(),rulePackApplicabilityDecision:decision,
 calculator:z.object({recordId:text,lifecycle:z.enum(['draft','review','certified','published','archived']),reviewerId:text.nullable(),publishAt:date.nullable()}).strict().nullable(),
 canonical:z.object({binding,decision}).strict(),reviewers:z.array(reviewer).max(100),sources:z.array(source).max(100),qa:z.array(qa).max(100),
 databaseSmoke:z.object({rls:z.array(z.object({table:z.enum(tables),enabled:z.boolean()}).strict()).max(4),caller:smoke,dependencyMutations:smoke,rollback:smoke,privilegeCompatibility:smoke}).strict(),
 visibility:z.object({url:publicUrl,httpStatus:z.number().int().min(100).max(599),inDiscovery:z.boolean(),inSitemap:z.boolean(),observedAt:date}).strict(),
 releaseHold:z.literal(true),
}).strict();
export type Publication20ReleaseBinding=z.infer<typeof binding>;
/** Pins must be supplied by a trusted caller from separately verified bytes, never copied from the capture being checked. */
export type Publication20ReleasePins={binding:Publication20ReleaseBinding;captureSHA256:string;schemaSHA256:string;publicationDefinitionsSHA256:string;reviewedSourceSHA256s:readonly string[];qaEvidenceSHA256s:readonly string[];databaseSmokeSHA256s:readonly string[];publicUrl:string;maxCaptureAgeMs:number};
export type Publication20ReleaseInspection={captureChecksPassed:boolean;publicationEligible:false;eligibilityAssessment:'NOT_ESTABLISHED_BY_UNSIGNED_OFFLINE_CAPTURE';eligibilityBlockers:readonly string[];productionAuthorized:false;authorizationBlockers:readonly string[];releaseHold:true;captureKind:'SYNTHETIC_TEST'|'AUTHENTICATED_READ_ONLY_CAPTURE'|'UNREADABLE';blockers:string[];limitations:readonly string[]};
const limitations=Object.freeze([
 'Hashes and internally consistent record labels do not authenticate publisher, reviewer, canonical or release authority.',
 'Eligibility can be established independently while RELEASE HOLD remains active; this unsigned offline capture cannot establish it. RELEASE HOLD separately forbids production execution, even for genuinely eligible calculators.',
 'This offline function does not query current production, execute SQL/RPCs, verify real JWT/RLS behavior or issue certification/publication.',
 'A passing synthetic or archived capture is only a reproducible conditional preflight; genuine exact-current evidence and explicit wave-specific release authority remain external prerequisites.',
]);
const qaFields:Record<QaCheckType,keyof PublishingRecord>={
 'engine-tests':'engineTestsPassed','formula-review':'formulaReviewPassed',sources:'sourcesPassed',methodology:'methodologyPassed','reverse-solve':'reverseSolvePassed','visualization-reconciliation':'visualizationReconciliationPassed','schedule-reconciliation':'scheduleReconciliationPassed','scenario-reconciliation':'scenarioReconciliationPassed','sensitivity-validation':'sensitivityValidationPassed','entitlement-validation':'entitlementValidationPassed','ux-responsive':'uxResponsivePassed',performance:'performancePassed',security:'securityPassed','seo-content':'seoContentPassed',accessibility:'accessibilityPassed','rule-pack-validation':'rulePackValidationPassed','ymyl-review':'ymylReviewPassed',
};
const sameBinding=(a:Publication20ReleaseBinding,b:Publication20ReleaseBinding)=>Object.keys(a).length===Object.keys(b).length&&(Object.keys(a) as (keyof Publication20ReleaseBinding)[]).every(key=>a[key]===b[key]);
const digest=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
/** No local `approved`, `certified` or `releaseHold:false` field can turn this into an executor. */
export function inspectPublication20Release(pins:Publication20ReleasePins,raw:Uint8Array,now:string):Publication20ReleaseInspection{
 const failures=new Set<string>(),block=(value:string)=>failures.add(value);
 const result=(kind:Publication20ReleaseInspection['captureKind']):Publication20ReleaseInspection=>({captureChecksPassed:failures.size===0,publicationEligible:false,eligibilityAssessment:'NOT_ESTABLISHED_BY_UNSIGNED_OFFLINE_CAPTURE',eligibilityBlockers:['AUTHENTICATED_ELIGIBILITY_ASSESSMENT_UNESTABLISHED'],productionAuthorized:false,authorizationBlockers:['RELEASE_HOLD_ACTIVE','EXPLICIT_WAVE_RELEASE_AUTHORITY_UNESTABLISHED'],releaseHold:true,captureKind:kind,blockers:[...failures,'RELEASE_HOLD_ACTIVE','AUTHENTICATED_ACCEPTANCE_AND_RELEASE_AUTHORITY_NOT_ESTABLISHED_OFFLINE'],limitations});
 const expected=binding.safeParse(pins.binding),nowParsed=date.safeParse(now);
 if(!expected.success||!publication20ReleaseIds.includes(pins.binding.catalogId as typeof publication20ReleaseIds[number])||!nowParsed.success||!Number.isSafeInteger(pins.maxCaptureAgeMs)||pins.maxCaptureAgeMs<1){block('INVALID_TRUSTED_PINS_OR_TIME');return result('UNREADABLE');}
 const allPins=[pins.captureSHA256,pins.schemaSHA256,pins.publicationDefinitionsSHA256,...pins.reviewedSourceSHA256s,...pins.qaEvidenceSHA256s,...pins.databaseSmokeSHA256s];
 if(allPins.some(value=>!hash.safeParse(value).success)||!publicUrl.safeParse(pins.publicUrl).success){block('INVALID_TRUSTED_PINS');return result('UNREADABLE');}
 if(raw.byteLength>4_000_000||digest(raw)!==pins.captureSHA256){block('CAPTURE_BYTE_HASH_OR_SIZE_MISMATCH');return result('UNREADABLE');}
 let decoded:unknown;try{decoded=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));}catch{block('CAPTURE_JSON_INVALID');return result('UNREADABLE');}
 const parsed=captureSchema.safeParse(decoded);if(!parsed.success){block('CAPTURE_SCHEMA_INVALID');return result('UNREADABLE');}
 const c=parsed.data,clock=Date.parse(now);
 if(!sameBinding(c.binding,pins.binding))block('EXACT_IDENTITY_VERSION_CONTRACT_MISMATCH');
 if(c.schemaSHA256!==pins.schemaSHA256||c.publicationDefinitionsSHA256!==pins.publicationDefinitionsSHA256)block('SCHEMA_OR_PUBLICATION_DEFINITION_DRIFT');
 const instant=(value:string)=>Date.parse(value);
 const current=(start:string,end:string|null)=>instant(start)<=captured&&instant(start)<=clock&&(end===null||(clock<=instant(end)&&instant(start)<=instant(end))); // Null encodes no captured expiry, not an applicability/validity approval.
 const captured=instant(c.capturedAt);if(captured>clock||clock-captured>pins.maxCaptureAgeMs)block('CAPTURE_STALE_OR_FUTURE');
 const reviewerIds=c.reviewers.map(r=>r.id);if(new Set(reviewerIds).size!==reviewerIds.length)block('DUPLICATE_REVIEWER_IDENTITY');
 const capable=(id:string)=>c.reviewers.find(r=>r.id===id&&r.active&&['owner','admin','reviewer'].includes(r.role));
 const approved=(d:z.infer<typeof decision>)=>d.status==='approved'&&current(d.reviewedAt,d.validUntil)&&!!capable(d.reviewerId);
 if(!sameBinding(c.canonical.binding,pins.binding)||!approved(c.canonical.decision))block('CANONICAL_ACCEPTANCE_UNESTABLISHED');
 if(!approved(c.rulePackApplicabilityDecision))block('RULE_PACK_APPLICABILITY_UNESTABLISHED');
 if(!c.calculator)block('HOSTED_IDENTITY_ABSENT');
 else{
  if(c.calculator.lifecycle!=='certified'||!canTransition(c.calculator.lifecycle,'published'))block('NOT_CERTIFIED_FOR_PUBLISHED_TRANSITION');
  if(c.calculator.publishAt!==null&&instant(c.calculator.publishAt)>clock)block('PUBLICATION_DATE_NOT_EFFECTIVE');
  if(c.calculator.reviewerId!==null&&!capable(c.calculator.reviewerId))block('ASSIGNED_REVIEWER_NOT_ACTIVE_CAPABLE');
 }
 const reviewedSources=c.sources.filter(s=>sameBinding(s.binding,pins.binding)&&pins.reviewedSourceSHA256s.includes(s.sourceSHA256)&&approved(s.review));
 if(!reviewedSources.length||reviewedSources.length!==c.sources.length)block('REVIEWED_SOURCE_REVISION_APPLICABILITY_UNESTABLISHED');
 if(new Set(c.sources.map(s=>s.recordId)).size!==c.sources.length)block('DUPLICATE_SOURCE_RECORD');
 const required=requiredQaChecks('standard',c.rulePackRequired),qaTypes=c.qa.map(q=>q.type);
 if(new Set(qaTypes).size!==qaTypes.length||new Set(c.qa.map(q=>q.recordId)).size!==c.qa.length)block('DUPLICATE_QA_RECORD_OR_TYPE');
 if(required.some(type=>!qaTypes.includes(type))||qaTypes.some(type=>!required.includes(type as QaCheckType)))block('EXACT_REQUIRED_QA_SET_MISMATCH');
 const passes=new Map<string,boolean>();
 for(const q of c.qa){
  let valid=sameBinding(q.binding,pins.binding)&&current(q.reviewedAt,q.validUntil)&&!!capable(q.reviewerId)&&pins.qaEvidenceSHA256s.includes(q.evidenceSHA256);
  if(q.status==='waived'){
   const w=q.waiver,actor=w&&capable(w.authorityId);
   valid=valid&&!!w&&!!actor&&['owner','admin'].includes(actor.role)&&current(w.approvedAt,w.validUntil)&&roleCanTransition(actor.role,'published');
  }else valid=valid&&q.status==='passed'&&q.waiver===undefined;
  if(!valid)block('QA_DECISION_OR_WAIVER_UNESTABLISHED:'+q.type);
  passes.set(q.type,valid);
 }
 const p:PublishingRecord={riskClass:'standard',lifecycle:c.calculator?.lifecycle??'draft',engineTestsPassed:false,formulaReviewPassed:false,sourcesPassed:false,methodologyPassed:false,reverseSolvePassed:false,visualizationReconciliationPassed:false,scheduleReconciliationPassed:false,scenarioReconciliationPassed:false,sensitivityValidationPassed:false,entitlementValidationPassed:false,uxResponsivePassed:false,performancePassed:false,securityPassed:false,seoContentPassed:false,accessibilityPassed:false,ymylReviewPassed:false,rulePackRequired:c.rulePackRequired,rulePackValidationPassed:false,sourceCount:reviewedSources.length,reviewerId:c.calculator?.reviewerId};
 for(const type of required){const key=qaFields[type];(p as unknown as Record<string,unknown>)[key]=passes.get(type)===true;}
 const gate=publishingGate(p);if(!gate.ok)block('EXISTING_PUBLISHING_GATE_UNSATISFIED');
 if(c.databaseSmoke.rls.length!==tables.length||new Set(c.databaseSmoke.rls.map(r=>r.table)).size!==tables.length||c.databaseSmoke.rls.some(r=>!r.enabled))block('RLS_CONFIGURATION_UNESTABLISHED');
 for(const [name,smoke]of Object.entries(c.databaseSmoke)){
  if(name==='rls')continue;
  const proof=smoke as {recordId:string;status:string;sourceSHA256:string;observedAt:string};
  if(proof.status!=='passed'||!pins.databaseSmokeSHA256s.includes(proof.sourceSHA256)||instant(proof.observedAt)>captured||instant(proof.observedAt)>clock||clock-instant(proof.observedAt)>pins.maxCaptureAgeMs)block('DATABASE_ACCEPTANCE_UNESTABLISHED:'+name);
 }
 if(c.visibility.url!==pins.publicUrl||![404,410].includes(c.visibility.httpStatus)||c.visibility.inDiscovery||c.visibility.inSitemap||instant(c.visibility.observedAt)>captured||instant(c.visibility.observedAt)>clock||clock-instant(c.visibility.observedAt)>pins.maxCaptureAgeMs)block('PREPUBLICATION_VISIBILITY_UNESTABLISHED');
 return result(c.captureKind);
}
