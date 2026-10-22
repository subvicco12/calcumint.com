import {expect,it} from 'vitest';
import {calculateDraftPreview,draftPreviewDefinitions} from '@/calculators/final-framework/draft-preview-catalog';
import {draftMasterIdForSlug,validateDraftPersistedCapture} from './draft-persistence-contract';
it.each(draftPreviewDefinitions)('$masterId preserves exact version-bound DRAFT capture',d=>{
 const snapshot=calculateDraftPreview(d.masterId,d.initialInput).snapshot;
 const result=validateDraftPersistedCapture(d.masterId,snapshot);expect(result.snapshot).toEqual(snapshot);expect(Object.isFrozen(result.snapshot.output)).toBe(true);expect(draftMasterIdForSlug(snapshot.calculatorSlug)).toBe(d.masterId);
});
it.each(['version','slug','output','missing','extra'])('rejects %s corruption without rewriting original history',field=>{
 const original=calculateDraftPreview(205,{left:'-0.000001',right:'0',operation:'add'}).snapshot;
 const copy=JSON.parse(JSON.stringify(original)),before=JSON.stringify(copy);
 if(field==='version')copy.calculatorVersion=2;if(field==='slug')copy.calculatorSlug='slope-calculator';if(field==='output')copy.output.result='different';if(field==='missing')delete copy.input;if(field==='extra')copy.extra='unexpected';
 const corrupt=JSON.stringify(copy);expect(()=>validateDraftPersistedCapture(205,copy)).toThrow();expect(JSON.stringify(copy)).toBe(corrupt);expect(JSON.stringify(original)).toBe(before);
});
it('rejects unknown identities instead of guessing a public alias',()=>{expect(draftMasterIdForSlug('unknown-draft')).toBeUndefined();expect(()=>validateDraftPersistedCapture(410,{})).toThrow();});
it('routes known DRAFT saved records privately and leaves historical/public identities unchanged',async()=>{
 const {draftAccountRecordHref}=await import('./draft-persistence-contract');
 for(const d of draftPreviewDefinitions)expect(draftAccountRecordHref(d.slug,'record id','history')).toBe('/account/drafts?source=history&id=record%20id');
 expect(draftAccountRecordHref('slope-calculator','legacy-v1','history')).toBeUndefined();expect(draftAccountRecordHref('loan-emi-calculator','public','history')).toBeUndefined();
});
