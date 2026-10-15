import { describe, expect, it } from "vitest";
import { runCalculator } from "../engine";
import { calculatorRegistry } from "../registry";

const slugs = [
  "simple-interest-calculator",
  "compound-interest-calculator",
  "fixed-term-deposit-calculator",
  "recurring-deposit-calculator",
  "sip-calculator"
] as const;

// These records verify bounded numerical contracts, not protected financial approval.
describe("independent accumulation contract goldens (specialist review pending)", () => {
  for (const slug of slugs) {
    const definition = calculatorRegistry.getBySlug(slug)!;
    it(`${slug}: retains registered identity, provenance and six explicit vectors`, () => {
      expect(definition.id).toBe(`finance.${slug === "fixed-term-deposit-calculator" ? "term-deposit" : slug.replace("-calculator", "")}`);
      expect(definition.version).toBe(1);
      expect(definition.riskClass).toBe("financial");
      expect(definition.reviewStatus).toBe("certified"); // inherited code flag only
      expect(definition.sources.length).toBeGreaterThan(0);
      expect(definition.sources.every(source => source.url?.startsWith("https://www.investor.gov/") || source.url?.includes("consumerfinance.gov/"))).toBe(true);
      expect(definition.goldenTests).toHaveLength(6);
    });
    for (const vector of definition.goldenTests ?? []) {
      it(`${slug}: ${vector.label}`, () => {
        // Whole literal output includes signed gain and contract-specific rounding.
        expect(definition.calculate(definition.inputSchema.parse(vector.input), {})).toEqual(vector.expected);
        for (const plan of ["free", "pro", "business"]) {
          const run = runCalculator(definition, { ...(vector.input as Record<string, unknown>), plan });
          expect(run.input).not.toHaveProperty("plan");
          expect(run.output).toEqual(vector.expected);
        }
        for (const context of [{}, { locale: "en-US", currency: "USD" }, { locale: "de-DE", currency: "EUR" }]) {
          expect(runCalculator(definition, vector.input, context).output).toEqual(vector.expected);
        }
      });
    }
    it(`${slug}: public schema rejects missing, nonfinite and nonnumeric capital`, () => {
      const input = definition.goldenTests![0].input as Record<string, unknown>;
      const key = slug === "sip-calculator" ? "monthlyContribution" : slug === "recurring-deposit-calculator" ? "monthlyDeposit" : "principal";
      for (const value of [undefined, null, "100", NaN, Infinity, -Infinity, -1]) {
        const invalid = { ...input, [key]: value };
        expect(definition.inputSchema.safeParse(invalid).success).toBe(false);
        expect(() => runCalculator(definition, invalid)).toThrow();
      }
    });
  }

  it("reports five new explicit records independently of specialist approval", () => {
    const definitions = calculatorRegistry.list();
    expect(definitions).toHaveLength(574);
    expect(definitions.filter(definition => !definition.goldenTests?.length)).toHaveLength(10);
    expect(definitions.filter(definition => definition.riskClass === "standard" && !definition.goldenTests?.length)).toHaveLength(0);
  });

  it("rejects rates outside each existing financial schema", () => {
    for (const [slug, key, invalid] of [
      ["simple-interest-calculator", "annualRatePercent", [-1, 10001]],
      ["compound-interest-calculator", "annualRatePercent", [-100, 1001]],
      ["fixed-term-deposit-calculator", "annualRatePercent", [-1, 1001]],
      ["recurring-deposit-calculator", "annualInterestPercent", [-1, 101]],
      ["sip-calculator", "annualReturnPercent", [-100, 1001]]
    ] as const) {
      const definition = calculatorRegistry.getBySlug(slug)!;
      for (const value of [...invalid, NaN, Infinity, -Infinity]) {
        expect(() => runCalculator(definition, { ...(definition.goldenTests![0].input as Record<string, unknown>), [key]: value })).toThrow();
      }
    }
  });

  it("rejects noninteger or out-of-range period/frequency boundaries", () => {
    for (const slug of ["sip-calculator", "recurring-deposit-calculator", "fixed-term-deposit-calculator"]) {
      const definition = calculatorRegistry.getBySlug(slug)!;
      const input = definition.goldenTests![0].input as Record<string, unknown>;
      for (const termMonths of [0, 1.5, 1201, Infinity]) {
        expect(() => runCalculator(definition, { ...input, termMonths })).toThrow();
      }
    }
    const compound = calculatorRegistry.getBySlug("compound-interest-calculator")!;
    for (const compoundsPerYear of [0, 1.5, 366, Infinity]) {
      expect(() => runCalculator(compound, { principal: 100, annualRatePercent: 10, years: 1, compoundsPerYear })).toThrow();
    }
  });

  it("retains zero-capital rejection for deposit and contribution public contracts", () => {
    for (const [slug, key] of [["fixed-term-deposit-calculator", "principal"], ["recurring-deposit-calculator", "monthlyDeposit"], ["sip-calculator", "monthlyContribution"]]) {
      const definition = calculatorRegistry.getBySlug(slug)!;
      expect(() => runCalculator(definition, { ...(definition.goldenTests![0].input as Record<string, unknown>), [key]: 0 })).toThrow();
    }
  });
});
