import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {buildImplementationReconciliation} from '../src/calculators/implementation-reconciliation';
const destination=process.argv[2];if(!destination)throw Error('Explicit offline output directory required');
const report=buildImplementationReconciliation();
const files={
 'implementation-manifest.json':JSON.stringify(report,null,2)+'\n',
 'discovery.json':JSON.stringify({schemaVersion:1,releaseHold:true,summary:report.summary,rows:report.rows.map(r=>({masterId:r.masterId,title:r.title,domain:r.domain,implementationClass:r.implementationClass,canonicalMappingApproved:false,currentPublicPublication:r.lifecycle.currentPublicPublication,nextAction:r.nextAction,privateIds:r.privateImplementations.map(d=>d.id??`${d.slug}@${d.version}`)}))},null,2)+'\n',
 'implementation-manifest.csv':[['masterId','title','domain','implementationClass','canonicalMappingApproved','currentPublicPublication','protectedCertification','nextAction'],...report.rows.map(r=>[r.masterId,r.title,r.domain,r.implementationClass,false,'UNKNOWN','UNKNOWN',r.nextAction])].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n',
};
if(process.argv.includes('--check')){for(const [name,content] of Object.entries(files))if(readFileSync(destination+'/'+name,'utf8')!==content)throw Error('Stale reconciliation '+name);}else{mkdirSync(destination,{recursive:true});for(const [name,content] of Object.entries(files))writeFileSync(destination+'/'+name,content);}
console.log(JSON.stringify(report.summary,null,2));
