/** Target-specific readiness excludes directory forms and intermediate client navigation. */
export function ownerPreviewReadyScript(model){
 const pathname='/account/calculators/'+model.slug;
 return `location.pathname===${JSON.stringify(pathname)} && [...document.querySelectorAll('h1')].some(h=>h.textContent.trim()===${JSON.stringify(model.title)}) && [...document.querySelectorAll('section[aria-label="Engine contract preview"] button[type="submit"]')].some(b=>b.textContent.trim()==='Calculate preview')`;
}
