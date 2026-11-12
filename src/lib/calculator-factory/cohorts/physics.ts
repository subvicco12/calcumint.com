import { capacitanceCalculator, freeFallCalculator, angularVelocityCalculator, coulombForceCalculator, projectileMotionCalculator } from '../../../calculators/physics/catalog-batch-3';
import { calculateCoulombScaled, calculateProjectileScaled, coulombScaledSchema, projectileScaledSchema, physicsScaledRevision } from '../experimental/physics-scaled';

const blockers = ['CANONICAL_UNITS_AND_SCOPE_UNAPPROVED', 'SOURCE_APPLICABILITY_AND_COMPETENT_REVIEW_REQUIRED', 'FULL_DOMAIN_ACCEPTANCE_REQUIRED'] as const;
const fields = (input: object) => Object.entries(input).map(([key, defaultValue]) => ({ key, label: key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), kind: 'number' as const, defaultValue: defaultValue as number }));
function existing(catalogId: number, engine: typeof capacitanceCalculator | typeof freeFallCalculator | typeof angularVelocityCalculator, scope: string) {
  return { catalogId, engineId: engine.id, slug: engine.slug, version: engine.version, title: engine.title, fields: fields(engine.examples[0].input), registered: true, primaryKey: 'value', unit: null, scope, sourceEvidence: 'src/calculators/physics/catalog-batch-3.ts', limitations: ['Observed scalar v1 contract only; no canonical mapping approval'], blockers, engine };
}
const privateCoulomb = {
  ...coulombForceCalculator, id: 'private.physics-scaled.coulomb-force', slug: 'private-physics-scaled-coulomb-force', version: 1, reviewStatus: 'draft' as const,
  inputSchema: coulombScaledSchema,
  calculate: (input: unknown, _context: unknown) => ({ ...calculateCoulombScaled(input), steps: ['Private scaled Coulomb scalar formula'] }),
  examples: [], goldenTests: [],
};
const privateProjectile = {
  ...projectileMotionCalculator, id: 'private.physics-scaled.projectile-range', slug: 'private-physics-scaled-projectile-range', version: 1, reviewStatus: 'draft' as const,
  inputSchema: projectileScaledSchema,
  calculate: (input: unknown, _context: unknown) => ({ ...calculateProjectileScaled(input), steps: ['Private scaled ideal level-ground range formula'] }),
  examples: [], goldenTests: [],
};
function successor(catalogId: number, engine: typeof privateCoulomb | typeof privateProjectile, historical: typeof coulombForceCalculator | typeof projectileMotionCalculator, scope: string, limitations: string[]) {
  return { catalogId, engineId: engine.id, slug: engine.slug, version: engine.version, privateRevision: physicsScaledRevision,
    historicalEngine: { id: historical.id, slug: historical.slug, version: historical.version }, registered: false,
    title: historical.title, fields: fields(historical.examples[0].input), primaryKey: 'value', unit: null, scope,
    sourceEvidence: 'src/calculators/physics/catalog-batch-3.ts', limitations, blockers, engine };
}
export const physicsCandidates = [
  existing(322, capacitanceCalculator, 'Signed charge divided by nonzero voltage'),
  successor(323, privateCoulomb, coulombForceCalculator, 'Existing signed Coulomb scalar formula with unchanged constant', ['Private arithmetic revision; physical medium and canonical units unapproved']),
  successor(324, privateProjectile, projectileMotionCalculator, 'Existing ideal level-ground range without air resistance; angle in degrees', ['Private arithmetic revision; 90 degree floating residual preserved; no launch-height model']),
  existing(325, freeFallCalculator, 'Distance from rest under constant gravity'),
  existing(327, angularVelocityCalculator, 'Signed average angular displacement divided by positive elapsed time'),
] as const;
