import type {CertificationEvidencePacket} from "@/calculators/certification-evidence-packet";
import type {QaCheckType} from "./publishing";

export type ReviewerEvidencePrefill={
  calculatorKey:string;
  slug:string;
  sources:readonly {label:string;url:string;sourceKind:"reference"}[];
  qa:readonly {checkType:QaCheckType;status:"pending";details:string}[];
  evidenceSummary:{goldenTestCount:number;formulaCount:number};
};

export function buildReviewerEvidencePrefill(packet:CertificationEvidencePacket):ReviewerEvidencePrefill{
  return{
    calculatorKey:packet.calculatorKey,
    slug:packet.slug,
    sources:packet.sources.map(({label,url})=>({label,url,sourceKind:"reference" as const})),
    qa:packet.requiredQaChecks.map((checkType)=>({checkType,status:"pending" as const,details:""})),
    evidenceSummary:{goldenTestCount:packet.goldenTestCount,formulaCount:packet.formulaCount}
  };
}
