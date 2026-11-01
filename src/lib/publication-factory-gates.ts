/** Pure offline preparation validation. Evidence integrity is never publication authority. */
import {createHash} from 'node:crypto';
export type FactoryReference={path:string;sha256:string;pointer:string};
export type FactoryRole='identity'|'engineering'|'canonical'|'source'|'reviewer'|'qa'|'lifecycle';
export type FactoryPacket={masterId:number;engineId:string;slug:string;version:number;requirements:readonly string[];evidence:readonly (FactoryReference & {role:FactoryRole;scope:'identity'|'family'|'component';bindingPointer?:string})[]};
export type FactoryPreparationInput={register:FactoryReference;ledger:FactoryReference;packets:readonly FactoryPacket[];trustedPins:Readonly<Record<string,string>>;rawFiles:Readonly<Record<string,Uint8Array>>};
type ObjectRow=Record<string,unknown>;
const object=(v:unknown):v is ObjectRow=>typeof v==='object'&&v!==null&&!Array.isArray(v);
const qaTypes=['engine-tests','formula-review','sources','methodology','reverse-solve','visualization-reconciliation','schedule-reconciliation','scenario-reconciliation','sensitivity-validation','entitlement-validation','ux-responsive','performance','security','seo-content','accessibility'];
const text=(v:unknown)=>typeof v==='string'&&v.trim().length>0;
function rolePrepared(role:FactoryRole,b:ObjectRow,id:number):boolean{
 switch(role){
  case 'identity': return true;
  case 'engineering': return Number(b.numericalObservationCount)>0||object(b.engineering);
  case 'canonical': return text(b.canonicalDecisionNeeded)||text(b.canonicalScope);
  case 'source': return Array.isArray(b.sourceReferences)&&b.sourceReferences.length>0&&b.sourceReferences.every(s=>object(s)&&Array.isArray(s.masterIds)&&s.masterIds.includes(id)&&text(s.title)&&Array.isArray(s.publisher)&&s.publisher.length>0&&s.publisher.every(text)&&((Array.isArray(s.publicationDate)&&s.publicationDate.length>0&&s.publicationDate.every(text))||text(s.revision))&&typeof s.sourceRevisionApproved==='boolean'&&typeof s.applicabilityApproved==='boolean');
  case 'reviewer': return object(b.reviewer)&&text(b.reviewer.requiredReviewExpertise)&&Object.hasOwn(b.reviewer,'identity')&&Object.hasOwn(b.reviewer,'competenceEvidence')&&Object.hasOwn(b.reviewer,'approval');
  case 'qa': {
   const q=b.qaRequests,conditional=b.conditionalRulePack;
   if(!['standard','financial','health','tax'].includes(String(b.riskClass))||!object(conditional)||typeof conditional.required!=='boolean'||!text(conditional.applicability)||/undetermined|unknown/i.test(String(conditional.applicability)))return false;
   const required=[...qaTypes,...(b.riskClass!=='standard'?['ymyl-review']:[]),...(conditional.required?['rule-pack-validation']:[])];
   return Array.isArray(q)&&q.length===required.length&&new Set(q.map(r=>object(r)?r.checkType:null)).size===required.length&&required.every(t=>q.some(r=>object(r)&&r.checkType===t&&r.status==='pending'&&r.reviewer===null&&r.decisionEvidence===null));
  }
  case 'lifecycle': return object(b.lifecycle)&&b.lifecycle.productionWrites===false&&b.lifecycle.gateOk===false&&text(b.lifecycle.remaining);
 }
}
const roles:readonly FactoryRole[]=['identity','engineering','canonical','source','reviewer','qa','lifecycle'];
/** RFC6901 traversal requires own properties; prototype properties are never evidence. */
function resolve(value:unknown,pointer:string):{found:boolean;value:unknown}{
 if(pointer==='')return {found:true,value};
 if(!pointer.startsWith('/')||/~(?![01])/u.test(pointer))return {found:false,value:undefined};
 for(const encoded of pointer.slice(1).split('/')){
  const key=encoded.replace(/~1/g,'/').replace(/~0/g,'~');
  if(!object(value)&&!Array.isArray(value))return {found:false,value:undefined};
  if(Array.isArray(value)&&!/^(0|[1-9][0-9]*)$/.test(key))return {found:false,value:undefined};
  if(!Object.hasOwn(value,key))return {found:false,value:undefined};
  value=(value as ObjectRow)[key];
 }
 return {found:true,value};
}
export function validatePublicationFactoryPreparation(input:FactoryPreparationInput){
 const errors:string[]=[];
 const parsed=new Map<string,unknown>();
 const hashes=new Map<string,string>();
 if(!input.packets.length)errors.push('EMPTY_COHORT');
 const read=(ref:FactoryReference,kind:string):unknown=>{
  const pin=input.trustedPins[ref.path],bytes=input.rawFiles[ref.path];
  if(!pin||!/^[a-f0-9]{64}$/.test(pin)||pin!==ref.sha256){errors.push('UNTRUSTED_OR_STALE_SOURCE');return undefined;}
  if(bytes&&!hashes.has(ref.path))hashes.set(ref.path,createHash('sha256').update(bytes).digest('hex'));
  if(!bytes||hashes.get(ref.path)!==pin){errors.push('RAW_SOURCE_SHA_MISMATCH');return undefined;}
  if(!parsed.has(ref.path))try{parsed.set(ref.path,JSON.parse(new TextDecoder().decode(bytes)));}catch{errors.push('INVALID_SOURCE_JSON');return undefined;}
  const resolved=resolve(parsed.get(ref.path),ref.pointer);
  if(!resolved.found)errors.push(kind+'_POINTER_UNRESOLVED');
  return resolved.value;
 };
 const rows=(value:unknown):ObjectRow[]=>object(value)&&Array.isArray(value.rows)&&value.rows.every(object)?value.rows:[];
 const register=rows(read(input.register,'REGISTER')),ledger=rows(read(input.ledger,'LEDGER'));
 const indexed=(items:ObjectRow[],kind:string)=>{
  const map=new Map<number,ObjectRow>();
  for(const row of items){const id=row.masterId;if(!Number.isInteger(id)||Number(id)<1||Number(id)>540){errors.push(kind+'_INVALID_IDENTITY');continue;}if(map.has(Number(id)))errors.push(kind+'_DUPLICATE_IDENTITY');map.set(Number(id),row);}
  if(items.length!==540||map.size!==540)errors.push(kind+'_540_IDENTITIES_REQUIRED');return map;
 };
 const registry=indexed(register,'REGISTER'),requirements=indexed(ledger,'LEDGER');
 let requirementCount=0;
 const sets=new Map<number,string[]>();
 for(const [id,row]of requirements){
  if(!registry.has(id)||registry.get(id)?.title!==row.title)errors.push('REGISTER_LEDGER_IDENTITY_MISMATCH');
  const list=Array.isArray(row.requirements)?row.requirements:[];
  const names=list.map(q=>object(q)?q.requirementId:undefined);
  if(!list.length||names.some(n=>typeof n!=='string'||!n)||new Set(names).size!==names.length)errors.push('INVALID_OR_DUPLICATE_REQUIREMENT');
  requirementCount+=list.length;sets.set(id,names.filter((n):n is string=>typeof n==='string'));
 }
 if(requirementCount!==14293)errors.push('EXACT_14293_REQUIREMENTS_REQUIRED');
 const seen=new Set<number>();
 const decisions=input.packets.map(packet=>{
  const start=errors.length;
  if(seen.has(packet.masterId))errors.push('DUPLICATE_PACKET_IDENTITY');seen.add(packet.masterId);
  if(!registry.has(packet.masterId)||!packet.engineId||!packet.slug||!Number.isInteger(packet.version)||packet.version<1)errors.push('INVALID_PACKET_IDENTITY');
  const registered=registry.get(packet.masterId),requirementRow=requirements.get(packet.masterId);
  const tuple=(v:unknown)=>object(v)&&v.engineId===packet.engineId&&v.slug===packet.slug&&v.version===packet.version;
  const six=registered&&object(registered.sixCandidate)?registered.sixCandidate.engine:undefined;
  const candidateMatch=registered&&Array.isArray(registered.candidates)&&registered.candidates.some(c=>tuple(c)&&object(c)&&c.exactCurrentBinding===true&&c.identityCandidate===true);
  const adapter=requirementRow?.liveAdapter;
  const privateMatch=registered&&Array.isArray(registered.privateCandidates)&&registered.privateCandidates.some(c=>tuple(c))&&object(adapter)&&adapter.adapterKey===packet.engineId&&adapter.engineVersion===packet.version&&adapter.catalogId===packet.masterId;
  if(!tuple(six)&&!candidateMatch&&!privateMatch)errors.push('REGISTER_CANDIDATE_IDENTITY_VERSION_MISMATCH');
  const expected=sets.get(packet.masterId);
  if(!expected||packet.requirements.length!==expected.length||new Set(packet.requirements).size!==packet.requirements.length||expected.some(r=>!packet.requirements.includes(r)))errors.push('REQUIREMENT_SET_MISMATCH');
  const supplied=new Set<FactoryRole>();
  for(const evidence of packet.evidence){
   if(!roles.includes(evidence.role)){errors.push('UNKNOWN_EVIDENCE_ROLE');continue;}
   const value=read(evidence,'EVIDENCE');
   const binding=evidence.bindingPointer===undefined?{found:true,value}:resolve(value,evidence.bindingPointer);
   if(!binding.found){errors.push('BINDING_POINTER_UNRESOLVED');continue;}
   if(evidence.scope!=='identity'){
    if(evidence.scope!=='family'&&evidence.scope!=='component')errors.push('INVALID_EVIDENCE_SCOPE');
    if(evidence.role!=='engineering')errors.push('NON_IDENTITY_AUTHORITY_EVIDENCE');
    // Family/component associations remain supporting material, never exact evidence.
    continue;
   }
   const b=binding.value;
   if(!object(b)||b.masterId!==packet.masterId||b.engineId!==packet.engineId||b.slug!==packet.slug||b.version!==packet.version){errors.push('EVIDENCE_IDENTITY_VERSION_MISMATCH');continue;}
   if(!rolePrepared(evidence.role,b,packet.masterId)){continue;}
   supplied.add(evidence.role);
  }
  const preparationBlockers=roles.filter(r=>!supplied.has(r)).map(r=>'MISSING_'+r.toUpperCase()+'_PREPARATION');
  if(errors.length>start)preparationBlockers.push('PACKET_INTEGRITY_INVALID');
  return {masterId:packet.masterId,engineId:packet.engineId,slug:packet.slug,version:packet.version,preparationReady:false,preparationBlockers,integrityErrors:[...new Set(errors.slice(start))],authorityBlockers:['AUTHENTICATED_AUTHORITY_UNESTABLISHED'],publicationEligible:false as const};
 });
 // Global register/hash failures invalidate every candidate; a valid row cannot mask a broken cohort.
 const integrityVerified=errors.length===0;
 for(const decision of decisions){if(!integrityVerified&&!decision.preparationBlockers.includes('PACKET_INTEGRITY_INVALID'))decision.preparationBlockers.push('COHORT_INTEGRITY_INVALID');decision.preparationReady=integrityVerified&&decision.preparationBlockers.length===0;}
 return {integrityVerified,registerCount:register.length,requirementCount,errors:[...new Set(errors)],decisions};
}
