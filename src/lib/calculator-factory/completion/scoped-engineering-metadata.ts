import type {FactoryContract} from '../registry';
import type {FactoryIdentity} from '../workflows';
import type {ScenarioDisplayMetadata,ScenarioFieldDisplay} from '@/lib/scenario-display-metadata';

export type ScopedEngineeringMetadata=Readonly<{
 schemaVersion:1;identity:FactoryIdentity;scope:string;primaryKey:string;
 fields:readonly Readonly<{key:string;label:string;unit?:string}>[];
 outputs:Readonly<Record<string,ScenarioFieldDisplay>>;
 sourceEvidence:readonly string[];publisherSources:readonly string[];limitations:readonly string[];
 authority:string;
}>;
// Publisher URLs are compiled from the retained per-ID source manifests, never read at runtime.
const retainedPublisherSources:Readonly<Record<number,readonly string[]>>={
  "284": [
    "https://openstax.org/books/introductory-statistics-2e/pages/6-1-the-standard-normal-distribution"
  ],
  "285": [
    "https://openstax.org/books/introductory-statistics-2e/pages/8-1-a-single-population-mean-using-the-normal-distribution"
  ],
  "286": [
    "https://openstax.org/books/introductory-statistics-2e/pages/8-3-a-population-proportion"
  ],
  "287": [
    "https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology",
    "https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability"
  ],
  "288": [
    "https://openstax.org/books/college-algebra-2e/pages/9-5-counting-principles"
  ],
  "329": [
    "https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties"
  ],
  "333": [
    "https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh",
    "https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties"
  ],
  "334": [
    "https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law",
    "https://physics.nist.gov/cgi-bin/cuu/Value?r",
    "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8"
  ],
  "335": [
    "https://openstax.org/books/chemistry-2e/pages/9-3-stoichiometry-of-gaseous-substances-mixtures-and-reactions",
    "https://physics.nist.gov/cgi-bin/cuu/Value?r",
    "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8"
  ],
  "336": [
    "https://openstax.org/books/chemistry-2e/pages/3-4-other-units-for-solution-concentrations",
    "https://openstax.org/books/chemistry-2e/pages/3-2-determining-empirical-and-molecular-formulas"
  ],
  "337": [
    "https://openstax.org/books/chemistry-2e/pages/3-4-other-units-for-solution-concentrations"
  ]
};
const secondaryUnits:Readonly<Record<number,Readonly<Record<string,string>>>>={
 284:{deviation:'supplied unit'},
 285:{estimate:'supplied estimate unit',lowerBound:'supplied estimate unit',upperBound:'supplied estimate unit',confidenceLevel:'fraction',criticalValue:'dimensionless'},
 286:{unroundedSampleSize:'observations',confidenceLevel:'fraction',marginOfError:'absolute fraction',proportion:'fraction'},
 287:{probabilityOfA:'probability',probabilityOfB:'probability',eitherIndependent:'probability',notA:'probability'},
 288:{n:'objects',r:'selected objects'},289:{n:'objects',r:'selected objects'},
 290:{n:'trials',k:'successes',p:'probability (0–1)'},
 291:{pdf:'reciprocal input unit',zScore:'dimensionless',upperTail:'probability (0–1)'},
 300:{numerator:'joint probability (0–1)',denominator:'evidence probability (0–1)'},
};
const approximationLimits:Readonly<Record<number,readonly string[]>>={
 285:['Uses the immutable rounded v1 critical-value table; no ideal-quantile coverage guarantee.'],
 286:['Uses the immutable rounded v1 critical-value table; no ideal-quantile coverage or minimum sample-size guarantee.'],
 290:['Independent log-space approximation golden cases do not establish a uniform error bound; interior underflow, subnormal probability and rounded saturation are refused.'],
 291:['Retained numerical evidence is a finite grid within |z| <= 4, not a continuous/global error bound or coefficient provenance certification.'],
};
/** Reviewable delivery context only. This metadata grants no authentication, certification or publication authority. */
export function createScopedEngineeringMetadata(contract:FactoryContract,identity:FactoryIdentity):ScopedEngineeringMetadata{
 const outputs=Object.fromEntries(Object.entries({...secondaryUnits[contract.catalogId],[contract.primaryKey]:contract.unit}).map(([key,unit])=>[key,Object.freeze({label:key,...(unit?{unit}:{})})]));
 return Object.freeze({schemaVersion:1,identity:Object.freeze({...identity}),scope:contract.scope,primaryKey:contract.primaryKey,
 fields:Object.freeze(contract.fields.map(({key,label,unit})=>Object.freeze({key,label,...(unit?{unit}:{})}))),outputs:Object.freeze(outputs),
 sourceEvidence:Object.freeze([...contract.sourceEvidence]),publisherSources:Object.freeze([...new Set([...(retainedPublisherSources[contract.catalogId]??[]),...contract.sourceEvidence.filter(s=>s.startsWith('https://'))])]),
 limitations:Object.freeze([...contract.limitations,...(approximationLimits[contract.catalogId]??[])]),
 authority:'Private engineering context; not authenticated provenance, canonical acceptance, certification or publication authority.'});
}
export function scopedEngineeringDisplay(metadata:ScopedEngineeringMetadata):ScenarioDisplayMetadata{
 return {schemaVersion:1,calculatorSlug:metadata.identity.calculatorSlug,calculatorVersion:metadata.identity.calculatorVersion,
 inputs:Object.fromEntries(metadata.fields.map(({key,label,unit})=>[key,{label,...(unit?{unit}:{})}])),outputs:metadata.outputs};
}
