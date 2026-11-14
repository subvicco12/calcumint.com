import hashlib,json,shutil,subprocess,sys,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
PREDECESSOR='a955cdad7019a645b7ed2950299d0603ba1784a7'
SUCCESSORS=['src/calculators/finance/compound-interest.ts','src/calculators/finance/loan-payment.ts','src/calculators/precision.ts']

class FrozenSource(unittest.TestCase):
 def fixture(self,root,revision,object_source=ROOT):
  # The real guards require immutable Git objects as well as current bytes.
  # An explicit read-only object alternate retains fetched but unreferenced
  # exact commits in shallow CI checkouts; clone may omit these objects.
  subprocess.run(['git','init','--quiet',str(root)],check=True,capture_output=True)
  objects=subprocess.check_output(['git','rev-parse','--path-format=absolute','--git-path','objects'],cwd=object_source,text=True).strip()
  (root/'.git/objects/info/alternates').write_text(objects+'\n')
  manifest=f'docs/validation-scale/v{revision}-source-files.json'
  binding='docs/canonical-validation/source-binding.json' if revision==1 else 'docs/validation-scale/source-binding.json'
  script='scripts/canonical-validation-source.py' if revision==1 else 'scripts/scale-validation-source.py'
  records=json.loads((ROOT/manifest).read_text())
  for name in {r['path'] for r in records}|{manifest,binding,script,'scripts/financial-safety-lineage.mjs'}:
   dest=root/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,dest)
  return records,script
 def run_guard(self,root,script):
  return subprocess.run([sys.executable,str(root/script),'--check'],capture_output=True,text=True)
 def original_bytes(self,name):
  return subprocess.check_output(['git','show',PREDECESSOR+':'+name],cwd=ROOT)
 def test_frozen_v1_rejects_changes_but_allows_independent_additions(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d)/'fixture';records,script=self.fixture(root,1)
   result=self.run_guard(root,script);self.assertEqual(result.returncode,0,result.stderr)
   shutil.copyfile(ROOT/'docs/validation-scale/input/v1-glob-verifier.py',root/'scripts/v1-original.py')
   # Verify the retained original glob algorithm against its original bytes,
   # not the legitimately changed current safety implementation.
   for name in SUCCESSORS:(root/name).write_bytes(self.original_bytes(name))
   result=self.run_guard(root,'scripts/v1-original.py');self.assertEqual(result.returncode,0,result.stderr)
   (root/'src/calculators/unrelated-additive-revision.ts').write_text('export const example=1;\n')
   self.assertNotEqual(self.run_guard(root,'scripts/v1-original.py').returncode,0)
   for name in SUCCESSORS:shutil.copyfile(ROOT/name,root/name)
   result=self.run_guard(root,script);self.assertEqual(result.returncode,0,result.stderr)
   original=root/records[0]['path'];original.write_bytes(original.read_bytes()+b'\nchanged')
   self.assertNotEqual(self.run_guard(root,script).returncode,0)
 def test_v2_has_closed_membership_and_rejects_old_dependency_changes(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d)/'fixture';records,script=self.fixture(root,2)
   result=self.run_guard(root,script);self.assertEqual(result.returncode,0,result.stderr)
   (root/'src/calculators/next-independent-revision.ts').write_text('export const next=3;\n')
   result=self.run_guard(root,script);self.assertEqual(result.returncode,0,result.stderr)
   original=root/records[0]['path'];original.write_bytes(original.read_bytes()+b'\nchanged')
   self.assertNotEqual(self.run_guard(root,script).returncode,0)
 def test_known_successors_reject_predecessor_reversion_and_tamper(self):
  for revision in [1,2]:
   with self.subTest(revision=revision),tempfile.TemporaryDirectory() as d:
    root=Path(d)/'fixture';records,script=self.fixture(root,revision)
    for name in SUCCESSORS:
     with self.subTest(path=name):
      original=self.original_bytes(name)
      self.assertEqual(hashlib.sha256(original).hexdigest(),next(r['sha256'] for r in records if r['path']==name))
      (root/name).write_bytes(original)
      result=self.run_guard(root,script);self.assertNotEqual(result.returncode,0);self.assertIn('dependency differs',result.stderr)
      (root/name).write_bytes((ROOT/name).read_bytes()+b'\n//tamper')
      self.assertNotEqual(self.run_guard(root,script).returncode,0)
      shutil.copyfile(ROOT/name,root/name)
 def test_exact_lineage_context_is_mandatory(self):
  for revision in [1,2]:
   with self.subTest(revision=revision),tempfile.TemporaryDirectory() as d:
    root=Path(d)/'fixture';_,script=self.fixture(root,revision)
    verifier=root/'scripts/financial-safety-lineage.mjs';verifier.unlink()
    self.assertNotEqual(self.run_guard(root,script).returncode,0)
    shutil.copyfile(ROOT/'scripts/financial-safety-lineage.mjs',verifier)
    shutil.rmtree(root/'.git')
    self.assertNotEqual(self.run_guard(root,script).returncode,0)
 def test_shallow_checkout_retains_exact_unreferenced_source_objects(self):
  with tempfile.TemporaryDirectory() as d:
   source=Path(d)/'shallow'
   subprocess.run(['git','clone','--quiet','--depth=1','--no-checkout',ROOT.as_uri(),str(source)],check=True,capture_output=True)
   subprocess.run(['git','fetch','--quiet','--depth=1',str(ROOT),PREDECESSOR,'af92e4f4fc2a024d50fb2c71271b09e221b2c6fe'],cwd=source,check=True,capture_output=True)
   for revision in [1,2]:
    root=Path(d)/f'fixture-{revision}';_,script=self.fixture(root,revision,object_source=source)
    result=self.run_guard(root,script);self.assertEqual(result.returncode,0,result.stderr)
 def test_frozen_membership_is_bound_to_the_original_sha_preimage(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d)
   for name in ['scripts/canonical-validation-source.py','docs/validation-scale/v1-source-files.json','docs/canonical-validation/source-binding.json']:
    dest=root/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,dest)
   p=root/'docs/validation-scale/v1-source-files.json';rows=json.loads(p.read_text());rows.pop();p.write_text(json.dumps(rows))
   result=self.run_guard(root,'scripts/canonical-validation-source.py');self.assertNotEqual(result.returncode,0);self.assertIn('preimage differs',result.stderr)
if __name__=='__main__':unittest.main()
