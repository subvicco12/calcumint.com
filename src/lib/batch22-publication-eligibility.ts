import {createHash} from 'node:crypto';
export type SourceReference={path:string;sha256:string;pointer:string};
export type PublicationPacket={masterId:number;engineId:string;slug:string;version:number;sources:SourceReference[]};
export const SIX_PUBLICATION_IDENTITIES=[
 {masterId:235,engineId:'advanced-math.graphing',slug:'graphing-calculator',version:1},
 {masterId:251,engineId:'advanced-math.function-plotter-2d',slug:'function-plotter-2d',version:1},
 {masterId:275,engineId:'geometry.volume',slug:'volume-calculator',version:1},
 {masterId:276,engineId:'geometry.slope',slug:'slope-calculator',version:2},
 {masterId:282,engineId:'statistics.standard-deviation',slug:'standard-deviation-calculator',version:1},
 {masterId:283,engineId:'statistics.variance',slug:'variance-calculator',version:1},
] as const;
/** Offline integrity only. Trusted source pins must come from the repository generator,
 * never the packet being checked. No positive authority importer or execution API exists. */
export function validatePublicationPackets(packets:readonly PublicationPacket[],pins:readonly {path:string;sha256:string;pointers:Readonly<Record<number,readonly string[]>>}[],rawFiles:Readonly<Record<string,Uint8Array>>){
 const errors:string[]=[];
 const pinned=new Map(pins.map(p=>[p.path,p.sha256]));
 const permitted=new Map(pins.map(p=>[p.path,p.pointers]));
 if(pinned.size!==pins.length)errors.push('DUPLICATE_SOURCE_PIN');
 if(packets.length!==6)errors.push('EXACT_SIX_REQUIRED');
 const seen=new Set<number>();
 for(const packet of packets){
  const identity=SIX_PUBLICATION_IDENTITIES.find(i=>i.masterId===packet.masterId);
  if(seen.has(packet.masterId))errors.push('DUPLICATE_IDENTITY');
  seen.add(packet.masterId);
  if(!identity||identity.engineId!==packet.engineId||identity.slug!==packet.slug||identity.version!==packet.version)errors.push('IDENTITY_OR_VERSION_MISMATCH');
  if(!packet.sources.length)errors.push('SOURCE_REFERENCES_REQUIRED');
  const references=new Set<string>();
  for(const source of packet.sources){
   const key=source.path+'#'+source.pointer;
   if(references.has(key))errors.push('DUPLICATE_SOURCE_REFERENCE');
   references.add(key);
   if(!/^\/(?:[^~]|~[01])*$/.test(source.pointer)||!permitted.get(source.path)?.[packet.masterId]?.includes(source.pointer))errors.push('INVALID_OR_SUBSTITUTED_SOURCE_POINTER');
   const expected=pinned.get(source.path),bytes=rawFiles[source.path];
   if(!expected||!/^[a-f0-9]{64}$/.test(source.sha256)||expected!==source.sha256)errors.push('UNTRUSTED_OR_STALE_SOURCE');
   if(!bytes||createHash('sha256').update(bytes).digest('hex')!==expected)errors.push('RAW_SOURCE_SHA_MISMATCH');
  }
  for(const pin of pins)for(const required of pin.pointers[packet.masterId]??[]){
   if(!references.has(pin.path+'#'+required))errors.push('MISSING_MANDATORY_SOURCE_REFERENCE');
  }
 }
 return {integrityVerified:errors.length===0,errors:[...new Set(errors)],decisions:SIX_PUBLICATION_IDENTITIES.map(identity=>({...identity,eligible:false as const,canonicalAccepted:false as const,blockers:[...(errors.length?['PACKET_INTEGRITY_INVALID']:[]),'AUTHENTICATED_AUTHORITY_IMPORT_UNAVAILABLE','CANONICAL_SCOPE_APPROVAL_UNESTABLISHED','PUBLISHER_REVISION_APPLICABILITY_UNESTABLISHED','QUALIFIED_REVIEW_UNESTABLISHED','COMPLETE_HOSTED_QA_UNESTABLISHED','LIFECYCLE_AUTHORIZATION_UNESTABLISHED']}))};
}
