import { z } from 'zod';
import type { CalculatorDefinition } from '../types';
import { weightedMeanCalculator } from '../statistics/catalog-batch-4';

/** Native score units. Bands are lower-inclusive, upper-exclusive; the last includes maxScore. */
export type GradeInput = {
  assessments: { score: number | null; weight?: number }[];
  mode: 'weighted' | 'unweighted';
  missingPolicy: 'reject' | 'exclude';
  scale: { minScore: number; maxScore: number; bands?: { minScore: number; label: string }[] };
};
export type GradeOutput = { average: number; label: string | null; totalWeight: number; usedCount: number; excludedCount: number; zeroWeightCount: number; steps: string[] };
const finite = z.number().finite();
const inputSchema: z.ZodType<GradeInput> = z.object({
  assessments: z.array(z.object({ score: finite.nullable(), weight: finite.nonnegative().optional() }).strict()).min(1).max(10000),
  mode: z.enum(['weighted','unweighted']), missingPolicy: z.enum(['reject','exclude']),
  scale: z.object({minScore:finite,maxScore:finite,bands:z.array(z.object({minScore:finite,label:z.string().trim().min(1)}).strict()).min(1).max(1000).optional()}).strict(),
}).strict().superRefine((i,ctx)=>{
  const fail=(message:string)=>ctx.addIssue({code:'custom',message});
  if(i.scale.minScore>=i.scale.maxScore)fail('Scale minimum must be below maximum');
  const bands=i.scale.bands;
  if(bands){
    if(bands[0].minScore!==i.scale.minScore)fail('First band must start at scale minimum');
    if(new Set(bands.map(b=>b.label)).size!==bands.length)fail('Band labels must be unique');
    bands.forEach((b,n)=>{if(b.minScore<i.scale.minScore||b.minScore>i.scale.maxScore||(n>0&&b.minScore<=bands[n-1].minScore))fail('Band lower boundaries must increase within scale');});
  }
  let used=0;
  for(const a of i.assessments){
    if(i.mode==='weighted'&&a.weight===undefined)fail('Weighted mode requires every weight');
    if(i.mode==='unweighted'&&a.weight!==undefined)fail('Unweighted mode does not accept weights');
    if(a.score===null){if(i.missingPolicy==='reject')fail('Missing assessment rejected');continue;}
    if(a.score<i.scale.minScore||a.score>i.scale.maxScore)fail('Score outside supplied scale');
    if(i.mode==='unweighted'||(a.weight??0)>0)used++;
  }
  if(!used)fail('At least one nonmissing positive-weight assessment is required');
});
export const weightedGradeCalculator: CalculatorDefinition<GradeInput,GradeOutput> = {
  id:'education.weighted-grade',slug:'grade-calculator',title:'Grade Calculator',category:'education',version:1,riskClass:'standard',reviewStatus:'draft',inputSchema,
  calculate(raw,context){
    const i=inputSchema.parse(raw);
    const used=i.assessments.filter(a=>a.score!==null&&(i.mode==='unweighted'||a.weight! > 0));
    for(const a of used){
      const weight=i.mode==='unweighted'?1:a.weight!;
      if(a.score!==0&&weight>0&&a.score!*weight===0)throw new Error('Grade contribution is outside the supported numeric range (underflow)');
    }
    const result=weightedMeanCalculator.calculate({values:used.map(a=>a.score!),weights:used.map(a=>i.mode==='unweighted'?1:a.weight!)},context);
    const average=result.weightedMean;
    if(!Number.isFinite(average)||!Number.isFinite(result.totalWeight))throw new Error('Grade arithmetic overflow');
    if(average<i.scale.minScore||average>i.scale.maxScore)throw new Error('Grade arithmetic result is outside the supplied score scale');
    const band=i.scale.bands?.filter(b=>average>=b.minScore).at(-1);
    return {average,label:band?.label??null,totalWeight:result.totalWeight,usedCount:used.length,excludedCount:i.assessments.filter(a=>a.score===null).length,zeroWeightCount:i.assessments.filter(a=>a.score!==null&&i.mode==='weighted'&&a.weight===0).length,
      steps:[...result.steps,'Missing scores follow the explicit policy; zero weights do not contribute.','Bands include their lower boundary; the last band includes the scale maximum.']};
  },
  formulas:[{id:'weighted-grade',expression:'average = Σ(score × weight) / Σweight',description:'Unweighted mode uses weight 1. Uses the existing weighted mean engine; no curve, rounding or institutional thresholds.'}],
  sources:[{label:'Explicit caller-supplied score scale and deterministic weighted mean arithmetic',note:'DRAFT, unregistered; no institutional grading policy inferred.'}],examples:[],goldenTests:[{label:'Exact rational 860/10',input:{assessments:[{score:80,weight:4},{score:90,weight:6}],mode:'weighted',missingPolicy:'reject',scale:{minScore:0,maxScore:100}},expected:{average:86,totalWeight:10,usedCount:2,label:null}}],
};
