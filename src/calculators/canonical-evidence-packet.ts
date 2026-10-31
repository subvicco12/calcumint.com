/** Browser-safe evidence export. Trusted compiled ledger is a review artifact, never approval. */
import ledger from '../../docs/canonical-acceptance/canonical-discovery.json';
import {copyCalculationData} from '../lib/calculation-snapshot';
import {equalCompletionJson} from './completion-contracts';
export {ledger as canonicalDiscovery};
export function exportCanonicalEvidence(masterId:number,plan:'free'|'pro'|'business'='free'){
 if(!['free','pro','business'].includes(plan)||!Number.isInteger(masterId))throw Error('Unsupported evidence selection');const entry=ledger.rows.find(r=>r.masterId===masterId);if(!entry)throw Error('Unknown canonical identity');
 const packet={schemaVersion:1,documentKind:'CANONICAL_EVIDENCE_NOT_APPROVAL',baseline:ledger.baseline,recordedRequirementSHA256:ledger.blueprint.recordedLedgerSHA256,sourceTreeSHA256:ledger.sourceTreeSHA256,entry,releaseHold:true,certificationAuthorized:false,publicationAuthorized:false};return copyCalculationData({packet},{}).input.packet as typeof packet;
}
export function importCanonicalEvidence(raw:unknown){const p=copyCalculationData({packet:raw},{}).input.packet as ReturnType<typeof exportCanonicalEvidence>;if(!p?.entry)throw Error('Missing canonical evidence entry');const expected=exportCanonicalEvidence(p.entry.masterId);if(!equalCompletionJson(p,expected))throw Error('Evidence differs from compiled identity, source, requirements, gaps or governance');return expected;}
