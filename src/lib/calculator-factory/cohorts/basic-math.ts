import { launchDefinitions } from "../../../calculators/launch-portfolio";
import { createCalculationSnapshot } from "../../calculation-snapshot";
import type { CalculatorContext } from "../../../calculators/types";
import type { StructuredCalculationResult } from "../../../calculators/final-framework/types";

/** Explicit catalog binding for private reusable delivery. Existing engine status grants no factory release authority. */
export const basicMathContracts = [
  {
    "catalogId": 208,
    "engineId": "launch-percentage-change-calculator",
    "slug": "percentage-change-calculator",
    "version": 1,
    "title": "Percentage Change Calculator",
    "fields": [
      {
        "key": "old",
        "label": "Original value",
        "kind": "number",
        "defaultValue": 100
      },
      {
        "key": "next",
        "label": "New value",
        "kind": "number",
        "defaultValue": 125
      }
    ],
    "primaryKey": "result",
    "unit": "%",
    "scope": "Signed change divided by the absolute original value; original must be nonzero.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Signed change divided by the absolute original value; original must be nonzero."
    ],
    "blockers": []
  },
  {
    "catalogId": 209,
    "engineId": "launch-percentage-increase-calculator",
    "slug": "percentage-increase-calculator",
    "version": 1,
    "title": "Percentage Increase Calculator",
    "fields": [
      {
        "key": "value",
        "label": "Original value",
        "kind": "number",
        "defaultValue": 100
      },
      {
        "key": "percent",
        "label": "Increase (%)",
        "kind": "number",
        "defaultValue": 20
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Nonnegative percentage increase of a supplied real value.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Nonnegative percentage increase of a supplied real value."
    ],
    "blockers": []
  },
  {
    "catalogId": 210,
    "engineId": "launch-percentage-decrease-calculator",
    "slug": "percentage-decrease-calculator",
    "version": 1,
    "title": "Percentage Decrease Calculator",
    "fields": [
      {
        "key": "value",
        "label": "Original value",
        "kind": "number",
        "defaultValue": 100
      },
      {
        "key": "percent",
        "label": "Decrease (%)",
        "kind": "number",
        "defaultValue": 20
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Nonnegative percentage decrease; decreases above 100% may produce negative values.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Nonnegative percentage decrease; decreases above 100% may produce negative values."
    ],
    "blockers": []
  },
  {
    "catalogId": 211,
    "engineId": "launch-ratio-calculator",
    "slug": "ratio-calculator",
    "version": 1,
    "title": "Ratio Calculator",
    "fields": [
      {
        "key": "a",
        "label": "First value",
        "kind": "number",
        "defaultValue": 12
      },
      {
        "key": "b",
        "label": "Second value",
        "kind": "number",
        "defaultValue": 18
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Numeric quotient of two values; does not simplify an integer ratio.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Numeric quotient of two values; does not simplify an integer ratio."
    ],
    "blockers": []
  },
  {
    "catalogId": 212,
    "engineId": "launch-proportion-calculator",
    "slug": "proportion-calculator",
    "version": 1,
    "title": "Proportion Calculator",
    "fields": [
      {
        "key": "a",
        "label": "Known numerator",
        "kind": "number",
        "defaultValue": 3
      },
      {
        "key": "b",
        "label": "Known denominator",
        "kind": "number",
        "defaultValue": 5
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Decimal quotient only; does not solve an unknown term in a four-term proportion.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Decimal quotient only; does not solve an unknown term in a four-term proportion."
    ],
    "blockers": []
  },
  {
    "catalogId": 215,
    "engineId": "launch-fraction-to-decimal-calculator",
    "slug": "fraction-to-decimal-calculator",
    "version": 1,
    "title": "Fraction to Decimal Calculator",
    "fields": [
      {
        "key": "numerator",
        "label": "Numerator",
        "kind": "number",
        "defaultValue": 3
      },
      {
        "key": "denominator",
        "label": "Denominator",
        "kind": "number",
        "defaultValue": 4
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Finite numeric quotient; no exact repeating-decimal expansion.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Finite numeric quotient; no exact repeating-decimal expansion."
    ],
    "blockers": []
  },
  {
    "catalogId": 216,
    "engineId": "launch-average-two-numbers-calculator",
    "slug": "average-two-numbers-calculator",
    "version": 1,
    "title": "Average Calculator",
    "fields": [
      {
        "key": "a",
        "label": "First value",
        "kind": "number",
        "defaultValue": 10
      },
      {
        "key": "b",
        "label": "Second value",
        "kind": "number",
        "defaultValue": 20
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Arithmetic mean of exactly two numbers; no list or weighted mean.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Arithmetic mean of exactly two numbers; no list or weighted mean."
    ],
    "blockers": []
  },
  {
    "catalogId": 218,
    "engineId": "launch-square-calculator",
    "slug": "square-calculator",
    "version": 1,
    "title": "Square Calculator",
    "fields": [
      {
        "key": "x",
        "label": "Number",
        "kind": "number",
        "defaultValue": 12
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Real scalar squared within finite output range.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Real scalar squared within finite output range."
    ],
    "blockers": []
  },
  {
    "catalogId": 219,
    "engineId": "launch-cube-calculator",
    "slug": "cube-calculator",
    "version": 1,
    "title": "Cube Calculator",
    "fields": [
      {
        "key": "x",
        "label": "Number",
        "kind": "number",
        "defaultValue": 5
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Real scalar cubed within finite output range.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Real scalar cubed within finite output range."
    ],
    "blockers": []
  },
  {
    "catalogId": 220,
    "engineId": "launch-square-root-calculator",
    "slug": "square-root-calculator",
    "version": 1,
    "title": "Square Root Calculator",
    "fields": [
      {
        "key": "x",
        "label": "Number",
        "kind": "number",
        "defaultValue": 144
      }
    ],
    "primaryKey": "result",
    "unit": "",
    "scope": "Principal real square root; nonnegative input only.",
    "sourceEvidence": [
      "docs/calculator-first/authority-catalog.json",
      "src/calculators/launch-portfolio.ts",
      "data/verification/codex-a-standard-risk-goldens-2026-10-15.json"
    ],
    "limitations": [
      "IEEE-754 finite real arithmetic; no arbitrary precision.",
      "Principal real square root; nonnegative input only."
    ],
    "blockers": []
  }
] as const;
export type BasicMathCatalogId = typeof basicMathContracts[number]["catalogId"];

/** Validates with the actual engine; captures parsed input and raw output before presentation. No formula is duplicated here. */
export function calculateBasicMath(catalogId: BasicMathCatalogId, input: unknown, context: CalculatorContext = {}) {
  const contract = basicMathContracts.find(row => row.catalogId === catalogId);
  if (!contract) throw new Error("Unsupported basic math factory identity");
  const engine = launchDefinitions.find(row => row.id === contract.engineId && row.slug === contract.slug && row.version === contract.version);
  if (!engine) throw new Error("Basic math factory engine binding unavailable");
  const parsed = engine.inputSchema.parse(input);
  const output = engine.calculate(parsed, context);
  const snapshot = createCalculationSnapshot({ calculatorSlug: engine.slug, calculatorVersion: engine.version, input: parsed, output });
  const result: StructuredCalculationResult = {
    primaryResult: { id: contract.primaryKey, label: "Result", value: output.result, ...(contract.unit ? { unit: contract.unit } : {}) },
    methodology: engine.formulas.map(formula => formula.description).join(" "),
    sources: engine.sources,
    warnings: ["Private factory delivery; no new certification or publication authorization.", contract.scope],
  };
  return { snapshot, result };
}
