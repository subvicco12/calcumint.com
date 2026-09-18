import { buildPublicCalculatorSearchIndex,findPublicCalculatorCandidates } from "../../calculators/search-index";

export type CalculatorSuggestion={slug:string;category:string;description:string;url:string;score:number};

export function deterministicCalculatorSearch(query:string,limit=5):CalculatorSuggestion[]{
 return findPublicCalculatorCandidates(query,Math.max(1,Math.min(limit,10))).map((item,index)=>({slug:item.slug,category:item.category,description:item.description,url:item.href,score:Math.max(1,limit-index)}));
}

export function publicCalculatorCatalog(){
 return buildPublicCalculatorSearchIndex().map(item=>({slug:item.slug,category:item.category,description:item.description,keywords:[...item.keywords],url:item.href}));
}
