"""Disposable exact-checkout negative controls; never admits source."""
import pathlib,subprocess,tempfile,json,hashlib
root=pathlib.Path(__file__).resolve().parent
source='/workspace/worker3-restoration-20261124/verified.git'
head='1637b2a2bf582ebc6e4f4452ff9f3a3fe082b35e'
def run(args,cwd=None):return subprocess.run(args,cwd=cwd,text=True,capture_output=True,timeout=65)
results=[]
with tempfile.TemporaryDirectory(prefix='singleton440-') as tmp:
    repo=pathlib.Path(tmp)/'checkout'
    for args in [['git','clone','--shared','--no-checkout',source,str(repo)],['git','-C',str(repo),'checkout','--detach',head]]:
        r=run(args);assert r.returncode==0,r.stderr
    def verify(name,passes):
        r=run(['node',str(root/'verify-checkout.mjs'),str(repo)])
        assert (r.returncode==0)==passes,(name,r.stderr)
        results.append({'case':name,'pass':True,'exitCode':r.returncode,'stderrSha256':hashlib.sha256(r.stderr.encode()).hexdigest()})
    verify('exact-head-two-path-source',True)
    p=repo/'src/components/publication20-tool.tsx';original=p.read_bytes();p.write_bytes(original+b'\n// tamper\n');verify('changed-allowlisted-working-bytes',False);p.write_bytes(original)
    p=repo/'src/authority-unrelated-negative-control.ts';p.write_text('export const unauthorized=true;\n');verify('unrelated-untracked-source',False);p.unlink()
    p=repo/'src/components/publication20-tool.tsx';p.unlink();p.symlink_to(repo/'package.json');verify('redirected-source-symlink',False);p.unlink();p.write_bytes(original)
    r=run(['git','-C',str(repo),'checkout','--detach','49ea243b5be7e1ee9f3cd8af7f936ab784402cf7']);assert r.returncode==0,r.stderr
    verify('wrong-head',False)
print(json.dumps({'results':results,'admitted':False,'activated':False},indent=2))
