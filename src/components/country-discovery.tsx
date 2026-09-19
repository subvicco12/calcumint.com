import Link from "next/link";
import { listCertifiedCountryPriorities } from "@/calculators/country-discovery";
import { listWaveOneCountries,type CountryCode } from "@/calculators/country-intelligence";
export function CountryDiscovery(){
 return <section className="section"><div className="section-heading"><div><span className="eyebrow">Country-aware discovery</span><h2>Explore calculators for your country.</h2><p className="muted-copy">Choose your country explicitly. CalcuMint suggests relevant certified tools without requiring precise location.</p></div></div><div className="category-grid">{listWaveOneCountries().map(country=>{const items=listCertifiedCountryPriorities(country.code as CountryCode);return <article className="card category-discovery-card" key={country.code}><span className="category-count">{country.currency} · {country.unitSystem}</span><h3>{country.name}</h3>{items.length?<div>{items.slice(0,4).map(item=><p key={item.slug}><Link className="text-link" href={item.href}>{item.title} →</Link></p>)}</div>:<p className="muted-copy">Country-specific certified tools are being prepared. Global certified calculators remain available.</p>}</article>})}</div></section>;
}
