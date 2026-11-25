"""Bounded setup receipt. Never serialize environment, service config or exceptions."""
import argparse,hashlib,json,os,pathlib,shutil,subprocess

class SetupRefusal(ValueError):
 def __init__(self,category):self.category=category;super().__init__(category)

def resolve_tools():
 paths={'pdftotext':shutil.which('pdftotext'),'chromium':shutil.which('google-chrome') or shutil.which('google-chrome-stable')}
 result={}
 for category,path in paths.items():
  if not path:raise SetupRefusal(category+'-missing')
  target=pathlib.Path(path).resolve(strict=True)
  if not target.is_file() or not os.access(target,os.X_OK):raise SetupRefusal(category+'-not-executable')
  # Do not include tool stdout, stderr or paths supplied by provider APIs in failures.
  try:
   subprocess.run([str(target),'-v' if category=='pdftotext' else '--version'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,timeout=10,check=True)
  except (OSError,subprocess.SubprocessError):raise SetupRefusal(category+'-unusable') from None
  result[category]={'path':str(target),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
 return result

def check(output):
 try:receipt={'schema':'calcumint.mass426.setup.v1','passed':True,'tools':resolve_tools()}
 except SetupRefusal as e:receipt={'schema':'calcumint.mass426.setup.v1','passed':False,'category':e.category}
 except Exception:receipt={'schema':'calcumint.mass426.setup.v1','passed':False,'category':'setup-contract-refusal'}
 output.write_text(json.dumps(receipt,sort_keys=True)+'\n')
 if receipt['passed']:
  with open(os.environ.get('GITHUB_ENV',os.devnull),'a') as env:env.write('MASS426_CHROMIUM_PATH='+receipt['tools']['chromium']['path']+'\n')
 return 0 if receipt['passed'] else 1

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--output',required=True,type=pathlib.Path);args=parser.parse_args();raise SystemExit(check(args.output))
