import pathlib, os, json, time, selectors, tempfile, signal, shutil
source=pathlib.Path('/workspace/calcumint-worker3-recovery/tests/next-engineering-20261115/source-private-git-broker.py').read_text().split('\ntry:\n    parent_death')[0]
old_selector=selectors.DefaultSelector
candidate=source.replace('            now = time.monotonic()','            if not watch.get_map() and deadline is None:\n                child.wait()\n                continue\n            now = time.monotonic()')
root=tempfile.mkdtemp(prefix='worker3-empty-selector-equivalence-')
exe=pathlib.Path(root,'git')
records=[]
try:
 for variant,text in [('original',source),('candidate',candidate)]:
  for case in ['closed-streams','inherited-streams','interrupted']:
   ns={};exec(compile(text,'broker-'+variant,'exec'),ns)
   empty=[];frames=[];metadata=[];pids=[]
   class Observed(old_selector):
    def select(self,timeout=None):
     if not self.get_map():
      empty.append(timeout)
      if case=='closed-streams':raise AssertionError('empty-selector-sleep')
     return super().select(timeout)
   selectors.DefaultSelector=Observed
   ns['frame']=lambda seq,kind,data=b'':frames.append((kind,list(data)))
   ns['metadata']=lambda seq,kind,data:metadata.append((kind,data))
   real_popen=ns['subprocess'].Popen
   def popen(*args,**kwargs):
    child=real_popen(*args,**kwargs);pids.append(child.pid);return child
   ns['subprocess'].Popen=popen
   body='import os,time,sys\nos.write(1,b"abc\\x00")\nos.write(2,b"err")\n'
   if case=='inherited-streams':body+='if os.fork()==0:\n time.sleep(.04)\n os._exit(0)\nsys.exit(7)\n'
   else:body+='os.close(1)\nos.close(2)\ntime.sleep(.20)\nsys.exit(7)\n'
   exe.write_text('#!/usr/bin/python3\n'+body);exe.chmod(0o700)
   request={'sequence':1,'argv':['rev-parse','--show-toplevel'],'cwd':root,'env':{**os.environ,'PATH':root+':/usr/bin:/bin'},'inputPresent':False,'timeout':0,'maxBuffer':134217728,'killSignal':'SIGTERM'}
   outcome='returned';start=time.monotonic()
   previous=signal.signal(signal.SIGALRM,ns['stopped'])
   if case=='interrupted':signal.setitimer(signal.ITIMER_REAL,.05)
   try:ns['run'](request,b'')
   except (AssertionError,SystemExit) as e:outcome=type(e).__name__+':'+str(e)
   finally:
    signal.setitimer(signal.ITIMER_REAL,0);signal.signal(signal.SIGALRM,previous)
    ns['subprocess'].Popen=real_popen
    selectors.DefaultSelector=old_selector
   alive=[]
   for pid in pids:
    try:os.kill(pid,0);alive.append(pid)
    except ProcessLookupError:pass
   records.append({'variant':variant,'case':case,'outcome':outcome,'ms':(time.monotonic()-start)*1000,'empty_select_count':len(empty),'frames':frames,'results':[value for kind,value in metadata if kind==3],'live_child_pids':alive})
 pathlib.Path('/tmp/worker3-broker-empty-selector-equivalence.json').write_text(json.dumps(records,indent=2))
 print(json.dumps(records,indent=2))
finally:shutil.rmtree(root)
