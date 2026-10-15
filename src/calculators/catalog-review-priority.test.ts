import { expect, it } from "vitest";
import { buildCatalogReviewPriority } from "./catalog-review-priority";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

const item: CalculatorInventoryRecord = {
  id:"math.ratio",slug:"ratio-calculator",title:"Ratio Calculator",
  category:"math",version:1,riskClass:"standard",reviewStatus:"certified",
};

it("prioritizes a single certified standard candidate without granting approval",()=>{
  const rows=buildCatalogReviewPriority([{masterId:1,domain:"Math",title:"Ratio Calculator"}],[item]);
  expect(rows[0].reviewPriority).toBe("P1-source-contract-review");
  expect(rows[0].identityApproved).toBe(false);
  expect(rows[0].publicationAuthorized).toBe(false);
});

it("preserves a shared slug hold across master identities",()=>{
  const rows=buildCatalogReviewPriority([
    {masterId:1,domain:"Math",title:"Ratio Calculator"},
    {masterId:2,domain:"Physics",title:"Ratio Calculator"},
  ],[item]);
  expect(rows.every(row=>row.reviewPriority==="HOLD-identity-collision")).toBe(true);
});

it("does not prioritize draft implementations as certified",()=>{
  const rows=buildCatalogReviewPriority([{masterId:1,domain:"Math",title:"Ratio Calculator"}],
    [{...item,reviewStatus:"draft"}]);
  expect(rows[0].reviewPriority).toBe("P2-other-review");
});
