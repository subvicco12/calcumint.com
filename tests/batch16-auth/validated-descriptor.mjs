import {compareDescriptors} from './schema-descriptor.mjs';

const tables=['business_projects','client_workspaces','organization_audit_log','organization_invitations','organization_members','organizations','shared_calculations'];
const signatures=['accept_business_invitation(text)','create_business_organization(text,text)','has_org_role(uuid,text[])','is_org_member(uuid)','membership_identity_fence_v1()','org_role(uuid)','organization_owner_fence_v1()'];
const sections=['columns','constraints','effectiveTableGrants','functions','policies','relations','roleMemberships','scope','triggers'];
const text=value=>typeof value==='string'&&value.length>0;
const bool=value=>typeof value==='boolean';
const nullableText=value=>value===null||text(value);
const strings=value=>Array.isArray(value)&&value.every(text);
function require(condition){if(!condition)throw Error('Incomplete or malformed business catalog descriptor; no equality established');}
function object(value,fields){require(value!==null&&typeof value==='object'&&!Array.isArray(value));require(JSON.stringify(Object.keys(value).sort())===JSON.stringify(Object.keys(fields).sort()));for(const [key,valid]of Object.entries(fields))require(valid(value[key]));}
function unique(rows,key){const keys=rows.map(key);require(new Set(keys).size===keys.length);}
const table=value=>tables.includes(value);
/** Completeness is limited to this declared catalog scope, never source authenticity. */
export function validateBusinessDescriptor(value){
 require(value!==null&&typeof value==='object'&&!Array.isArray(value));
 require(JSON.stringify(Object.keys(value).sort())===JSON.stringify(sections));
 require(value.scope==='batch16-business-catalog-v1');
 for(const section of sections.filter(s=>s!=='scope'))require(Array.isArray(value[section]));
 for(const row of value.relations)object(row,{name:table,owner:text,rls:bool,forceRls:bool,acl:nullableText});
 require(JSON.stringify(value.relations.map(r=>r.name).sort())===JSON.stringify(tables));
 for(const row of value.columns)object(row,{table,name:text,type:text,notNull:bool,default:nullableText});
 unique(value.columns,r=>JSON.stringify([r.table,r.name]));
 for(const name of tables)require(value.columns.some(r=>r.table===name));
 for(const row of value.constraints)object(row,{table,name:text,validated:bool,definition:text});
 for(const row of value.triggers)object(row,{table,name:text,definition:text});
 for(const row of value.policies)object(row,{table,name:text,command:v=>['r','a','w','d','*'].includes(v),using:nullableText,check:nullableText,roles:v=>strings(v)&&v.length>0&&new Set(v).size===v.length});
 for(const section of ['constraints','triggers','policies'])unique(value[section],r=>JSON.stringify([r.table,r.name]));
 for(const row of value.functions)object(row,{signature:v=>signatures.includes(v),owner:text,definer:bool,config:v=>v===null||strings(v),acl:nullableText,definition:text});
 require(JSON.stringify(value.functions.map(r=>r.signature).sort())===JSON.stringify(signatures));
 for(const row of value.roleMemberships)object(row,{role:v=>['anon','authenticated','service_role'].includes(v),memberOf:text});
 unique(value.roleMemberships,r=>JSON.stringify([r.role,r.memberOf]));
 const roles=['anon','authenticated','service_role'],privileges=['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER'];
 for(const row of value.effectiveTableGrants)object(row,{table,role:v=>roles.includes(v),privilege:v=>privileges.includes(v),allowed:bool});
 unique(value.effectiveTableGrants,r=>JSON.stringify([r.table,r.role,r.privilege]));
 require(value.effectiveTableGrants.length===tables.length*roles.length*privileges.length);
 return value;
}
export function compareValidatedBusinessDescriptors(model,capture){
 return {...compareDescriptors(validateBusinessDescriptor(model),validateBusinessDescriptor(capture)),descriptorShapeValidated:true,captureProvenanceVerified:false,fullSchemaAndMigrationLedgerVerified:false};
}
