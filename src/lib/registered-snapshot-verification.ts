import {copyCalculationData} from './calculation-snapshot';
import {batch21ReplayBindings,verifyBatch21Snapshot} from './batch21-snapshot-replay';
import {verifyRegisteredSnapshot as verifyOriginalRegisteredSnapshot} from './registered-snapshot-replay';

/** Add six explicit current contracts while preserving the original verifier unchanged. */
export function verifyRegisteredSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const slug=clean&&typeof clean==='object'&&!Array.isArray(clean)?(clean as Record<string,unknown>).calculatorSlug:undefined;
 return batch21ReplayBindings.some(binding=>binding.slug===slug)?verifyBatch21Snapshot(clean):verifyOriginalRegisteredSnapshot(clean);
}
