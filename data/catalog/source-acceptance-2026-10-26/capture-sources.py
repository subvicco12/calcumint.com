"""Capture approved public publisher URLs through inherited proxy/TLS, without approval claims.

Default mode lists the immutable index only. --fetch --output DIR stores raw public
bodies outside this evidence package for substantive review; never executes content.
"""
import argparse
import datetime
import hashlib
import json
from pathlib import Path
import ssl
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, HTTPSHandler, ProxyHandler, Request, build_opener

MAX_SOURCE_BYTES=16*1024*1024
HERE=Path(__file__).resolve().parent

def validate_url(url,hosts):
    parsed=urlsplit(url)
    if parsed.scheme!='https' or parsed.hostname not in hosts or parsed.username or parsed.password or parsed.port not in (None,443):
        raise ValueError('Only explicit credential-free HTTPS publisher hosts on port443 are allowed')

class ApprovedRedirect(HTTPRedirectHandler):
    def __init__(self,hosts):super().__init__();self.hosts=hosts
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        validate_url(newurl,self.hosts)
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def tls_context():return ssl.create_default_context()

def store_capture(requested,final,body,headers,output):
    body_hash=hashlib.sha256(body).hexdigest();name=body_hash+'.bin'
    output.mkdir(parents=True,exist_ok=True,mode=0o700)
    target=output/name
    with target.open('wb') as f:f.write(body)
    target.chmod(0o600)
    return {'requestedUrl':requested,'finalUrl':final,'status':'CAPTURED_UNREVIEWED',
            'capturedUTC':datetime.datetime.now(datetime.timezone.utc).isoformat(),'bodyFile':name,
            'bodySHA256':body_hash,'bytes':len(body),'contentType':headers.get('Content-Type'),
            'reportedLastModifiedNotEffectiveDate':headers.get('Last-Modified'),
            'normativeRevision':None,'effectiveFrom':None,'sourceVerified':False,
            'certificationAuthorized':False,'publicationAuthorized':False}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--fetch',action='store_true');parser.add_argument('--output',type=Path)
    args=parser.parse_args();index=json.loads((HERE/'source-index.json').read_text());hosts=set(index['publisherHosts'])
    for source in index['sources']:validate_url(source['url'],hosts)
    if not args.fetch:
        print(json.dumps({'networkUsed':False,'sources':index['sources'],'captureGrantsReview':False},indent=2));return
    if args.output is None:parser.error('--fetch requires --output DIR')
    if args.output.resolve().is_relative_to(HERE.resolve()):parser.error('Raw source captures must be outside the committed evidence package')
    opener=build_opener(ProxyHandler(),HTTPSHandler(context=tls_context()),ApprovedRedirect(hosts));results=[]
    for source in index['sources']:
        url=source['url']
        try:
            with opener.open(Request(url,headers={'User-Agent':'CalcuMint-public-source-evidence/1.0'}),timeout=20) as response:
                validate_url(response.url,hosts);body=response.read(MAX_SOURCE_BYTES+1)
                if len(body)>MAX_SOURCE_BYTES:raise ValueError('Source exceeds16MiB capture limit')
                if not body:raise ValueError('Empty source body')
                result=store_capture(url,response.url,body,response.headers,args.output)
        except Exception as exc:
            result={'requestedUrl':url,'status':'CAPTURE_FAILED','errorType':type(exc).__name__,
                    'sourceVerified':False,'certificationAuthorized':False,'publicationAuthorized':False}
        results.append(result)
        print(json.dumps({k:result.get(k) for k in ['requestedUrl','status','bodySHA256','errorType']}),flush=True)
    args.output.mkdir(parents=True,exist_ok=True,mode=0o700)
    manifest=args.output/'capture-results.json';manifest.write_text(json.dumps(results,indent=2)+'\n');manifest.chmod(0o600)

if __name__=='__main__':main()
