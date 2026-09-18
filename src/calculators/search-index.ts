import { calculatorRegistry } from "./registry";
import { listPublicCalculators } from "./public-content";

export type CalculatorSearchItem={slug:string;title:string;category:string;href:string;description:string;keywords:readonly string[]};
export function buildPublicCalculatorSearchIndex():readonly CalculatorSearchItem[]{
 return listPublicCalculators().flatMap(item=>{const definition=calculatorRegistry.getBySlug(item.slug);return definition?[{slug:item.slug,title:definition.title,category:item.category,href:`/calculators/${item.category}/${item.slug}`,description:item.shortDescription,keywords:item.keywords}]:[]}).sort((a,b)=>a.title.localeCompare(b.title));
}
function tokens(value:string){return value.toLocaleLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>1)}
export function findPublicCalculatorCandidates(query:string,limit=8):readonly CalculatorSearchItem[]{
 if(!Number.isInteger(limit)||limit<1)return [];
 const q=tokens(query);if(q.length===0)return [];
 return buildPublicCalculatorSearchIndex().map(item=>{const title=tokens(item.title),keywords=tokens(item.keywords.join(" ")),description=tokens(item.description);let score=0;for(const token of q){if(title.includes(token))score+=5;if(keywords.includes(token))score+=3;if(description.includes(token))score+=1}return{item,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title)).slice(0,limit).map(x=>x.item);
}
