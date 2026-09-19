import{listPublicCalculators}from"./public-content";export function sitemapEntriesForAudit():string[]{return listPublicCalculators().map(item=>`/calculators/${item.category}/${item.slug}`)}
