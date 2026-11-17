import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeTargetShape} from '../adoption1528/initializer.mjs';
import {snapshot,prepareApply,prepareRollback,bindExpectedPostimage} from '../adoption1528/bundle.mjs';
import {packageSnapshot,packageApply,packageReverse} from '../publication540-shared/database-package.mjs';
import {compose,root} from '../../scripts/adoption1535/package.mjs';
import {tables} from '../adoption1528/catalog.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGSERVICE','PGDATABASE'])assert(!process.env[key],'External target environment rejected: '+key);
const open=s=>s.replace(/^DO \$hold\$ BEGIN RAISE EXCEPTION '[^']+'; END \$hold\$;$/m,'-- disposable in-memory fixture copy only');
const digest=s=>createHash('sha256').update(s).digest('hex'),checks=[],startedAt=new Date().toISOString();
const pass=s=>{checks.push(s);console.log('PASS '+s);};
const env={...process.env};for(const k of ['DOCKER_HOST','DOCKER_CONTEXT','DOCKER_TLS','DOCKER_TLS_VERIFY','DOCKER_CERT_PATH'])delete env[k];
let db,holder,holderExit;
try{
 db=await startGoTrueFixture({initializeSchema:initializeTargetShape});
 const before=await snapshot(db.sql),core=await prepareApply(before);
 await db.sql(open(core.sql));const coreAfter=await snapshot(db.sql),p0=await packageSnapshot(db.sql);
 await db.sql(open(await readFile(root+'docs/publication540-shared/database/guarded-successor.sql','utf8')));const p1=await packageSnapshot(db.sql);
 const addonApply=await packageApply(p0,p1),addonReverse=packageReverse(p0,p1),coreReverse=prepareRollback(before,coreAfter).sql;
 await db.sql(open(addonReverse));await db.sql(open(coreReverse));
 const apply=compose(bindExpectedPostimage(core,coreAfter).sql,addonApply,'APPLY'),reverse=compose(addonReverse,coreReverse,'REVERSE');
 const initial=await packageSnapshot(db.sql);
 const rows=()=>db.sql('SELECT jsonb_build_array('+tables.map(t=>' (SELECT coalesce(jsonb_agg(to_jsonb(r) ORDER BY to_jsonb(r)::text),\'[]\'::jsonb) FROM public.'+t+' r)').join(',')+');');
 const baselineRows=await rows();
 // Bind only to the exact local fixture via a fresh catalog capability; no server files.
 const markerSchema='fixture_identity_'+randomUUID().replaceAll('-','');
 await db.sql('CREATE SCHEMA '+markerSchema+';');
 let matching=[];
 try{
  const names=execFileSync('docker',['--host=unix:///var/run/docker.sock','ps','--format','{{.Names}}'],{env,encoding:'utf8'}).trim().split('\n').filter(x=>/^calcumint-gotrue-[a-f0-9-]+-db$/.test(x));
  matching=names.filter(name=>execFileSync('docker',['--host=unix:///var/run/docker.sock','exec',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1','-c',"SELECT EXISTS(SELECT FROM pg_namespace WHERE nspname='"+markerSchema+"');"],{env,encoding:'utf8',timeout:5000}).trim()==='t');
  assert.equal(matching.length,1,'Exactly one local DB must possess the fresh fixture catalog capability');
 }finally{await db.sql('DROP SCHEMA '+markerSchema+';');}
 assert.equal((await packageSnapshot(db.sql)).sha256,initial.sha256);assert.equal(await rows(),baselineRows);
 holder=spawn('docker',['--host=unix:///var/run/docker.sock','exec','-i',matching[0],'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],{env,stdio:['pipe','pipe','pipe']});
 let stdout='',stderr='';holder.stdout.on('data',b=>stdout+=b);holder.stderr.on('data',b=>stderr+=b);
 holderExit=new Promise((resolve,reject)=>{holder.on('error',reject);holder.on('close',code=>code===0?resolve():reject(Error('Holder failed: '+stderr)));});holderExit.catch(()=>{});
 const until=async predicate=>{const deadline=Date.now()+10000;while(!await predicate()){assert(Date.now()<deadline,'Observed lock barrier deadline: '+stderr);await new Promise(r=>setTimeout(r,10));}};
 const command=async sql=>{const marker=randomUUID();holder.stdin.write(sql+";SELECT '"+marker+"';\n");await until(()=>stdout.includes(marker));};
 const writerLabel='operational-writer-'+randomUUID(),adopterLabel='operational-adopter-'+randomUUID();
 await command("SET application_name='"+writerLabel+"'");
 for(const disposition of ['ROLLBACK','COMMIT']){
  // A genuine uncommitted row mutation owns RowExclusiveLock before adoption.
  await command("BEGIN;INSERT INTO public.admin_alerts(severity,alert_type,message) VALUES('info','operational_fixture','"+disposition+"')");
  assert.equal(await db.sql("SELECT count(*) FROM pg_locks l JOIN pg_stat_activity a ON a.pid=l.pid WHERE a.application_name='"+writerLabel+"' AND l.relation='public.admin_alerts'::regclass AND l.mode='RowExclusiveLock' AND l.granted;"),'1');
  const attempted=db.sql("SET application_name='"+adopterLabel+"';"+open(apply)).then(()=>({ok:true}),error=>({ok:false,message:error.message}));
  await until(async()=>await db.sql("SELECT count(*) FROM pg_locks l JOIN pg_stat_activity a ON a.pid=l.pid WHERE a.application_name='"+adopterLabel+"' AND l.relation='public.admin_alerts'::regclass AND l.mode='AccessExclusiveLock' AND NOT l.granted;")==='1');
  const refusal=await attempted;assert.equal(refusal.ok,false);assert.match(refusal.message,/lock timeout/);
  assert.equal((await packageSnapshot(db.sql)).sha256,initial.sha256);assert.equal(await rows(),baselineRows);
  await command(disposition);
  const preserved=await rows();
  if(disposition==='ROLLBACK')assert.equal(preserved,baselineRows);else assert.notEqual(preserved,baselineRows);
  assert.equal(await db.sql("SELECT count(*) FROM public.admin_alerts WHERE alert_type='operational_fixture';"),disposition==='COMMIT'?'1':'0');
  await db.sql(open(apply));assert.equal((await packageSnapshot(db.sql)).sha256,p1.sha256);assert.equal(await rows(),preserved);
  await db.sql(open(reverse));assert.equal((await packageSnapshot(db.sql)).sha256,initial.sha256);assert.equal(await rows(),preserved);
  pass('Observed writer '+disposition+' barrier: 3s adoption lock timeout, no partial metadata/data, writer outcome retained through retry and exact reversal');
 }
 holder.stdin.end();await holderExit;holder=null;
 const reportPath=resolve(process.env.OPERATIONAL_LOCKS_REPORT||'/tmp/calcumint-operational-locks-receipt.json');await mkdir(dirname(reportPath),{recursive:true});
 const sources={};for(const path of ['tests/competent-closure-20261108/operational-locks.mjs','tests/adoption1528/bundle.mjs','tests/publication540-shared/database-package.mjs','scripts/adoption1535/package.mjs'])sources[path]=digest(await readFile(root+path));
 await writeFile(reportPath,JSON.stringify({passed:true,startedAt,finishedAt:new Date().toISOString(),checks,sourceHashes:sources,localPreimage:initial.sha256,localPostimage:p1.sha256,localApplyHash:digest(apply),localReverseHash:digest(reverse),provenance:db.provenance,syntheticOnly:true,productionWrites:false,freezeAttested:false,limitations:['Tests existing writer blocking adoption; does not enforce external writer or provider DDL freeze.','Disposable in-memory guard removal and derived fixture metadata only; held target SQL unchanged.']},null,2)+'\n');
}finally{
 const cleanup=[];if(holder){holder.stdin.end('ROLLBACK;\n');try{await holderExit;}catch(e){cleanup.push(e);}}
 if(db)try{await db.close();}catch(e){cleanup.push(e);}
 if(cleanup.length)throw new AggregateError(cleanup,'Operational fixture cleanup failed');
}
