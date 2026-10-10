import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseMasterCatalogCsv } from "./catalog-csv-ingestion";
import { MASTER_CATALOG_DOMAINS } from "./catalog-domain-audit";

describe("committed canonical master catalog fixture", () => {
  it("contains exactly 540 unique sequential IDs across all 27 master domains", () => {
    const source = readFileSync(resolve(process.cwd(), "data/catalog/master-catalog-2026.csv"), "utf8");
    const rows = parseMasterCatalogCsv(source);
    expect(rows).toHaveLength(540);
    expect(rows.map((row) => row.masterId)).toEqual(Array.from({ length: 540 }, (_, index) => index + 1));
    expect([...new Set(rows.map((row) => row.domain))].sort()).toEqual([...MASTER_CATALOG_DOMAINS].sort());
  });
});
