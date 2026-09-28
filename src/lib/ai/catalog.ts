import { buildPublicCalculatorSearchIndex,findPublicCalculatorCandidates } from "../../calculators/search-index";

export type CalculatorSuggestion={slug:string;category:string;description:string;url:string;score:number};

export function deterministicCalculatorSearch(query:string,publishedSlugs:ReadonlySet<string>,limit=5):CalculatorSuggestion[]{
 if(!Number.isInteger(limit)||limit<1||limit>10)return [];
 return findPublicCalculatorCandidates(query,publishedSlugs,limit).map((item,index)=>({slug:item.slug,category:item.category,description:item.description,url:item.href,score:Math.max(1,limit-index)}));
}

export function publicCalculatorCatalog(publishedSlugs:ReadonlySet<string>){
 return buildPublicCalculatorSearchIndex(publishedSlugs).map(item=>({slug:item.slug,category:item.category,description:item.description,keywords:[...item.keywords],url:item.href}));
}
