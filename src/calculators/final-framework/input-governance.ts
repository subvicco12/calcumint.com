export type CalculatorInputClass =
  | "core"
  | "accuracy-required"
  | "jurisdiction-required"
  | "advanced-analysis"
  | "business-workflow";

export type InputEntitlementRule = "always" | "pro-or-business" | "business";

export type GovernedInputMetadata = {
  key: string;
  inputClass: CalculatorInputClass;
  entitlement: InputEntitlementRule;
};

const requiredRule: Readonly<Record<CalculatorInputClass, InputEntitlementRule>> = {
  core: "always",
  "accuracy-required": "always",
  "jurisdiction-required": "always",
  "advanced-analysis": "pro-or-business",
  "business-workflow": "business"
};

export function requiredEntitlementForInput(inputClass: CalculatorInputClass): InputEntitlementRule {
  return requiredRule[inputClass];
}

export function validateInputEntitlement(metadata: GovernedInputMetadata): void {
  const required = requiredEntitlementForInput(metadata.inputClass);
  if (metadata.entitlement !== required) {
    throw new Error(
      `Input "${metadata.key}" is classified as ${metadata.inputClass} and must use entitlement "${required}"`
    );
  }
}

export function assertNoAccuracyPaywall(inputs: readonly GovernedInputMetadata[]): void {
  for (const input of inputs) validateInputEntitlement(input);
}
