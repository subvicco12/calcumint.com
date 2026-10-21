import { expect, it } from "vitest";
import { auditDatabaseCatalogIdentities } from "./catalog-database-identity-audit";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

const inventory: CalculatorInventoryRecord = {
  id: "physics.power", slug: "power-calculator", title: "Power Calculator",
  category: "physics", version: 1, riskClass: "standard", reviewStatus: "certified",
};
const record = {
  calculator_key: "physics.power", slug: "power-calculator",
  version: 1, published_timestamp_present: true,
};

it("never grants approval for a database identity match", () => {
  const result = auditDatabaseCatalogIdentities([inventory], [record])[0];
  expect(result.status).toBe("database-identity-match");
  expect(result.identityApproved).toBe(false);
  expect(result.publicationAuthorized).toBe(false);
});

it("holds missing or duplicate database identities", () => {
  expect(auditDatabaseCatalogIdentities([inventory], [])[0].status).toBe("database-row-missing");
  expect(auditDatabaseCatalogIdentities([inventory], [record, record])[0].status).toBe("duplicate-database-slug-hold");
});

it("holds key and version mismatches", () => {
  expect(auditDatabaseCatalogIdentities([inventory], [{...record, calculator_key:"wrong"}])[0].status).toBe("calculator-key-mismatch-hold");
  expect(auditDatabaseCatalogIdentities([inventory], [{...record, version:2}])[0].status).toBe("version-mismatch-hold");
});

it("requires a publication timestamp for positive database evidence", () => {
  expect(auditDatabaseCatalogIdentities([inventory], [{...record, published_timestamp_present:false}])[0].status).toBe("publication-timestamp-missing");
});
