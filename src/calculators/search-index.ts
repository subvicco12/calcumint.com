import { calculatorRegistry } from "./registry";
import { listGovernedPublicCalculators } from "./public-content";
import { rankCalculatorSearchItems } from "./search-ranking";

export type CalculatorSearchItem={slug:string;title:string;category:string;href:string;description:string;keywords:readonly string[]};
export function buildPublicCalculatorSearchIndex(publishedSlugs:ReadonlySet<string>):readonly CalculatorSearchItem[]{
 const items=listGovernedPublicCalculators(publishedSlugs);
 return items.flatMap(item=>{const definition=calculatorRegistry.getBySlug(item.slug);return definition?[{slug:item.slug,title:definition.title,category:item.category,href:`/calculators/${item.category}/${item.slug}`,description:item.shortDescription,keywords:item.keywords}]:[]}).sort((a,b)=>a.title.localeCompare(b.title));
}
export function findPublicCalculatorCandidates(query:string,publishedSlugs:ReadonlySet<string>,limit=8):readonly CalculatorSearchItem[]{
 return rankCalculatorSearchItems(buildPublicCalculatorSearchIndex(publishedSlugs),query,limit);
}
