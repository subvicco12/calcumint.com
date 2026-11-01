"""Bounded read-only HTTPS GET evidence. Never submits inputs or calls database APIs."""
import concurrent.futures,datetime,hashlib,json,pathlib,re,urllib.error,urllib.request
from html.parser import HTMLParser
from urllib.parse import urlsplit
class Redirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  if urlsplit(newurl).scheme!='https' or urlsplit(newurl).netloc!='calcumint.com':raise ValueError('Unexpected redirect origin')
  return super().redirect_request(req,fp,code,msg,headers,newurl)
class Page(HTMLParser):
 def __init__(self):super().__init__();self.text=[];self.h1=[];self.in_h1=False;self.canonical=None;self.controls=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.in_h1=True
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if tag in ('input','select','textarea'):self.controls+=1
 def handle_endtag(self,tag):
  if tag=='h1':self.in_h1=False
 def handle_data(self,data):
  self.text.append(data)
  if self.in_h1:self.h1.append(data)
def probe(row):
 category,slug=row['category'],row['slug']
 if not all(isinstance(x,str) and re.fullmatch('[a-z0-9]+(?:-[a-z0-9]+)*',x) for x in (category,slug)):raise ValueError('Unsafe route identity')
 url='https://calcumint.com/calculators/'+category+'/'+slug
 result={'url':url,'slug':slug,'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'GET','expectedVersion':row['version']}
 try:
  with urllib.request.build_opener(Redirect()).open(urllib.request.Request(url,headers={'User-Agent':'CalcuMint-readonly-publication-audit/1.0'}),timeout=12) as response:
   body=response.read(2_000_001)
   if len(body)>2_000_000:raise ValueError('Response exceeds evidence limit')
   p=Page();p.feed(body.decode('utf-8'));text=' '.join(p.text)
   version=re.search(r'Technical calculation version:\s*(\d+)',text)
   result.update(status=response.status,finalUrl=response.url,h1=''.join(p.h1).strip(),canonical=p.canonical,inputControls=p.controls,displayedVersion=int(version.group(1)) if version else None,bodySha256=hashlib.sha256(body).hexdigest())
 except urllib.error.HTTPError as error:result.update(status=error.code,error='HTTP error')
 except Exception as error:result.update(status=None,error=type(error).__name__+': '+str(error)[:180])
 return result
if __name__=='__main__':
 root=pathlib.Path('docs/calculator-first');rows=json.loads((root/'hosted-rows.json').read_text())['rows']
 assert len({r['slug'] for r in rows})==len(rows)
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(probe,rows))
 (root/'live-route-observations.json').write_text(json.dumps({'scope':'Published hosted rows only; three bounded GET workers, twelve-second request timeout, no form submissions; public route availability is not numerical/canonical acceptance','rows':results},indent=2)+'\n')
 print(json.dumps({'observed':len(results),'http200':sum(r.get('status')==200 for r in results),'http404':sum(r.get('status')==404 for r in results),'unknown':sum(r.get('status') is None for r in results)}))
