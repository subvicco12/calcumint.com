"""Focused socket-free qualification only; no database, browser or provider calls."""
import argparse,hashlib,json,os,pathlib,shutil,subprocess,tempfile
from stage_ripgrep import stage,BINARY_SHA

def main():
 p=argparse.ArgumentParser();p.add_argument('--node',required=True,type=pathlib.Path);p.add_argument('--archive',required=True,type=pathlib.Path);p.add_argument('--source',required=True,type=pathlib.Path);p.add_argument('--output',required=True,type=pathlib.Path);args=p.parse_args()
 assert hashlib.sha256(args.node.read_bytes()).hexdigest()=='94efd062ed066c1a0b332e18249859c905e920eeada5df55d24c99b919629a90'
 args.output.mkdir(parents=True,exist_ok=True)
 base=pathlib.Path(tempfile.mkdtemp(prefix='calcumint-rg-focused-',dir='/tmp'));base.chmod(0o755)
 (base/'app').symlink_to(args.source.resolve(),target_is_directory=True);(base/'home').mkdir();(base/'evidence').mkdir();stage(args.archive,base/'tools')
 results=[]
 def run(script,search_path=None,extra=None,guard=False,output=None,synthetic_socket=False):
  env={'PATH':search_path or str(base/'tools')+':/usr/bin:/bin','HOME':str(base/'home'),'APP_SOURCE':str(base/'app'),'WORKER2_MOBILITY_BROWSER_ARTIFACTS':str(base/'evidence'),**(extra or {})}
  command=['bwrap','--unshare-user','--unshare-pid','--unshare-net','--ro-bind','/','/','--proc','/proc','--tmpfs','/run','--bind',str(base/'evidence'),str(base/'evidence')]
  if synthetic_socket:command+=['--ro-bind',str(base/'synthetic-socket-marker'),'/run/docker.sock']
  command+=['--uid','65534','--gid','65534','/usr/bin/setpriv','--no-new-privs','/usr/bin/env','-i',*[k+'='+v for k,v in env.items()],str(args.node)]
  command+=([str(base/'tools/check-ripgrep.mjs')] if guard else ['-e',script])
  result=subprocess.run(command,capture_output=True,text=True,timeout=120)
  if output is not None:output.write_text(result.stdout)
  return result
 # Both permission mechanisms reproduce Node's real execvp error, not a mocked errno.
 (base/'nonexec').mkdir();shutil.copyfile(base/'tools/rg',base/'nonexec/rg');(base/'nonexec/rg').chmod(0o644)
 (base/'denied').mkdir();shutil.copyfile(base/'tools/rg',base/'denied/rg');(base/'denied/rg').chmod(0o555);(base/'denied').chmod(0)
 reproduce="const {execFileSync}=require('node:child_process');try{execFileSync('rg',['--files','src','data'],{cwd:process.env.APP_SOURCE});process.exit(2)}catch(e){if(e.code!=='EACCES')throw e;console.log(JSON.stringify({uid:process.getuid(),gid:process.getgid(),code:e.code,syscall:e.syscall}));}"
 for name in ['nonexec','denied']:
  result=run(reproduce,str(base/name),output=args.output/(name+'-before.json'));assert result.returncode==0,result.stderr;results.append({'case':name+'-EACCES-before','pass':True})
 positive=run('',guard=True);assert positive.returncode==0,positive.stderr
 receipt=json.loads((base/'evidence/ripgrep-isolation.json').read_text());assert receipt['passed'] and receipt['sourceFileCount']>0
 (args.output/'ripgrep-isolation.json').write_text(json.dumps(receipt,indent=2)+'\n');results.append({'case':'pinned-ripgrep-under-UID-GID65534','pass':True})
 # Compare the exact same enumeration arguments and per-file SHA256 inputs.
 def enumeration(binary,root=None):
  root=root or args.source
  names=subprocess.check_output([str(binary),'--files','src','data'],cwd=root,text=True).strip().split('\n')
  entries=[[name,hashlib.sha256((root/name).read_bytes()).hexdigest()] for name in sorted(names+['next.config.ts'])]
  return names,hashlib.sha256(json.dumps(entries,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
 old,old_hash=enumeration(shutil.which('rg'));new,new_hash=enumeration(base/'tools/rg')
 assert set(old)==set(new) and old_hash==new_hash==receipt['sourceManifestSha256']
 (args.output/'enumeration-equivalence.json').write_text(json.dumps({'files':len(old),'originalResolvedRipgrep':shutil.which('rg'),'baselineVersion':subprocess.check_output(['rg','--version'],text=True).splitlines()[0],'pinnedVersion':receipt['ripgrep']['version'],'sameFileSet':True,'samePerFileSHA256':True,'canonicalManifestSha256':new_hash,'unchangedArguments':['--files','src','data']},indent=2)+'\n');results.append({'case':'full-source-enumeration-and-checksum-equivalence','pass':True})
 # Every negative stays fail-closed; synthetic token never leaves this process tree.
 result=run('',guard=True,extra={'BOOTSTRAP_DRIVE_TOKEN':'SYNTHETIC_NEGATIVE_ONLY'});assert result.returncode!=0
 assert json.loads((base/'evidence/ripgrep-isolation.json').read_text())=={'passed':False,'category':'ripgrep-execution-or-isolation-refused'};results.append({'case':'provider-credential-injection-refused','pass':True})
 result=run('',guard=True,search_path=str(base/'nonexec'));assert result.returncode!=0;results.append({'case':'wrong-or-inaccessible-PATH-refused','pass':True})
 (base/'synthetic-socket-marker').write_text('SYNTHETIC FILE ONLY; NO DAEMON')
 result=run('',guard=True,synthetic_socket=True);assert result.returncode!=0;results.append({'case':'readable-synthetic-Docker-path-refused-no-real-socket-exposed','pass':True})
 binary=base/'tools/rg';original=binary.read_bytes();binary.chmod(0o755);binary.write_bytes(b'#!/bin/sh\necho executed > "$WORKER2_MOBILITY_BROWSER_ARTIFACTS/tamper-executed"\n');binary.chmod(0o555)
 result=run('',guard=True);assert result.returncode!=0 and not (base/'evidence/tamper-executed').exists()
 binary.chmod(0o755);binary.write_bytes(original);binary.chmod(0o555);results.append({'case':'tampered-binary-refused-before-execution','pass':True})
 fixture=base/'enumeration-fixture';(fixture/'src').mkdir(parents=True);(fixture/'data').mkdir();(fixture/'src/visible.txt').write_text('visible');(fixture/'src/.hidden').write_text('hidden');(fixture/'src/.ignore').write_text('ignored.txt\n');(fixture/'src/ignored.txt').write_text('ignored');(fixture/'data/value.txt').write_text('one');(fixture/'next.config.ts').write_text('fixture')
 a,first=enumeration(base/'tools/rg',fixture);b,baseline=enumeration(shutil.which('rg'),fixture)
 assert set(a)==set(b)=={'src/visible.txt','data/value.txt'} and first==baseline
 (fixture/'data/value.txt').write_text('two');_,changed=enumeration(base/'tools/rg',fixture);assert changed!=first
 results.append({'case':'hidden-ignore-semantics-and-source-change-digest-sensitivity','pass':True})
 for destination in [base/'tools',base/'tool-link']:
  if not destination.exists():destination.symlink_to(base/'tools',target_is_directory=True)
  try:stage(args.archive,destination);raise AssertionError('existing destination admitted')
  except ValueError:pass
 results.append({'case':'existing-and-symlink-destination-refused-with-valid-archive','pass':True})
 (args.output/'qualification.json').write_text(json.dumps({'passed':True,'results':results,'isolation':'rootless Bubblewrap user+PID+network namespaces; read-only filesystem; /run masked; only evidence directory writable','hostUid':os.getuid(),'hostGid':os.getgid(),'identityBoundary':'UID/GID65534 are genuine namespace IDs mapped to the existing unprivileged host account; not a GitHub-hosted or native-host UID65534 attestation','browserJourneys':0,'exports':0,'providerCalls':0,'databaseTestsRepeated':0,'engineChanged':False},indent=2)+'\n')
 print(json.dumps({'passed':True,'cases':len(results),'sourceFiles':len(new),'output':str(args.output)}))
if __name__=='__main__':main()
