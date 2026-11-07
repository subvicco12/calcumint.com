/** Engineering-only transaction snapshots. No network, signatures, approval or execution. */
import {createHash} from 'node:crypto';
import {z} from 'zod';
import Decimal from 'decimal.js';
import {calculatorRegistry} from '@/calculators/registry';
import {isRepositoryPublicationEligible,parsePublishedCalculatorManifest,type PublishedCalculatorManifestEntry} from '@/calculators/publication-authority';
import {requiredQaChecks} from '@/lib/admin/publishing';

const text=z.string().min(1).refine(s=>s.trim().length>0,'Nonblank text required'),sha=z.string().regex(/^[a-f0-9]{64}$/),uuid=z.string().uuid(),date=z.string().datetime({offset:true});
const binding=z.object({catalogId:z.number().int().min(1).max(540),engineId:text,slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),version:z.number().int().positive(),contractSHA256:sha,implementationSHA256:sha}).strict();
const catalog=z.object({id:uuid,calculator_key:text,slug:text,version:z.number().int().positive(),lifecycle:z.literal('certified'),risk_class:z.enum(['standard','financial','health','tax']),metadata:z.record(z.string(),z.unknown()),publish_at:date.nullable(),reviewer_id:uuid.nullable()}).passthrough();
const check=z.object({id:uuid,calculator_id:uuid,check_type:text,status:z.enum(['pending','passed','failed','waived']),checked_by:uuid.nullable(),checked_at:date.nullable(),details:z.string()}).passthrough();
const source=z.object({id:uuid,calculator_id:uuid,label:text,url:z.string().url(),reviewed_by:uuid.nullable(),reviewed_at:date.nullable()}).passthrough();
const record=z.object({catalogId:z.number().int().min(1).max(540),catalog,qa:z.array(check).max(17),sources:z.array(source).min(1).max(100),gate:z.object({ok:z.boolean(),failures:z.array(text)}).strict()}).strict();
const capture=z.object({protocol:z.literal('publication-batch-snapshot-1'),kind:z.enum(['SYNTHETIC_TEST','AUTHENTICATED_READ_ONLY_CAPTURE']),projectRef:text,capturedAt:date,schemaSHA256:sha,definitionsSHA256:sha,actor:z.object({user_id:uuid,role:z.enum(['owner','admin']),active:z.literal(true)}).strict(),manifest:z.array(z.object({calculator_key:text,slug:text,version:z.number().int().positive()}).strict()),records:z.array(record).min(1).max(100)}).strict();
export type PublicationBatchBinding=z.infer<typeof binding>;
export type PublicationBatchPins={captureSHA256:string;bindingsSHA256:string;projectRef:string;schemaSHA256:string;definitionsSHA256:string;maxCaptureAgeMs:number};
export type PublicationBatchArtifacts=Readonly<Record<number,{contract:Uint8Array;implementation:Uint8Array}>>;
export type PublicationBatchItem={id:string;calculator_key:string;slug:string;version:number;expected_catalog:z.infer<typeof catalog>;expected_metadata:Record<string,unknown>;expected_sources:z.infer<typeof source>[];expected_qa:z.infer<typeof check>[]};
function parseSnapshotJSON(raw:string):unknown{
 return JSON.parse(raw,(_key,value,context?:{source?:string})=>{
  if(typeof value==='number'&&(!Number.isFinite(value)||!context?.source||!new Decimal(context.source).eq(new Decimal(String(value)))))throw new Error('Snapshot number cannot round-trip exactly');
  return value;
 });
}
const hash=(raw:string)=>createHash('sha256').update(raw).digest('hex');
const byId=<T extends {id:string}>(rows:T[])=>rows.slice().sort((a,b)=>a.id.localeCompare(b.id,'en'));
const bySlug=(rows:readonly PublishedCalculatorManifestEntry[])=>rows.slice().sort((a,b)=>a.slug.localeCompare(b.slug,'en'));
/** Caller pins must come from a separately reviewed capture/binding source, never request body claims.
 * Even a perfect synthetic or unsigned authenticated capture establishes no competent approval.
 * SQL repeats exact snapshots, current role, gate and audit checks in one atomic transaction.
 */
export function preparePublicationBatch(pins:PublicationBatchPins,rawCapture:string,rawBindings:string,now:string,artifacts:PublicationBatchArtifacts){
 const errors:string[]=[],items:PublicationBatchItem[]=[],urls:string[]=[];
 let oldManifest:readonly PublishedCalculatorManifestEntry[]=[];
 const result=()=>({transactionSnapshotReady:errors.length===0,items:errors.length?[]:items,rollbackManifest:bySlug(oldManifest),expectedManifest:errors.length?[]:bySlug([...oldManifest,...items.map(i=>({calculator_key:i.calculator_key,slug:i.slug,version:i.version}))]),publicUrls:errors.length?[]:urls,errors:[...new Set(errors)],publicationEligible:false as const,productionAuthorized:false as const,releaseHold:true as const,authorityBlockers:['CANONICAL_SOURCE_PRECISION_COMPETENT_QA_AND_SPECIALIST_ACCEPTANCE_NOT_ESTABLISHED_BY_SNAPSHOTS','DEPLOYED_GIT_SOURCE_AND_APPROVED_CONTRACT_PROVENANCE_REQUIRED','TARGET_ADOPTION_WRITERS_QUIESCENCE_SECRETS_AND_RECOVERY_REQUIRED','EXPLICIT_BATCH_RELEASE_AUTHORITY_REQUIRED','RELEASE_HOLD_ACTIVE']});
 if(!date.safeParse(now).success||!Number.isSafeInteger(pins.maxCaptureAgeMs)||pins.maxCaptureAgeMs<1||![pins.captureSHA256,pins.bindingsSHA256,pins.schemaSHA256,pins.definitionsSHA256].every(h=>sha.safeParse(h).success)){errors.push('INVALID_TRUSTED_PINS_OR_CLOCK');return result();}
 if(Buffer.byteLength(rawCapture)>8_000_000||Buffer.byteLength(rawBindings)>200_000){errors.push('INPUT_RESOURCE_BOUND');return result();}
 if(hash(rawCapture)!==pins.captureSHA256)errors.push('CAPTURE_HASH_MISMATCH');
 if(hash(rawBindings)!==pins.bindingsSHA256)errors.push('BINDINGS_HASH_MISMATCH');
 if(errors.length)return result();
 let c:z.infer<typeof capture>,bindings:PublicationBatchBinding[];
 try{c=capture.parse(parseSnapshotJSON(rawCapture));bindings=z.array(binding).min(1).max(100).parse(parseSnapshotJSON(rawBindings));}catch{errors.push('CAPTURE_OR_BINDINGS_SCHEMA_INVALID');return result();}
 if(c.projectRef!==pins.projectRef||c.schemaSHA256!==pins.schemaSHA256||c.definitionsSHA256!==pins.definitionsSHA256)errors.push('SCHEMA_OR_DEFINITION_DRIFT');
 const clock=Date.parse(now),captured=Date.parse(c.capturedAt);if(captured>clock||clock-captured>pins.maxCaptureAgeMs)errors.push('CAPTURE_STALE_OR_FUTURE');
 const seen=(list:unknown[])=>new Set(list).size===list.length;
 if(!['catalogId','engineId','slug'].every(k=>seen(bindings.map(b=>b[k as keyof PublicationBatchBinding])))||!seen(c.records.map(r=>r.catalogId))||!seen(c.records.map(r=>r.catalog.id)))errors.push('DUPLICATE_BATCH_IDENTITY');
 const manifest=parsePublishedCalculatorManifest(c.manifest);if(!manifest)errors.push('MANIFEST_INVALID_OR_CONFLICTING');else oldManifest=manifest;
 if(c.records.length!==bindings.length)errors.push('CAPTURE_BINDING_MEMBERSHIP_MISMATCH');
 for(const b of bindings){
  const r=c.records.find(r=>r.catalogId===b.catalogId),d=calculatorRegistry.getById(b.engineId);
  if(!r||!isRepositoryPublicationEligible(d)||d.slug!==b.slug||d.version!==b.version){errors.push('EXACT_REGISTERED_BINDING_REQUIRED');continue;}
  const bytes=artifacts[b.catalogId];
  if(!bytes||!(bytes.contract instanceof Uint8Array)||!(bytes.implementation instanceof Uint8Array)||createHash('sha256').update(bytes.contract).digest('hex')!==b.contractSHA256||createHash('sha256').update(bytes.implementation).digest('hex')!==b.implementationSHA256)errors.push('ARTIFACT_DIGEST_MISMATCH');
  const row=r.catalog,metadata=row.metadata,eb=metadata.engineBinding;
  if(row.calculator_key!==b.engineId||row.slug!==b.slug||row.version!==b.version||row.risk_class!==(d.riskClass??'standard')||!eb||typeof eb!=='object'||Array.isArray(eb)||JSON.stringify(Object.entries(eb).sort())!==JSON.stringify(Object.entries({engineId:b.engineId,slug:b.slug,version:b.version}).sort()))errors.push('EXACT_REGISTERED_BINDING_REQUIRED');
  if(manifest?.some(m=>m.slug===b.slug||m.calculator_key===b.engineId))errors.push('CANDIDATE_ALREADY_PUBLISHED_OR_CONFLICTING');
  if(typeof metadata.rulePackRequired!=='boolean')errors.push('RULE_PACK_APPLICABILITY_UNKNOWN');
  const required=requiredQaChecks(row.risk_class,metadata.rulePackRequired===true);
  if(!seen(r.qa.map(q=>q.id))||!seen(r.qa.map(q=>q.check_type))||r.qa.length!==required.length||required.some(t=>!r.qa.some(q=>q.check_type===t&&q.status==='passed'&&q.checked_by!==null&&q.checked_at!==null&&Date.parse(q.checked_at)<=captured)))errors.push('APPLICABLE_QA_INCOMPLETE');
  // Waived/N/A requests require governed applicability review, not automatic pass conversion.
  if(r.qa.some(q=>q.status==='waived'))errors.push('WAIVER_APPLICABILITY_REQUIRES_GOVERNED_REVIEW');
  if(!seen(r.sources.map(s=>s.id))||r.sources.some(s=>s.calculator_id!==row.id||!s.reviewed_by||!s.reviewed_at||Date.parse(s.reviewed_at)>captured)||r.qa.some(q=>q.calculator_id!==row.id))errors.push('SOURCE_OR_QA_PARENT_AND_REVIEW_MISMATCH');
  if(row.publish_at!==null&&Date.parse(row.publish_at)>clock)errors.push('PUBLICATION_DATE_NOT_EFFECTIVE');
  if(!r.gate.ok||r.gate.failures.length)errors.push('AUTHORITATIVE_CAPTURED_GATE_REFUSED');
  items.push({id:row.id,calculator_key:b.engineId,slug:b.slug,version:b.version,expected_catalog:row,expected_metadata:metadata,expected_sources:byId(r.sources),expected_qa:byId(r.qa)});
  urls.push(`https://calcumint.com/calculators/${d.category}/${d.slug}`);
 }
 items.sort((a,b)=>a.id.localeCompare(b.id,'en'));urls.sort();return result();
}
