/** Disposable transport parity/lifecycle fixtures; not calculator acceptance. */
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, chmodSync, rmSync, openSync, writeSync, closeSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { execFileSync, spawn } from 'node:child_process';
import { execNativeGit, nativeGitProcessState, closeNativeGitProcess } from './native-git.mjs';
const dir = mkdtempSync(join(tmpdir(), 'native-git-parity-')), repo = join(dir, 'repo with spaces');
mkdirSync(repo);
const options = { cwd: repo, stdio: ['ignore', 'pipe', 'pipe'] };
const raw = (args, extra = {}) => execFileSync('git', args, { ...options, ...extra }), actual = (args, extra = {}) => execNativeGit(args, { ...options, ...extra });
raw(['init', '-q']);
raw(['config', 'user.name', 'Disposable fixture']);
raw(['config', 'user.email', 'fixture@example.invalid']);
mkdirSync(join(repo, 'src'));
writeFileSync(join(repo, 'src/a.ts'), 'original\n');
writeFileSync(join(repo, '.gitignore'), 'src/ignored.ts\n');
raw(['add', '.']);
raw(['commit', '-qm', 'original']);
const bin = join(dir, 'bin');
mkdirSync(bin);
const fake = join(bin, 'git');
writeFileSync(fake, `#!${process.execPath}\nconst fs=require('node:fs');const mode=process.argv[2];if(mode==='hang'){if(process.env.GIT_FIXTURE_MARKER)fs.writeFileSync(process.env.GIT_FIXTURE_MARKER,String(process.pid));process.stdout.write('started');setInterval(()=>{},1000);}else if(mode==='fail'){process.stdout.write('out');process.stderr.write('err');process.exit(17);}else if(mode==='huge-nul'){const b=Buffer.alloc(8*1024*1024);let at=0;while(at<b.length)at+=fs.writeSync(2,b,at,b.length-at);process.exit(17);}else if(mode==='large'){process.stdout.write('x'.repeat(8192));}else if(mode==='descendant'){const child=require('node:child_process').spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});child.unref();fs.writeFileSync(process.env.GIT_FIXTURE_MARKER,String(child.pid));setTimeout(()=>process.stdout.write('done'),120);}else if(mode==='input'){process.stdout.write(fs.readFileSync(0));}else if(mode==='kill-helper'){fs.appendFileSync(process.env.GIT_FIXTURE_MARKER,'executed\\n');process.kill(process.ppid,'SIGKILL');}else{process.stdout.write(JSON.stringify({cwd:process.cwd(),args:process.argv.slice(2),value:process.env.GIT_FIXTURE_VALUE}));}\n`);
chmodSync(fake, 0o700);
const env = value => ({ ...process.env, PATH: bin + ':' + process.env.PATH, GIT_FIXTURE_VALUE: value });
const stopped = pid => {
    try {
        return /\) [ZX] /.test(readFileSync('/proc/' + pid + '/stat', 'utf8'));
    }
    catch (e) {
        if (e.code === 'ENOENT')
            return true;
        throw e;
    }
};
after(() => { closeNativeGitProcess(); rmSync(dir, { recursive: true, force: true }); });
test('every native query returns actual Git bytes from a small separately owned helper', () => { assert(actual(['rev-parse', '--verify', 'HEAD^{commit}']).equals(raw(['rev-parse', '--verify', 'HEAD^{commit}']))); const state = nativeGitProcessState(); assert(state && state.pid !== process.pid && state.ownerPid === process.pid, 'Dedicated owned helper required'); assert.equal(actual(['status', '--porcelain', '--untracked-files=all', '--', 'src']).length, 0); });
test('mutable HEAD and dirty source are observed again after a successful query', () => { const before = actual(['rev-parse', 'HEAD']); writeFileSync(join(repo, 'src/a.ts'), 'changed\n'); assert(actual(['status', '--porcelain', '--untracked-files=all', '--', 'src']).equals(raw(['status', '--porcelain', '--untracked-files=all', '--', 'src']))); raw(['add', '.']); raw(['commit', '-qm', 'changed']); assert(!actual(['rev-parse', 'HEAD']).equals(before)); assert(actual(['rev-parse', 'HEAD']).equals(raw(['rev-parse', 'HEAD']))); });
test('ignored source and skip-worktree flags remain fresh actual Git observations', () => { writeFileSync(join(repo, 'src/ignored.ts'), 'ignored'); const query = ['ls-files', '--others', '--ignored', '--exclude-standard', '--', 'src']; assert(actual(query).equals(raw(query))); assert(actual(query).includes(Buffer.from('src/ignored.ts'))); raw(['update-index', '--skip-worktree', 'src/a.ts']); assert(actual(['ls-files', '-v', '--', 'src/a.ts']).equals(raw(['ls-files', '-v', '--', 'src/a.ts']))); assert.match(actual(['ls-files', '-v', '--', 'src/a.ts']).toString(), /^S /); raw(['update-index', '--no-skip-worktree', 'src/a.ts']); assert.match(actual(['ls-files', '-v', '--', 'src/a.ts']).toString(), /^H /); });
test('working directory and linked-worktree common directory match native Git', () => {
    const tree = join(dir, 'linked');
    raw(['worktree', 'add', '--detach', tree, 'HEAD']);
    try {
        assert(actual(['rev-parse', '--git-common-dir'], { cwd: tree }).equals(raw(['rev-parse', '--git-common-dir'], { cwd: tree })));
        assert(actual(['rev-parse', 'HEAD'], { cwd: tree }).equals(raw(['rev-parse', 'HEAD'], { cwd: tree })));
    }
    finally {
        raw(['worktree', 'remove', '--force', tree]);
    }
});
test('binary stdin/output partial frames and UTF8 encoding are lossless', () => {
    const input = Buffer.alloc(128 * 1024);
    for (let i = 0; i < input.length; i++)
        input[i] = i % 256;
    const opt = { env: env('binary'), input, stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 1024 * 1024 };
    assert(actual(['input'], opt).equals(input));
    assert.equal(actual(['describe'], { env: env('utf8'), encoding: 'utf8' }), raw(['describe'], { env: env('utf8'), encoding: 'utf8' }));
});
test('fresh environment and literal argv do not become cached values or shell commands', () => {
    const args = ['literal', '$(touch SHOULD_NOT_EXIST)', '`touch SHOULD_NOT_EXIST`'];
    for (const value of ['first', 'second']) {
        const opt = { env: env(value) };
        assert(actual(args, opt).equals(raw(args, opt)));
        assert.equal(JSON.parse(actual(args, opt).toString()).value, value);
    }
    assert.equal(existsSync(join(repo, 'SHOULD_NOT_EXIST')), false);
});
test('native exit status and both failed output streams are preserved', () => {
    let a, b;
    try {
        raw(['fail'], { env: env('failure') });
    }
    catch (e) {
        a = e;
    }
    try {
        actual(['fail'], { env: env('failure') });
    }
    catch (e) {
        b = e;
    }
    assert(a && b);
    for (const key of ['status', 'signal', 'code'])
        assert.equal(b[key], a[key]);
    assert(b.stdout.equals(a.stdout));
    assert(b.stderr.equals(a.stderr));
    assert.deepEqual(b.output, a.output);
});
test('native timeout and maxBuffer failure semantics are preserved', () => {
    for (const [args, opt] of [[['hang'], { env: env('timeout'), timeout: 150 }], [['large'], { env: env('buffer'), maxBuffer: 64 }]]) {
        let a, b;
        try {
            raw(args, opt);
        }
        catch (e) {
            a = e;
        }
        try {
            actual(args, opt);
        }
        catch (e) {
            b = e;
        }
        assert(a && b);
        for (const key of ['status', 'signal', 'code'])
            assert.equal(b[key], a[key], key);
        assert(b.stdout.equals(a.stdout));
        assert(b.stderr.equals(a.stderr));
    }
});
test('a dead helper cannot supply prior values and a later request uses a new helper', () => { actual(['rev-parse', 'HEAD']); const state = nativeGitProcessState(); assert(state); process.kill(state.pid, 'SIGKILL'); assert.throws(() => actual(['rev-parse', 'HEAD']), /helper|transport|process/i); assert(actual(['rev-parse', 'HEAD']).equals(raw(['rev-parse', 'HEAD']))); assert.notEqual(nativeGitProcessState().pid, state.pid); });
test('mismatched protocol responses fail without replay and discard the instance', () => { actual(['rev-parse', 'HEAD']); const state = nativeGitProcessState(); assert(state); const fd = openSync(state.responsePath, 'w'), b = Buffer.from(JSON.stringify({ id: -7, ok: true, value: { kind: 'buffer', data: '' } })), h = Buffer.alloc(4); h.writeUInt32BE(b.length); writeSync(fd, h); writeSync(fd, b); closeSync(fd); assert.throws(() => actual(['rev-parse', 'HEAD']), /response|protocol|request/i); assert.equal(nativeGitProcessState(), null); assert(actual(['rev-parse', 'HEAD']).equals(raw(['rev-parse', 'HEAD']))); });
test('helper death after executing a command never replays the started request', () => { actual(['rev-parse', 'HEAD']); assert(nativeGitProcessState(), 'Owned helper required before its crash fixture'); const marker = join(dir, 'executions'); assert.throws(() => actual(['kill-helper'], { env: { ...env('kill'), GIT_FIXTURE_MARKER: marker } }), /helper|transport|process/i); assert.equal(readFileSync(marker, 'utf8'), 'executed\n'); assert.equal(nativeGitProcessState(), null); });
test('cleanup stops the owned helper and unsupported large-buffer calls use native fallback', async () => {
    actual(['rev-parse', 'HEAD']);
    const state = nativeGitProcessState();
    assert(state);
    closeNativeGitProcess();
    assert.equal(nativeGitProcessState(), null);
    for (let i = 0; i < 100 && !stopped(state.pid); i++)
        await new Promise(r => setTimeout(r, 5));
    assert(stopped(state.pid));
    assert.equal(existsSync(state.directory), false);
    assert(actual(['rev-parse', 'HEAD'], { maxBuffer: 64 * 1024 * 1024 }).equals(raw(['rev-parse', 'HEAD'])));
    assert.equal(nativeGitProcessState(), null);
});
test('cleanup stops an owned Git descendant even after its direct parent exits', async () => {
    const marker = join(dir, 'descendant');
    actual(['descendant'], { env: { ...env('descendant'), GIT_FIXTURE_MARKER: marker } });
    const pid = Number(readFileSync(marker, 'utf8'));
    assert(pid > 0);
    try {
        assert(nativeGitProcessState().ownedProcesses.some(row => row.pid === pid), 'Descendant lease missing: ' + JSON.stringify(nativeGitProcessState()));
        closeNativeGitProcess();
        for (let i = 0; i < 100 && !stopped(pid); i++)
            await new Promise(r => setTimeout(r, 5));
        assert(stopped(pid), 'Owned descendant must stop');
    }
    finally {
        if (!stopped(pid))
            process.kill(pid, 'SIGKILL');
    }
});
test('malformed binary responses discard the transport before any later request', () => {
    actual(['rev-parse', 'HEAD']);
    const state = nativeGitProcessState();
    assert(state);
    const fd = openSync(state.responsePath, 'w'), b = Buffer.from(JSON.stringify({ id: state.requests + 1, ok: true, value: { kind: 'buffer', data: 'invalid base64!' } })), h = Buffer.alloc(4);
    h.writeUInt32BE(b.length);
    writeSync(fd, h);
    writeSync(fd, b);
    closeSync(fd);
    try {
        assert.throws(() => actual(['rev-parse', 'HEAD']), /protocol|binary/i);
        assert.equal(nativeGitProcessState(), null);
    }
    finally {
        closeNativeGitProcess();
    }
});
test('natural parent exit closes its owned helper and private transport files', async () => {
    const script = "import {execNativeGit,nativeGitProcessState} from " + JSON.stringify(new URL('./native-git.mjs', import.meta.url).href) + ";execNativeGit(['rev-parse','HEAD'],{cwd:" + JSON.stringify(repo) + ",stdio:['ignore','pipe','pipe']});console.log(JSON.stringify(nativeGitProcessState()));";
    const result = execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8' }), state = JSON.parse(result.trim());
    for (let i = 0; i < 100 && !stopped(state.pid); i++)
        await new Promise(r => setTimeout(r, 5));
    assert(stopped(state.pid));
    assert.equal(existsSync(state.directory), false);
});
test('the caller process-group deadline stops parent helper and active Git descendants', async () => {
    const marker = join(dir, 'group-git-pid'), script = "import {execNativeGit,nativeGitProcessState} from " + JSON.stringify(new URL('./native-git.mjs', import.meta.url).href) + ";execNativeGit(['rev-parse','HEAD'],{cwd:" + JSON.stringify(repo) + ",stdio:['ignore','pipe','pipe']});console.log(JSON.stringify(nativeGitProcessState()));execNativeGit(['hang'],{cwd:" + JSON.stringify(repo) + ",env:" + JSON.stringify({ ...env('group'), GIT_FIXTURE_MARKER: marker }) + ",timeout:5000,stdio:['ignore','pipe','pipe']});";
    const child = spawn(process.execPath, ['--input-type=module', '-e', script], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', b => output += b);
    let state;
    try {
        for (let i = 0; i < 300 && (!output.includes('\n') || !existsSync(marker)); i++)
            await new Promise(r => setTimeout(r, 5));
        state = JSON.parse(output.trim());
        assert.equal(state.ownerPid, child.pid);
        const gitPid = Number(readFileSync(marker, 'utf8'));
        process.kill(-child.pid, 'SIGKILL');
        for (let i = 0; i < 100 && ![child.pid, state.pid, gitPid].every(stopped); i++)
            await new Promise(r => setTimeout(r, 5));
        assert([child.pid, state.pid, gitPid].every(stopped));
    }
    finally {
        try {
            process.kill(-child.pid, 'SIGKILL');
        }
        catch (e) {
            if (e.code !== 'ESRCH')
                throw e;
        }
        if (state) {
            assert(state.directory.startsWith(join(tmpdir(), 'calcumint-native-git-')));
            rmSync(state.directory, { recursive: true, force: true });
        }
    }
});
test('native spawn failures preserve null streams and output fields', () => {
    const empty = join(dir, 'empty-bin');
    mkdirSync(empty);
    const opt = { env: { PATH: empty } };
    let a, b;
    try {
        raw(['--version'], opt);
    }
    catch (e) {
        a = e;
    }
    try {
        actual(['--version'], opt);
    }
    catch (e) {
        b = e;
    }
    assert(a && b);
    for (const key of ['status', 'signal', 'code', 'stdout', 'stderr', 'output'])
        assert.deepEqual(b[key], a[key], key);
});
test('invalid supported-option values retain original native error types', () => {
    for (const opt of [{ timeout: -1 }, { encoding: 'not-an-encoding' }, { killSignal: 'INVALIDSIGNAL' }]) {
        let a, b;
        try {
            raw(['--version'], opt);
        }
        catch (e) {
            a = e;
        }
        try {
            actual(['--version'], opt);
        }
        catch (e) {
            b = e;
        }
        assert(a && b);
        assert.equal(b.constructor.name, a.constructor.name);
        assert.equal(b.code, a.code);
    }
});
test('a caller ownership-marker value is preserved by fallback without creating a helper', () => { closeNativeGitProcess(); assert(actual(['--version'], { env: 'invalid-env' }).equals(raw(['--version'], { env: 'invalid-env' }))); const opt = { env: { ...env('original'), CALCUMINT_NATIVE_GIT_SCOPE: 'caller-owned-marker' } }; assert(actual(['literal'], opt).equals(raw(['literal'], opt))); assert.equal(nativeGitProcessState(), null); });
async function stoppedHelperFixture(partial) { const script = "import {execNativeGit,nativeGitProcessState} from " + JSON.stringify(new URL('./native-git.mjs', import.meta.url).href) + ";import {openSync,writeSync,closeSync} from 'node:fs';execNativeGit(['rev-parse','HEAD'],{cwd:" + JSON.stringify(repo) + ",stdio:['ignore','pipe','pipe']});const state=nativeGitProcessState();console.log(JSON.stringify(state));process.kill(state.pid,'SIGSTOP');if(" + partial + "){const fd=openSync(state.responsePath,'w'),h=Buffer.alloc(4);h.writeUInt32BE(2000);writeSync(fd,h);writeSync(fd,Buffer.from('{'));closeSync(fd);}try{execNativeGit(['rev-parse','HEAD'],{cwd:" + JSON.stringify(repo) + ",stdio:['ignore','pipe','pipe'],timeout:100});throw Error('Unexpected success');}catch(e){if(e.code!=='ETIMEDOUT')throw e;console.log('EXPECTED_TIMEOUT');}"; const child = spawn(process.execPath, ['--input-type=module', '-e', script], { detached: true, stdio: ['ignore', 'pipe', 'pipe'] }); let output = '', diagnostic = '', forced = false; child.stdout.on('data', b => output += b); child.stderr.on('data', b => diagnostic += b); const timer = setTimeout(() => { forced = true; try {
    process.kill(-child.pid, 'SIGKILL');
}
catch { } }, 800); const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); }); clearTimeout(timer); try {
    assert.equal(forced, false, 'A live stopped helper must respect the request timeout');
    assert.equal(code, 0, diagnostic);
    assert(output.includes('EXPECTED_TIMEOUT'));
}
finally {
    try {
        process.kill(-child.pid, 'SIGKILL');
    }
    catch (e) {
        if (e.code !== 'ESRCH')
            throw e;
    }
    if (output.includes('\n')) {
        const state = JSON.parse(output.split('\n')[0]);
        assert.equal(state.ownerPid, child.pid);
        assert(state.directory.startsWith(join(tmpdir(), 'calcumint-native-git-')));
        rmSync(state.directory, { recursive: true, force: true });
    }
} }
test('a stopped helper respects the unchanged explicit request timeout', () => stoppedHelperFixture(false));
test('one request deadline covers a stalled partial response body', () => stoppedHelperFixture(true));
test('BigInt and inherited environment values keep native stringification through fallback', () => { for (const value of [7n, Object.create(null)]) {
    if (typeof value === 'object')
        continue;
    const opt = { env: { ...env('unused'), GIT_FIXTURE_VALUE: value } };
    assert(actual(['literal'], opt).equals(raw(['literal'], opt)));
} const inherited = Object.assign(Object.create({ GIT_FIXTURE_VALUE: 'inherited' }), { ...process.env, PATH: bin + ':' + process.env.PATH }); assert(actual(['literal'], { env: inherited }).equals(raw(['literal'], { env: inherited }))); });
test('large NUL stderr remains a bounded lossless native error response', () => { const opt = { env: env('huge'), maxBuffer: 16 * 1024 * 1024 }; let a, b; try {
    raw(['huge-nul'], opt);
}
catch (e) {
    a = e;
} try {
    actual(['huge-nul'], opt);
}
catch (e) {
    b = e;
} assert(a && b); assert.equal(b.status, a.status); assert.equal(b.code, a.code); assert(b.stderr.equals(a.stderr)); assert.deepEqual(b.output, a.output); const hash = s => createHash('sha256').update(Buffer.from(s, 'utf16le')).digest('hex'); assert.equal(hash(b.message), hash(a.message)); });

test('abrupt parent death closes the idle helper request channel',async()=>{const script="import {execNativeGit,nativeGitProcessState} from "+JSON.stringify(new URL('./native-git.mjs',import.meta.url).href)+";execNativeGit(['rev-parse','HEAD'],{cwd:"+JSON.stringify(repo)+",stdio:['ignore','pipe','pipe']});console.log(JSON.stringify(nativeGitProcessState()));process.kill(process.pid,'SIGKILL');";let result;try{execFileSync(process.execPath,['--input-type=module','-e',script],{encoding:'utf8'});}catch(e){assert.equal(e.signal,'SIGKILL');result=e.stdout;}const state=JSON.parse(result.trim());try{for(let i=0;i<100&&!stopped(state.pid);i++)await new Promise(r=>setTimeout(r,5));assert(stopped(state.pid));}finally{assert(state.directory.startsWith(join(tmpdir(),'calcumint-native-git-')));rmSync(state.directory,{recursive:true,force:true});}});
