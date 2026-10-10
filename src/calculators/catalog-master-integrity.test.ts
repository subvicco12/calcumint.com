import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";

/** Source-workbook counts, independently checked against all 540 master records. */
export const MASTER_DOMAIN_COUNTS: Readonly<Record<string, number>> = {
  "Loans & Credit": 25,
  "Mortgage & Property Finance": 24,
  "Investing & Wealth": 30,
  "Retirement & Financial Independence": 19,
  "Personal Finance & Household": 21,
  "Tax & Payroll": 18,
  "Business & Accounting": 24,
  "SaaS & Startups": 22,
  "E-commerce & Marketing": 21,
  "Math": 30,
  "Advanced Math & Graphing": 20,
  "Geometry": 26,
  "Statistics & Probability": 21,
  "Physics": 26,
  "Chemistry": 15,
  "Engineering & Construction": 25,
  "Technology & Computing": 20,
  "Health & Fitness": 23,
  "Biology & Life Science": 12,
  "Conversion": 20,
  "Date & Time": 15,
  "Automotive & EV": 19,
  "Energy & Environment": 19,
  "Food & Cooking": 11,
  "Travel & Everyday": 14,
  "Sports": 10,
  "Earth & Astronomy": 10,
};

describe("master catalog workbook domain count integrity", () => {
  it("covers exactly 27 domains and 540 entries", () => {
    expect(Object.keys(MASTER_DOMAIN_COUNTS).sort()).toEqual([...MASTER_CATALOG_DOMAINS].sort());
    expect(Object.values(MASTER_DOMAIN_COUNTS).reduce((sum, count) => sum + count, 0)).toBe(540);
  });

  it.skipIf(!process.env.CALCUMINT_MASTER_CSV)("rejects incomplete or altered domain distributions", () => {
    const rows = parseMasterCatalogCsv(readFileSync(resolve(process.env.CALCUMINT_MASTER_CSV!), "utf8"));
    const actual: Record<string, number> = {};
    for (const row of rows) actual[row.domain] = (actual[row.domain] ?? 0) + 1;
    expect(rows).toHaveLength(540);
    expect(actual).toEqual(MASTER_DOMAIN_COUNTS);
  });
});
