import{calculatorRegistry}from"./registry";import{runCalculator}from"./engine";import{getPublicCalculatorContent,type PublicCalculatorContent}from"./public-content";
export type LaunchCertificationIssue={slug:string;reason:string};
type RegistryCalculator=ReturnType<typeof calculatorRegistry.list>[number];
export type PublicContentLookup=(slug:string)=>PublicCalculatorContent|undefined;
const ABS=1e-10,REL=1e-9;
export function goldenMismatch(actual:unknown,expected:unknown,path="output"):string|null{
 if(typeof expected==="number"){if(typeof actual!=="number"||!Number.isFinite(actual)||!Number.isFinite(expected))return `${path}: expected finite number`;const tolerance=Math.max(ABS,REL*Math.max(1,Math.abs(expected)));return Math.abs(actual-expected)<=tolerance?null:`${path}: expected ${expected}, received ${actual}`;}
 if(Array.isArray(expected)){if(!Array.isArray(actual))return `${path}: expected array`;if(actual.length!==expected.length)return `${path}: expected array length ${expected.length}, received ${actual.length}`;for(let i=0;i<expected.length;i++){const issue=goldenMismatch(actual[i],expected[i],`${path}[${i}]`);if(issue)return issue}return null}
 if(expected&&typeof expected==="object"&&!Array.isArray(expected)&&actual&&typeof actual==="object"){
  const e=expected as Record<string,unknown>,a=actual as Record<string,unknown>;
  if(Array.isArray(actual)){const allowed=new Set(["length","items"]);for(const key of Object.keys(e))if(!allowed.has(key))return `${path}: invalid array expectation key ${key}`;const itemEntries=e.items&&typeof e.items==="object"?Object.entries(e.items as Record<string,unknown>):[];if(e.length===undefined&&itemEntries.length===0)return `${path}: array expectation must declare length or at least one indexed item`;if(e.length!==undefined&&actual.length!==e.length)return `${path}: expected array length ${e.length}, received ${actual.length}`;if(itemEntries.length){for(const [key,value] of itemEntries){const i=Number(key);if(!Number.isInteger(i)||i<0||i>=actual.length)return `${path}: invalid expected array index ${key}`;const issue=goldenMismatch(actual[i],value,`${path}[${i}]`);if(issue)return issue}}return null}
  if(Array.isArray(actual))return `${path}: expected object`;for(const [key,value] of Object.entries(e)){if(!(key in a))return `${path}: missing key ${key}`;const issue=goldenMismatch(a[key],value,`${path}.${key}`);if(issue)return issue}return null;
 }
 return Object.is(actual,expected)?null:`${path}: expected ${String(expected)}, received ${String(actual)}`;
}
const blank=(value:unknown)=>typeof value!=="string"||value.trim().length===0;\nconst usableSource=(source:{label:string;url?:string})=>{if(blank(source.label))return false;if(!source.url)return true;try{new URL(source.url);return true}catch{return false}};
export function auditLaunchCertificationDefinitions(definitions:readonly RegistryCalculator[],getContent:PublicContentLookup,now=new Date()):LaunchCertificationIssue[]{
 const issues:LaunchCertificationIssue[]=[];
 for(const d of definitions){if(d.reviewStatus!=="certified")continue;
  const slug=blank(d.slug)?"<missing-slug>":d.slug;
  if(blank(d.id))issues.push({slug,reason:"missing calculator id"});
  if(blank(d.slug))issues.push({slug,reason:"missing calculator slug"});
  if(blank(d.title))issues.push({slug,reason:"missing calculator title"});
  if(blank(d.category))issues.push({slug,reason:"missing calculator category"});
  if(!Number.isInteger(d.version)||d.version<1)issues.push({slug,reason:"invalid version"});
  const fixtures=d.goldenTests?.length?d.goldenTests:d.examples;
  if(!fixtures?.length)issues.push({slug,reason:"missing certification fixtures"});else for(const fixture of fixtures){try{const actual=runCalculator(d,fixture.input).output;const mismatch=goldenMismatch(actual,fixture.expected);if(mismatch)issues.push({slug,reason:`golden fixture "${fixture.label}" mismatch: ${mismatch}`})}catch(error){issues.push({slug,reason:`golden fixture "${fixture.label}" failed: ${error instanceof Error?error.message:String(error)}`})}}
  if(!d.formulas?.length)issues.push({slug,reason:"missing formulas"});
  if(!d.sources?.length)issues.push({slug,reason:"missing sources"});else if(d.sources.some(source=>!usableSource(source)))issues.push({slug,reason:"invalid source"});
  const publicContent=blank(d.slug)?undefined:getContent(d.slug);
  if(!publicContent)issues.push({slug,reason:"missing public content"});else{
   if(publicContent.slug!==d.slug)issues.push({slug,reason:"public content slug mismatch"});
   if(publicContent.category!==d.category)issues.push({slug,reason:"public content category mismatch"});
   if(blank(publicContent.intro))issues.push({slug,reason:"missing editorial intro"});
   if(blank(publicContent.formulaExplanation))issues.push({slug,reason:"missing editorial formula explanation"});
   if(!publicContent.assumptions?.some(item=>!blank(item)))issues.push({slug,reason:"missing editorial assumptions"});
  }
  if(d.lastVerifiedAt){const t=Date.parse(d.lastVerifiedAt);if(!Number.isFinite(t)||t>now.getTime())issues.push({slug,reason:"invalid verification date"});}
  if(["financial","tax","health"].includes(String(d.riskClass))){const sources=d.officialSources?.length?d.officialSources:d.sources;if(!sources?.length)issues.push({slug,reason:"regulated calculator missing official sources"});}
 }
 return issues;
}
export function auditLaunchCertification(now=new Date()):LaunchCertificationIssue[]{return auditLaunchCertificationDefinitions(calculatorRegistry.list(),getPublicCalculatorContent,now);}
export function assertLaunchCertification(now=new Date()):void{const issues=auditLaunchCertification(now);if(issues.length)throw new Error(`Launch certification failed: ${issues.map(i=>`${i.slug}: ${i.reason}`).join("; ")}`);}
