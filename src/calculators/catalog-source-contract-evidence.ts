import { calculatorRegistry } from "./registry";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

/** Evidence presence only: this cannot validate formula correctness or authorize publication. */
export function collectCatalogSourceContractEvidence(inventory: readonly CalculatorInventoryRecord[]) {
  return inventory.map(item => {
    const definition = calculatorRegistry.getBySlug(item.slug);
    const identityMatches = definition?.id === item.id && definition.version === item.version;
    return {
      calculatorKey: item.id, slug: item.slug, version: item.version,
      registryIdentityMatches: identityMatches,
      formulaCount: identityMatches ? definition.formulas.length : 0,
      sourceCount: identityMatches ? definition.sources.length : 0,
      exampleCount: identityMatches ? definition.examples.length : 0,
      goldenTestCount: identityMatches ? (definition.goldenTests?.length ?? 0) : 0,
      inputSchemaPresent: identityMatches && !!definition.inputSchema,
      calculateFunctionPresent: identityMatches && typeof definition.calculate === "function",
      sourceContractVerified: false,
      mathematicalCorrectnessVerified: false,
      identityApproved: false,
      publicationAuthorized: false,
    };
  });
}
