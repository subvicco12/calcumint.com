// Offline evidence classification; absence is proven only by COMPLETE coverage.
export function objectEffect(section, id) {
  if (section?.status !== 'COMPLETE' || !Array.isArray(section.rows)) return 'UNKNOWN';
  return section.rows.some(row => row.id === id) ? 'PRESENT_EFFECT_IDENTITY_UNKNOWN' : 'ABSENT_EFFECT';
}
export function compareGrant(hosted, model) {
  if (typeof hosted?.allowed !== 'boolean' || typeof model?.allowed !== 'boolean') return 'UNKNOWN';
  return hosted.allowed === model.allowed ? 'SAME_EFFECTIVE_GRANT' : 'DIFFERENT_EFFECTIVE_GRANT_NOT_APPROVAL';
}
export function proposalGate({ expectedHashes, actualHashes, complete, providerOwned, requirementReviewed }) {
  if (providerOwned) return 'EXCLUDED_PROVIDER_OWNERSHIP';
  if (!complete || !requirementReviewed || !Object.keys(expectedHashes ?? {}).length) return 'BLOCKED';
  return Object.entries(expectedHashes).every(([key,value]) => /^[a-f0-9]{64}$/.test(value) && actualHashes?.[key] === value)
    ? 'REVIEWABLE_OFFLINE_ONLY' : 'BLOCKED_SOURCE_DRIFT';
}
