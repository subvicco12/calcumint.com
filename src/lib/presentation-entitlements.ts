import type {FinalPlan} from '@/calculators/final-framework/product-capabilities';
/** Preserve the offered ddca214 table boundary; a scalar table is not a schedule. */
export const PRESENTATION_CAPABILITIES=Object.freeze({
 inputOutputReconciliation:Object.freeze({free:false,pro:true,business:true}),
});
export function allowsPresentationCapability(plan:FinalPlan,capability:keyof typeof PRESENTATION_CAPABILITIES):boolean{
 return PRESENTATION_CAPABILITIES[capability]?.[plan]===true;
}
