import type {RegisteredRateAnalysis} from '@/calculators/final-framework/registered-rate-analysis';
import type {PlanTier,PresentationDefinition} from '@/calculators/final-framework/types';
import {resolveAnalysisSurface} from '@/calculators/final-framework/analysis-surface-policy';
import {displayFinalValue} from '@/calculators/final-framework/renderer-display';
export function UnavailableRateAnalysis({analysis,plan,presentation}:{analysis:RegisteredRateAnalysis|null;plan:PlanTier;presentation:PresentationDefinition}){
 const enabled=(['scenarios','sensitivity'] as const).some(surface=>resolveAnalysisSurface(plan,presentation,surface)?.canExecute);
 if(!enabled)return null;
 if(!analysis)return <p role="alert">Optional rate analysis is unavailable for these inputs. The core calculation is unchanged.</p>;
 const unavailable=analysis.unavailable.filter(request=>resolveAnalysisSurface(plan,presentation,request.surface)?.canExecute);
 if(!unavailable.length)return null;
 return <div className="result-warning" role="alert"><p>Some optional rate comparisons are unavailable. Valid comparisons and the core calculation remain available.</p><ul>{unavailable.map((request,index)=><li key={index}>{request.surface==='scenarios'?'Scenario':'Sensitivity'} — {request.label}: {displayFinalValue(request.rate,request.unit)}. {request.reason}</li>)}</ul></div>;
}
