"""Governed v2 receipt review adapter; does not register authority in any consumer."""
import authority as a
def prepare_consumption(grant,receipt,authoritative_state):
 a.require(grant['mode']=='source-admission','Disposable qualification is not source admission')
 a.verify_receipt(receipt,grant,qualification=False)
 a.require(authoritative_state.get('state')=='RECEIPTED' and authoritative_state.get('grantSha256')==a.digest(a.canonical(grant).encode()) and authoritative_state.get('receipt')==receipt,'Authoritative source receipt unavailable or uncertain')
 return {'kind':'CALCUMINT440_OWNER_ACCEPTANCE_V2_REVIEW_ONLY','candidate':a.CANDIDATE,'tree':a.TREE,'policySha256':a.POLICY_SHA,'receiptSha256':receipt['sha256'],'historicalIndependentApproval':False,'activated':False,'certified':False,'published':False,'separateAuthorizationRequired':True}
