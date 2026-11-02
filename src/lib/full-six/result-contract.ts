import {z} from 'zod';
import Decimal from 'decimal.js';
import {copyCalculationData} from '@/lib/calculation-snapshot';

/** Experimental artifact protocol, not a registered engine revision or approval. */
export const fullSixProtocol='full-six-artifact-1' as const;
const hash=z.string().regex(/^[a-f0-9]{64}$/);
const ArtifactDecimal=Decimal.clone({precision:1000,minE:-1000,maxE:1000});
const decimal=z.string().max(4096).regex(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/).refine(text=>{
 try{const n=new ArtifactDecimal(text);return n.isFinite()&&!(n.isZero()&&/[1-9]/.test(text.split(/[eE]/)[0]));}catch{return false;}
},'Finite artifact decimal within explicit +/-1000 adjusted-exponent envelope required');
const id=z.string().min(1).max(200);
const scalar=z.object({raw:decimal,unit:z.string().max(80),label:z.string().min(1).max(200)}).strict();
const finite=z.object({status:z.literal('finite'),values:z.record(id,scalar).refine(v=>Object.keys(v).length>0&&Object.keys(v).length<=100),warnings:z.array(z.string().max(2000)).max(100)}).strict();
const classification=z.object({status:z.enum(['vertical-line','degenerate','underdetermined','no-solution','domain-error','precision-unavailable','budget-exhausted','cancelled']),message:z.string().min(1).max(2000)}).strict();
export const fullSixArtifactSchema=z.object({
 protocol:z.literal(fullSixProtocol),scope:z.literal('PRIVATE_EXPERIMENTAL'),
 catalogId:z.union([z.literal(235),z.literal(251),z.literal(275),z.literal(276),z.literal(282),z.literal(283)]),
 engineId:id,baselineVersion:z.number().int().positive().safe(),implementationRevision:id,
 contractSHA256:hash,
 inputs:z.record(id,z.string().max(4096)).refine(v=>Object.keys(v).length<=10000),
 modes:z.record(id,z.string().max(200)).refine(v=>Object.keys(v).length<=100),
 sources:z.array(z.object({sourceId:id,contentSHA256:hash,clause:z.string().min(1).max(2000)}).strict()).min(1).max(100),
 numericPolicy:z.object({revision:id,precisionDigits:z.number().int().min(1).max(1000),rounding:z.literal('half-even')}).strict(),
 outcome:z.discriminatedUnion('status',[finite,classification]),
}).strict().superRefine((v,ctx)=>{
 const expected:Record<number,[string,number]>={235:['advanced-math.graphing',1],251:['advanced-math.function-plotter-2d',1],275:['geometry.volume',1],276:['geometry.slope',2],282:['statistics.standard-deviation',1],283:['statistics.variance',1]};
 const [engine,version]=expected[v.catalogId];
 if(v.engineId!==engine||v.baselineVersion!==version)ctx.addIssue({code:'custom',message:'Catalog/baseline identity mismatch'});
});
export type FullSixArtifact=z.infer<typeof fullSixArtifactSchema>;
export function immutableFullSixArtifact(value:unknown):FullSixArtifact{
 // Reuse the existing descriptor-safe plain JSON copier; getters/prototypes are not data.
 const copied=copyCalculationData({candidate:value},{}).input.candidate;
 const parsed=fullSixArtifactSchema.parse(copied);
 return copyCalculationData({candidate:parsed},{}).input.candidate as FullSixArtifact;
}
