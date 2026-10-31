import {copyCalculationData} from './calculation-snapshot';
import {importScaledContract,compareScaledScenarios} from '@/calculators/scaled-contract-adapters';
import {equalCompletionJson} from '@/calculators/completion-contracts';
const slots=['A','B','C'] as const;
/** Private review recovery only: every original packet keeps its own exact engine/source revision. */
export function createPrivateReviewScenarioSet(values:readonly unknown[]){
 const copied=copyCalculationData({values},{}).input.values;
 if(!Array.isArray(copied)||copied.length<2||copied.length>3)throw Error('Select two or three complete private scenarios.');
 const packets=copied.map(importScaledContract);
 // The existing immutable readers and same-contract comparison enforce actual identity/version/source.
 compareScaledScenarios(packets);
 const set={schemaVersion:1,kind:'private-review-scenarios',adapterKey:packets[0].adapterKey,engineVersion:packets[0].engineVersion,baseline:'A',scenarios:packets.map((packet,i)=>({slot:slots[i],packet})),canonicalAccepted:false,releaseHold:true};
 return copyCalculationData({set},{}).input.set as typeof set;
}
export function importPrivateReviewScenarioSet(raw:unknown){
 const copied=copyCalculationData({raw},{}).input.raw;
 if(!copied||typeof copied!=='object'||Array.isArray(copied))throw Error('Private scenario set object required.');
 const rows=(copied as Record<string,unknown>).scenarios;
 if(!Array.isArray(rows)||rows.some(row=>!row||typeof row!=='object'||Array.isArray(row)))throw Error('Complete ordered scenario packets required.');
 const expected=createPrivateReviewScenarioSet(rows.map(row=>(row as Record<string,unknown>).packet));
 if(!equalCompletionJson(copied,expected))throw Error('Scenario set identity, order, governance, source or immutable result differs.');
 return expected;
}
