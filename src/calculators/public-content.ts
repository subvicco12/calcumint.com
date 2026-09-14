import { calculatorRegistry } from "./registry";

export type PublicCalculatorContent = {
  slug: string;
  category: string;
  shortDescription: string;
  intro: string;
  formulaExplanation: string;
  assumptions: readonly string[];
  faq: readonly { question: string; answer: string }[];
  relatedSlugs: readonly string[];
  keywords: readonly string[];
};

const content: readonly PublicCalculatorContent[] = [
  {
    slug: "percentage-of-value-calculator",
    category: "math",
    shortDescription: "Find a percentage of any number instantly.",
    intro: "Use this calculator to answer questions such as 20% of 250. Enter the percentage and the base value to get an immediate result.",
    formulaExplanation: "Convert the percentage to decimal form by dividing by 100, then multiply it by the base value.",
    assumptions: ["Inputs are treated as finite decimal numbers.", "The result is calculated directly; no tax, currency or domain-specific rules are applied."],
    faq: [
      { question: "How do I calculate a percentage of a number?", answer: "Divide the percentage by 100 and multiply the decimal by the number." },
      { question: "Can I use decimals?", answer: "Yes. Both the percentage and the base value can include decimals." }
    ],
    relatedSlugs: ["unit-conversion-calculator"],
    keywords: ["percentage calculator", "percent of number", "percentage of value"]
  },
  {
    slug: "unit-conversion-calculator",
    category: "unit-conversions",
    shortDescription: "Convert common length, mass, volume and temperature units.",
    intro: "Convert between supported units using a single verified conversion engine. The calculator includes common metric and US customary measurements.",
    formulaExplanation: "Linear units are converted through a common base unit. Temperature conversions use Kelvin as the intermediate scale.",
    assumptions: ["Only units in the same measurement family can be converted.", "US liquid gallon and quart definitions are used for gal_us and qt_us."],
    faq: [
      { question: "Can I convert temperature?", answer: "Yes. Celsius, Fahrenheit and Kelvin conversions are supported." },
      { question: "Can I convert between unrelated units?", answer: "No. A length unit can only convert to another length unit, mass to mass, volume to volume, and temperature to temperature." }
    ],
    relatedSlugs: ["percentage-of-value-calculator"],
    keywords: ["unit converter", "measurement converter", "length conversion", "temperature conversion"]
  }
];

export const categoryContent = {
  math: {
    name: "Math Calculators",
    description: "Fast, accurate calculators for percentages and everyday mathematics."
  },
  "unit-conversions": {
    name: "Unit Conversion Calculators",
    description: "Convert common units of length, mass, volume and temperature."
  }
} as const;

export function getPublicCalculatorContent(slug: string): PublicCalculatorContent | undefined {
  const definition = calculatorRegistry.getBySlug(slug);
  if (!definition || definition.reviewStatus !== "certified") return undefined;
  return content.find((item) => item.slug === slug);
}

export function listPublicCalculators(): readonly PublicCalculatorContent[] {
  return content.filter((item) => calculatorRegistry.getBySlug(item.slug)?.reviewStatus === "certified");
}

export function listPublicCategories() {
  return Object.entries(categoryContent).map(([slug, value]) => ({ slug, ...value }));
}
