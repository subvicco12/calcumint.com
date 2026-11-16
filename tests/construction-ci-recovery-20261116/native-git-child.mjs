/** Private native-Git executor. Every request executes Git; no query cache exists. */
import { openSync, closeSync, readSync, writeSync, readFileSync, lstatSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const [directory, ownerText, ownerStart] = process.argv.slice(2), owner = Number(ownerText), pause = new Int32Array(new SharedArrayBuffer(4)), limit = 128 * 1024 * 1024;
function alive() {
    try {
        const s = readFileSync('/proc/' + owner + '/stat', 'utf8'), f = s.slice(s.lastIndexOf(') ') + 2).split(' ');
        return f[19] === ownerStart && !['Z', 'X'].includes(f[0]);
    }
    catch {
        return false;
    }
}
function owned(path, fifo = false) {
    const s = lstatSync(path);
    if (s.uid !== process.getuid() || s.isSymbolicLink() || (fifo ? !s.isFIFO() : !s.isDirectory()) || (s.mode & 0o777) !== (fifo ? 0o600 : 0o700))
        throw Error('Private Git transport ownership differs');
}
owned(directory);
for (const name of ['request', 'response'])
    owned(join(directory, name), true);
const flags = (await import('node:fs')).constants.O_RDWR | (await import('node:fs')).constants.O_NONBLOCK, input = openSync(join(directory, 'request'), flags), output = openSync(join(directory, 'response'), flags);
function transfer(fd, b, write) {
    let at = 0;
    while (at < b.length) {
        if (!alive())
            throw Error('Native Git owner stopped');
        try {
            const n = write ? writeSync(fd, b, at, b.length - at) : readSync(fd, b, at, b.length - at, null);
            if (n)
                at += n;
            else
                Atomics.wait(pause, 0, 0, 1);
        }
        catch (e) {
            if (e.code !== 'EAGAIN' && e.code !== 'EINTR')
                throw e;
            Atomics.wait(pause, 0, 0, 1);
        }
    }
    return b;
}
function frame(value) {
    const b = Buffer.from(JSON.stringify(value));
    if (b.length > limit)
        throw Error('Native Git response frame exceeds bound');
    const h = Buffer.alloc(4);
    h.writeUInt32BE(b.length);
    transfer(output, h, true);
    transfer(output, b, true);
}
const pack = value => value === undefined ? { kind: 'undefined' } : value === null ? { kind: 'null' } : Buffer.isBuffer(value) ? { kind: 'buffer', data: value.toString('base64') } : typeof value === 'string' ? { kind: 'string', data: value } : null;
try {
    frame({ id: 0, ready: true, pid: process.pid, ownerPid: owner });
    let previous = 0;
    for (;;) {
        const h = transfer(input, Buffer.alloc(4), false), length = h.readUInt32BE();
        if (!length || length > limit)
            throw Error('Native Git request frame differs');
        const request = JSON.parse(transfer(input, Buffer.alloc(length), false).toString());
        if (!Number.isSafeInteger(request.id) || request.id <= previous)
            throw Error('Native Git request identity differs');
        previous = request.id;
        const options = request.options;
        options.env = { ...options.env, CALCUMINT_NATIVE_GIT_SCOPE: process.env.CALCUMINT_NATIVE_GIT_SCOPE };
        if (options.input?.kind === 'buffer')
            options.input = Buffer.from(options.input.data, 'base64');
        else if (options.input?.kind === 'string')
            options.input = options.input.data;
        try {
            if (request.nativeDeadline !== null) {
                const left = request.nativeDeadline - Date.now();
                if (left <= 0)
                    throw Object.assign(Error('spawnSync git ETIMEDOUT'), { code: 'ETIMEDOUT', status: null, signal: 'SIGTERM', stdout: Buffer.alloc(0), stderr: Buffer.alloc(0), output: [null, Buffer.alloc(0), Buffer.alloc(0)] });
                options.timeout = left;
            }
            const result = execFileSync('git', request.args, options);
            frame({ id: request.id, ok: true, value: pack(result) });
        }
        catch (error) {
            const fields = {};
            for (const key of ['name', 'code', 'errno', 'status', 'signal', 'pid', 'path', 'spawnargs', 'killed'])
                if (error[key] !== undefined)
                    fields[key] = error[key];
            fields.message = { encoding: 'utf16le', data: Buffer.from(error.message, 'utf16le').toString('base64') };
            fields.stdout = pack(error.stdout);
            fields.stderr = pack(error.stderr);
            fields.output = Array.isArray(error.output) ? { kind: 'outputs', items: error.output.map(value => value === error.stdout ? { stream: 'stdout' } : value === error.stderr ? { stream: 'stderr' } : pack(value)) } : pack(error.output);
            frame({ id: request.id, ok: false, error: fields });
        }
    }
}
finally {
    closeSync(input);
    closeSync(output);
}
