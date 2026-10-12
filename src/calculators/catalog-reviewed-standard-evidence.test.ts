import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { expect, it } from "vitest";
import { auditCatalogSlugReviewLedger, type CatalogSlugReview } from "./catalog-slug-review-ledger";
import { buildCatalogCertificationQueueReport } from "./catalog-certification-queue-report";
import { calculatorRegistry } from "./registry";
import { inspectCertificationEvidencePacket } from "./certification-evidence-packet";

it("exports reviewed-identity shortlist and packet readiness without granting certification", () => {
  const csv=readFileSync("data/catalog/master-catalog-2026.csv","utf8");
  const ledger=JSON.parse(readFileSync("data/catalog/mixed-category-review-ledger.partial.json","utf8")) as CatalogSlugReview[];
  const audit=auditCatalogSlugReviewLedger(ledger);
  const report=buildCatalogCertificationQueueReport(csv,{slugDomains:audit.approvedDomains});
  const definitions=new Map(calculatorRegistry.list().map(definition=>[definition.slug,definition]));
  const registry=calculatorRegistry.list();
  const categoryCounts=Object.entries(registry.reduce((acc,definition)=>{
    const k=definition.category+"|"+definition.riskClass+"|"+definition.reviewStatus;
    acc[k]=(acc[k]??0)+1;return acc;
  },{} as Record<string,number>)).sort(([a],[b])=>a.localeCompare(b));
  const standardCertified=registry.filter(d=>d.riskClass==="standard"&&d.reviewStatus==="certified");
  const standardReviewed=registry.filter(d=>d.riskClass==="standard"&&d.reviewStatus==="reviewed");
  console.info("REGISTRY_IDENTITY_SNAPSHOT",JSON.stringify(registry.map(d=>({id:d.id,slug:d.slug,version:d.version,riskClass:d.riskClass,reviewStatus:d.reviewStatus,category:d.category}))));
  console.info("STANDARD_RISK_REGISTRY_AUDIT",JSON.stringify({
    totalRegistered:registry.length,
    standardCertified:standardCertified.length,
    standardReviewed:standardReviewed.length,
    certifiedFirst25:standardCertified.slice(0,25).map(d=>({id:d.id,slug:d.slug,version:d.version,category:d.category})),
    categoryRiskReviewCounts:categoryCounts,
    databaseManifestCrossCheckPending:true,
  }));
  const candidates=report.rows.filter(row=>{
    if(!row.registrySlug||row.riskClass!=="standard"||row.registryReviewStatus!=="reviewed")return false;
    const definition=definitions.get(row.registrySlug);
    return definition && (definition.category!=="science"&&definition.category!=="everyday"||audit.approvedDomains[row.registrySlug]===row.domain);
  });
  const evidence=candidates.map(row=>{
    const definition=definitions.get(row.registrySlug!)!;
    const readiness=inspectCertificationEvidencePacket(definition);
    return {masterId:row.masterId,slug:row.registrySlug,ready:readiness.ready,missing:readiness.missing};
  });
  console.info("REVIEWED_STANDARD_CERTIFICATION_PACKET_QUEUE",JSON.stringify({
    totalCatalog:report.summary.totalMaster,
    reviewedMixedCategoryApproved:Object.keys(audit.approvedDomains).length,
    heldMixedCategory:audit.held.length,
    missingMixedCategoryReviews:audit.missing.length,
    candidates:evidence.length,
    evidenceReady:evidence.filter(row=>row.ready).length,
    blocked:evidence.filter(row=>!row.ready).length,
    first25:evidence.slice(0,25),
    databaseCertificationVerified:false,
    publicationVerified:false,
  }));
  const sixSlugs=["slope-calculator","graphing-calculator","function-plotter-2d","volume-calculator","standard-deviation-calculator","variance-calculator"];
  const six=sixSlugs.map(slug=>{
    const d=definitions.get(slug);
    if(!d)throw new Error("Missing six-candidate registry definition: "+slug);
    return {id:d.id,slug:d.slug,version:d.version,riskClass:d.riskClass,reviewStatus:d.reviewStatus,formulaCount:d.formulas.length,sourceCount:d.sources.length,goldenTestCount:d.goldenTests?.length??0,exampleCount:d.examples.length};
  });
  console.info("SIX_STANDARD_CANDIDATE_EVIDENCE",JSON.stringify(six));
  expect(six.every(d=>d.riskClass==="standard"&&d.reviewStatus==="certified")).toBe(true);
  const output=process.env.CALCUMINT_CERTIFICATION_EVIDENCE_OUT;
  if(output){
    mkdirSync(output,{recursive:true});
    const snapshot={
      totalMaster:report.summary.totalMaster,
      totalRegistered:report.summary.totalRegistered,
      provisionalCounts:report.summary.counts,
      reviewedMixedCategoryApproved:Object.keys(audit.approvedDomains).length,
      heldMixedCategory:audit.held.length,
      missingMixedCategoryReviews:audit.missing.length,
      reviewedStandardCandidates:evidence.length,
      packetEvidenceReady:evidence.filter(row=>row.ready).length,
      identityMappingComplete:false,
      databaseCertificationVerified:false,
      publicationVerified:false,
    };
    writeFileSync(output+"/certification-readiness-summary.json",JSON.stringify(snapshot,null,2)+"\\n");
    writeFileSync(output+"/certification-readiness-rows.csv",report.csv);
    writeFileSync(output+"/six-standard-candidate-evidence.json",JSON.stringify(six,null,2)+"\\n");
    writeFileSync(output+"/reviewed-standard-packet-candidates.json",JSON.stringify(evidence,null,2)+"\\n");
  }
  expect(report.rows).toHaveLength(540);
  expect(evidence.every(row=>row.slug!==null)).toBe(true);
});
