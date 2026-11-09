import {it,expect} from 'vitest';
import {allowsPresentationCapability,PRESENTATION_CAPABILITIES} from './presentation-entitlements';
it('preserves the existing three-plan reconciliation boundary in shared capability metadata',()=>{
 expect(['free','pro','business'].map(plan=>allowsPresentationCapability(plan as 'free'|'pro'|'business','inputOutputReconciliation'))).toEqual([false,true,true]);
 expect(Object.isFrozen(PRESENTATION_CAPABILITIES)).toBe(true);expect(Object.isFrozen(PRESENTATION_CAPABILITIES.inputOutputReconciliation)).toBe(true);
});
it('fails closed for an unknown runtime plan or capability',()=>{expect(allowsPresentationCapability('unknown' as 'free','inputOutputReconciliation')).toBe(false);expect(allowsPresentationCapability('business','unknown' as 'inputOutputReconciliation')).toBe(false);});
