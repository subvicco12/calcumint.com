import type { CalculationSnapshot } from './calculation-snapshot';
import { eligibleScenarioContract } from './scenario-reevaluation';

/**
 * Explicit reviewed sensitivity fields for certified standard-risk engines.
 * This is a separate capability gate, not a general inference from numeric inputs.
 * New calculators and variables require an explicit review and allowlist change.
 */
const sensitivityFields: Readonly<Record<string, Readonly<{ version: number; fields: readonly string[] }>>> = Object.freeze({
  'percentage-of-value-calculator': Object.freeze({ version: 1, fields: Object.freeze(['percentage', 'value']) }),
  'unit-conversion-calculator': Object.freeze({ version: 1, fields: Object.freeze(['value']) }),
});

export function eligibleSensitivityFields(snapshot: CalculationSnapshot): readonly string[] {
  if (!eligibleScenarioContract(snapshot)) return Object.freeze([]);
  const approved = sensitivityFields[snapshot.calculatorSlug];
  if (!approved || approved.version !== snapshot.calculatorVersion) return Object.freeze([]);
  return Object.freeze(approved.fields.filter(field =>
    Object.hasOwn(snapshot.input, field) &&
    typeof snapshot.input[field] === 'number' &&
    Number.isFinite(snapshot.input[field]),
  ));
}
