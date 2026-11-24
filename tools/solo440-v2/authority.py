"""Versioned fixed #440 owner authority. No historical approval or activation authority."""
import hashlib,json,pathlib,re,time
ROOT=pathlib.Path(__file__).resolve().parent
REPO='subvicco12/calcumint.com'
CANDIDATE='1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e'
TREE='209982b9a81d7bf9f4783228505b5a274563391f'
AMENDMENT='62c30cc17ad5b9a87e57bb2e91a5ee2b25bbcfd3d9fe3c3e7f1775a99cd8475a'
POLICY_COMMIT='aa6b7a18f8dd89c6d4cf01a3aa1514a1c5a5f5ff'
POLICY_BLOB='642d25f770b334a13419c4466d81f17aabff0aae'
POLICY_SHA='16564fc8612e87a282195193e539b5e9d44d2fd94c88f9ee9b6ea9f19c73008c'
NOMINATION='aef727afa4234c4e0e7c6db84bfa312e85696ac655513d3cd6b10a2d829af449'
ARCHIVE='6fcfdf70a0e08004e4c7df76a1417b905b166a97cb7f5bba7b2adcf592ca4a72'
ENGINE='d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3'
OWNER_ID='115201266201052505736'
OWNER='Subrata Singha Roy'
ADOPTION='doco.yCW4dzFjM3eDgvrRWjBNVA'
TIMESTAMP='2026-11-24T12:51:04.217Z'
BASIS='authenticated-owner-acceptance-under-adopted-amendment'
GRANT_SCHEMA='calcumint.singleton440.single-owner-grant.v2'
RECEIPT_SCHEMA='calcumint.singleton440.single-owner-source-receipt.v2'
ADOPTION_TEXT='I adopt the #440 single-owner governance amendment with SHA-256 `'+AMENDMENT+'`, solely for general-purpose frequency conversion and the two nominated source transitions at candidate `'+CANDIDATE+'`. I authorize Worker 3 to implement and qualify a separately versioned successor in isolation. This decision does not supersede applicable legal, provider or specialist requirements, approve calculator methodology, amend production observer or restoration controls, or authorize live execution or release. RELEASE HOLD remains active.'
def require(c,message):
 if not c:raise ValueError(message)
def canonical(x):return json.dumps(x,sort_keys=True,separators=(',',':'))
def digest(b):return hashlib.sha256(b).hexdigest()
def verify_package():
 for name,sha in [('amendment.md',AMENDMENT),('policy.json',POLICY_SHA)]:
  p=ROOT/name;require(p.is_file() and not p.is_symlink() and digest(p.read_bytes())==sha,'Frozen package differs: '+name)
 old=ROOT.parent/'singleton440-authority'
 require(digest((old/'nomination.json').read_bytes())==NOMINATION,'Nomination differs')
 require(digest((old/'source-data.tar.gz').read_bytes())==ARCHIVE,'Source archive differs')
 require(digest((old/'exact-stage.mjs').read_bytes())=='427dcad7727bd28d26ecfe40df5b780b79c94a7b2a35930b40417e07d5ac347a','Verifier differs')
 return json.loads((ROOT/'policy.json').read_bytes())
def verify_adoption(owner,comment):
 require(owner.get('id')==OWNER_ID and owner.get('name')==OWNER and owner.get('email')=='subvicco12@gmail.com','Owner profile differs')
 require(comment.get('id')==ADOPTION and comment.get('deleted') is False and comment.get('createdTime')==TIMESTAMP and comment.get('modifiedTime')==TIMESTAMP and comment.get('author',{}).get('me') is True and comment['author'].get('displayName')==OWNER and comment.get('content')==ADOPTION_TEXT,'Exact adoption differs')
def verify_grant(g,now,context=None):
 fixed={'schema':GRANT_SCHEMA,'amendmentSha256':AMENDMENT,'policyCommit':POLICY_COMMIT,'policyBlob':POLICY_BLOB,'policySha256':POLICY_SHA,'candidate':CANDIDATE,'tree':TREE,'nominationSha256':NOMINATION,'sourceArchiveSha256':ARCHIVE,'engineBlob':ENGINE,'ownerSubject':OWNER_ID,'adoptionComment':ADOPTION,'basis':BASIS,'action':'source-only','activation':False,'repository':REPO,'attempt':1}
 fields={'runId','nonce','issuedAt','expiresAt','executor','executorTree','evidenceSha256','productDispositionSha256','applicabilitySha256','storeIdentity','mode'}
 require(type(g) is dict and set(g)==set(fixed)|fields,'Grant fields differ')
 for k,v in fixed.items():require(type(g[k]) is type(v) and g[k]==v,'Grant binding differs: '+k)
 for k,n in [('executor',40),('executorTree',40),('evidenceSha256',64),('productDispositionSha256',64),('applicabilitySha256',64),('nonce',32)]:require(type(g[k]) is str and re.fullmatch('[0-9a-f]{'+str(n)+'}',g[k]) is not None,'Malformed '+k)
 require(type(g['runId']) is str and re.fullmatch('[1-9][0-9]{0,19}',g['runId']) is not None,'Run identity differs')
 require(type(now) is int and type(g['issuedAt']) is int and type(g['expiresAt']) is int and g['issuedAt']<=now<g['expiresAt']<=g['issuedAt']+600,'Grant stale or validity exceeds 600 seconds')
 require(g['mode'] in ('disposable-qualification','source-admission') and type(g['storeIdentity']) is str and re.fullmatch('[A-Za-z0-9._:/-]{1,200}',g['storeIdentity']) is not None,'Store or mode missing')
 if context is not None:
  for k in ('runId','executor','executorTree','evidenceSha256','productDispositionSha256','applicabilitySha256','storeIdentity','mode'):require(g[k]==context[k],'Execution context differs: '+k)
  require(context['attempt']==1 and type(context['attempt']) is int,'Attempt differs')
def receipt(g,qualification):
 require(type(qualification) is bool and qualification==(g['mode']=='disposable-qualification'),'Receipt mode differs')
 body={'schema':RECEIPT_SCHEMA,'basis':BASIS,'amendmentSha256':AMENDMENT,'adoptionComment':ADOPTION,'policyCommit':POLICY_COMMIT,'policyBlob':POLICY_BLOB,'policySha256':POLICY_SHA,'candidate':CANDIDATE,'tree':TREE,'nominationSha256':NOMINATION,'sourceArchiveSha256':ARCHIVE,'engineBlob':ENGINE,'grantSha256':digest(canonical(g).encode()),'ownerSubject':OWNER_ID,'productDispositionSha256':g['productDispositionSha256'],'applicabilitySha256':g['applicabilitySha256'],'evidenceSha256':g['evidenceSha256'],'executor':g['executor'],'executorTree':g['executorTree'],'runId':g['runId'],'attempt':1,'storeIdentity':g['storeIdentity'],'qualification':qualification,'admitted':not qualification,'activated':False,'independentApproval':False,'certified':False,'published':False,'releaseHold':True}
 return {'body':body,'sha256':digest(canonical(body).encode())}
def verify_receipt(r,g,qualification):
 require(r==receipt(g,qualification),'Receipt scope, integrity or authority differs')
def sql_text(text):return "convert_from(decode('"+text.encode().hex()+"','hex'),'UTF8')"
class Store:
 """Transport must address an independently approved PostgreSQL authority store."""
 def __init__(self,transport):self.transport=transport
 def claim(self,g):
  verify_grant(g,int(time.time()))
  return self.transport('SELECT solo440.claim('+sql_text(canonical(g))+');')
 def reconcile(self,g):return self.transport('SELECT solo440.reconcile('+sql_text(g['runId'])+');')
 def finalize(self,g,r):
  verify_receipt(r,g,g['mode']=='disposable-qualification')
  return self.transport('SELECT solo440.finish('+sql_text(canonical(g))+','+sql_text(canonical(r))+');')
