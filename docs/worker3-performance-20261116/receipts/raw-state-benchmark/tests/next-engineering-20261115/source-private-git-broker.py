"""Private Linux fresh-Git byte transport. No repository state or output cache."""
import ctypes
import errno
import json
import os
import selectors
import signal
import struct
import subprocess
import sys
import time

MAX_META = 2 * 1024 * 1024
MAX_INPUT = 1024 * 1024
MAX_OUTPUT = 128 * 1024 * 1024
CHUNK = 65536
libc = ctypes.CDLL(None, use_errno=True)
libc.prctl.argtypes = [ctypes.c_int, ctypes.c_ulong, ctypes.c_ulong, ctypes.c_ulong, ctypes.c_ulong]
libc.prctl.restype = ctypes.c_int
active = None

def parent_death(expected):
    if libc.prctl(1, signal.SIGKILL, 0, 0, 0) != 0:
        raise OSError(ctypes.get_errno(), 'PR_SET_PDEATHSIG failed')
    if os.getppid() != expected:
        os._exit(125)

def creator_alive(parent, tid, start):
    try:
        with open('/proc/'+str(parent)+'/task/'+str(tid)+'/stat', 'r') as handle:
            raw = handle.read(4096)
        fields = raw[raw.rfind(')')+2:].split()
        return len(fields) >= 20 and fields[0] not in ['Z', 'X', 'x'] and not int(fields[6]) & 4 and int(fields[19]) == start
    except (OSError, ValueError, IndexError):
        return False

def write_all(data):
    view = memoryview(data)
    while view:
        count = os.write(1, view)
        if count <= 0:
            raise BrokenPipeError('Closed owner response pipe')
        view = view[count:]

def frame(sequence, kind, data=b''):
    write_all(struct.pack('!IBI', sequence, kind, len(data)))
    write_all(data)

def metadata(sequence, kind, value):
    frame(sequence, kind, json.dumps(value, separators=(',', ':')).encode())

def read_exact(length, eof=False):
    output = bytearray()
    while len(output) < length:
        chunk = os.read(0, length-len(output))
        if not chunk:
            if eof and not output:
                return None
            raise EOFError('Truncated private request')
        output.extend(chunk)
    return bytes(output)

def terminate_child(child):
    if child is None or child.poll() is not None:
        return
    try:
        child.kill()
    except ProcessLookupError:
        pass
    child.wait()

def stopped(signum, unused):
    raise SystemExit(128 + signum)

def run(request, input_bytes):
    global active
    sequence = request['sequence']
    owner = os.getpid()
    def setup_child():
        parent_death(owner)
    child = subprocess.Popen(['git', *request['argv']], cwd=request['cwd'], env=request['env'],
                             stdin=subprocess.PIPE if request['inputPresent'] else subprocess.DEVNULL,
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE, preexec_fn=setup_child)
    active = child
    metadata(sequence, 5, {'pid': child.pid})
    watch = selectors.DefaultSelector()
    for stream, kind in [(child.stdout, 1), (child.stderr, 2)]:
        os.set_blocking(stream.fileno(), False)
        watch.register(stream, selectors.EVENT_READ, kind)
    if child.stdin is not None:
        if input_bytes:
            os.set_blocking(child.stdin.fileno(), False)
            watch.register(child.stdin, selectors.EVENT_WRITE, 0)
        else:
            child.stdin.close()
    offset = 0
    totals = {1: 0, 2: 0}
    failure = None
    deadline = time.monotonic() + request['timeout']/1000 if request['timeout'] else None
    try:
        while watch.get_map() or child.poll() is None:
            now = time.monotonic()
            if deadline is not None and now >= deadline and failure is None:
                failure = {'code': 'ETIMEDOUT', 'message': 'Private Git command timed out'}
                try:
                    child.send_signal(getattr(signal, request['killSignal']))
                except ProcessLookupError:
                    pass
            pause = 0.05
            if deadline is not None and failure is None:
                pause = max(0, min(pause, deadline-now))
            for key, unused in watch.select(pause):
                stream, kind = key.fileobj, key.data
                if kind == 0:
                    try:
                        count = os.write(stream.fileno(), memoryview(input_bytes)[offset:offset+CHUNK])
                        offset += count
                    except BrokenPipeError:
                        offset = len(input_bytes)
                    if offset == len(input_bytes):
                        watch.unregister(stream)
                        stream.close()
                    continue
                try:
                    chunk = os.read(stream.fileno(), CHUNK)
                except BlockingIOError:
                    continue
                if not chunk:
                    watch.unregister(stream)
                    stream.close()
                    continue
                permitted = max(0, request['maxBuffer'] - sum(totals.values()))
                totals[kind] += len(chunk)
                if permitted:
                    frame(sequence, kind, chunk[:permitted])
                if sum(totals.values()) > request['maxBuffer'] and failure is None:
                    failure = {'code': 'ENOBUFS', 'message': 'Private Git output exceeds maxBuffer'}
                    try:
                        child.send_signal(getattr(signal, request['killSignal']))
                    except ProcessLookupError:
                        pass
        status = child.wait()
        result = {'status': status if status >= 0 else None,
                  'signal': signal.Signals(-status).name if status < 0 else None,
                  'pid': child.pid}
        if failure:
            result.update(failure)
        metadata(sequence, 3, result)
    finally:
        watch.close()
        terminate_child(child)
        active = None

def valid_request(request):
    if not isinstance(request, dict) or set(request) != {'sequence', 'argv', 'cwd', 'env', 'inputLength', 'inputPresent', 'maxBuffer', 'timeout', 'killSignal', 'operation'}:
        raise ValueError('Unknown private request fields')
    if type(request['sequence']) is not int or not 1 <= request['sequence'] <= 2147483647:
        raise ValueError('Invalid private sequence')
    if request['operation'] not in ['run', 'close']:
        raise ValueError('Unknown private operation')
    if not isinstance(request['argv'], list) or not 1 <= len(request['argv']) <= 8192 or any(not isinstance(arg, str) or '\0' in arg for arg in request['argv']):
        raise ValueError('Invalid private argv')
    if not isinstance(request['cwd'], str) or not os.path.isabs(request['cwd']) or '\0' in request['cwd']:
        raise ValueError('Invalid private cwd')
    if not isinstance(request['env'], dict) or any(not isinstance(key, str) or not isinstance(value, str) or '=' in key or '\0' in key+value for key, value in request['env'].items()):
        raise ValueError('Invalid private environment')
    for key, low, high in [('inputLength', 0, MAX_INPUT), ('maxBuffer', 1, MAX_OUTPUT), ('timeout', 0, 2147483647)]:
        if type(request[key]) is not int or not low <= request[key] <= high:
            raise ValueError('Invalid private '+key)
    if type(request['inputPresent']) is not bool or (not request['inputPresent'] and request['inputLength']):
        raise ValueError('Invalid private stdin')
    if request['killSignal'] not in ['SIGTERM', 'SIGKILL', 'SIGINT']:
        raise ValueError('Unsupported private kill signal')

try:
    parent_death(int(sys.argv[1]))
    if not creator_alive(int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3])):
        os._exit(125)
    signal.signal(signal.SIGTERM, stopped)
    signal.signal(signal.SIGINT, stopped)
    metadata(0, 0, {'pid': os.getpid(), 'version': 1})
    previous = 0
    while True:
        header = read_exact(4, eof=True)
        if header is None:
            break
        length = struct.unpack('!I', header)[0]
        if not 1 <= length <= MAX_META:
            raise ValueError('Invalid private metadata length')
        request = json.loads(read_exact(length))
        valid_request(request)
        if request['sequence'] != previous + 1:
            raise ValueError('Private request sequence differs')
        previous = request['sequence']
        input_bytes = read_exact(request['inputLength'])
        if request['operation'] == 'close':
            metadata(request['sequence'], 4, {'closed': True})
            break
        try:
            run(request, input_bytes)
        except OSError as error:
            metadata(request['sequence'], 3, {'status': None, 'signal': None, 'code': errno.errorcode.get(error.errno, 'EIO'), 'message': str(error), 'pid': None})
finally:
    terminate_child(active)
