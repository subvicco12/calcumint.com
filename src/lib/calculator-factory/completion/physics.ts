import { physicsCandidates } from '../cohorts/physics';
import { physicsObservedContracts } from './physics-domain';
/** Review metadata only. Does not adopt a successor, assign units or alter replay. */
export const physicsCompletionReview = physicsCandidates.map(candidate => ({
  catalogId: candidate.catalogId,
  identity: { id: candidate.engineId, slug: candidate.slug, version: candidate.version },
  ...('privateRevision' in candidate ? { privateRevision: candidate.privateRevision, historicalEngine: candidate.historicalEngine } : {}),
  registered: candidate.registered,
  observedArithmetic: physicsObservedContracts[candidate.catalogId as keyof typeof physicsObservedContracts],
  canonicalUnit: null,
  fieldUnits: Object.fromEntries(candidate.fields.map(field => [field.key, null])),
  observedScope: candidate.scope,
  completion: 'BLOCKED_SOURCE_AND_UNIT_CONTRACT' as const,
  numericalEvidenceScope: 'Selected binary64 rational and historical replay witnesses; no full-domain or physical methodology acceptance',
  publisherSource: null,
  retainedEvidence: [
    'data/catalog/scientific-models-2026-10-25/manifest.json',
    'docs/blueprint-reconciliation/blueprint-to-540.json',
    'docs/calculator-factory/wave1/physics-evidence.json',
    'src/calculators/physics/catalog-batch-3.ts',
  ],
  missingFacts: candidate.catalogId === 322
    ? ['Publisher-defined charge/voltage/output units', 'Signed Q/V physical interpretation and applicability']
    : candidate.catalogId === 325
      ? ['Publisher-defined time/gravity/distance units', 'From-rest constant-gravity and zero-gravity applicability']
      : candidate.catalogId === 327
        ? ['Publisher-defined angular displacement/time/output units; radians cannot be inferred', 'Average signed angular velocity applicability']
        : candidate.catalogId === 323
          ? ['Publisher-defined charge/distance/force units', 'Medium, point-charge, signed-force and constant-precision applicability']
          : ['Publisher-defined speed/gravity/range units', 'Level-ground from-launch assumptions and trigonometric endpoint policy'],
}));
