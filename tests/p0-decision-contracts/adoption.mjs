import {createHash} from 'node:crypto';
// Offline graph review only. There is deliberately no SQL/remote/approval API.
export function evaluateAdoption(graph,readSource) {
 const errors=[],order=[],unresolvedGates=[];
 if(graph.decisionId!=='OPS-03-ADOPTION'||graph.status!=='PENDING'||graph.releaseHold!==true||graph.activationAuthorized!==false||graph.sqlExecutionImplemented!==false||graph.approvedBy!==null||graph.approvedAt!==null)errors.push('Unapproved decision envelope changed');
 const nodes=new Map(),gates=new Map();
 for(const gate of graph.gates){
  if(gates.has(gate.id))errors.push('Duplicate gate '+gate.id);gates.set(gate.id,gate);
  // This pending contract has no target/policy evidence authenticator. A status
  // string or supplied object cannot stand in for independently reviewed proof.
  unresolvedGates.push(gate.id);
  if(gate.status!=='UNRESOLVED'||gate.evidence!==null)errors.push('Unverified gate assertion '+gate.id);
 }
 for(const node of graph.nodes){if(nodes.has(node.id))errors.push('Duplicate node '+node.id);nodes.set(node.id,node);}
 const deps=new Map(graph.nodes.map(n=>[n.id,[...n.dependencies]]));
 for(const edge of graph.activationOrdering){if(!nodes.has(edge.before)||!nodes.has(edge.after))errors.push('Unknown sequence target');else deps.get(edge.after).push(edge.before);}
 const visiting=new Set(),visited=new Set();
 const visit=id=>{if(!nodes.has(id)){errors.push('Unknown dependency '+id);return;}if(visiting.has(id)){errors.push('Dependency cycle '+id);return;}if(visited.has(id))return;visiting.add(id);for(const d of deps.get(id))visit(d);visiting.delete(id);visited.add(id);order.push(id);};
 for(const node of graph.nodes){
  visit(node.id);
  for(const gate of node.activationGates)if(!gates.has(gate))errors.push('Unknown gate '+gate);
  if(!node.sourceBindings.length)errors.push('Missing source bindings '+node.id);
  for(const binding of node.sourceBindings){
   const p=binding.path;
   if(typeof p!=='string'||p.startsWith('/')||p.includes('\\')||p.split('/').some(x=>x==='..'||x===''||x==='.')||!/^[a-f0-9]{64}$/.test(binding.sha256)){errors.push('Unsafe source binding');continue;}
   if(node.kind==='GUARDED_REVIEW_PROPOSAL'&&p.startsWith('supabase/migrations/'))errors.push('Proposal inside active migration path');
   try{
    const raw=readSource(p);if(createHash('sha256').update(raw).digest('hex')!==binding.sha256)errors.push('Source drift '+p);
    if(node.guardMustRemainIntact&&!/BEGIN;\s*(?:SET LOCAL[^;]+;\s*)*DO\s+(\$\w*\$)\s+BEGIN\s+RAISE EXCEPTION\s+'UNAPPLIED/i.test(raw.toString()))errors.push('Missing unconditional transaction guard '+p);
   }catch{errors.push('Missing source '+p);}
  }
 }
 return {integrityValid:errors.length===0,errors,reviewOrder:errors.length?[]:order,unresolvedGates,activationAuthorized:false,meaning:'Hash/graph integrity only; all gates and target evidence still require independent review. No executable adoption plan.'};
}
