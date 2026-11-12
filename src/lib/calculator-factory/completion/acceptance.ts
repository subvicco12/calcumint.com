/** Private engineering receipt validation. This does not grant canonical or release authority. */
export type CompletionIdentity = { catalogId: number; engineId: string; slug: string; version: number };
export type CompletionEvidence = {
  path: string;
  sha256: string;
  sourceSHA: string;
  identity: CompletionIdentity;
};
export type CompletionCriterion = {
  id: string;
  source: string;
  applicability: "required" | "outside-declared-scope";
  rationale: string;
};
export type CompletionReceipt = {
  sourceSHA: string;
  identity: CompletionIdentity;
  scope: "scalar-personal-delivery" | "full-engineering";
  scopeStatement: string;
  criteria: CompletionCriterion[];
  observations: { criterionId: string; passed: boolean; evidence: CompletionEvidence[] }[];
  downloads: (CompletionEvidence & {
    format: "json" | "csv" | "pdf";
    byteLength: number;
    downloadedInBrowser: boolean;
    identityAndValuesReconciled: boolean;
  })[];
  persistence: (CompletionEvidence & {
    plan: "free" | "pro" | "business";
    created: boolean;
    reloaded: boolean;
    replayedOriginalVersion: boolean;
  })[];
};

const CORE = ["identity-scope", "formula-provenance-domain-precision", "three-plan-entitlements",
  "browser-interaction", "accessibility-recovery", "performance", "independent-review", "exact-source-ci"] as const;
const BUSINESS = ["team-client-sharing", "api", "embed", "automation"] as const;
const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^[a-f0-9]{64}$/;
const filled = (value: string) => typeof value === "string" && value.trim().length > 0;
function sameIdentity(a: CompletionIdentity, b: CompletionIdentity) {
  return a.catalogId === b.catalogId && a.engineId === b.engineId && a.slug === b.slug && a.version === b.version;
}

/** Checks receipt metadata, not artifact bytes. A trusted runner must hash/read the referenced files. */
export function assessCompletionReceipt(receipt: CompletionReceipt) {
  const failures: string[] = [];
  const fail = (message: string) => failures.push(message);
  if (!SHA.test(receipt.sourceSHA)) fail("Invalid frozen source SHA");
  if (!Number.isSafeInteger(receipt.identity.catalogId) || receipt.identity.catalogId < 1 ||
      !Number.isSafeInteger(receipt.identity.version) || receipt.identity.version < 1 ||
      !filled(receipt.identity.engineId) || !filled(receipt.identity.slug)) fail("Invalid exact identity");
  if (!filled(receipt.scopeStatement)) fail("Missing declared scope");
  const ids = new Set<string>();
  for (const criterion of receipt.criteria) {
    if (!filled(criterion.id) || ids.has(criterion.id)) fail(`Duplicate or empty criterion: ${criterion.id}`);
    ids.add(criterion.id);
    if (!filled(criterion.source) || !filled(criterion.rationale)) fail(`Unreasoned applicability: ${criterion.id}`);
    if (criterion.applicability !== "required" && criterion.applicability !== "outside-declared-scope") fail(`Invalid applicability: ${criterion.id}`);
  }
  const required = new Set<string>(receipt.scope === "full-engineering" ? [...CORE, ...BUSINESS] : [...CORE]);
  if (receipt.scope !== "full-engineering" && receipt.scope !== "scalar-personal-delivery") fail("Invalid completion scope");
  // Native K remains visible even when the selected completion scope excludes it.
  for (const id of [...CORE, ...BUSINESS]) {
    const criterion = receipt.criteria.find(row => row.id === id);
    if (!criterion || (required.has(id) && criterion.applicability !== "required")) fail(`Missing required applicability: ${id}`);
  }
  const validEvidence = (evidence: CompletionEvidence) => filled(evidence.path) && DIGEST.test(evidence.sha256) &&
    evidence.sourceSHA === receipt.sourceSHA && sameIdentity(evidence.identity, receipt.identity);
  const observed = new Set<string>();
  for (const observation of receipt.observations) {
    if (observed.has(observation.criterionId) || !ids.has(observation.criterionId)) fail(`Duplicate or unknown observation: ${observation.criterionId}`);
    observed.add(observation.criterionId);
    if (!observation.passed || observation.evidence.length === 0 || !observation.evidence.every(validEvidence)) fail(`Unproven criterion: ${observation.criterionId}`);
  }
  for (const criterion of receipt.criteria) {
    if (criterion.applicability === "required" && !observed.has(criterion.id)) fail(`Missing observation: ${criterion.id}`);
  }
  for (const format of ["json", "csv", "pdf"] as const) {
    const rows = receipt.downloads.filter(row => row.format === format);
    if (rows.length !== 1 || !rows.every(row => validEvidence(row) && Number.isSafeInteger(row.byteLength) && row.byteLength > 0 &&
      row.downloadedInBrowser && row.identityAndValuesReconciled)) fail(`Missing or invalid actual download: ${format}`);
  }
  for (const plan of ["free", "pro", "business"] as const) {
    const rows = receipt.persistence.filter(row => row.plan === plan);
    if (rows.length !== 1 || !rows.every(row => validEvidence(row) && row.created && row.reloaded && row.replayedOriginalVersion)) fail(`Missing or invalid persisted replay: ${plan}`);
  }
  return {
    scopedEngineeringComplete: failures.length === 0,
    fullEngineeringComplete: failures.length === 0 && receipt.scope === "full-engineering",
    canonicalAccepted: false as const,
    certificationGranted: false as const,
    publicationEligible: false as const,
    failures,
  };
}
