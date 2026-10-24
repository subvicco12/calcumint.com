import {describe,it,expect} from 'vitest';
import {resolveProductMode,capabilitiesForMode} from './product-mode';
describe('server-selected product capabilities',()=>{
 it.each([undefined,'full'])('preserves full behavior for %s',value=>{expect(capabilitiesForMode(resolveProductMode(value)).accounts).toBe(true);expect(capabilitiesForMode(resolveProductMode(value)).exports).toBe(true);});
 it('enables only anonymous calculators in public mode',()=>{expect(Object.entries(capabilitiesForMode(resolveProductMode('public-only'))).filter(([,enabled])=>enabled).map(([key])=>key)).toEqual(['calculatorEngine']);});
 it.each(['','FULL','public',' public-only','invalid'])('denies all capabilities for invalid mode %s',value=>{expect(Object.values(capabilitiesForMode(resolveProductMode(value))).some(Boolean)).toBe(false);});
});
