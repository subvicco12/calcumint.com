import pathlib,unittest,importlib.util
ROOT=pathlib.Path(__file__).parent
class ClientTests(unittest.TestCase):
 def load(self):
  self.assertTrue((ROOT/'sql-client.py').is_file(),'Socket-free PostgreSQL client missing')
  s=importlib.util.spec_from_file_location('sqlclient',ROOT/'sql-client.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
 def test_no_external_database_selector(self):
  m=self.load();c={'kind':'CALCUMINT_DISPOSABLE_SERVICES_V1','runId':'1','workflowSha':'a'*40,'attempt':1,'postgres':{'host':'127.0.0.1','port':5432,'database':'postgres'}}
  m.validate(c,{'GITHUB_RUN_ID':'1','GITHUB_WORKFLOW_SHA':'a'*40})
  for bad in [{**c,'postgres':{**c['postgres'],'host':'prod.supabase.co'}},{**c,'attempt':2},{**c,'runId':'2'},{**c,'postgres':{**c['postgres'],'port':True}}]:
   with self.assertRaises(ValueError):m.validate(bad,{'GITHUB_RUN_ID':'1','GITHUB_WORKFLOW_SHA':'a'*40})
 def test_rejects_unapproved_role_before_connect(self):
  m=self.load()
  with self.assertRaises(ValueError):m.query({'postgres':{}},'untrusted-role','SELECT 1')
if __name__=='__main__':unittest.main()
