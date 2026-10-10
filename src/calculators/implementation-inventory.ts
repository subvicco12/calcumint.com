import { calculatorRegistry } from "./registry";
import type { CalculatorReviewStatus, CalculatorRiskClass } from "./types";

/**
 * Internal, read-only implementation inventory.
 *
 * Registry presence is NOT evidence of DB publication, specialist approval,
 * or authorization to expose a calculator to the public.
 */
export type CalculatorInventoryRecord = Readonly<{
  id: string;
  slug: string;
  title: string;
  category: string;
  version: number;
  riskClass: CalculatorRiskClass;
  reviewStatus: CalculatorReviewStatus;
}>;

export function listCalculatorImplementationInventory(): readonly CalculatorInventoryRecord[] {
  return calculatorRegistry.list().map(({ id, slug, title, category, version, riskClass, reviewStatus }) => ({
    id, slug, title, category, version, riskClass, reviewStatus,
  })).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function summarizeCalculatorImplementationInventory() {
  const entries = listCalculatorImplementationInventory();
  const byCategory: Record<string, number> = {};
  const byReviewStatus: Record<CalculatorReviewStatus, number> = { draft: 0, reviewed: 0, certified: 0 };
  const byRiskClass: Record<CalculatorRiskClass, number> = { standard: 0, financial: 0, health: 0, tax: 0 };
  for (const entry of entries) {
    byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1;
    byReviewStatus[entry.reviewStatus]++;
    byRiskClass[entry.riskClass]++;
  }
  return { totalRegistered: entries.length, byCategory, byReviewStatus, byRiskClass };
}
