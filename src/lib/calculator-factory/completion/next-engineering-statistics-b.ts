import {combinationCalculator, binomialProbabilityCalculator, normalDistributionCalculator} from '@/calculators/statistics/catalog-batch-3';
import {bayesTheoremCalculator} from '@/calculators/statistics/catalog-batch-4';
import {createEngineeringContract} from './next-engineering-core';

const evidenceRoot = 'docs/next-engineering-20261115/statistics-b/';
const minimumNormal = 2 ** -1022;

/** Private capture only. Immutable v1 engines and their historical domains remain unchanged. */
export const statisticsBContracts = [
  createEngineeringContract(combinationCalculator, {
    catalogId: 289,
    primaryKey: 'combinations',
    unit: 'selections',
    scope: 'Unordered selections without replacement from n distinct objects; integer 0 ≤ r ≤ n ≤ 10000. Exact integer result must fit Number.MAX_SAFE_INTEGER.',
    sourceEvidence: [
      'https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/binomial.htm',
      evidenceRoot + 'nist-combinations.md',
      evidenceRoot + 'SOURCES.md#289',
    ],
    fieldUnits: {n: 'objects', r: 'selected objects'},
  }),
  createEngineeringContract(binomialProbabilityCalculator, {
    catalogId: 290,
    primaryKey: 'probability',
    unit: 'probability (0–1)',
    scope: 'Exactly k successes in n independent Bernoulli trials with a common fixed success probability p; integer 0 ≤ k ≤ n ≤ 10000, 0 ≤ p ≤ 1. Log-space binary64 approximation; interior positive probabilities that underflow, become subnormal or round to one for n>0 are refused. Degenerate p=0 and p=1 include exact zero and one.',
    sourceEvidence: [
      'https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm',
      evidenceRoot + 'nist-binomial.md',
      evidenceRoot + 'SOURCES.md#290',
    ],
    fieldUnits: {n: 'trials', k: 'successes', p: 'probability (0–1)'},
    validate(input, output) {
      if (input.p > 0 && input.p < 1 && output.probability < minimumNormal) {
        throw Error('Positive binomial probability underflow or subnormal result is outside capture scope');
      }
      if (input.n > 0 && input.p > 0 && input.p < 1 && output.probability === 1) {
        throw Error('Interior binomial probability rounded to one is outside capture scope');
      }
    },
  }),
  createEngineeringContract(normalDistributionCalculator, {
    catalogId: 291,
    primaryKey: 'cdf',
    unit: 'probability (0–1)',
    scope: 'Normal model with supplied mean and positive standard deviation in the same units as x. PDF has reciprocal input units; z is dimensionless. CDF and upperTail use the immutable v1 erf approximation, not exact probabilities or a certified error bound. Capture is restricted to |z| ≤ 4 and finite normal positive density and tails; extreme tails are refused.',
    sourceEvidence: [
      'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm',
      evidenceRoot + 'nist-normal.md',
      evidenceRoot + 'SOURCES.md#291',
    ],
    fieldUnits: {x: 'shared input unit', mean: 'shared input unit', standardDeviation: 'shared input unit'},
    validate(_input, output) {
      if (Math.abs(output.zScore) > 4 ||
          ![output.pdf, output.cdf, output.upperTail].every(value => Number.isFinite(value) && value >= minimumNormal) ||
          output.cdf >= 1 || output.upperTail >= 1) {
        throw Error('Normal approximation capture requires |z| ≤ 4 with finite normal positive density and nonsaturated tails');
      }
    },
  }),
  createEngineeringContract(bayesTheoremCalculator, {
    catalogId: 300,
    primaryKey: 'posterior',
    unit: 'probability (0–1)',
    scope: 'Two exhaustive complementary hypotheses H and not-H. prior=P(H), likelihood=P(E|H), evidenceGivenNot=P(E|not-H), each in [0,1]; evidence probability must be positive. Rounded endpoint posteriors with positive evidence from both hypotheses are refused. Supplied probabilities are assumed applicable to the same population and evidence. Retains joint numerator and total-evidence denominator; no diagnostic or causal inference.',
    sourceEvidence: [
      'https://openstax.org/books/principles-data-science/pages/3-4-probability-theory',
      evidenceRoot + 'openstax-bayes-excerpt.md',
      evidenceRoot + 'SOURCES.md#300',
    ],
    fieldUnits: {prior: 'probability (0–1)', likelihood: 'conditional probability (0–1)', evidenceGivenNot: 'conditional probability (0–1)'},
    validate(input, output) {
      const alternative = (1 - input.prior) * input.evidenceGivenNot;
      if (output.numerator > 0 && alternative > 0 && (output.posterior === 0 || output.posterior === 1)) {
        throw Error('Interior Bayes posterior rounded to an endpoint is outside capture scope');
      }
    },
  }),
] as const;
