import http.server,threading,subprocess,tempfile,pathlib,unittest,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[3]
HELPER=ROOT/'scripts/download-ci-artifact.sh'
BODY=b'CalcuMint synthetic immutable browser transport fixture\n'*128
class Handler(http.server.BaseHTTPRequestHandler):
 def do_GET(self):
  self.server.calls+=1
  if self.server.mode=='permanent':
   self.send_response(503);self.end_headers();return
  self.send_response(200);self.send_header('Content-Length',str(len(BODY)));self.end_headers()
  self.wfile.write(BODY[:127] if self.server.mode=='truncate' and self.server.calls==1 else BODY);self.wfile.flush();self.close_connection=True
 def log_message(self,*args):pass
class DownloadAcceptance(unittest.TestCase):
 def run_case(self,mode):
  server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);server.calls=0;server.mode=mode
  thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
  try:
   with tempfile.TemporaryDirectory() as temp:
    p=pathlib.Path(temp)/'fixture.bin';p.write_bytes(b'previous immutable artifact')
    result=subprocess.run(['sh',str(HELPER),'http://127.0.0.1:'+str(server.server_port)+'/browser.deb',str(p)],capture_output=True,timeout=12)
    data=p.read_bytes();remaining=list(pathlib.Path(temp).glob('*.part'));return result,data,server.calls,remaining
  finally:server.shutdown();server.server_close();thread.join()
 def test_truncated_response_retries_then_publishes_only_complete_bytes(self):
  result,data,calls,remaining=self.run_case('truncate')
  self.assertEqual(result.returncode,0,result.stderr.decode());self.assertEqual(calls,2);self.assertEqual(hashlib.sha256(data).digest(),hashlib.sha256(BODY).digest());self.assertEqual(remaining,[])
 def test_permanent_error_is_bounded_and_preserves_previous_destination(self):
  result,data,calls,remaining=self.run_case('permanent')
  self.assertNotEqual(result.returncode,0);self.assertEqual(calls,2);self.assertEqual(data,b'previous immutable artifact');self.assertEqual(remaining,[])
 def test_success_does_not_retry(self):
  result,data,calls,remaining=self.run_case('success');self.assertEqual(result.returncode,0);self.assertEqual(calls,1);self.assertEqual(data,BODY);self.assertEqual(remaining,[])
if __name__=='__main__':unittest.main()
