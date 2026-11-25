import hashlib,importlib.util,pathlib,tempfile,unittest
ROOT=pathlib.Path(__file__).parent
class StageRipgrepTests(unittest.TestCase):
 def module(self):
  self.assertTrue((ROOT/'stage_ripgrep.py').is_file(),'Pinned unprivileged Ripgrep staging is missing')
  s=importlib.util.spec_from_file_location('stage_rg',ROOT/'stage_ripgrep.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 def test_tampered_archive_is_refused_before_destination_creation(self):
  m=self.module()
  with tempfile.TemporaryDirectory() as d:
   archive=pathlib.Path(d)/'wrong.tar.gz';archive.write_bytes(b'untrusted')
   target=pathlib.Path(d)/'tools'
   with self.assertRaises(ValueError):m.stage(archive,target)
   self.assertFalse(target.exists())
 def test_existing_destination_and_symlink_refused(self):
  m=self.module()
  with tempfile.TemporaryDirectory() as d:
   archive=pathlib.Path(d)/'wrong.tar.gz';archive.write_bytes(b'untrusted');target=pathlib.Path(d)/'tools';target.mkdir()
   with self.assertRaises(ValueError):m.stage(archive,target)
   link=pathlib.Path(d)/'link';link.symlink_to(target,target_is_directory=True)
   with self.assertRaises(ValueError):m.stage(archive,link)
if __name__=='__main__':unittest.main()
