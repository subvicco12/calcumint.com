import { expect, it } from "vitest";
import type { CalculatorInventoryRecord } from "./implementation-inventory";
import type { CatalogMatch } from "./catalog-reconciliation";
import { buildCatalogCertificationQueue } from "./catalog-certification-queue";

const inventory: CalculatorInventoryRecord[] = [
  {id:"one",slug:"one-calculator",title:"One",category:"math",version:1,riskClass:"standard",reviewStatus:"certified"},
  {id:"two",slug:"two-calculator",title:"Two",category:"health",version:1,riskClass:"health",reviewStatus:"reviewed"},
  {id:"three",slug:"three-calculator",title:"Three",category:"math",version:1,riskClass:"standard",reviewStatus:"draft"},
];
const matches: CatalogMatch[] = [
  {masterId:1,domain:"Math",title:"One",status:"exact",slug:"one-calculator",evidence:"domain-title"},
  {masterId:2,domain:"Health",title:"Two",status:"alias",slug:"two-calculator",evidence:"explicit-alias"},
  {masterId:3,domain:"Math",title:"Three",status:"exact",slug:"three-calculator",evidence:"domain-title"},
  {masterId:4,domain:"Math",title:"Ambiguous",status:"ambiguous",candidates:["one-calculator","three-calculator"]},
  {masterId:5,domain:"Math",title:"Missing",status:"unmatched"},
];

it("classifies all planning entries without inferring DB certification or publication",()=>{
 const queue=buildCatalogCertificationQueue(matches,inventory);
 expect(queue.map(row=>row.status)).toEqual([
  "registry-certified-unverified","registry-reviewed","registry-draft","identity-hold","implementation-missing",
 ]);
 expect(queue[1].riskClass).toBe("health");
 expect(queue.every(row=>!row.databaseCertificationVerified&&!row.publicationVerified)).toBe(true);
 expect(queue[3].registrySlug).toBeNull();
 expect(queue[4].registrySlug).toBeNull();
 expect(Object.isFrozen(queue)).toBe(true);
 expect(Object.isFrozen(queue[0])).toBe(true);
});

it("fails closed on duplicate master identities and missing registry definitions",()=>{
 expect(()=>buildCatalogCertificationQueue([matches[0],matches[0]],inventory)).toThrow("Duplicate master catalog ID");
 expect(()=>buildCatalogCertificationQueue([{...matches[0],slug:"unknown-calculator"}],inventory)).toThrow("Missing registry definition");
 expect(()=>buildCatalogCertificationQueue(matches,[...inventory,inventory[0]])).toThrow("Duplicate registry slug");
});
