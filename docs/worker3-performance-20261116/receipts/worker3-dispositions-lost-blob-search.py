import subprocess as s,pathlib,hashlib,json,time
repo='/workspace/calcumint-worker3-recovery';expected='620f7db61b95c032bf88d235680921fff53c347cb8f8992df896c67692cd9fc4';start=time.monotonic();command=['git','-C',repo,'cat-file','--batch-all-objects','--batch-check=%(objectname) %(objecttype) %(objectsize)','--unordered'];meta=s.check_output(command);objects=[]
for line in meta.decode().splitlines():
 oid,kind,size=line.split();objects.append((oid,kind,int(size)))
blobs=[r for r in objects if r[1]=='blob'];candidates=blobs
report={'kind':'READ_ONLY_ORIGINAL_ADMINISTRATIVE_BINDING_GIT_OBJECT_RECOVERY','targetSHA256':expected,'repository':repo,'readOnly':True,'scope':'Git object enumeration includes reachable and unreachable objects; no filesystem/Git mutation, reconstruction or hash substitution.','objectInventory':{'allObjects':len(objects),'blobObjects':len(blobs),'blobUncompressedBytes':sum(r[2] for r in blobs)},'candidateScope':{'minBytes':0,'maxBytes':max(r[2] for r in blobs),'objects':len(candidates),'uncompressedBytes':sum(r[2] for r in candidates)},'matches':[]}
child=s.Popen(['git','-C',repo,'cat-file','--batch'],stdin=s.PIPE,stdout=s.PIPE,stderr=s.PIPE)
try:
 for oid,kind,size in candidates:
  child.stdin.write((oid+'\n').encode());child.stdin.flush();header=child.stdout.readline().decode().strip().split();assert header==[oid,'blob',str(size)]
  h=hashlib.sha256();parts=[];left=size
  while left:
   b=child.stdout.read(min(65536,left));assert b;h.update(b);parts.append(b);left-=len(b)
  assert child.stdout.read(1)==b'\n'
  if h.hexdigest()==expected:
   body=b''.join(parts);artifact=pathlib.Path('/tmp/worker3-original-dispositions-recovered-'+oid+'.json');artifact.write_bytes(body);j=json.loads(body)
   report['matches'].append({'gitBlob':oid,'sha256':h.hexdigest(),'bytes':size,'recoveredExactBytesPath':str(artifact),'kind':j.get('kind'),'testedHead':j.get('testedHead'),'observedImplementationHead':j.get('observedImplementationHead'),'rows':len(j.get('rows',[])),'confirmedEngineeringBaseline':j.get('confirmedEngineeringBaseline'),'newConfirmedEngineering':j.get('newConfirmedEngineering'),'all20Dispositions':sorted({str(x.get('disposition')) for x in j.get('rows',[])})})
finally:
 child.stdin.close();code=child.wait();assert code==0,child.stderr.read().decode()
report['scannedObjects']=len(candidates);report['scannedBytes']=sum(r[2] for r in candidates);report['elapsedSeconds']=time.monotonic()-start;report['qualified']=False
out=pathlib.Path('/tmp/worker3-dispositions-lost-blob-search.json');out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
