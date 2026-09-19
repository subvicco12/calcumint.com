export type CalculatorCategory = {
  id: string;
  title: string;
  parentId?: string;
  country?: string;
};

export type CalculationJourney = {
  id: string;
  title: string;
  calculatorSlugs: readonly string[];
  country?: string;
};

const categories = new Map<string, CalculatorCategory>();
const journeys = new Map<string, CalculationJourney>();

export function registerCategory(category: CalculatorCategory): void {
  if (!category.id.trim() || !category.title.trim()) throw new Error("Category id and title are required");
  if (categories.has(category.id)) throw new Error(`Duplicate category ${category.id}`);
  if (category.parentId && !categories.has(category.parentId)) throw new Error(`Unknown parent category ${category.parentId}`);
  categories.set(category.id, Object.freeze({ ...category }));
}

export function registerJourney(journey: CalculationJourney): void {
  if (!journey.id.trim() || !journey.title.trim()) throw new Error("Journey id and title are required");
  if (!journey.calculatorSlugs.length) throw new Error("Journey requires at least one calculator");
  if (new Set(journey.calculatorSlugs).size !== journey.calculatorSlugs.length) throw new Error("Journey calculator slugs must be unique");
  if (journeys.has(journey.id)) throw new Error(`Duplicate journey ${journey.id}`);
  journeys.set(journey.id, Object.freeze({ ...journey, calculatorSlugs: Object.freeze([...journey.calculatorSlugs]) }));
}

export function listCategories(country?: string): readonly CalculatorCategory[] {
  const normalized = country?.trim().toUpperCase();
  return [...categories.values()].filter((category) => !category.country || !normalized || category.country.toUpperCase() === normalized);
}

export function listJourneys(country?: string): readonly CalculationJourney[] {
  const normalized = country?.trim().toUpperCase();
  return [...journeys.values()].filter((journey) => !journey.country || !normalized || journey.country.toUpperCase() === normalized);
}

export function getJourney(id: string): CalculationJourney | undefined {
  return journeys.get(id);
}

export function clearTaxonomyRegistry(): void {
  categories.clear();
  journeys.clear();
}

export function registerCoreTaxonomy(): void {
  const coreCategories: readonly CalculatorCategory[] = [
    { id: "finance", title: "Finance & Investment" },
    { id: "loans", title: "Loans, Mortgages & Credit", parentId: "finance" },
    { id: "tax", title: "Tax & Payroll" },
    { id: "business", title: "Business & Commerce" },
    { id: "real-estate", title: "Real Estate & Construction" },
    { id: "math", title: "Math & Statistics" },
    { id: "science", title: "Science & Engineering" },
    { id: "health", title: "Health & Fitness" },
    { id: "everyday", title: "Everyday & Conversion" },
  ];
  for (const category of coreCategories) if (!categories.has(category.id)) registerCategory(category);

  const coreJourneys: readonly CalculationJourney[] = [
    { id: "buy-a-home", title: "Buy a Home", calculatorSlugs: ["mortgage-payment", "loan-payment", "rent-vs-buy"] },
    { id: "plan-retirement", title: "Plan Retirement", calculatorSlugs: ["retirement", "compound-interest", "sip"] },
    { id: "start-a-business", title: "Start a Business", calculatorSlugs: ["break-even", "margin", "runway"] },
    { id: "invest-for-a-goal", title: "Invest for a Goal", calculatorSlugs: ["sip", "compound-interest", "future-value"] },
    { id: "get-out-of-debt", title: "Get Out of Debt", calculatorSlugs: ["loan-payment", "debt-payoff", "credit-card-payoff"] },
  ];
  for (const journey of coreJourneys) if (!journeys.has(journey.id)) registerJourney(journey);
}
