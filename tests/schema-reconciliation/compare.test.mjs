import test from 'node:test';
import assert from 'node:assert/strict';
import {difference, triggerSemantic} from './compare.mjs';
import {SECTIONS} from '../batch17-capture/descriptor.mjs';
const capture = () => ({sections:Object.fromEntries(SECTIONS.map(s=>[s,{status:'COMPLETE',count:0,rows:[]}]))});
const put=(c,s,rows)=>{c.sections[s]={status:'COMPLETE',count:rows.length,rows};return c;};
test('named evidence identifies exact absent objects, not an aggregate inference',()=>{
 const a=capture(),b=capture();put(a,'relations',[{id:'public.a'},{id:'public.b'}]);put(b,'relations',[{id:'public.b'}]);
 const d=difference(a,b);assert.deepEqual(d.sections.relations.modelOnly,['public.a']);assert.equal(d.adoptionAuthorized,false);assert.equal(d.productionEquivalence,'UNKNOWN');
});
test('OID normalization preserves event, target, SQL literals and trigger multiplicity',()=>{
 const row={id:'x:RI_ConstraintTrigger_a_123',name:'RI_ConstraintTrigger_a_123',internal:true,relation:'x',enabled:'O',definition:'CREATE CONSTRAINT TRIGGER "RI_ConstraintTrigger_a_123" AFTER DELETE ON x EXECUTE FUNCTION f(123)'};
 const other={...row,id:'x:RI_ConstraintTrigger_a_456',name:'RI_ConstraintTrigger_a_456',definition:row.definition.replace('a_123','a_456')};
 assert.deepEqual(triggerSemantic(row),triggerSemantic(other));assert.notDeepEqual(triggerSemantic(row),triggerSemantic({...other,definition:other.definition.replace('DELETE','UPDATE')}));
 assert.equal(triggerSemantic({...row,internal:false}).name,row.name);
 const d=difference(put(capture(),'triggers',[row,{...other,id:'duplicate'}]),put(capture(),'triggers',[other]));assert.equal(d.semanticTriggers.modelOnly.length,1);
});
test('unknown ledgers, changed fields and malformed inputs remain visible',()=>{
 const a=put(capture(),'policies',[{id:'p',check:'owner'}]),b=put(capture(),'policies',[{id:'p',check:null}]);b.sections.effectLedger.status='UNKNOWN';
 const d=difference(a,b);assert.deepEqual(d.sections.policies.changed[0].fields,['check']);assert.equal(d.sections.effectLedger.hostedStatus,'UNKNOWN');
 b.sections.policies.count=9;assert.throws(()=>difference(a,b));
});
test('duplicate IDs fail rather than silently overwriting evidence',()=>{assert.throws(()=>difference(put(capture(),'relations',[{id:'a'},{id:'a'}]),capture()));});
