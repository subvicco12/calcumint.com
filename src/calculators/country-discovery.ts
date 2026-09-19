import { calculatorRegistry } from "./registry";
import { getPublicCalculatorContent } from "./public-content";
import { getCountryProfile,type CountryCode } from "./country-intelligence";
export type CountryPriorityItem={slug:string;title:string;category:string;href:string};
export type CountryDiscoveryProfile={country:CountryCode;name:string;currency:string;locale:string;unitSystem:string;items:readonly CountryPriorityItem[]};
export function listCertifiedCountryPriorities(country:CountryCode):readonly CountryPriorityItem[]{
 const profile=getCountryProfile(country);if(!profile)return [];
 return profile.priorityCalculatorSlugs.flatMap(slug=>{const definition=calculatorRegistry.getBySlug(slug);const content=getPublicCalculatorContent(slug);return definition&&content?[{slug,title:definition.title,category:content.category,href:`/calculators/${content.category}/${slug}`}]:[]});
}

export function getCountryDiscoveryProfile(country:CountryCode):CountryDiscoveryProfile|undefined{const profile=getCountryProfile(country);if(!profile)return undefined;return{country,name:profile.name,currency:profile.currency,locale:profile.locale,unitSystem:profile.unitSystem,items:listCertifiedCountryPriorities(country)}}
