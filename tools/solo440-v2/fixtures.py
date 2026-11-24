"""Synthetic test fixtures only; no provider approval or live grant."""
import time,secrets

def adoption_fixture(m):
 return ({'id':m.OWNER_ID,'name':m.OWNER,'email':'subvicco12@gmail.com'}, {'id':m.ADOPTION,'createdTime':m.TIMESTAMP,'modifiedTime':m.TIMESTAMP,'deleted':False,'author':{'me':True,'displayName':m.OWNER},'content':m.ADOPTION_TEXT})
def fixture_grant(m):
 now=int(time.time())
 return {'schema':m.GRANT_SCHEMA,'amendmentSha256':m.AMENDMENT,'policyCommit':m.POLICY_COMMIT,'policyBlob':m.POLICY_BLOB,'policySha256':m.POLICY_SHA,'candidate':m.CANDIDATE,'tree':m.TREE,'nominationSha256':m.NOMINATION,'sourceArchiveSha256':m.ARCHIVE,'engineBlob':m.ENGINE,'ownerSubject':m.OWNER_ID,'adoptionComment':m.ADOPTION,'basis':m.BASIS,'action':'source-only','activation':False,'repository':m.REPO,'runId':str(secrets.randbelow(10**12)+1),'attempt':1,'nonce':secrets.token_hex(16),'issuedAt':now,'expiresAt':now+600,'executor':'e'*40,'executorTree':'d'*40,'evidenceSha256':'a'*64,'productDispositionSha256':'b'*64,'applicabilitySha256':'c'*64,'storeIdentity':'disposable-postgresql-qualification','mode':'disposable-qualification'}
