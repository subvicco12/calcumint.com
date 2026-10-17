import { expect, it } from "vitest";
import { collectCatalogSourceContractEvidence } from "./catalog-source-contract-evidence";
import { listCalculatorImplementationInventory } from "./implementation-inventory";

it("reports source evidence without approving any registered calculator", () => {
  const inventory = listCalculatorImplementationInventory();
  const evidence = collectCatalogSourceContractEvidence(inventory);
  expect(evidence).toHaveLength(inventory.length);
  expect(evidence.every(row => row.registryIdentityMatches)).toBe(true);
  expect(evidence.every(row => !row.sourceContractVerified && !row.mathematicalCorrectnessVerified
    && !row.identityApproved && !row.publicationAuthorized)).toBe(true);
});

it("does not mistake an incorrect key for a verified registry identity", () => {
  const original = listCalculatorImplementationInventory()[0];
  const evidence = collectCatalogSourceContractEvidence([{...original,id:"incorrect-key"}])[0];
  expect(evidence.registryIdentityMatches).toBe(false);
  expect(evidence.formulaCount).toBe(0);
  expect(evidence.sourceContractVerified).toBe(false);
});
