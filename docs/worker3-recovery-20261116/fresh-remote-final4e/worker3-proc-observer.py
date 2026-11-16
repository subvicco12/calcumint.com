import os,sys,time,json,re
from pathlib import Path
root_pid=int(sys.argv[1]);output=Path(sys.argv[2]);hz=os.sysconf('SC_CLK_TCK')
try:os.nice(19)
except OSError:pass
safe_file=re.compile(r'^/?[A-Za-z0-9_./@-]+\.(?:mjs|cjs|js|ts|tsx)$')
def read_stat(pid):
 try:
  raw=Path(f'/proc/{pid}/stat').read_text();stop=raw.rfind(')');comm=raw[raw.find('(')+1:stop];v=raw[stop+2:].split()
  return {'pid':pid,'ppid':int(v[1]),'pgid':int(v[2]),'state':v[0],'cpu_ticks_user':int(v[11]),'cpu_ticks_system':int(v[12]),'child_cpu_ticks_user':int(v[13]),'child_cpu_ticks_system':int(v[14]),'start_ticks':int(v[19]),'is_node':comm.startswith('node')}
 except (OSError,ValueError,IndexError):return None
def node_files(pid):
 try:args=Path(f'/proc/{pid}/cmdline').read_bytes().split(b'\0')
 except OSError:return []
 result=[];skip=False
 for raw in args[1:]:
  arg=raw.decode('utf8','replace')
  if skip:skip=False;continue
  if arg in ['-e','--eval','-p','--print']:skip=True;continue
  if arg.startswith('-'):continue
  if safe_file.fullmatch(arg):result.append(arg)
 return result
known={};t0=time.monotonic();initial=read_stat(root_pid);root_start=initial['start_ticks'] if initial else None
with output.open('w',buffering=1) as log:
 def emit(x):log.write(json.dumps(x,separators=(',',':'))+'\n')
 emit({'event':'begin','root_pid':root_pid,'root_start_ticks':root_start,'monitor_pid':os.getpid(),'monitor_nice':os.getpriority(os.PRIO_PROCESS,0),'frequency_hz':1,'clock_ticks_per_second':hz,'scope':'advisory external read-only proc observer; no env/inline-code/full-argv collection; no kill/retry'})
 while True:
  tick=time.monotonic();all_rows={}
  for entry in Path('/proc').iterdir():
   if entry.name.isdigit():
    row=read_stat(int(entry.name))
    if row:all_rows[row['pid']]=row
  r=all_rows.get(root_pid)
  if not r or (root_start is not None and r['start_ticks']!=root_start):emit({'event':'end','seconds':time.monotonic()-t0,'reason':'test root disappeared or identity changed'});break
  wanted={root_pid}|{pid for pid,start in known.items() if pid in all_rows and all_rows[pid]['start_ticks']==start}
  while True:
   more={pid for pid,row in all_rows.items() if row['ppid'] in wanted}
   if more<=wanted:break
   wanted|=more
  rows=[]
  for pid in sorted(wanted):
   row=all_rows.get(pid)
   if not row:continue
   known[pid]=row['start_ticks'];row['node_file_args']=node_files(pid) if row['is_node'] else [];rows.append(row)
  emit({'event':'sample','seconds':time.monotonic()-t0,'processes':rows})
  time.sleep(max(0,1-(time.monotonic()-tick)))
