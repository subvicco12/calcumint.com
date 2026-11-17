/** Run fresh native Git in a small owned process to avoid large-proof fork cost.
 * Only transport is shared. No Git result, HEAD, status, index or source is cached.
 */
import { execFileSync, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, openSync, closeSync, readSync, writeSync, readFileSync, lstatSync, readdirSync, unlinkSync, rmdirSync, constants } from 'node:fs';
import { tmpdir, constants as osConstants } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const key = Symbol.for('calcumint.native-git-process.v1'), pause = new Int32Array(new SharedArrayBuffer(4)), limit = 128 * 1024 * 1024;
if (!process[key])
    Object.defineProperty(process, key, { value: { state: null, exitInstalled: false } });
const holder = process[key];
function info(pid) {
    try {
        const path = '/proc/' + pid, s = readFileSync(path + '/stat', 'utf8'), f = s.slice(s.lastIndexOf(') ') + 2).split(' ');
        return { pid, ppid: Number(f[1]), pgid: Number(f[2]), start: f[19], state: f[0], uid: lstatSync(path).uid };
    }
    catch (e) {
        if (e.code === 'ENOENT' || e.code === 'ESRCH')
            return null;
        throw e;
    }
}
function same(row) { const now = info(row.pid); return now && now.start === row.start && now.uid === row.uid && now.pgid === row.pgid && !['Z', 'X'].includes(now.state); }
function rememberChildren(state) {
    if (!state.process)
        return;
    const marker = Buffer.from('CALCUMINT_NATIVE_GIT_SCOPE=' + state.scope + '\0');
    for (const entry of readdirSync('/proc')) {
        if (!/^\d+$/.test(entry))
            continue;
        const pid = Number(entry);
        if (pid === process.pid || pid === state.process.pid)
            continue;
        const row = info(pid);
        if (!row || row.uid !== state.process.uid || row.pgid !== state.process.pgid || BigInt(row.start) < BigInt(state.process.start) || ['Z', 'X'].includes(row.state))
            continue;
        try {
            if (readFileSync('/proc/' + pid + '/environ').includes(marker))
                state.descendants.set(pid, row);
        }
        catch (e) {
            if (!['ENOENT', 'ESRCH', 'EACCES'].includes(e.code))
                throw e;
        }
    }
}
function removeOwned(state) {
    for (const [path, owned] of state.files) {
        try {
            const now = lstatSync(path);
            if (now.dev === owned.dev && now.ino === owned.ino && now.uid === owned.uid && now.isFIFO())
                unlinkSync(path);
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
        }
    }
    try {
        const now = lstatSync(state.directory);
        if (now.dev === state.directoryStat.dev && now.ino === state.directoryStat.ino && now.uid === state.directoryStat.uid && now.isDirectory() && !now.isSymbolicLink())
            rmdirSync(state.directory);
    }
    catch (e) {
        if (e.code !== 'ENOENT' && e.code !== 'ENOTEMPTY')
            throw e;
    }
}
function dispose(state) {
    if (holder.state === state)
        holder.state = null;
    if (state.closed)
        return;
    state.closed = true;
    state.child?.ref();
    if (state.process && same(state.process))
        try {
            process.kill(state.process.pid, 'SIGSTOP');
        }
        catch (e) {
            if (e.code !== 'ESRCH')
                throw e;
        }
    for (let pass = 0; pass < 3; pass++) {
        rememberChildren(state);
        for (const row of state.descendants.values())
            if (same(row))
                try {
                    process.kill(row.pid, 'SIGSTOP');
                }
                catch (e) {
                    if (e.code !== 'ESRCH')
                        throw e;
                }
    }
    for (const row of [...state.descendants.values()].reverse())
        if (same(row))
            try {
                process.kill(row.pid, 'SIGKILL');
            }
            catch (e) {
                if (e.code !== 'ESRCH')
                    throw e;
            }
    if (state.process && same(state.process))
        try {
            process.kill(state.process.pid, 'SIGKILL');
        }
        catch (e) {
            if (e.code !== 'ESRCH')
                throw e;
        }
    for (const fd of [state.input, state.output])
        if (fd !== undefined)
            try {
                closeSync(fd);
            }
            catch (e) {
                if (e.code !== 'EBADF')
                    throw e;
            }
    removeOwned(state);
}
export function closeNativeGitProcess() {
    if (holder.state)
        dispose(holder.state);
}
export function nativeGitProcessState() {
    const s = holder.state;
    if (s)
        rememberChildren(s);
    return s ? { pid: s.process.pid, ownerPid: process.pid, directory: s.directory, responsePath: s.responsePath, requests: s.sequence, ownedProcesses: [...s.descendants.values()].map(row => ({ ...row })) } : null;
}
if (!holder.exitInstalled) {
    holder.exitInstalled = true;
    process.on('beforeExit',()=>{if(holder.state)closeNativeGitProcess();});
    process.once('exit', () => {
        try {
            closeNativeGitProcess();
        }
        catch { }
    });
}
function transfer(state, fd, b, write, deadline) {
    let at = 0;
    while (at < b.length) {
        if (!same(state.process))
            throw Error('Native Git helper process stopped');
        if (deadline && Date.now() > deadline)
            throw Object.assign(Error('Native Git helper request transport timed out'), { code: 'ETIMEDOUT' });
        try {
            const n = write ? writeSync(fd, b, at, b.length - at) : readSync(fd, b, at, b.length - at, null);
            if (n)
                at += n;
            else
                Atomics.wait(pause, 0, 0, 0.05);
        }
        catch (e) {
            if (e.code !== 'EAGAIN' && e.code !== 'EINTR')
                throw e;
            Atomics.wait(pause, 0, 0, 0.05);
        }
    }
    return b;
}
function receive(state, deadline) {
    const h = transfer(state, state.output, Buffer.alloc(4), false, deadline), length = h.readUInt32BE();
    if (!length || length > limit)
        throw Error('Native Git protocol response frame exceeds bound');
    return JSON.parse(transfer(state, state.output, Buffer.alloc(length), false, deadline).toString());
}
function create(deadline) {
    const directory = mkdtempSync(join(tmpdir(), 'calcumint-native-git-')), requestPath = join(directory, 'request'), responsePath = join(directory, 'response'), state = { directory, requestPath, responsePath, directoryStat: lstatSync(directory), files: [], descendants: new Map(), sequence: 0, scope: randomUUID(), closed: false };
    try {
        execFileSync('mkfifo', ['-m', '600', requestPath, responsePath], { stdio: ['ignore', 'pipe', 'pipe'] });
        for (const path of [requestPath, responsePath]) {
            const s = lstatSync(path);
            if (!s.isFIFO() || s.isSymbolicLink() || s.uid !== process.getuid() || (s.mode & 0o777) !== 0o600)
                throw Error('Native Git FIFO ownership differs');
            state.files.push([path, s]);
        }
        state.input = openSync(requestPath, constants.O_RDWR | constants.O_NONBLOCK);
        state.output = openSync(responsePath, constants.O_RDWR | constants.O_NONBLOCK);
        const owner = info(process.pid), env = { ...process.env };
        delete env.NODE_OPTIONS;
        env.CALCUMINT_NATIVE_GIT_SCOPE = state.scope;
        state.child = spawn(process.execPath, [fileURLToPath(new URL('./native-git-child.mjs', import.meta.url)), directory, String(process.pid), owner.start], { env, detached: false, stdio: 'ignore' });
        state.child.on('error', () => { });
        state.child.unref();
        state.process = info(state.child.pid);
        if (!state.process)
            throw Error('Native Git helper process did not start');
        const ready = receive(state, Math.min(deadline ?? Infinity, Date.now() + 5000));
        if (ready.id !== 0 || ready.ready !== true || ready.pid !== state.child.pid || ready.ownerPid !== process.pid)
            throw Error('Native Git helper protocol identity differs');
        holder.state = state;
        return state;
    }
    catch (error) {
        dispose(state);
        throw error;
    }
}
function unpack(value) {
    if (value?.kind === 'undefined')
        return undefined;
    if (value?.kind === 'null')
        return null;
    if (value === null)
        return null;
    if (value === undefined)
        return undefined;
    if (value.kind === 'string' && typeof value.data === 'string')
        return value.data;
    if (value.kind === 'buffer' && typeof value.data === 'string') {
        const b = Buffer.from(value.data, 'base64');
        if (b.toString('base64') !== value.data)
            throw Error('Native Git protocol binary response differs');
        return b;
    }
    throw Error('Native Git protocol value differs');
}
const allowed = new Set(['cwd', 'env', 'stdio', 'timeout', 'maxBuffer', 'killSignal', 'input', 'encoding', 'windowsHide']);
function supported(args, options) {
    if (Array.isArray(args) && Object.values(Object.getOwnPropertyDescriptors(args)).some(d => !Object.hasOwn(d, 'value')))
        return false;
    if (process.platform !== 'linux' || !Array.isArray(args) || args.some(a => typeof a !== 'string' || a.includes('\0')) || !options || typeof options !== 'object')
        return false;
    if (options.stdio === undefined)
        return false;
    let command = 0;
    while (args[command] === '-c' && typeof args[command + 1] === 'string')
        command += 2;
    if (['fetch', 'worktree', 'clone', 'pull', 'push', 'checkout', 'switch', 'reset', 'commit', 'add', 'config'].includes(args[command]))
        return false;
    const fields = Object.getOwnPropertyDescriptors(options);
    if (Object.entries(fields).some(([name, d]) => !allowed.has(name) || !Object.hasOwn(d, 'value')))
        return false;
    if (options.cwd !== undefined && typeof options.cwd !== 'string')
        return false;
    if (options.timeout !== undefined && (!Number.isInteger(options.timeout) || options.timeout < 0))
        return false;
    if (options.encoding !== undefined && options.encoding !== null && (typeof options.encoding !== 'string' || !Buffer.isEncoding(options.encoding)))
        return false;
    if (options.killSignal !== undefined && (typeof options.killSignal !== 'string' && typeof options.killSignal !== 'number'))
        return false;
    if (options.killSignal !== undefined && !(typeof options.killSignal === 'string' ? Object.hasOwn(osConstants.signals, options.killSignal.toUpperCase()) : Number.isInteger(options.killSignal) && Object.values(osConstants.signals).includes(options.killSignal)))
        return false;
    if (options.windowsHide !== undefined && typeof options.windowsHide !== 'boolean')
        return false;
    if (options.env !== undefined && options.env !== null && typeof options.env !== 'object')
        return false;
    if (options.maxBuffer !== undefined && (!Number.isFinite(options.maxBuffer) || options.maxBuffer > 16 * 1024 * 1024 || options.maxBuffer < 0))
        return false;
    if (options.stdio !== undefined && !(Array.isArray(options.stdio) && options.stdio.length === 3 && ['ignore', 'pipe'].includes(options.stdio[0]) && options.stdio[1] === 'pipe' && options.stdio[2] === 'pipe'))
        return false;
    if (options.input !== undefined && typeof options.input !== 'string' && !Buffer.isBuffer(options.input))
        return false;
    if (options.input !== undefined && Buffer.byteLength(options.input) > 8 * 1024 * 1024)
        return false;
    const environment = options.env ?? process.env;
    for (const name in environment) {
        if (!Object.hasOwn(environment, name) || name.includes('\0'))
            return false;
        const descriptor = Object.getOwnPropertyDescriptor(environment, name);
        if (!descriptor || !Object.hasOwn(descriptor, 'value'))
            return false;
        const value = descriptor.value;
        if (value !== undefined && value !== null && !(typeof value === 'string' && !value.includes('\0')) && !(typeof value === 'number' && Number.isFinite(value)) && typeof value !== 'boolean')
            return false;
    }
    if (Object.hasOwn(options.env ?? process.env, 'CALCUMINT_NATIVE_GIT_SCOPE'))
        return false;
    if (options.env && Object.values(Object.getOwnPropertyDescriptors(options.env)).some(d => !Object.hasOwn(d, 'value')))
        return false;
    return true;
}
export function execNativeGit(args, options = {}) {
    if (!supported(args, options))
        return execFileSync('git', args, options);
    const nativeDeadline = options.timeout > 0 ? Date.now() + options.timeout : null, deadline = nativeDeadline ? nativeDeadline + 100 : null;
    let state = holder.state, request, response;
    try {
        state ??= create(deadline);
        if (!same(state.process))
            throw Error('Native Git helper process stopped before request');
        const opts = { ...options, cwd: options.cwd ?? process.cwd(), env: { ...(options.env ?? process.env) } };
        if (options.input !== undefined)
            opts.input = Buffer.isBuffer(options.input) ? { kind: 'buffer', data: options.input.toString('base64') } : { kind: 'string', data: options.input };
        request = { id: ++state.sequence, args, options: opts, nativeDeadline };
        const b = Buffer.from(JSON.stringify(request));
        if (b.length > limit)
            throw Error('Native Git protocol request frame exceeds bound');
        const h = Buffer.alloc(4);
        h.writeUInt32BE(b.length);
        transfer(state, state.input, h, true, deadline);
        transfer(state, state.input, b, true, deadline);
        response = receive(state, deadline);
        if (response.id !== request.id || typeof response.ok !== 'boolean')
            throw Error('Native Git protocol response request identity differs');
    }
    catch (error) {
        if (state)
            try {
                dispose(state);
            }
            catch (cleanup) {
                error.cleanupError = cleanup;
            }
        throw error;
    }
    let result, nativeError;
    try {
        if (response.ok)
            result = unpack(response.value);
        else {
            const data = response.error;
            if (!data || data.message?.encoding !== 'utf16le' || typeof data.message.data !== 'string')
                throw Error('Native Git protocol error response differs');
            const messageBytes = Buffer.from(data.message.data, 'base64');
            if (messageBytes.length % 2 || messageBytes.toString('base64') !== data.message.data)
                throw Error('Native Git protocol message differs');
            nativeError = new Error(messageBytes.toString('utf16le'));
            for (const name of ['name', 'code', 'errno', 'status', 'signal', 'pid', 'path', 'spawnargs', 'killed'])
                if (Object.hasOwn(data, name))
                    nativeError[name] = data[name];
            nativeError.stdout = unpack(data.stdout);
            nativeError.stderr = unpack(data.stderr);
            if (Object.hasOwn(data, 'output'))
                nativeError.output = data.output?.kind === 'outputs' ? data.output.items.map(item => item.stream === 'stdout' ? nativeError.stdout : item.stream === 'stderr' ? nativeError.stderr : unpack(item)) : unpack(data.output);
        }
    }
    catch (error) {
        dispose(state);
        throw error;
    }
    if (nativeError)
        throw nativeError;
    return result;
}
