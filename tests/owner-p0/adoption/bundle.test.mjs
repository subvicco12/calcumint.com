import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareApply,prepareRollback,sha} from './bundle.mjs';
const snapshot=data=>{const raw=JSON.stringify(data);return {kind:'ISOLATED_FIXTURE',raw,sha256:sha(raw),data};};
const base=()=>({major:17,provider:{},functions:[],triggers:[]});
test('rollback generation never removes unrelated new functions or triggers',()=>{
 const before=snapshot(base());const a=base();a.functions=[{id:'public.unrelated()',definition:'unrelated'}];assert.throws(()=>prepareRollback(before,snapshot(a)),/outside correction scope/);
 const overload=base();overload.functions=[{id:'public.is_active_review_capable_admin(text)',definition:'unrelated overload'}];assert.throws(()=>prepareRollback(before,snapshot(overload)),/outside correction scope/);
 const b=base();b.triggers=[{id:'unrelated',table:'public.profiles'}];assert.throws(()=>prepareRollback(before,snapshot(b)),/outside correction scope/);
});
test('rollback refuses unrelated changed preexisting function definitions',()=>{
 const a=base();a.functions=[{id:'public.existing()',definition:'before'}];const b=structuredClone(a);b.functions[0].definition='after';assert.throws(()=>prepareRollback(snapshot(a),snapshot(b)),/Unrelated function changed/);
});
test('unlabelled or modified snapshots and provider drift cannot generate SQL',()=>{
 const a=snapshot(base()),b=snapshot(base());a.kind='HOSTED';assert.throws(()=>prepareRollback(a,b),/isolated snapshots/);
 const c=snapshot(base());c.sha256='0'.repeat(64);assert.throws(()=>prepareRollback(c,b));
 const d=base();d.provider={unexpected:true};assert.throws(()=>prepareRollback(b,snapshot(d)),/Provider controls drifted/);
});
test('apply refuses unreviewed existing target names and a different captured predicate owner',async()=>{
 const a={...base(),columns:[],functions:[{id:'public.assign_calculator_reviewer(text)',definition:'unknown existing overload'}]};
 await assert.rejects(prepareApply(snapshot(a)),/already exists/);
 const b={...base(),columns:[],functions:[{id:'public.validate_calculator_publish_gate(uuid)',owner:'unreviewed-owner',definition:'unknown'}]};
 await assert.rejects(prepareApply(snapshot(b)),/owner mismatch/);
});
test('recovery refuses missing predecessor functions and changed existing privileges before SQL generation',()=>{
 const a={...base(),functions:[{id:'public.existing()',definition:'same',owner:'postgres',acl:[]}]};
 assert.throws(()=>prepareRollback(snapshot(a),snapshot(base())),/Preexisting function missing/);
 for(const patch of [{owner:'other'},{acl:[{grantee:'PUBLIC',privilege:'EXECUTE'}]}]){
  const b=structuredClone(a);Object.assign(b.functions[0],patch);
  assert.throws(()=>prepareRollback(snapshot(a),snapshot(b)),/Existing function control drift/);
 }
});
