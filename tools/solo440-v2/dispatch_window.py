"""Read-only queue bound; no Google credential or refresh operation."""
import datetime,json,os,pathlib,sys,time
sys.path.insert(0,str(pathlib.Path(__file__).parent))
import provider
def verify_age(created,now):
 stamp=datetime.datetime.fromisoformat(created.replace('Z','+00:00')).timestamp()
 age=now-stamp
 if not -120<=age<=600:raise ValueError('Dispatch start window refused')
 return age
def main():
 out=pathlib.Path(os.environ['RUNNER_TEMP'])/'final-dispatch-window.json'
 try:
  runid=os.environ['GITHUB_RUN_ID'];provider.a.require(runid.isdecimal(),'Run identity refused')
  run=provider.Provider(os.environ).github('actions/runs/'+runid,'github-run')
  provider.verify_run(os.environ,run,provider.FINAL_WORKFLOW)
  age=verify_age(run['created_at'],time.time())
  out.write_text(json.dumps({'passed':True,'runId':runid,'attempt':1,'head':os.environ['GITHUB_SHA'],'ageSeconds':round(age,3),'maximumStartDelaySeconds':600})+'\n')
 except Exception:
  out.write_text('{"passed":false,"category":"dispatch-window-or-binding-refused"}\n')
  raise SystemExit('Dispatch window or binding refused') from None
if __name__=='__main__':main()
