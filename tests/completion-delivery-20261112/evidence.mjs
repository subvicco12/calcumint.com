import {sanitizeText,sanitizeEvidence} from '../five-native-auth-20261109/evidence-sanitizer.mjs';
// Execution credentials remain in memory. Persist only redacted evidence or hashes.
const credentials=new Set();
export function registerCredentials(...values){for(const value of values.flat())if(typeof value==='string'&&value.length>=8)credentials.add(value);}
export function redactText(value){let text=String(value);for(const credential of credentials)text=text.split(credential).join('[REDACTED_CREDENTIAL]');return sanitizeText(text.replace(/((?:\/api\/native-embed\/|\/embed\/native\/))[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,'$1[REDACTED_SIGNED_GRANT]'));}
export const evidenceJSON=value=>redactText(sanitizeEvidence(JSON.stringify(value)));
export async function captureFixtureDiagnostics(db,directory){
 const [{execFile},{promisify},{writeFile},{default:path}]=await Promise.all([import('node:child_process'),import('node:util'),import('node:fs/promises'),import('node:path')]);
 const run=promisify(execFile),hostname=(await db.sql("SELECT trim(pg_read_file('/etc/hostname'));" )).trim();
 const inspected=await run('docker',['--host=unix:///var/run/docker.sock','inspect','--format','{{.Name}}',hostname]);
 const database=inspected.stdout.trim().replace(/^\//,'');if(!/^calcumint-gotrue-[a-f0-9-]+-db$/.test(database))throw Error('Diagnostic scope must be this disposable fixture');
 const diagnostics={capturedAt:new Date().toISOString(),activity:JSON.parse(await db.sql("SELECT coalesce(jsonb_agg(jsonb_build_object('state',state,'waitType',wait_event_type,'wait',wait_event,'started',query_start,'query',left(query,1000))),'[]'::jsonb) FROM pg_stat_activity WHERE datname=current_database() AND pid<>pg_backend_pid();"))};
 for(const [kind,name]of [['postgres',database],['postgrest',database.replace(/-db$/,'-rest')]]){const logs=await run('docker',['--host=unix:///var/run/docker.sock','logs','--tail','80',name]);await writeFile(path.join(directory,`fixture-${kind}.log`),redactText(logs.stdout+'\n'+logs.stderr));}
 await writeFile(path.join(directory,'fixture-readiness-diagnostics.json'),evidenceJSON(diagnostics));return diagnostics;
}
