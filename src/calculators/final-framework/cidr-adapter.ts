import {cidrCalculator} from '../technology-computing/catalog-batch-1';
import {registeredValueResult} from './registered-value-result';
import type {StructuredCalculationResult} from './types';

export function cidrResult(output: {value: number; steps: readonly string[]}): StructuredCalculationResult {
 return registeredValueResult(cidrCalculator, output, {
  label: 'CIDR addresses',
  unit: 'addresses',
  methodology: 'Counts total IPv4 addresses as 2^(32 − prefix length), including reserved addresses; not usable hosts. '+output.steps.join(' '),
 });
}
