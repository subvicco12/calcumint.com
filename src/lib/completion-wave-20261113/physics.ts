import { physicsCandidates } from '../calculator-factory/cohorts/physics';
import { physicsCompletionReview } from '../calculator-factory/completion/physics';

export type PhysicsEvidenceIdentity = {
  id: string;
  slug: string;
  version: number;
  privateRevision?: string;
};

/** Applicability of the retained 20261111 historical journeys only, never new acceptance. */
export function physicsRetainedWorkflowApplies(catalogId: number, identity: PhysicsEvidenceIdentity): boolean {
  const candidate = physicsCandidates.find(row => row.catalogId === catalogId);
  return !!candidate && candidate.registered && identity.privateRevision === undefined
    && candidate.engineId === identity.id && candidate.slug === identity.slug && candidate.version === identity.version;
}

const expressions: Record<number, string> = {
  322: 'C = Q / V',
  323: 'F = 8.9875517923e9 × q1 × q2 / distance²',
  324: 'R = speed² × sin(2 × angle × π / 180) / gravity',
  325: 'd = 0.5 × gravity × time²',
  327: 'ω = angle / time',
};

/**
 * Private engineering presentation hook. Scalar and every discrete graph point are
 * evaluated by the selected immutable engine. Samples are not a trajectory,
 * interpolation, full-domain proof, authenticated workflow, or canonical adoption.
 */
export function physicsPresentation(
  catalogId: number,
  input: unknown,
  graph: { field: string; samples: readonly number[] },
) {
  const candidate = physicsCandidates.find(row => row.catalogId === catalogId);
  const review = physicsCompletionReview.find(row => row.catalogId === catalogId);
  if (!candidate || !review) throw new Error('Unsupported physics catalog ID');
  const keys = candidate.fields.map(field => field.key);
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== keys.length || Object.keys(input).some(key => !keys.includes(key))) {
    throw new Error('Supply exactly the declared scalar input fields');
  }
  if (!keys.includes(graph.field) || !Array.isArray(graph.samples) || graph.samples.length === 0 || graph.samples.length > 101
    || Array.from(graph.samples).some(value => !Number.isFinite(value))) {
    throw new Error('Select a declared field and 1–101 finite discrete samples');
  }
  const evaluate = (operands: unknown) => {
    const parsed = candidate.engine.inputSchema.parse(operands);
    const result = candidate.engine.calculate(parsed as never, {});
    if (!Number.isFinite(result.value)) throw new Error('Nonfinite engine output');
    return result;
  };
  const result = evaluate(input);
  const identity: PhysicsEvidenceIdentity = {
    id: candidate.engineId, slug: candidate.slug, version: candidate.version,
    ...('privateRevision' in candidate ? { privateRevision: candidate.privateRevision } : {}),
  };
  const points = graph.samples.map(sample => ({
    input: sample,
    value: evaluate({ ...input, [graph.field]: sample }).value,
  }));
  return {
    catalogId, identity, value: result.value,
    units: null,
    scope: candidate.scope,
    releaseHold: true as const,
    canonicalAdoption: false as const,
    steps: { expression: expressions[catalogId], operands: { ...input }, engineSteps: [...result.steps] },
    graph: { kind: 'discrete-engine-samples' as const, field: graph.field, points, units: null },
    retainedWorkflowApplicable: physicsRetainedWorkflowApplies(catalogId, identity),
    retainedWorkflowEvidence: 'docs/seven-recovery-20261111/physics-workflow-evidence.json',
    remainingCriteria: [
      ...review.missingFacts,
      'Publisher source applicability and competent physical review',
      'Full-domain acceptance beyond selected deterministic witnesses',
      ...(!candidate.registered ? ['Authenticated product journeys and native exports bound to this exact private revision'] : []),
    ],
  };
}
