import {zScoreCalculator} from '@/calculators/statistics/catalog-batch-1';
import {confidenceIntervalCalculator, sampleSizeCalculator, probabilityCalculator, permutationCalculator} from '@/calculators/statistics/catalog-batch-2';
import {createEngineeringContract, type EngineeringContract} from './next-engineering-core';

const evidence = (id: number) => [
  `docs/next-engineering-20261115/statistics-a/source-bindings.md#id-${id}`,
  'docs/next-engineering-20261115/statistics-a/evidence/manifest.json',
];

/** Private engineering candidates only. No registry, canonical acceptance, or release authority. */
export const statisticsAContracts: readonly EngineeringContract[] = Object.freeze([
  createEngineeringContract(zScoreCalculator, {
    catalogId: 284, primaryKey: 'zScore', unit: 'dimensionless',
    scope: 'Standardize one value using a supplied mean and positive standard deviation in the same unit; no tail probability or distribution fit.',
    sourceEvidence: evidence(284),
    fieldUnits: {value: 'supplied unit', mean: 'supplied unit', standardDeviation: 'supplied unit'},
  }),
  createEngineeringContract(confidenceIntervalCalculator, {
    catalogId: 285, primaryKey: 'marginOfError', unit: 'supplied estimate unit',
    scope: 'Two-sided normal interval from a supplied estimate and positive standard error; caller establishes a valid normal approximation. Confidence levels: 80%, 90%, 95%, 98%, 99%. No t interval.',
    sourceEvidence: evidence(285),
    fieldUnits: {estimate: 'supplied unit', standardError: 'supplied unit', confidenceLevel: 'fraction'},
    validate: (input, output) => {
      if (!(output.lowerBound < input.estimate && input.estimate < output.upperBound)) {
        throw Error('Confidence interval endpoints collapse at the supplied estimate');
      }
    },
  }),
  createEngineeringContract(sampleSizeCalculator, {
    catalogId: 286, primaryKey: 'sampleSize', unit: 'observations',
    scope: 'Normal-approximation proportion sample-size planning for 0 < p < 1, absolute fractional margin 0 < E ≤ 1, and the five v1 confidence levels; round upward, maximum 1e9. No finite-population correction or inference guarantee.',
    sourceEvidence: evidence(286),
    fieldUnits: {confidenceLevel: 'fraction', marginOfError: 'absolute fraction', proportion: 'fraction'},
    validate: input => {
      if (!(input.proportion > 0 && input.proportion < 1)) {
        throw Error('Planning proportion must be strictly between zero and one');
      }
    },
  }),
  createEngineeringContract(probabilityCalculator, {
    catalogId: 287, primaryKey: 'bothIndependent', unit: 'probability',
    scope: 'Intersection, union, and complement for two supplied independent event probabilities in [0,1]. Independence is assumed; no conditional/dependent-event model.',
    sourceEvidence: evidence(287),
    fieldUnits: {probabilityOfA: 'probability', probabilityOfB: 'probability'},
    validate: (input, output) => {
      const a = input.probabilityOfA, b = input.probabilityOfB;
      if ([output.bothIndependent, output.eitherIndependent, output.notA].some(value => value < 0 || value > 1)
        || output.bothIndependent > Math.min(a, b) || output.eitherIndependent < Math.max(a, b)) {
        throw Error('Probability result outside mathematical event bounds');
      }
      if ((a > 0 && a < 1 && !(output.notA > 0 && output.notA < 1))
        || (a < 1 && b < 1 && output.eitherIndependent === 1)
        || (a > 0 && a < 1 && b > 0 && b < 1 && output.eitherIndependent === Math.max(a, b))) {
        throw Error('Nonzero probability contribution collapses at binary64 precision');
      }
    },
  }),
  createEngineeringContract(permutationCalculator, {
    catalogId: 288, primaryKey: 'permutations', unit: 'ordered selections',
    scope: 'Ordered selections without replacement from n distinct objects, integer 0 ≤ r ≤ n ≤ 1e9; result must be an exact safe integer. P(n,0)=1. No repeated/indistinguishable objects.',
    sourceEvidence: evidence(288), fieldUnits: {n: 'objects', r: 'selected objects'},
  }),
]);
