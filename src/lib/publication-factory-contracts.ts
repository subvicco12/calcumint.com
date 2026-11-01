import groups from '../../docs/full-product-batch16/contract-groups.json';
import requirements from '../../docs/full-product-batch16/requirements-540.json';
import readiness from '../../docs/calculator-first/publication-readiness-540.json';
export type PublicationFactoryContract=Readonly<{masterId:number;adapterKey:string;engineVersion:number;vector:Readonly<{path:string;sha256:string}>;readinessPointer:string;requirementPointer:string}>;
/** Explicit existing workflow membership plus exact private identity/version evidence; no family transfer. */
export const publicationFactoryContracts:readonly PublicationFactoryContract[]=Object.freeze((()=>{
 const workflow=groups.workflowGroups.find(g=>g.protocol==='existing-private-immutable-packet-and-plan-parity');
 if(!workflow?.masterIds)throw Error('Existing exact workflow cohort unavailable');
 return workflow.masterIds.flatMap(masterId=>{
  const index=requirements.rows.findIndex(r=>r.masterId===masterId),row=requirements.rows[index];
  const readyIndex=readiness.rows.findIndex(r=>r.masterId===masterId),ready=readiness.rows[readyIndex];
  if(!row||!ready)throw Error('Exact cohort identity unavailable');
  const adapter=row.liveAdapter;
  if(!adapter)throw Error('Exact cohort adapter unavailable');
  const candidate=ready.privateCandidates.find(c=>c.engineId===adapter.adapterKey&&c.version===adapter.engineVersion);
  if(!candidate){
   if([246,247,248].includes(masterId)&&adapter.adapterKey==='private.canonical-calculus.'+masterId&&adapter.engineVersion===3)return [];
   throw Error('Exact private candidate/version missing');
  }
  if(adapter.catalogId!==masterId||!adapter.vector.path.endsWith('#masterId='+masterId)||!/^[a-f0-9]{64}$/.test(adapter.vector.sha256)||adapter.existingChecks<1)throw Error('Exact adapter/version/vector evidence unavailable');
  return [Object.freeze({masterId,adapterKey:adapter.adapterKey,engineVersion:adapter.engineVersion,vector:Object.freeze({...adapter.vector}),readinessPointer:'docs/calculator-first/publication-readiness-540.json#/rows/'+readyIndex,requirementPointer:'docs/full-product-batch16/requirements-540.json#/rows/'+index})];
 });
})());
