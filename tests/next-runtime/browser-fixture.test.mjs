import assert from 'node:assert/strict';
import test from 'node:test';
import {spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readdir,access,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const installer=fileURLToPath(new URL('../../scripts/install-ci-browser.sh',import.meta.url));
for(const failure of ['download','checksum','extraction'])test(`Browser fixture ${failure} failure rejects and removes partial installation`,async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'browser-fixture-failure-'));
 try{
  const bin=path.join(dir,'bin');await mkdir(bin);
  const curl=`#!/bin/sh\nwhile [ "$1" != '-o' ]; do shift; done\nprintf 'invalid package bytes' > "$2"\nexit ${failure==='download'?22:0}\n`;
  await writeFile(path.join(bin,'curl'),curl,{mode:0o700});
  // Isolate an unpacker failure after the validation boundary. The checksum case
  // above uses the real sha256sum and rejects the corrupted HTTP artifact.
  if(failure==='extraction'){
   await writeFile(path.join(bin,'sha256sum'),'#!/bin/sh\ncat > /dev/null\nexit 0\n',{mode:0o700});
   await writeFile(path.join(bin,'dpkg-deb'),`#!/bin/sh
mkdir -p "$3/opt/google/chrome"
cat > "$3/opt/google/chrome/chrome" <<'BROWSER'
#!/bin/sh
touch "$FIXTURE_EXECUTION_MARKER"
BROWSER
chmod +x "$3/opt/google/chrome/chrome"
exit 43
`,{mode:0o700});
  }
  const marker=path.join(dir,'executed');
  const result=spawnSync('/bin/sh',[installer,dir],{env:{...process.env,PATH:bin+path.delimiter+process.env.PATH,FIXTURE_EXECUTION_MARKER:marker},encoding:'utf8',timeout:5000});
  assert.equal(result.error,undefined);
  assert.equal(result.status,failure==='download'?22:failure==='extraction'?43:1);
  assert.equal(result.stdout,'','A rejected fixture must not return an executable path');
  if(failure==='checksum')assert.match(result.stderr,/Pinned CI browser checksum mismatch/);
  assert(!(await readdir(dir)).some(name=>name.startsWith('calcumint-ci-browser.')),'Failed installation must remove the entire partial fixture');
  await assert.rejects(access(marker),{code:'ENOENT'});
 }finally{await rm(dir,{recursive:true,force:true})}
});
