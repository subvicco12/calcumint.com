import { calculatorRegistry } from "./registry";
import { getPublicCalculatorContent } from "./public-content";
import { getCountryProfile,type CountryCode } from "./country-intelligence";
export type CountryPriorityItem={slug:string;title:string;category:string;href:string};
export function listCertifiedCountryPriorities(country:CountryCode):readonly CountryPriorityItem[]{
 const profile=getCountryProfile(country);if(!profile)return [];
 return profile.priorityCalculatorSlugs.flatMap(slug=>{const definition=calculatorRegistry.getBySlug(slug);const content=getPublicCalculatorContent(slug);return definition&&content?[{slug,title:definition.title,category:content.category,href:`/calculators/${content.category}/${slug}`}]:[]});
}
