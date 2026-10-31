import unittest,tempfile,shutil,json,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
class FrozenSource(unittest.TestCase):
 def test_frozen_v1_rejects_changes_but_allows_independent_additions(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);records=json.loads((ROOT/'docs/validation-scale/v1-source-files.json').read_text())
   paths=[r['path'] for r in records]+['scripts/canonical-validation-source.py','docs/validation-scale/v1-source-files.json','docs/canonical-validation/source-binding.json']
   for p in set(paths):
    dest=root/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/p,dest)
   def run():return subprocess.run([sys.executable,str(root/'scripts/canonical-validation-source.py'),'--check'],capture_output=True,text=True)
   self.assertEqual(run().returncode,0)
   shutil.copyfile(ROOT/'docs/validation-scale/input/v1-glob-verifier.py',root/'scripts/v1-original.py')
   def original():return subprocess.run([sys.executable,str(root/'scripts/v1-original.py'),'--check'],capture_output=True,text=True)
   self.assertEqual(original().returncode,0)
   (root/'src/calculators/unrelated-additive-revision.ts').write_text('export const example=1;\n');self.assertNotEqual(original().returncode,0);self.assertEqual(run().returncode,0)
   original=root/records[0]['path'];original.write_bytes(original.read_bytes()+b'\nchanged');self.assertNotEqual(run().returncode,0)
 def test_v2_has_closed_membership_and_rejects_old_dependency_changes(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);records=json.loads((ROOT/'docs/validation-scale/v2-source-files.json').read_text())
   paths=[r['path'] for r in records]+['scripts/scale-validation-source.py','docs/validation-scale/v2-source-files.json','docs/validation-scale/source-binding.json']
   for p in set(paths):
    dest=root/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/p,dest)
   def run():return subprocess.run([sys.executable,str(root/'scripts/scale-validation-source.py'),'--check'],capture_output=True,text=True)
   self.assertEqual(run().returncode,0)
   (root/'src/calculators/next-independent-revision.ts').write_text('export const next=3;\n');self.assertEqual(run().returncode,0)
   original=root/records[0]['path'];original.write_bytes(original.read_bytes()+b'\nchanged');self.assertNotEqual(run().returncode,0)
 def test_frozen_membership_is_bound_to_the_original_sha_preimage(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d)
   for p in ['scripts/canonical-validation-source.py','docs/validation-scale/v1-source-files.json','docs/canonical-validation/source-binding.json']:
    dest=root/p;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/p,dest)
   p=root/'docs/validation-scale/v1-source-files.json';rows=json.loads(p.read_text());rows.pop();p.write_text(json.dumps(rows));r=subprocess.run([sys.executable,str(root/'scripts/canonical-validation-source.py'),'--check'],capture_output=True,text=True);self.assertNotEqual(r.returncode,0);self.assertIn('preimage differs',r.stderr)
if __name__=='__main__':unittest.main()
