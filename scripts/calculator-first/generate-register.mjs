// Reproducible offline join: never invokes a database, release or mutation API.
import {createServer} from 'vite';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {tmpdir} from 'node:os';
const directory='docs/calculator-first/';
const read=async file=>JSON.parse(await readFile(file,'utf8'));
const cacheDir=await mkdtemp(path.join(tmpdir(),'calcumint-wave-'));
const server=await createServer({configFile:false,envFile:false,root:process.cwd(),cacheDir,resolve:{alias:{'@':path.join(process.cwd(),'src')}},server:{watch:null}});
try{
 const {buildCalculatorFirstReadiness}=await server.ssrLoadModule('/src/lib/calculator-first-readiness.ts');
 const files={catalog:directory+'authority-catalog.json',ledger:'docs/canonical-acceptance/canonical-ledger.json',requirements:'docs/full-product-batch16/requirements-540.json',registry:directory+'registry-snapshot.json',hosted:directory+'hosted-rows.json',routes:directory+'browser-route-observations.json',unpublishedRoutes:directory+'unpublished-route-observations.json'};
 const data=Object.fromEntries(await Promise.all(Object.entries(files).map(async([key,file])=>[key,await read(file)])));
 const report=buildCalculatorFirstReadiness({catalog:data.catalog.rows.map(r=>({masterId:r.ID,title:r.Calculator})),ledger:data.ledger.rows,requirements:data.requirements.rows,registry:data.registry.rows,hosted:data.hosted.rows,routes:[...data.routes.rows,...data.unpublishedRoutes.rows],hostedComplete:true});
 const calculusPath='docs/p0-decision-contracts/calculus.json',authorizationPath='docs/owner-p0/authorization.json';
 const calculus=await read(calculusPath);
 for(const row of report.rows){
  row.privateCandidates=row.privateCandidates.map((candidate,index)=>({engineId:candidate.id??null,slug:candidate.slug,version:candidate.version,family:candidate.family,meaning:'Historical immutable candidate metadata; not a canonical/public dispatch approval',evidencePointer:`docs/canonical-acceptance/canonical-ledger.json#/rows/${row.masterId-1}/observedContracts/privateCandidates/${index}`}));
  const target=calculus.contracts.find(c=>c.catalogId===row.masterId);
  if(target)row.proposedReviewTarget={...target.reviewTarget,engineeringAuthorization:authorizationPath,fullDomainAndCanonicalDecision:'PENDING',canonicalRoutingAuthorized:false,evidencePointer:calculusPath+'#/contracts/'+calculus.contracts.indexOf(target)};
 }
 report.additionalEvidenceHashes=Object.fromEntries(await Promise.all([calculusPath,authorizationPath].map(async file=>[file,createHash('sha256').update(await readFile(file)).digest('hex')])));
 const ids=new Set(report.rows.map(r=>r.masterId));if(ids.size!==540||[...ids].some(i=>i<1||i>540))throw Error('540 identities required');
 if(report.summary.authorityBlocked!==43)throw Error('43 authority blocks must remain');
 report.sourceHashes=Object.fromEntries(await Promise.all(Object.values(files).map(async file=>[file,createHash('sha256').update(await readFile(file)).digest('hex')])));
 report.softwareHashes=Object.fromEntries(await Promise.all(['src/lib/calculator-first-readiness.ts','scripts/calculator-first/generate-register.mjs','scripts/calculator-first/snapshot-registry.mjs'].map(async file=>[file,createHash('sha256').update(await readFile(file)).digest('hex')])));
 report.observedRouteCounts={publishedHTTP200:data.routes.rows.filter(r=>r.status===200).length,unpublishedHTTP404:data.unpublishedRoutes.rows.filter(r=>r.status===404).length,unknownPublishedRoutes:data.routes.rows.filter(r=>r.status===null).length};
 const hostedOnly=new Set(data.hosted.rows.map(r=>r.slug));
 report.observedLifecycleCounts=data.hosted.rows.reduce((a,r)=>{a[r.lifecycle]=(a[r.lifecycle]??0)+1;return a;},{});
 report.localCertifiedAbsentHosted=data.registry.rows.filter(r=>r.reviewStatus==='certified'&&!hostedOnly.has(r.slug));
 report.countMeaning={livePublicEngines:'209 independent engine/version/URL observations, not all540 canonical contracts',liveCatalogBindings:'One publicly observed exact titled legacy candidate, matching hosted identity/version and URL. Other unpublished alternatives may remain (#377/#510); no canonical target is selected. Multiple live alternatives or shared engine across native IDs remain UNKNOWN; canonical linkage is unapproved',drafts:'No hosted draft rows; original14 private DRAFTs are separate unchanged artifacts',unpublished:'Absence from complete hosted snapshot, not an inferred draft',unknown:'Unbound/ambiguous or unobserved URL; family support does not establish a route'};
 const bytes=JSON.stringify(report,null,2)+'\n',target=directory+'publication-readiness-540.json';
 if(process.argv.includes('--check')){if(await readFile(target,'utf8')!==bytes)throw Error('Publication evidence differs; regenerate and review');}else await writeFile(target,bytes);
 const columns=['masterId','title','disposition','canonicalAccepted','canonicalMappingApproved','engineVersionUrlBindings'];
 const csv=value=>'"'+String(value).replaceAll('"','""')+'"';
 if(!process.argv.includes('--check'))await writeFile(directory+'publication-readiness-540.csv',columns.join(',')+'\n'+report.rows.map(r=>columns.map(k=>csv(k==='engineVersionUrlBindings'?JSON.stringify(r.candidates.map(c=>({engineId:c.engineId,version:c.version,url:c.proposedUrl,lifecycle:c.lifecycle,liveVerified:c.liveVerified}))):r[k])).join(',')).join('\n')+'\n');
 console.log(JSON.stringify(report.summary));
}finally{await server.close();await rm(cacheDir,{recursive:true,force:true});}
