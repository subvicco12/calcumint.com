import {z} from "zod";
import {forceCalculator} from "../physics/catalog-batch-1";
import type {CalculatorDefinition} from "../types";
/** Immutable draft reference model, not a measured landing-site or apparent-gravity dataset. */
export const GRAVITY_REFERENCE_VERSION="nasa-jeod-b2f8a391-spherical-v1" as const;
const sourceCommit="b2f8a3913424b7a4ea2e59c604dda008c9dea6ed";
const reference=(name:string,mu:number,radius:number)=>Object.freeze({name,muM3PerS2:mu,referenceRadiusM:radius,gravity:mu/(radius*radius),sourceUrl:`https://github.com/nasa/jeod/blob/${sourceCommit}/models/environment/gravity/data/src/${name.toLowerCase()}_spherical.cc`});
export const planetaryGravityReferences=Object.freeze({
 earth:reference("Earth",398600441500000,6378136.3),
 mars:reference("Mars",42828375214000,3396000),
 jupiter:reference("Jupiter",126731229000000000,71492000),
 moon:reference("Moon",4902801076000,1738000),
 "standard-earth":Object.freeze({name:"Standard Earth gravity convention",gravity:9.80665,sourceUrl:"https://www.bipm.org/en/committees/cg/cgpm/3-1901/resolution-2"})
});
const inputSchema=z.object({bodyMass:z.number().finite().nonnegative(),massUnit:z.enum(["kg","lb"]),body:z.enum(["earth","mars","jupiter","moon","standard-earth"]),referenceVersion:z.literal(GRAVITY_REFERENCE_VERSION)}).strict();
export type PlanetaryWeightInput=z.infer<typeof inputSchema>;
export type PlanetaryWeightOutput={bodyMassKg:number;referenceGravityMps2:number;weightNewtons:number;earthEquivalentKg:number;referenceVersion:string;referenceBody:string;steps:string[]};
export const planetaryWeightCalculator:CalculatorDefinition<PlanetaryWeightInput,PlanetaryWeightOutput>={
 id:"astronomy.planetary-weight",slug:"planetary-weight-calculator",title:"Planetary Weight Calculator",category:"science",version:1,riskClass:"standard",reviewStatus:"draft",inputSchema,
 calculate(raw,context){
  const i=inputSchema.parse(raw),r=planetaryGravityReferences[i.body];
  const bodyMassKg=(i.bodyMass===0?0:i.bodyMass)*(i.massUnit==="kg"?1:0.45359237);
  if(!Number.isFinite(bodyMassKg)||(i.bodyMass>0&&bodyMassKg===0))throw new Error("Mass outside supported numeric range");
  const weightNewtons=forceCalculator.calculate({mass:bodyMassKg,acceleration:r.gravity},context).value;
  const earthEquivalentKg=weightNewtons/9.80665;
  if(!Number.isFinite(weightNewtons)||!Number.isFinite(earthEquivalentKg)||(bodyMassKg>0&&(weightNewtons===0||earthEquivalentKg===0)))throw new Error("Weight outside supported numeric range");
  return {bodyMassKg,referenceGravityMps2:r.gravity,weightNewtons,earthEquivalentKg,referenceVersion:i.referenceVersion,referenceBody:r.name,steps:["Physical mass is unchanged. Force uses the existing F=m*a engine.",i.body==="standard-earth"?"Conventional standard gravity, not measured Earth site gravity.":"Spherical reference gravity = NASA JEOD model GM/R² at its source radius; excludes rotation, oblateness and site variation. The source models include far-field limitations; this is not measured surface/apparent gravity.","Earth-equivalent indicated mass = reference force / 9.80665 m/s²; not a change in physical mass."]};
 },
 formulas:[{id:"reference-force",expression:"g_reference=GM/R²; F=m*g_reference; Earth-equivalent indicated kg=F/9.80665",description:"Versioned spherical reference-model comparison only, not a physical landing-site prediction. Standard gravity is a separate explicit convention."}],
 sources:[...Object.values(planetaryGravityReferences).map(r=>({label:r.name+" reference",url:r.sourceUrl})),{label:"International pound conversion",url:"https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors",note:"1 lb = 0.45359237 kg exactly; binary64 computation with raw unrounded outputs."}],
 examples:[],goldenTests:[{label:"Standard gravity convention",input:{bodyMass:1,massUnit:"kg",body:"standard-earth",referenceVersion:GRAVITY_REFERENCE_VERSION},expected:{bodyMassKg:1,weightNewtons:9.80665,earthEquivalentKg:1}}],ui:{simpleInputKeys:["bodyMass","massUnit","body","referenceVersion"]}
};
