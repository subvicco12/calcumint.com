"""Stage only checksum-pinned Ripgrep; never modify the application or host PATH."""
import argparse,hashlib,os,pathlib,tarfile
ARCHIVE_SHA='4cf9f2741e6c465ffdb7c26f38056a59e2a2544b51f7cc128ef28337eeae4d8e'
BINARY_SHA='f401154e2393f9002ac77e419f9ee5521c18f4f8cd3e32293972f493ba06fce7'
MEMBER='ripgrep-14.1.1-x86_64-unknown-linux-musl/rg'
def stage(archive,destination):
 if archive.is_symlink() or not archive.is_file() or hashlib.sha256(archive.read_bytes()).hexdigest()!=ARCHIVE_SHA:raise ValueError('Pinned Ripgrep archive refused')
 if destination.exists() or destination.is_symlink():raise ValueError('Existing tool destination refused')
 with tarfile.open(archive,'r:gz') as package:
  members=[m for m in package.getmembers() if m.name==MEMBER]
  if len(members)!=1 or not members[0].isfile() or members[0].size>20000000:raise ValueError('Ripgrep member refused')
  binary=package.extractfile(members[0]).read()
 if hashlib.sha256(binary).hexdigest()!=BINARY_SHA:raise ValueError('Pinned Ripgrep binary refused')
 destination.mkdir(mode=0o755)
 for name,content,mode in [('rg',binary,0o555),*[(name,(pathlib.Path(__file__).parent/name).read_bytes(),0o444) for name in ['check-ripgrep.mjs','dependency-preflight.mjs','run-mass426-successor.sh']]]:
  fd=os.open(destination/name,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,mode)
  with os.fdopen(fd,'wb') as output:output.write(content)
  (destination/name).chmod(mode)
 destination.chmod(0o555)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('archive',type=pathlib.Path);p.add_argument('destination',type=pathlib.Path);args=p.parse_args()
 try:stage(args.archive,args.destination)
 except Exception:raise SystemExit('Pinned Ripgrep staging refused') from None
