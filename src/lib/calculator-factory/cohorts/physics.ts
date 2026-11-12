import { capacitanceCalculator, freeFallCalculator, angularVelocityCalculator, coulombForceCalculator, projectileMotionCalculator } from '../../../calculators/physics/catalog-batch-3';
import { calculateCoulombScaled, calculateProjectileScaled, coulombScaledSchema, projectileScaledSchema, physicsScaledRevision } from '../experimental/physics-scaled';

const blockers = ['CANONICAL_UNITS_AND_SCOPE_UNAPPROVED', 'SOURCE_APPLICABILITY_AND_COMPETENT_REVIEW_REQUIRED', 'FULL_DOMAIN_ACCEPTANCE_REQUIRED'] as const;
function existing(catalogId: number, engine: typeof capacitanceCalculator | typeof freeFallCalculator | typeof angularVelocityCalculator, scope: string) {
  return { catalogId, engineId: engine.id, slug: engine.slug, version: engine.version, primaryKey: 'value', unit: null, scope, sourceEvidence: 'src/calculators/physics/catalog-batch-3.ts', limitations: ['Observed scalar v1 contract only; no canonical mapping approval'], blockers, engine };
}
export const physicsCandidates = [
  existing(322, capacitanceCalculator, 'Signed charge divided by nonzero voltage'),
  { catalogId: 323, engineId: coulombForceCalculator.id, slug: coulombForceCalculator.slug, version: physicsScaledRevision, primaryKey: 'value', unit: null, scope: 'Existing signed Coulomb scalar formula with unchanged constant', sourceEvidence: 'src/calculators/physics/catalog-batch-3.ts', limitations: ['Private arithmetic revision; physical medium and canonical units unapproved'], blockers, engine: { inputSchema: coulombScaledSchema, calculate: calculateCoulombScaled } },
  { catalogId: 324, engineId: projectileMotionCalculator.id, slug: projectileMotionCalculator.slug, version: physicsScaledRevision, primaryKey: 'value', unit: null, scope: 'Existing ideal level-ground range without air resistance; angle in degrees', sourceEvidence: 'src/calculators/physics/catalog-batch-3.ts', limitations: ['Private arithmetic revision; 90 degree floating residual preserved; no launch-height model'], blockers, engine: { inputSchema: projectileScaledSchema, calculate: calculateProjectileScaled } },
  existing(325, freeFallCalculator, 'Distance from rest under constant gravity'),
  existing(327, angularVelocityCalculator, 'Signed average angular displacement divided by positive elapsed time'),
] as const;
