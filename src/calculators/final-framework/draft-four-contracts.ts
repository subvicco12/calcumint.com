import {scientificDraftCalculator} from "../core/draft-master-206";
import {weightedGradeCalculator} from "../travel/draft-master-517";
import {sleepDurationCalculator} from "../travel/draft-master-518";
import {planetaryWeightCalculator} from "../astronomy/draft-master-531";
import {createCalculationSnapshot} from "@/lib/calculation-snapshot";
import type {CalculatorDefinition,CalculatorContext} from "../types";
import type {StructuredCalculationResult,ResultMetric,PresentationDefinition} from "./types";
export const draftFourPresentation={id:"draft.four-owner-contracts",domain:"math",family:"simple-scalar",level:"essential",supportedVisualizations:[],supportsSchedule:false,supportsGoalSolver:false,supportsScenarios:false,supportsSensitivity:false}as const satisfies PresentationDefinition;
function capture<I extends Record<string,unknown>,O extends Record<string,unknown>>(d:CalculatorDefinition<I,O>,raw:unknown,context:CalculatorContext,present:(o:O,i:I)=>{primaryResult:ResultMetric;metrics?:ResultMetric[];warnings?:string[]}){
 const input=d.inputSchema.parse(raw),output=d.calculate(input,context),surface=present(output,input);
 const snapshot=createCalculationSnapshot({calculatorSlug:d.slug,calculatorVersion:d.version,input:{...input},output:{...output}});
 const result:StructuredCalculationResult={...surface,methodology:d.formulas.map(f=>f.description+" "+f.expression).join(" "),sources:d.sources,warnings:["DRAFT — unregistered, uncertified, unpublished. Not authorized for release.",`Technical version ${d.version}. Snapshots and exports preserve raw engine precision.`,...(surface.warnings??[])]};return{snapshot,result};
}
export function calculateDraftFour(id:206|517|518|531,input:unknown,context:CalculatorContext={}){
 switch(id){
  case 206:return capture(scientificDraftCalculator,input,context,(o,i)=>({primaryResult:{id:"result",label:"Scientific result",value:o.result,...(["asin","acos","atan"].includes(i.operation)?{unit:i.angleMode}: {})}}));
  case 517:return capture(weightedGradeCalculator,input,context,(o)=>({primaryResult:{id:"average",label:"Numeric grade average",value:o.average,unit:"supplied score units"},metrics:[{id:"grade-label",label:"Caller-configured grade label",value:o.label??"No label scale supplied"},{id:"weight",label:"Total contributing weight",value:o.totalWeight},{id:"used",label:"Contributing assessments",value:o.usedCount},{id:"excluded",label:"Excluded missing assessments",value:o.excludedCount}],warnings:["No institution policy is inferred; supplied label bands and missing-value policy are explicit."]}));
  case 518:return capture(sleepDurationCalculator,input,context,o=>({primaryResult:{id:"sleep",label:"Elapsed interval minus supplied awake time",value:o.estimatedSleepMinutes,unit:"minutes"},metrics:[{id:"elapsed",label:"Elapsed UTC instant duration",value:o.elapsedMinutes,unit:"minutes"},{id:"awake",label:"Supplied awake time",value:o.awakeMinutes,unit:"minutes"}],warnings:["Explicit-offset minute timestamps only; offsetless or named local times are rejected. No medical or sleep-quality interpretation."]}));
  case 531:return capture(planetaryWeightCalculator,input,context,o=>({primaryResult:{id:"weight",label:"Reference-model weight force",value:o.weightNewtons,unit:"N"},metrics:[{id:"mass",label:"Unchanged physical mass",value:o.bodyMassKg,unit:"kg"},{id:"gravity",label:"Reference gravitational acceleration",value:o.referenceGravityMps2,unit:"m/s²"},{id:"equivalent",label:"Earth-equivalent indicated mass",value:o.earthEquivalentKg,unit:"kg equivalent"},{id:"reference",label:"Gravity reference version",value:o.referenceVersion},{id:"body",label:"Reference body/convention",value:o.referenceBody}],warnings:["NASA JEOD spherical GM/R² reference model; excludes rotation, oblateness and local site variation. Source far-field limitations apply; not measured surface/apparent gravity. Standard Earth gravity is a separate convention."]}));
  default:throw new Error("Unsupported authorized draft identity");
 }
}
